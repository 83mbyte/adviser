
const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2/options");
// const { defineSecret } = require('firebase-functions/params');

const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");

const { OpenAI } = require("openai");

// DEV stripe key 
// const DEV_SECRET = process.env.STRIPE_API_KEY_DEV;
// const stripe = require('stripe')(DEV_SECRET);

// PROD stripe
// const STRIPE_SECRET = defineSecret('SECRET_KEY_STRIPE_API');
const stripe = require('stripe')(process.env.SECRET_KEY_STRIPE_API);

setGlobalOptions({ maxInstances: 5 });

// init App and DB
initializeApp();
const db = getFirestore();

exports.getExchangeRates = onRequest(

    {
        // DEV
        //cors: true,

        //PROD
        cors: [process.env.APP_DOMAIN_MAIN, process.env.APP_DOMAIN_SECOND, process.env.APP_DOMAIN_CUSTOM],
        secrets: ['SECRET_KEY_CURRENCY_RATES',]
    },
    async (req, resp) => {

        if (req.method !== 'POST') {
            resp.status(400).json({ error: 'Bad request.' });
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
            resp.status(400).json({ error: 'Bad request.' });
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

                const timeStamp = Timestamp.now();
                const start = timeStamp.toMillis();
                const year = 31536000000;
                const halfYear = 15768000000;
                let subscriptionPeriod;
                let type;
                if (event.data.object.metadata.period === '1 year') {
                    subscriptionPeriod = start + year;
                    type = 'Premium';
                } else {
                    type = 'Basic';
                    subscriptionPeriod = start + halfYear;
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
        cors: [process.env.APP_DOMAIN_MAIN, process.env.APP_DOMAIN_CUSTOM, process.env.APP_DOMAIN_SECOND,] //prod
    },
    async (req, resp) => {
        //DEV domain
        // const APP_DOMAIN = 'http://127.0.0.1:5000';
        //PROD domain
        // const APP_DOMAIN = process.env.APP_DOMAIN_MAIN;
        const APP_DOMAIN_CUSTOM = process.env.APP_DOMAIN_CUSTOM;

        if (req.method !== 'POST') {
            resp.status(400).json({ error: 'Bad request.' });
        }
        else {
            const payloadReceived = JSON.parse(req.body);

            const userEmail = payloadReceived.email;
            const userId = payloadReceived.uid;
            const currency = payloadReceived.currency;
            const price = payloadReceived.price;

            const period = payloadReceived.period;


            if (!period || !currency) {
                resp.status(500).json({ error: 'Internal Server Error.' })
            };

            const session = await stripe.checkout.sessions.create({

                // create a product
                line_items: [
                    {
                        price_data: {
                            currency: currency,
                            product_data: {
                                name: `Helpi subscription for ${period}.`,
                            },
                            unit_amount: Math.trunc(price * 100),
                        },
                        quantity: 1,
                    },
                ],
                metadata: { uid: userId, period },
                customer_email: userEmail,
                mode: 'payment',
                success_url: `${APP_DOMAIN_CUSTOM}/workspace?checkout=complete`,
                cancel_url: `${APP_DOMAIN_CUSTOM}/workspace?checkout=cancel`,
                automatic_tax: { enabled: true },
            });
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
        cors: [process.env.APP_DOMAIN_MAIN, process.env.APP_DOMAIN_SECOND, process.env.APP_DOMAIN_CUSTOM],
        secrets: ['SECRET_KEY_OPENAI']
    },
    async (req, resp) => {
        if (req.method !== 'POST') {
            resp.status(400).json({ error: 'Bad request.' });
        }
        else {

            if (req.body) {

                let data = req.body;
                let assistReply = await createCompletions(data);
                if (assistReply) {
                    resp.status(200).json({ content: assistReply })
                } else {
                    resp.status(500).json({ error: 'Internal Server Error.' });
                }
            }
            else {
                resp.status(400).json({ error: 'Bad request.' });
            }
        }
    }

);

const createCompletions = async (dataJSON) => {

    let data = await JSON.parse(dataJSON);
    const openai = new OpenAI({
        apiKey: process.env.SECRET_KEY_OPENAI,
    });

    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        max_tokens: data.tokens,
        temperature: 1.2,
        messages: data.messagesArray,
    });

    return completion.choices[0].message.content
}

// Dall-e

exports.requestToAssistantWithImage = onRequest(
    {
        //DEV
        // cors: true,
        //PROD
        cors: [process.env.APP_DOMAIN_MAIN, process.env.APP_DOMAIN_SECOND, process.env.APP_DOMAIN_CUSTOM],
        secrets: ['SECRET_KEY_OPENAI']
    },
    async (req, resp) => {
        const generateImage = async (request, size = '256x256') => {
            const openai = new OpenAI({
                //dev
                // apiKey: process.env.NEXT_PUBLIC_ASSISTANT_KEY,
                //prod
                apiKey: process.env.SECRET_KEY_OPENAI,
            });
            try {
                const image = await openai.images.generate({ prompt: request, size: size });
                if (image?.data) {
                    return image.data[0].url
                } else {
                    return null
                }
            } catch (error) {
                return null
            }
        };

        const generateImage_dall_e_3_64 = async (request, size = '1024x1024') => {
            const openai = new OpenAI({

                apiKey: process.env.SECRET_KEY_OPENAI,
            });

            try {
                const image = await openai.images.generate({
                    model: 'dall-e-3', prompt: request, size, style: 'natural', response_format: 'b64_json'
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
            resp.status(400).json({ error: 'Bad request.' });
        }
        else {

            if (req.body) {

                const { request, size } = { ...JSON.parse(req.body) };
                const imgSize = {
                    A: '1024x1024',
                    B: '11792x1024',
                    C: '1024x1792',
                }
                let imageData64 = await generateImage_dall_e_3_64(request, `${imgSize[size]}`); //return base64

                if (imageData64) {
                    resp.status(200).json({ content: imageData64 })
                } else {
                    resp.status(500).json({ error: 'Internal Server Error.' });
                }
            }
            else {
                resp.status(400).json({ error: 'Bad request.' });
            }
        }
    }
)



exports.userAdded = functions.auth.user().onCreate((user) => {
    createUserInDB(user.uid);
    return Promise.resolve();
})

exports.userDeleted = functions.auth.user().onDelete((user) => {
    deleteUserInDB(user.uid);
    return Promise.resolve();
})


const createUserInDB = async (userId) => {

    // create initial db documents for a new  user //
    const chatsUserDoc = db.collection('chats').doc(userId);
    const usersUserDoc = db.collection('users').doc(userId);
    const imagesUserDoc = db.collection('images').doc(userId);
    const timeStamp = Timestamp.now();
    const start = timeStamp.toMillis();
    const period = start + 259200000;
    await chatsUserDoc.set({}, { merge: true });
    await imagesUserDoc.set({}, { merge: true });
    await usersUserDoc.set({ theme: 'green', plan: { period, type: 'Trial' } }, { merge: true });

    return `Document created.`
}

const deleteUserInDB = async (userId) => {

    const chatsUserDoc = db.collection('chats').doc(userId);
    const usersUserDoc = db.collection('users').doc(userId);
    const imagesUserDoc = db.collection('images').doc(userId);

    await chatsUserDoc.delete();
    await usersUserDoc.delete();
    await imagesUserDoc.delete();
    return `User (${userId}) deleted from DataBase.`
}