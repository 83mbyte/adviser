
const functions = require("firebase-functions");
const { Storage, getDownloadURL } = require("firebase-admin/storage");
const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2/options");
// const { defineSecret } = require('firebase-functions/params');

const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth")

const { OpenAI } = require("openai");

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const ffprobe = require('ffprobe-static');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobe.path);

//my import
const summarize = require('./summarize');

// DEV stripe key 
// const DEV_SECRET = process.env.STRIPE_API_KEY_DEV;
// const stripe = require('stripe')(DEV_SECRET);

// PROD stripe
// const STRIPE_SECRET = defineSecret('SECRET_KEY_STRIPE_API');
const stripe = require('stripe')(process.env.SECRET_KEY_STRIPE_API);

setGlobalOptions({ maxInstances: 5 });

// init App and DB
let app = initializeApp();
const db = getFirestore();
const storage = new Storage(app);

exports.summarizeData = onRequest({
    // DEV
    // cors: true,
    //PROD
    cors: [process.env.APP_DOMAIN_MAIN, process.env.APP_DOMAIN_SECOND, process.env.APP_DOMAIN_CUSTOM],
    secrets: ['SECRET_KEY_OPENAI'],
    timeoutSeconds: 360,
    cpu: 1,
    enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
}, async (req, resp) => {
    if (req.method !== 'POST') {
        return resp.status(400).json({ error: 'Bad request.' });
    } else {

        const data_received = JSON.parse(req.body);

        let isUserTokenValid = await getAuth(app)
            .verifyIdToken(data_received.accessToken)
            .then((decodedToken) => {
                const uid = decodedToken.uid;
                return ({ status: true, uid, message: 'Token verified successfully' })
            })
            .catch((error) => {
                return ({ status: false, uid: null, message: 'Unauthorized request' })
            });

        if (isUserTokenValid.status == false) {
            return resp.status(401).json({ status: 'Error', message: isUserTokenValid.message });
        }

        const userId = isUserTokenValid.uid;
        const bucket = storage.bucket('adviserai.appspot.com');

        const openai = new OpenAI({
            apiKey: process.env.SECRET_KEY_OPENAI,
        });

        switch (data_received.type) {
            case 'getAudioInfo':
                let audioInfo = null;
                let urlValidationResponse = summarize.validateYoutubeURL(data_received.payload);

                if (!urlValidationResponse) {
                    return resp.status(500).json({ status: 'Error', message: 'Internal Server Error' });
                } else if (urlValidationResponse.status == 'Error') {
                    return resp.status(200).json(urlValidationResponse);
                }

                audioInfo = await summarize.collectYouTubeInfo(data_received.payload);
                if (!audioInfo) {
                    return resp.status(500).json({ status: 'Error', message: 'Internal Server Error' });
                } else if (audioInfo.status == 'Error') {

                    return resp.status(200).json(audioInfo)
                }
                let audioFileSizeMb = (Number(audioInfo.payload.contentLength) / 1024 / 1024).toFixed(2); // size in MB after being downloaded

                if (urlValidationResponse.status == 'Success' && audioInfo.status == 'Success') {
                    const bucket = storage.bucket('adviserai.appspot.com');
                    const file = bucket.file(`ytdl/${userId}/audio_source.${audioInfo.payload.container}`);

                    let res = await summarize.downloadAudioFile(url = data_received.payload, info = audioInfo.payload, fileToSave = file, userId);

                    if (res && res.status !== 'Success') {
                        return resp.status(200).json(res);
                    } else {
                        let fileUrl = await getDownloadURL(file);

                        return resp.status(200).json({ status: 'Success', payload: { ...audioInfo.payload, fileUrl } });
                    }
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

                if (data_received.payload) {

                    let fileUrl = data_received.payload;

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
                console.log(data_received.payload)
                let fileUrl = data_received.payload.fileUrl;
                let fileContainer = data_received.payload.fileContainer;
                let fileIndex = data_received.payload.fileIndex;

                let segmentDuration = 3600;
                if (data_received.payload.lastSegmentDuration) {
                    segmentDuration = data_received.payload.lastSegmentDuration;
                };


                let fileSegment = bucket.file(`ytdl/${userId}/segment_${fileIndex}.${fileContainer}`);
                let startTime = data_received.payload.startTime;

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

                let file = bucket.file(`ytdl/${userId}/${data_received.payload.fileName}`);
                let extractedText = await summarize.extractTextFromAudioFile(openai, file, data_received.payload.mimeType);

                if (extractedText && extractedText.status == 'Success') {
                    return resp.status(200).json({ status: 'Success', content: extractedText.payload }); //text-from-audio received
                } else {
                    return resp.status(200).json({ status: 'Error', message: `${extractedText.message}. Unable to achieve text extraction` })
                }
                break;
            case 'summarizeText':

                let summarizeResult = await summarize.summarizeText(openai, data_received.payload);
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
        const ratesData = await fetch(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${process.env.SECRET_KEY_CURRENCY_RATES}&symbols=EUR,BGN,GBP,CHF,JPY,ZAR,CNY`);
        if (!ratesData) {
            resp.status(500).json({ error: 'Internal Server Error.' });
        }
        rates = await ratesData.json();
        resp.status(200).json({ rates: rates.rates });
    }
)

exports.webhookStrp = onRequest(
    {
        // cors: true,
        cors: ['/stripe\.com$/'],
        secrets: ['STRIPE_WHSEC'] //uncomment to production
    },

    async (req, resp) => {
        // DEV mode key
        // const endpointSecret = process.env.STRIPE_WHSEC_DEV;

        // PRODuction key
        const endpointSecret = process.env.STRIPE_WHSEC;

        if (req.method !== 'POST') {
            return resp.status(400).json({ error: 'Bad request.' });
        };

        const payload = req.rawBody;
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
        } catch (err) {
            // console.log('ERROR for event: ', err.message)
            return resp.status(400).send(`Event.object Error: ${err.message}`);
        }
        if (!event) {
            return resp.status(400).send(`Event.object Error: Event is Null`);
        }
        if (!event.type) {
            return resp.status(400).send(`Event.object Error: no Event.type`);
        }
        if (event.type === 'checkout.session.completed') {


            if (event.data.object.metadata.uid && event.data.object.metadata.uid !== undefined && event.data.object.metadata.period && event.data.object.metadata.period != undefined) {
                let subscriptionPeriod;
                let type;
                if (event.data.object.metadata.upgradePeriod != null || event.data.object.metadata.upgradePeriod != undefined) {
                    type = 'Premium';
                    subscriptionPeriod = Number(event.data.object.metadata.upgradePeriod);
                } else {
                    const timeStamp = Timestamp.now();
                    const start = timeStamp.toMillis();
                    const year = 31536000000;
                    const halfYear = 15768000000;

                    if (event.data.object.metadata.period === '1 year') {
                        subscriptionPeriod = start + year;
                        type = 'Premium';
                    } else {
                        type = 'Basic';
                        subscriptionPeriod = start + halfYear;
                    }
                }

                try {
                    const usersUserDoc = db.collection('users').doc(event.data.object.metadata.uid);
                    await usersUserDoc.set({ plan: { type, period: subscriptionPeriod } }, { merge: true });
                } catch (err) {
                    return resp.status(400).send(`DB Error: ${err.message}`);
                }
            }
        }

        resp.status(200).end();
    });

exports.createSubscription = onRequest(
    {
        // cors: true //dev
        cors: [process.env.APP_DOMAIN_MAIN, process.env.APP_DOMAIN_CUSTOM, process.env.APP_DOMAIN_SECOND,], //prod
        enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
    },
    async (req, resp) => {
        //DEV domain
        // const APP_DOMAIN_CUSTOM = 'http://127.0.0.1:5000';
        //PROD domain
        // const APP_DOMAIN = process.env.APP_DOMAIN_MAIN;
        const APP_DOMAIN_CUSTOM = process.env.APP_DOMAIN_CUSTOM;
        const APP_NAME = process.env.APP_NAME;

        if (req.method !== 'POST') {
            return resp.status(400).json({ error: 'Bad request.' });
        }
        else {
            const payloadReceived = JSON.parse(req.body);

            const userEmail = payloadReceived.email;
            const userId = payloadReceived.uid;
            const currency = payloadReceived.currency;
            const price = payloadReceived.price;

            const period = payloadReceived.period;
            const upgradePeriod = payloadReceived.upgradePeriod;

            const customer_email = userEmail;
            const mode = 'payment';
            const success_url = `${APP_DOMAIN_CUSTOM}/workspace?checkout=complete`;
            const cancel_url = `${APP_DOMAIN_CUSTOM}/workspace?checkout=cancel`;
            const automatic_tax = { enabled: true };

            if (!period || !currency) {
                resp.status(500).json({ error: 'Internal Server Error.' })
            };

            let session = null;

            let objectToCreateSession = (isUpgrade) => {
                let DESCRIPTION_STRING = `${APP_NAME} subscription for ${period}.`;
                let METADATA_TO_ADD = { uid: userId, period };

                if (isUpgrade == true) {
                    DESCRIPTION_STRING = `${APP_NAME} subscription upgrade to Premium.`;
                    METADATA_TO_ADD = { uid: userId, period, upgradePeriod }
                }
                return ({
                    line_items: [
                        {
                            price_data: {
                                currency: currency,
                                product_data: {
                                    name: DESCRIPTION_STRING,
                                },
                                unit_amount: Math.trunc(price * 100),
                            },
                            quantity: 1,
                        },
                    ],
                    metadata: { ...METADATA_TO_ADD },
                    customer_email,
                    mode,
                    success_url,
                    cancel_url,
                    automatic_tax
                })
            }

            if (upgradePeriod != null || upgradePeriod != undefined) {
                // upgrade a plan
                session = await stripe.checkout.sessions.create(objectToCreateSession(true))

            } else {
                // crete a new subscription
                session = await stripe.checkout.sessions.create(objectToCreateSession(false))
            }

            //stripe-hosted page
            if (session?.url) {
                resp.status(200).json({ url: session.url })
            } else {
                resp.status(500).json({ error: 'Internal Server Error.' });
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
            return resp.status(400).json({ error: 'Bad request.' });
        }
        else {

            if (req.body) {

                let data = req.body;
                let assistReply = await createCompletions(data);
                if (assistReply) {
                    return resp.status(200).json({ content: assistReply })
                } else {
                    return resp.status(500).json({ error: 'Internal Server Error.' });
                }
            }
            else {
                return resp.status(400).json({ error: 'Bad request.' });
            }
        }
    }

);

const createCompletions = async (dataJSON) => {

    let data = await JSON.parse(dataJSON);
    const openai = new OpenAI({
        apiKey: process.env.SECRET_KEY_OPENAI,
    });
    let model = 'gpt-3.5-turbo';
    let presence_p = data.presence_p || 0;
    let frequency_p = data.frequency_p || 0;
    let temperature = data.temperature || 1;

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

    const completion = await openai.chat.completions.create({
        model,
        temperature,
        presence_penalty: presence_p,
        frequency_penalty: frequency_p,
        max_tokens: data.tokens,
        messages: data.messagesArray,
    });

    // console.log('-------------------')
    // console.log(completion)
    // console.log('--=====================-')
    return completion.choices[0].message.content
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

                const { request, size, quality, style } = { ...JSON.parse(req.body) };
                const imgSize = {
                    A: '1024x1024',
                    B: '1792x1024',
                    C: '1024x1792',
                }
                let imageData64 = await generateImage_dall_e_3_64(request, `${imgSize[size]}`, style, quality); //return base64

                if (imageData64) {
                    return resp.status(200).json({ content: imageData64 })
                } else {
                    return resp.status(500).json({ error: 'Internal Server Error.' });
                }
            }
            else {
                return resp.status(400).json({ error: 'Bad request.' });
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

    // create initial db documents for a new  user //
    const chatsUserDoc = db.collection('chats').doc(userId);
    const usersUserDoc = db.collection('users').doc(userId);
    const summarizeYTUserDoc = db.collection('summarizeYT').doc(userId);

    const timeStamp = Timestamp.now();
    const start = timeStamp.toMillis();
    const period = start + 259200000;
    await chatsUserDoc.set({}, { merge: true });
    await summarizeYTUserDoc.set({}, { merge: true });
    await usersUserDoc.set({ theme: 'green', plan: { period, type: 'Trial', imgTrial: 0, trialOffers: { images: 0, youtube: 0 } }, userData: { email, isVerified } }, { merge: true });

    return `Document created.`
}

const deleteUserInDB = async (userId) => {

    const chatsUserDoc = db.collection('chats').doc(userId);
    const usersUserDoc = db.collection('users').doc(userId);
    const summarizeYTUserDoc = db.collection('summarizeYT').doc(userId);

    await chatsUserDoc.delete();
    await usersUserDoc.delete();
    await summarizeYTUserDoc.delete();

    return `User (${userId}) deleted from DataBase.`
}