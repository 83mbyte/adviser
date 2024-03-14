
const functions = require("firebase-functions");
const { Storage, getDownloadURL } = require("firebase-admin/storage");
const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2/options");
const { defineSecret } = require('firebase-functions/params');

const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth")

const { OpenAI } = require("openai");

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const ffprobe = require('ffprobe-static');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobe.path);

const summarize = require('./summarize');
const stripeActions = require('./stripe_lib');




setGlobalOptions({ maxInstances: 5 });

// init App and DB
let app = initializeApp();
const db = getFirestore();
const storage = new Storage(app);

const STRIPE_SECRET = defineSecret('SECRET_KEY_STRIPE_API');
const STRIPE_WHSEC = defineSecret('STRIPE_WHSEC')


const verifyToken = async (userToken) => {
    return await getAuth(app)
        .verifyIdToken(userToken)
        .then((decodedToken) => {
            const uid = decodedToken.uid;
            return ({ status: true, uid, message: 'Token verified successfully' })
        })
        .catch((error) => {
            return ({ status: false, uid: null, message: 'Unauthorized request' })
        });

    // if (isUserTokenValid.status == false) {
    //     return resp.status(401).json({ status: 'Error', message: isUserTokenValid.message });
    // }
}



exports.summarizeData = onRequest({
    // DEV
    // cors: true,
    //PROD
    cors: [process.env.APP_DOMAIN_MAIN, process.env.APP_DOMAIN_SECOND, process.env.APP_DOMAIN_CUSTOM],
    secrets: ['SECRET_KEY_OPENAI'],
    timeoutSeconds: 480,
    cpu: 2,
    enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
}, async (req, resp) => {
    if (req.method !== 'POST') {
        return resp.status(400).json({ error: 'Bad request.' });
    } else {

        const request_data = JSON.parse(req.body);
        const DEFAULT_BUCKET = process.env.DEFAULT_BUCKET;

        const isTokenVerified = await verifyToken(request_data.accessToken);


        if (!isTokenVerified || isTokenVerified.status == false) {
            return resp.status(401).json({ status: 'Error', message: isTokenVerified.message });
        }

        const userId = isTokenVerified.uid;
        const bucket = storage.bucket(DEFAULT_BUCKET);

        const openai = new OpenAI({
            apiKey: process.env.SECRET_KEY_OPENAI,
        });

        switch (request_data.type) {
            case 'validateYoutubeURL':

                let urlValidationResponse = summarize.validateYoutubeURL(request_data.payload);

                if (!urlValidationResponse) {
                    return resp.status(500).json({ status: 'Error', message: 'Internal Server Error' });
                } else if (urlValidationResponse.status == 'Error') {
                    return resp.status(200).json(urlValidationResponse);
                } else {
                    return resp.status(200).json(urlValidationResponse)
                }
                break;

            case 'getAudioInfo':
                let audioInfo = await summarize.collectYouTubeInfo(request_data.payload);

                if (!audioInfo) {
                    return resp.status(500).json({ status: 'Error', message: 'Internal Server Error' });
                }
                else if (audioInfo.status == 'Error' || audioInfo.status == 'Success') {
                    return resp.status(200).json(audioInfo)
                }

                // let audioFileSizeMb = (Number(audioInfo.payload.contentLength) / 1024 / 1024).toFixed(2); // size in MB after being downloaded
                break;


            case 'downloadAudioFile':

                const filePath = bucket.file(`ytdl/${userId}/audio_source.${request_data.payload.info.container}`);

                let res = await summarize.downloadAudioFile(url = request_data.payload.url, info = request_data.payload.info, fileToSave = filePath, userId);

                if (res && res.status !== 'Success') {
                    return resp.status(200).json(res);
                } else {

                    let fileUrl = await getDownloadURL(filePath);
                    return resp.status(200).json({ status: 'Success', payload: fileUrl });
                }

                break;

            case 'createAudioSegmentsTime':

                let timeToCutAudio = null;

                const calculateOutputsCount = (time_original) => {

                    let TIME_ORIGINAL = time_original;
                    let oneSegmentSeconds = 3600; //as seconds
                    let allFilesCount = Math.ceil(TIME_ORIGINAL / oneSegmentSeconds);

                    let timecodes = [];

                    for (let i = 0; i < allFilesCount; i++) {
                        timecodes.push(i * (oneSegmentSeconds + 1))
                    }
                    let lastSegmentDuration = (TIME_ORIGINAL - timecodes[timecodes.length - 1]);

                    return { timecodes, lastSegmentDuration }
                }

                if (request_data.payload) {

                    let fileUrl = request_data.payload;

                    async function getDuration(file) {
                        return new Promise((resolve, reject) => {
                            ffmpeg.ffprobe(file, (err, data) => {
                                resolve(data.format.duration)
                            })
                        })
                    }
                    let duration = await getDuration(fileUrl);
                    if (duration) {

                        timeToCutAudio = calculateOutputsCount(duration);
                        return resp.status(200).json({
                            status: 'Success',
                            payload: { totalFiles: timeToCutAudio.timecodes.length, segmentsArray: timeToCutAudio.timecodes, lastSegmentDuration: timeToCutAudio.lastSegmentDuration }
                        })
                    } else {

                        return resp.status(200).json({
                            status: 'Error',
                            message: 'Unable to get an audio track duration'
                        })
                    }
                }
                break;

            case 'splitAudioOnSegments':

                let fileUrl = request_data.payload.fileUrl;
                let fileContainer = request_data.payload.fileContainer;
                let fileIndex = request_data.payload.fileIndex;

                let segmentDuration = 3600;
                if (request_data.payload.lastSegmentDuration) {
                    segmentDuration = request_data.payload.lastSegmentDuration;
                };


                let fileSegment = bucket.file(`ytdl/${userId}/segment_${fileIndex}.${fileContainer}`);
                let startTime = request_data.payload.startTime;

                async function cutAudio(fileUrl, fileContainer, fileIndex, fileSegment, startTime,) {

                    return new Promise((resolve, reject) => {

                        ffmpeg()
                            .input(fileUrl)
                            .format(fileContainer)
                            .seekInput(startTime)
                            .duration(segmentDuration) // 60min
                            // .duration(900)   // 15min
                            .audioCodec('libopus')  //low
                            // .audioCodec('libvorbis')
                            .audioChannels(1)
                            .audioBitrate(32)
                            .audioQuality(0)
                            .on('end', async () => {
                                // console.log(`FFmpeg has finished file N ${fileIndex}`);
                                // console.log('....');
                                resolve({ status: 'Success', payload: `segment_${fileIndex}.${fileContainer}` });
                            })
                            .on('error', (error) => {
                                console.error('Error to fix:', error);
                                reject({ status: 'Error', message: error })
                            })
                            .on('progress', (progress) => {
                                if (progress.percent % 2 == 0) {
                                    console.log(`Processing: ${Math.floor(progress.percent)} % done`);
                                }
                            })
                            .writeToStream(fileSegment.createWriteStream({
                                metadata: {
                                    contentType: `audio/${fileContainer}`,
                                    metadata: {
                                        source: 'ffmpeg',
                                        author: userId,
                                    }
                                }
                                // }), { end: true });
                            }));

                    });
                }
                let currentResult = await cutAudio(fileUrl, fileContainer, fileIndex, fileSegment, startTime);

                return resp.status(200).json(currentResult);

                break;

            case 'getTextFromAudio':

                let file = bucket.file(`ytdl/${userId}/${request_data.payload.fileName}`);
                let extractedText = await summarize.extractTextFromAudioFile(openai, file, request_data.payload.mimeType);

                if (extractedText && extractedText.status == 'Success') {
                    return resp.status(200).json({ status: 'Success', content: extractedText.payload }); //text-from-audio received
                } else {
                    return resp.status(200).json({ status: 'Error', message: `${extractedText.message}. Unable to achieve text extraction` })
                }
                break;
            case 'summarizeText':

                let summarizeResult = await summarize.summarizeText(openai, request_data.payload);
                if (summarizeResult) {

                    let stringText = summarizeResult.payload;
                    if (stringText.startsWith('```html')) {
                        stringText = stringText.slice(8,);
                    }
                    if (stringText.endsWith('```')) {
                        stringText = stringText.slice(0, stringText.length - 3)
                    }

                    return resp.status(200).json({ status: summarizeResult.status, content: stringText });
                } else {
                    return resp.status(200).json({ status: 'Error', message: 'Unable to fulfil summarization' })
                }

            default:
                break;
        }
    }
    resp.json({ status: 'default', message: 'execution end' });
})


exports.requestToTranscribe = onRequest(
    {
        // DEV
        //cors: true,

        //PROD
        cors: [process.env.APP_DOMAIN_MAIN, process.env.APP_DOMAIN_SECOND, process.env.APP_DOMAIN_CUSTOM],
        secrets: ['SECRET_KEY_OPENAI'],
        enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
    },

    async (req, resp) => {
        if (req.method !== 'POST') {
            return resp.status(400).json({ error: 'Bad request.' });
        }
        else {

            if (req.body) {

                const fileUrl = req.body;
                const file = await fetch(fileUrl);
                const blob = await file.blob();

                const formData = new FormData();
                formData.append('model', 'whisper-1');
                formData.append('file', blob, { filename: 'transcribe.mp3', contentType: 'audio/mp3' })

                let transcribeReply =
                    await fetch('https://api.openai.com/v1/audio/transcriptions', {
                        method: 'POST',
                        headers: {
                            "Authorization": `Bearer ${process.env.SECRET_KEY_OPENAI}`,
                            // "Content-Type": "multipart/form-data"
                        },
                        body: formData
                    })
                        .then((resp) => {
                            return resp.json();
                        })
                        .then(respFinal => {
                            return respFinal
                        })
                        .catch(() => resp.status(500).json({ error: 'Internal Server Error. (Error while transcribe operation)' }))

                if (transcribeReply) {
                    return resp.status(200).json(transcribeReply)
                } else {
                    return resp.status(502).json({ error: 'Bad Gateway. (No reply received)' })
                }

            }
            else {
                return resp.status(400).json({ error: 'Bad request.' });
            }

        }
    }
);

exports.getExchangeRates = onRequest(

    {
        // DEV
        // cors: true,

        //PROD
        cors: [process.env.APP_DOMAIN_MAIN, process.env.APP_DOMAIN_SECOND, process.env.APP_DOMAIN_CUSTOM],
        secrets: ['SECRET_KEY_CURRENCY_RATES',],
        enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
    },
    async (req, resp) => {

        if (req.method !== 'POST') {
            return resp.status(400).json({ error: 'Bad request.' });
        };
        if (req.body) {
            let data = JSON.parse(req.body);

            const isTokenVerified = await verifyToken(data.accessToken);
            if (!isTokenVerified || isTokenVerified.status == false) {
                return resp.status(200).json({ status: 'Error', message: isTokenVerified.message, code: 401 });
            }

            const ratesData = await fetch(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${process.env.SECRET_KEY_CURRENCY_RATES}&symbols=EUR,BGN,GBP,CHF,JPY,ZAR,CNY`);
            if (!ratesData) {
                return resp.status(500).json({ message: 'Internal Server Error.', status: 'Error', code: 500 });
            }
            rates = await ratesData.json();
            return resp.status(200).json({ rates: rates.rates, status: 'Success', code: 200 });
        }
    }
)

exports.webhookStrp = onRequest(
    {
        // cors: true,
        cors: ['/stripe\.com$/'],
        secrets: [STRIPE_WHSEC, STRIPE_SECRET] //uncomment to production
    },

    async (req, resp) => {

        if (req.method !== 'POST') {
            return resp.status(400).json({ error: 'Bad request.' });
        };

        const payloadBody = req.rawBody;
        const sig = req.headers['stripe-signature'];

        const timeStamp = Timestamp.now();
        const start = timeStamp.toMillis();

        let respWebhookStr = await stripeActions.webhookStr(STRIPE_SECRET.value(), STRIPE_WHSEC.value(), sig, payloadBody, start);

        if (respWebhookStr && respWebhookStr.status !== 'Success') {

            return resp.code(respWebhookStr.code).json({ status: 'Error', message: respWebhookStr.message })
        }
        else {
            const { type, subscriptionPeriod, id } = respWebhookStr.payload;

            try {
                const usersColl = db.collection(process.env.DB_NAME).doc(process.env.DB_USERS_DOC).collection(id);
                const userSettingsDoc = usersColl.doc('settings');

                await userSettingsDoc.set({
                    userInfo: {
                        subscription: {
                            type,
                            period: subscriptionPeriod,
                        },
                    }
                }, { merge: true });
            }
            catch (err) {
                return resp.status(400).send(`DB Error: ${err.message}`);
            }
        }

        resp.status(200).end();
    });

exports.createSubscription = onRequest(
    {
        // cors: true //dev
        secrets: [STRIPE_SECRET],
        cors: [process.env.APP_DOMAIN_MAIN, process.env.APP_DOMAIN_CUSTOM, process.env.APP_DOMAIN_SECOND,], //prod
        enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
    },
    async (req, resp) => {


        if (req.method !== 'POST') {
            return resp.status(400).json({ error: 'Bad request.', status: 'Error' });
        }
        else {
            //DEV domain
            // const APP_DOMAIN_CUSTOM = 'http://127.0.0.1:5000';

            //PROD domain
            // const APP_DOMAIN = process.env.APP_DOMAIN_MAIN;
            const APP_DOMAIN_CUSTOM = process.env.APP_DOMAIN_CUSTOM;
            const APP_NAME = process.env.APP_NAME;

            const payloadReceived = JSON.parse(req.body);

            const isTokenVerified = await verifyToken(payloadReceived.accessToken);
            if (!isTokenVerified || isTokenVerified.status == false) {
                return resp.status(401).json({ status: 'Error', message: isTokenVerified.message });
            }

            let result = null;

            try {
                result = await stripeActions.createStripeSubscription(payloadReceived, STRIPE_SECRET.value(), APP_DOMAIN_CUSTOM, APP_NAME);
                if (result.status == 'Success' && result.code == 200) {
                    return resp.status(200).json({ url: result.payload, status: 'Success' })
                } else {
                    return resp.status(500).json({ error: 'Internal Server Error.', status: 'Error' });
                }
            } catch (error) {
                return resp.status(500).json({ error: 'Internal Server Error.', status: 'Error' });
            }


        }
    }
)


exports.requestToAssistant = onRequest(
    {
        //cors: true,
        cors: [process.env.APP_DOMAIN_MAIN, process.env.APP_DOMAIN_SECOND, process.env.APP_DOMAIN_CUSTOM],
        secrets: ['SECRET_KEY_OPENAI'],
        enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
    },
    async (req, resp) => {
        if (req.method !== 'POST') {
            return resp.status(400).json({ error: 'Bad request.', code: 400, status: 'Error' });
        }
        else {

            if (req.body) {

                let data = JSON.parse(req.body);
                const isTokenVerified = await verifyToken(data.accessToken);
                if (!isTokenVerified || isTokenVerified.status == false) {
                    return resp.status(401).json({ status: 'Error', message: isTokenVerified.message });
                }

                let assistReply = await createCompletions(data);
                if (assistReply) {
                    return resp.status(200).json({ content: assistReply, status: 'Success', code: 200 })
                } else {
                    return resp.status(500).json({ message: 'Internal Server Error.', status: 'Error', code: 500 });
                }
            }
            else {
                return resp.status(400).json({ message: 'Bad request.', status: 'Error', code: 400 });
            }
        }
    }

);

const createCompletions = async (data) => {


    const openai = new OpenAI({
        apiKey: process.env.SECRET_KEY_OPENAI,
    });
    let model = 'gpt-3.5-turbo';
    let presence_p = data.presence_p || 0;
    let frequency_p = data.frequency_p || 0;
    let temperature = data.temperature || 1;
    let n_param = data.n_param || 1;

    if (data.systemVersion) {
        switch (data.systemVersion) {
            case 'GPT-3.5':
                model = 'gpt-3.5-turbo';
                break;
            case 'GPT-4':
                model = 'gpt-4-turbo-preview'
                break;
            default:
                model = 'gpt-3.5-turbo';
        }
    }

    try {
        const completion = await openai.chat.completions.create({
            model,
            temperature,
            presence_penalty: presence_p,
            frequency_penalty: frequency_p,
            max_tokens: data.tokens,
            n: n_param,
            messages: data.messagesArray,
        });
        return completion.choices
    } catch (error) {
        return null
    }

}

// Dall-e

exports.requestToAssistantWithImage = onRequest(
    {
        //DEV
        // cors: true,
        //PROD
        cors: [process.env.APP_DOMAIN_MAIN, process.env.APP_DOMAIN_SECOND, process.env.APP_DOMAIN_CUSTOM],
        secrets: ['SECRET_KEY_OPENAI'],
        enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
    },
    async (req, resp) => {

        const generateImage_dall_e_3_64 = async (request, size = '1024x1024', style, quality) => {
            const openai = new OpenAI({
                apiKey: process.env.SECRET_KEY_OPENAI,
            });

            try {

                const image = await openai.images.generate({
                    model: 'dall-e-3',
                    prompt: request,
                    size,
                    style,
                    quality,
                    response_format: 'b64_json'
                });
                if (image?.data) {

                    return image.data[0].b64_json
                } else {
                    return null
                }
            } catch (error) {
                return null
            }
        };

        if (req.method !== 'POST') {
            return resp.status(400).json({ error: 'Bad request.' });
        }
        else {

            if (req.body) {

                const { request, size, quality, style, accessToken } = { ...JSON.parse(req.body) };
                const imgSize = {
                    A: '1024x1024',
                    B: '1792x1024',
                    C: '1024x1792',
                }

                const isTokenVerified = await verifyToken(accessToken);
                if (!isTokenVerified || isTokenVerified.status == false) {
                    return resp.status(401).json({ status: 'Error', message: isTokenVerified.message, code: 401 });
                }

                let imageData64 = await generateImage_dall_e_3_64(request, `${imgSize[size]}`, style, quality); //return base64

                if (imageData64) {
                    return resp.status(200).json({ content: imageData64, status: 'Success', code: 200 })
                } else {
                    return resp.status(500).json({ message: 'Internal Server Error.', status: 'Error', code: 500 });
                }
            }
            else {
                return resp.status(400).json({ message: 'Bad request.', status: 'Error', code: 40 });
            }
        }
    }
)



exports.userAdded = functions.auth.user().onCreate((user) => {
    createUserInDB(user.uid, user.email, user.emailVerified);
    return Promise.resolve();
})

exports.userDeleted = functions.auth.user().onDelete((user) => {
    deleteUserInDB(user.uid);
    return Promise.resolve();
})


const createUserInDB = async (userId, email, isVerified) => {

    //new
    const timeStamp = Timestamp.now();
    const start = timeStamp.toMillis();
    const period = start + 259200000;

    const usersColl = db.collection(process.env.DB_NAME).doc(process.env.DB_USERS_DOC).collection(userId);
    const userChatsDoc = usersColl.doc('chats');
    const userSummYTDoc = usersColl.doc('summarizeYT');
    const userSettingsDoc = usersColl.doc('settings');
    await userChatsDoc.set({}, { merge: true });
    await userSummYTDoc.set({}, { merge: true });
    await userSettingsDoc.set({
        userInfo: {
            subscription: {
                type: 'Trial',
                period,
                trialOffers: { images: 0, youtube: 0 }
            },
            isEmailVerified: isVerified || false,
            email
        }
    }, { merge: true });

    // -----old
    const chatsUserDoc = db.collection('chats').doc(userId);
    const usersUserDoc = db.collection('users').doc(userId);
    const summarizeYTUserDoc = db.collection('summarizeYT').doc(userId);

    await chatsUserDoc.set({}, { merge: true });
    await summarizeYTUserDoc.set({}, { merge: true });
    await usersUserDoc.set({ theme: 'green', plan: { period, type: 'Trial', imgTrial: 0, trialOffers: { images: 0, youtube: 0 } }, userData: { email, isVerified } }, { merge: true });

    return `Document created.`
}

const deleteUserInDB = async (userId) => {
    //old
    const chatsUserDoc = db.collection('chats').doc(userId);
    const usersUserDoc = db.collection('users').doc(userId);
    const summarizeYTUserDoc = db.collection('summarizeYT').doc(userId);

    await chatsUserDoc.delete();
    await usersUserDoc.delete();
    await summarizeYTUserDoc.delete();
    //
    const usersColl = db.collection(process.env.DB_NAME).doc(process.env.DB_USERS_DOC).collection(userId);

    await usersColl.doc('chats').delete();
    await usersColl.doc('summarizeYT').delete();
    await usersColl.doc('settings').delete();

    return `User (${userId}) deleted from DataBase.`
}