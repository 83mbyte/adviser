export const getReplyFromAssistant = async (data, model) => {
    let options = {
        method: 'POST',
        body: JSON.stringify(data)
    }
    let resp;
    switch (model) {

        case 'chat':
            resp = await fetch(process.env.NEXT_PUBLIC_FUNC_DEV_URL, options);
            // resp = await fetch(process.env.NEXT_PUBLIC_FUNC_PROD_URL, options);
            break;
        case 'image':
            resp = await fetch(process.env.NEXT_PUBLIC_FUNC_IMAGE_DEV_URL, options);
            // resp = await fetch(process.env.NEXT_PUBLIC_FUNC_IMAGE_PROD_URL, options);
            break;

        default:
            resp = await fetch(process.env.NEXT_PUBLIC_FUNC_DEV_URL, options);
            // resp = await fetch(process.env.NEXT_PUBLIC_FUNC_PROD_URL, options);
            break;
    }

    if (resp) {
        return await resp.json();
    } else {
        return { content: 'Unexpected error while request to assistant.' }
    }
}