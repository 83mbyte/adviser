
const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { OpenAI } = require("openai");

setGlobalOptions({ maxInstances: 5 });

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

