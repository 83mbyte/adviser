export const getReplyFromAssistant = async (data, model) => {
    let options = {
        method: 'POST',
        body: JSON.stringify(data)
    }
    let resp;
    switch (model) {

        case 'chat':
            // resp = await fetch(process.env.NEXT_PUBLIC_FUNC_DEV_URL, options);
            resp = await fetch(process.env.NEXT_PUBLIC_FUNC_PROD_URL, options);
            break;
        case 'image':
            // resp = await fetch(process.env.NEXT_PUBLIC_FUNC_IMAGE_DEV_URL, options);
            resp = await fetch(process.env.NEXT_PUBLIC_FUNC_IMAGE_PROD_URL, options);
            break;
        case 'summarize':
            // resp = await fetch(process.env.NEXT_PUBLIC_FUNC_SUMMARIZE_DEV_URL, options);
            resp = await fetch(process.env.NEXT_PUBLIC_FUNC_SUMMARIZE_PROD_URL, options);
            break;

        default:
            // resp = await fetch(process.env.NEXT_PUBLIC_FUNC_DEV_URL, options);
            resp = await fetch(process.env.NEXT_PUBLIC_FUNC_PROD_URL, options);
            break;
    }

    if (resp) {
        return await resp.json();
    } else {
        return { content: 'Unexpected error while request to assistant.' }
    }
}

export const transcribeToText = async (url) => {
    //DEV url
    // const URL = process.env.NEXT_PUBLIC_FUNC_TRANSCRIBE_DEV_URL;

    //PROD url
    const URL = process.env.NEXT_PUBLIC_FUNC_TRANSCRIBE_PROD_URL;
    return await fetch(URL, {
        method: 'POST',
        body: url
    })
        .then((resp) => {
            return resp.json();
        })
}

export const createCheckoutSession = async (dataObject) => {
    let resp;
    let options = {
        method: 'POST',
        body: JSON.stringify({ ...dataObject })
    }
    //DEV
    // resp = await fetch(process.env.NEXT_PUBLIC_FUNC_SUBSCRIPTION_DEV_URL, options);
    // PROD
    resp = await fetch(process.env.NEXT_PUBLIC_FUNC_SUBSCRIPTION_PROD_URL, options);

    if (resp) {
        return await resp.json();
    } else {
        return null
    }

}

export const getExchangeRates = async (accessToken = null) => {
    let options = {
        method: 'POST',
        body: JSON.stringify({ accessToken: accessToken })
    }
    // DEV
    // const resp = await fetch(process.env.NEXT_PUBLIC_FUNC_GETEXCHANGERATES_DEV_URL, { method: 'POST', body: JSON.stringify({ accessToken: accessToken }) });
    // PROD
    const resp = await fetch(process.env.NEXT_PUBLIC_FUNC_GETEXCHANGERATES_PROD_URL, options);

    if (resp && resp.status == 200) {
        return await resp.json()
    } else {
        return null
    }
}