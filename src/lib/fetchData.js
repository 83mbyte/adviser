
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
