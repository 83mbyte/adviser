
const ytdl = require('ytdl-core');

module.exports = {
    validateYoutubeURL: (url) => {

        try {
            if (!ytdl.validateURL(url)) {

                return ({ status: 'Error', message: 'URL mismatch' });
            } else {
                return ({ status: 'Success', message: 'Correct URL' });
            }

        } catch (error) {
            console.lo('Error:', error)
        }
    },
    collectYouTubeInfo: async (url) => {
        let minValue = { id: null, value: Number.MAX_SAFE_INTEGER };
        let info = await ytdl.getInfo(url);
        if (!info) {
            return ({ status: 'Error', message: `Unable to collect a video information` })
        }

        let videoTitle = 'No title provided';
        if (info?.videoDetails?.title) {
            videoTitle = info.videoDetails.title;
        }
        let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        if (!audioFormats) {
            return ({ status: 'Error', message: `Unable to collect audio formats from a given video source` })
        }

        audioFormats.forEach((audioItem, index) => {
            let current = (Number(audioItem.contentLength));
            if (current < minValue.value) {
                minValue = { id: index, value: current };
            }
        });

        return ({
            status: 'Success',
            payload: {
                title: videoTitle,
                urlOnYouTube: url,
                mimeType: audioFormats[minValue.id].mimeType.split('; ')[0],
                container: audioFormats[minValue.id].container,
                itag: audioFormats[minValue.id].itag,
                contentLength: audioFormats[minValue.id].contentLength
            }
        });
    },
    downloadAudioFile: (url, info, fileSaveTo, userId) => {

        return new Promise((resolve, reject) => {

            let fileStream = fileSaveTo.createWriteStream({
                metadata: {
                    contentType: `audio/${info.container}`,
                    metadata: {
                        source: 'youtube',
                        downloadedBy: userId,
                    }
                }
            });

            ytdl(url, { quality: info.itag })
                .pipe(fileStream)
                .on('error', () => {
                    fileStream.end();
                    reject({ status: 'Error', message: 'file.writeStream error..' });
                })
                .on('finish', async () => {
                    fileStream.end();
                    resolve({ status: 'Success', message: 'audio file downloaded' });
                });
        })
    },
    extractTextFromAudioFile: async (openai, file, type) => {
        function streamToBlob(stream) {
            return new Promise((resolve, reject) => {
                const chunks = [];
                stream
                    .on('data', chunk => chunks.push(chunk))
                    .once('end', () => {
                        const blob = new Blob(chunks, { type: type });
                        resolve(blob)
                    })
                    .once('error', reject)
            })
        }

        const sendFileToTranscribe = async (file) => {

            try {
                const transcription = await openai.audio.transcriptions.create({
                    file: file,
                    model: "whisper-1",
                });
                if (transcription && transcription.text) {

                    return ({ status: 'Success', payload: transcription.text })
                } else {
                    return ({ status: 'Error', message: 'Text transcription result is undefined' })
                }

            } catch (error) {
                console.log(error);
                return ({ status: 'Error', message: `${error}` })
            }
        }

        let stream = file.createReadStream();
        let blob = await streamToBlob(stream);
        if (blob) {

            let filename = `summarize.${blob.type.split('/')[1]}`;

            let file = new File([blob], filename, {
                type: blob.type,
                lastModified: Date.now(),
            })

            let transcriptionText = await sendFileToTranscribe(file);

            return transcriptionText
        } else {
            return ({ status: 'Error:', message: 'no blob received' })
        }
    },

    summarizeText: async (openai, messagesArrayToSummarize) => {

        let model = 'gpt-4-1106-preview';
        // let model = 'gpt-4';
        // let model = 'gpt-3.5-turbo';
        let presence_p = 0;
        let frequency_p = 0;
        let temperature = 1;
        let tokens = 4090;

        // if (data.systemVersion) {
        //     switch (data.systemVersion) {
        //         case 'GPT-3.5':
        //             model = 'gpt-3.5-turbo';
        //             break;
        //         case 'GPT-4':
        //             model = 'gpt-4'
        //             break;
        //         default:
        //             model = 'gpt-3.5-turbo';
        //     }
        // }

        const completion = await openai.chat.completions.create({
            model,
            temperature,
            presence_penalty: presence_p,
            frequency_penalty: frequency_p,
            max_tokens: tokens,
            messages: messagesArrayToSummarize,
        });

        console.log('===========');
        console.log({
            usage: completion.usage,
            reason: completion.choices[0].finish_reason
        });
        console.log('===========');

        if (completion.choices[0].finish_reason == 'stop') {
            return { status: 'Success', payload: completion.choices[0].message.content }
        } else {
            return { status: 'Partial', payload: completion.choices[0].message.content }
        }
    }
}