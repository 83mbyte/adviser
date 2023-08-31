
const makeRequest = async (url, options) => {
    try {
        // dev mode fetch
        const resp = await fetch(url, { ...options, cache: 'no-store' });

        if (resp.ok && resp.status === 200) {
            let res = await resp.json();
            return { status: 'success', data: res }
        } else {
            return { status: 'unsuccess', data: null }
        }

    } catch (error) {
        console.error(error)
        return { status: 'error', data: `Error: ${error}` }
    }
}

export const putData = async (postId, query) => {
    console.log('putData');
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    }
    const URL = `${process.env.NEXT_PUBLIC_DB_URL}/test/chatHistory/${postId}/.json`;
    return await makeRequest(URL, options)
}

export const deleteData = async (postId) => {
    console.log('deleteData');
    const options = {
        method: 'DELETE',
    }
    const URL = `${process.env.NEXT_PUBLIC_DB_URL}/test/chatHistory/${postId}/.json`;

    return await makeRequest(URL, options)
}

export const getData = async () => {
    console.log('getData')
    const options = {
        method: 'GET',
    }
    const URL = `${process.env.NEXT_PUBLIC_DB_HOST_URL}`;

    return await makeRequest(URL, options);
}

export const requestAssistant = async (endPoint, messagesArray, tokens = 1500) => {

    //will be moved to functions later

    const API_KEY = process.env.NEXT_PUBLIC_ASSISTANT_KEY
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: messagesArray,
            max_tokens: tokens,
            temperature: 1.2
        })
    }
    const URL = `${process.env.NEXT_PUBLIC_ASSISTANT_URL}`;

    const resp = await makeRequest(URL, options);


    if (resp.status === 'success' && resp.data.choices.length > 0) {
        // resp.status(200).send(JSON.stringify({ content: data.choices[0].message.content }));
        //console.log('reply::: ', JSON.stringify({ content: resp.data.choices[0].message.content }))
        // return JSON.stringify({ content: resp.data.choices[0].message.content })
        return { content: resp.data.choices[0].message.content }
    } else {
        // resp.status(200).send(JSON.stringify({ content: 'Unexpected error.' }));
        console.log('Error:: ', resp)
        return JSON.stringify({ content: 'Unexpected error.' })
    }

}