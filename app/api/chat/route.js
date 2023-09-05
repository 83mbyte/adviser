import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req) {
    let requestData = await req.json();
    let assistReply = await createCompletions(requestData);

    return NextResponse.json({ content: assistReply })
}


const createCompletions = async (data) => {
    const openai = new OpenAI({
        apiKey: process.env.ASSISTANT_KEY, // defaults to process.env["OPENAI_API_KEY"]
    });

    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        max_tokens: data.tokens,
        temperature: 1.2,
        messages: data.messagesArray,
    });

    return completion.choices[0].message.content
}