
const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2/options");


const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const { OpenAI } = require("openai");

setGlobalOptions({ maxInstances: 5 });

// init App and DB
initializeApp();
const db = getFirestore();

exports.requestToAssistant = onRequest(
    {
        cors: [process.env.APP_DOMAIN_MAIN, process.env.APP_DOMAIN_SECOND],
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
        cors: [process.env.APP_DOMAIN_MAIN, process.env.APP_DOMAIN_SECOND],
        secrets: ['SECRET_KEY_OPENAI']
    },
    async (req, resp) => {

        if (req.method !== 'POST') {
            resp.status(400).json({ error: 'Bad request.' });
        }
        else {

            if (req.body) {

                const { request, size } = { ...JSON.parse(req.body) };



                let imageUrl = await generateImage(request, `${size}x${size}`);
                if (imageUrl) {
                    resp.status(200).json({ content: imageUrl })
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

    }
}


exports.userAdded = functions.auth.user().onCreate((user) => {

    let result = createUserInDB(user.uid);
    return Promise.resolve();
})

exports.userDeleted = functions.auth.user().onDelete((user) => {
    let result = deleteUserInDB(user.uid);
    return Promise.resolve();
})

const createUserInDB = async (userId) => {

    // create initial db documents for a new  user //
    const chatsUserDoc = db.collection('chats').doc(userId);
    const usersUserDoc = db.collection('users').doc(userId);
    const chatsUserRes = await chatsUserDoc.set({}, { merge: true });
    const usersUserRes = await usersUserDoc.set({ theme: 'Green' }, { merge: true });

    return `Document created.`
}

const deleteUserInDB = async (userId) => {

    const chatsUserDoc = db.collection('chats').doc(userId);
    const usersUserDoc = db.collection('users').doc(userId);

    await chatsUserDoc.delete();
    await usersUserDoc.delete();
    return `User (${userId}) deleted from DataBase.`
}