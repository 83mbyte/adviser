
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
    collectInfo: async (url) => {
        let minValue = { id: null, value: Number.MAX_SAFE_INTEGER };
        let info = await ytdl.getInfo(url);
        if (!info) {
            return ({ status: 'Error', message: `Unable to collect a video information` })
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
                container: audioFormats[minValue.id].container,
                itag: audioFormats[minValue.id].itag
            }
        });
    },
    downloadAudio: (url, info, fileSaveTo, userId) => {

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

}