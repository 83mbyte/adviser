import { promptsTemplates } from "./promptsDefaults";

export const promptsAPI = {
    createSystemMessage: (activeButton) => {
        console.log('run promptsAPI.create()');
        let length;
        switch (activeButton.length) {
            case 'Short':
                length = '50 words';
                break;

            case 'Medium':
                length = '100 words';
                break;
            case 'Long':
                length = '300 words';
                break;
            case 'eXtraLong':
                length = '500 words';
                break;
            default:
                length = '100 words';
                break;
        }

        // provide your prompt as the example below
        // 
        // return ({
        //     role: 'system',
        //     content: `You are helpful assistant. Reply in a funny manner.`
        // })

        return promptsTemplates.main(activeButton, length)
    }

}
