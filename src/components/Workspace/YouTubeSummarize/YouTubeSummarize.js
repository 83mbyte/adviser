import WorkspaceCard from "../WorkspaceComponents/WorkspaceCard";
import ResultContentYTSummarize from "../WorkspaceComponents/WorkspaceResultsToShow/ResultContentYTSummarize.js"
import { getReplyFromAssistant } from "@/src/lib/fetchingData";
import { useAuthContext } from "@/src/context/AuthContextProvider";
import { useToast } from "@chakra-ui/react";
import { useSettingsContext } from "@/src/context/SettingsContext";
import { useState, useEffect, useRef } from "react";

import { dbAPI } from "@/src/lib/dbAPI";
import { promptTemplatesAPI } from "@/src/lib/promptsAPI";


const headerLeftButtons = null;
const headerRightButtons = null;

const YouTubeSummarize = ({ showNoHistoryVideoIssue, setShowNoHistoryVideoIssue }) => {

    const inputFormRef = useRef(null);
    const toast = useToast({
        position: 'top-right',
        duration: 10000,
        isClosable: true,
        containerStyle: {
            maxWidth: '100%',
            marginTop: '100px'
        }
    });
    const user = useAuthContext();

    const accessToken = user.accessToken;

    const settingsContext = useSettingsContext();
    const { subscription, setSubscription } = settingsContext.userSubscription;
    const { trialOffers, setTrialOffers } = settingsContext.trialOffers;
    const { themeColor } = settingsContext.userThemeColor;
    const { summarizeSettings } = settingsContext.summarizeSettings;

    const [isLoading, setIsLoading] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [showFooter, setShowFooter] = useState(true);
    const [showHeaderReturnPanel, setShowHeaderReturnPanel] = useState({ state: false, title: '' });  //return panel state

    const [youtubeSummarizeHistory, setYoutubeSummarizeHistory] = useState(null);
    const [showSummarize] = useState(true);
    const [historyId, setHistoryId] = useState(null);

    const headerReturnButtonHandler = () => {
        //return button in the header panel.. 
        // closeAll();
        setShowFooter(true);
        // if (chatsHistory) {
        //     setShowChatMessages(true)
        // }
    }

    const getTextFromAudioObject = async (data) => {
        setIsLoading(true);
        let result = null;
        setProgressValue(1);
        let filesToTranscribe = [];
        let tmpProgressValue = 0;

        try {
            let respAudioInfo = await getReplyFromAssistant({ type: 'getAudioInfo', accessToken, payload: data.value }, 'summarize');

            if (!respAudioInfo || respAudioInfo.status == 'Error') {

                throw new Error(respAudioInfo.message ? respAudioInfo.message : 'the request can not be fulfilled');
            }
            else if (respAudioInfo.status == 'Success') {

                setProgressValue(10);

                let audioInfo = respAudioInfo.payload;
                let fileUrl = audioInfo.fileUrl;
                let fileContainer = audioInfo.container;

                if (audioInfo.contentLength < 25000000) {

                    setProgressValue(50);
                    filesToTranscribe.push(`audio_source.${fileContainer}`);
                }
                else {
                    let audioSegmentsData = await getReplyFromAssistant({ type: 'createAudioSegmentsTime', accessToken, payload: fileUrl }, 'summarize');

                    if (!audioSegmentsData || audioSegmentsData.status == 'Error') {
                        throw new Error(audioSegmentsData.message ? audioSegmentsData.message : 'Error: undefined issue')
                    }

                    if (audioSegmentsData.status == 'Success' && audioSegmentsData.payload) {

                        setProgressValue(30);

                        if (audioSegmentsData.payload.totalFiles > 1) {

                            let indexCutFile = 0;
                            tmpProgressValue = 30;

                            for (let i = 0; i < audioSegmentsData.payload.segmentsArray.length; i++) {

                                let segmentStart = audioSegmentsData.payload.segmentsArray[i];
                                let lastSegmentDuration = null;

                                if (i == (audioSegmentsData.payload.segmentsArray.length) - 1) {

                                    lastSegmentDuration = Math.ceil(audioSegmentsData.payload.lastSegmentDuration);
                                }

                                let resp = await getReplyFromAssistant({ type: 'splitAudioOnSegments', accessToken, payload: { startTime: segmentStart, fileUrl: fileUrl, fileContainer, fileIndex: indexCutFile, lastSegmentDuration } }, 'summarize');

                                if (resp && resp.status == 'Success') {

                                    filesToTranscribe.push(resp.payload);
                                    tmpProgressValue = tmpProgressValue + (Math.ceil(20 / audioSegmentsData.payload.segmentsArray.length));
                                    setProgressValue(tmpProgressValue);
                                    indexCutFile++;
                                }
                            }
                        }
                    }
                }

                // get text from audio
                let extractedTextArray = [];
                if (filesToTranscribe.length > 0) {

                    tmpProgressValue = 54;
                    for (const fileName of filesToTranscribe.sort()) {

                        let respTextFromAudio = null;

                        respTextFromAudio = await getReplyFromAssistant({ type: 'getTextFromAudio', accessToken, payload: { fileName: fileName, mimeType: audioInfo.mimeType } }, 'summarize');

                        if (!respTextFromAudio || (respTextFromAudio && respTextFromAudio.status == 'Error')) {

                            throw new Error(respTextFromAudio.message ? respTextFromAudio.message : `Error while text extraction`);
                        }
                        else if (respTextFromAudio && respTextFromAudio.status == 'Success') {
                            console.log('respTextFromAudio', respTextFromAudio)

                            tmpProgressValue = tmpProgressValue + (Math.ceil(20 / filesToTranscribe.length));
                            extractedTextArray.push(respTextFromAudio.content);
                            setProgressValue(tmpProgressValue);
                        }
                    }
                }

                if (extractedTextArray.length > 0) {


                    // TODO make sumarizing of text chunks
                    // https://community.openai.com/t/how-to-send-long-articles-for-summarization/205574/3
                    //
                    //
                    setProgressValue(75);
                    let fullText = extractedTextArray.join(' ');


                    let wordsCount = fullText.trim().split(' ').length;
                    // console.log('full text lengh: ', fullText.length);
                    // console.log('total wrods: ', wordsCount);
                    // console.log('tokens approx.:', wordsCount * 3.1)
                    result = { textArray: extractedTextArray, wordsCount: wordsCount, title: audioInfo.title, urlOnYouTube: audioInfo.urlOnYouTube }
                }
            }

        }
        catch (error) {
            console.error(error);
            toast({
                title: error.message ? `${error.message}` : `Error: the request can not be fulfilled`,
                status: 'error',
            });
            setIsLoading(false);
            setProgressValue(0);

        }
        finally {
            inputFormRef.current.value = '';
            return result
        }
    }

    const getSummarizedText = async (textArray, parser) => {

        //summarizing text
        let resultToReturn = [];

        let fullTextToSummarize = textArray.join(' ');

        let systemMessage = promptTemplatesAPI.summarizeAsHTML();

        try {

            let messagesArray = [systemMessage, { role: 'user', content: fullTextToSummarize }];

            let summarizeResult = await getReplyFromAssistant({ type: 'summarizeText', accessToken, payload: messagesArray }, 'summarize');

            if (!summarizeResult || summarizeResult.status == 'Error') {
                throw new Error(summarizeResult.message ? summarizeResult.message : 'Error while summarizing process')
            }

            let html_parser = parser.parseFromString(summarizeResult.content, "text/html");

            // resultToReturn.push(summarizeResult.content);
            resultToReturn.push(html_parser.body.innerHTML);

        } catch (error) {
            console.error(error);
            toast({
                title: error.message ? `${error.message}` : `Error: the request can not be fulfilled`,
                status: 'error',
            });
            setIsLoading(false);
            setProgressValue(0);
        } finally {
            return resultToReturn.join(' ');
        }
    }

    const addToLocalHistory = async (source, title, summarizedText) => {
        if (summarizedText) {
            setProgressValue(99);
            let requestAndReplyItem = {
                //user: { content: data.value },
                assistant: { source, title, content: summarizedText }
            }

            if (subscription?.type) {
                console.log('# 1')
                if (subscription.type == 'Premium' || subscription.type == 'Basic') {
                    console.log('# 2')
                    let dataToUpload;
                    if (youtubeSummarizeHistory && youtubeSummarizeHistory[historyId]) {
                        dataToUpload = [
                            ...youtubeSummarizeHistory[historyId],
                            requestAndReplyItem
                        ]
                    } else {
                        dataToUpload = [
                            requestAndReplyItem
                        ]
                    }

                    let updateRes = await dbAPI.updateData('summarizeYT', user.uid, historyId, dataToUpload);
                    console.log('updateRes', updateRes)

                }
            }

            if (youtubeSummarizeHistory && youtubeSummarizeHistory[historyId]) {
                console.log('# 3')
                setYoutubeSummarizeHistory({
                    ...youtubeSummarizeHistory,
                    [historyId]: [
                        ...youtubeSummarizeHistory[historyId],
                        requestAndReplyItem
                    ]
                });

            } else {

                setYoutubeSummarizeHistory({
                    [historyId]: [requestAndReplyItem]
                });
            }
        }
    }

    const submitDataDev = async (data) => {
        let parser = new DOMParser();
        try {
            let textFromAudioObject = await getTextFromAudioObject(data);

            if (!textFromAudioObject || textFromAudioObject == undefined) {
                return null;
            }

            setProgressValue(77);

            if (subscription.type == 'Trial') {

                let newValueTrialImagesCount = trialOffers.youtube + 1;

                setTrialOffers({
                    ...trialOffers,
                    youtube: newValueTrialImagesCount
                });

                let dataToUpload = {
                    ...subscription,
                    trialOffers: {
                        ...subscription.trialOffers,
                        youtube: newValueTrialImagesCount
                    }
                }

                setSubscription({
                    ...subscription,
                    trialOffers: {
                        ...subscription.trialOffers,
                        youtube: newValueTrialImagesCount
                    }
                });

                await dbAPI.updateUserData(user.uid, 'plan', dataToUpload);
            }

            if (summarizeSettings.operation == 'summarize') {
                let summarizedText = await getSummarizedText(textFromAudioObject.textArray, parser);

                if (summarizedText) {
                    setProgressValue(96);
                    console.log('summarized length', summarizedText.length)
                    addToLocalHistory(textFromAudioObject.urlOnYouTube, textFromAudioObject.title, summarizedText);
                }
            } else {
                console.log('full text ')
                // TODO create extract text with timecodes
                // TODO create extract text with timecodes
                // TODO create extract text with timecodes    
                // TODO create extract text with timecodes
                // TODO create extract text with timecodes
            }

        } catch (error) {
            console.error(error);
            toast({
                title: error.message ? `Error: ${error.message}` : `Error: the request can not be fulfilled`,
                status: 'error',
            });
            setIsLoading(false);
            setProgressValue(0);

        } finally {
            setIsLoading(false);
            setProgressValue(0);

        }
    }

    const generateHistoryId = () => {
        let generatedId = Date.now();
        if (generatedId) {
            setHistoryId(generatedId);
        } else {
            alert(`something wrong.. please refresh the page.`);
        }
    }

    useEffect(() => {
        if (!historyId) {
            generateHistoryId();
        }
    }, []);
    return (
        <>
            <WorkspaceCard
                cardTitle={'Summarize YouTube video'}
                showIssueNotice={showSummarize && showNoHistoryVideoIssue}
                closeIssueNotice={setShowNoHistoryVideoIssue}
                showHeaderReturnPanel={showHeaderReturnPanel}
                headerLeftButtons={null}
                headerRightButtons={null}
                headerReturnButtonHandler={headerReturnButtonHandler}
                callback={submitDataDev}
                inputValue={null}
                showFooter={showFooter}
                isLoading={isLoading}
                promptToRepeat={null}
                setPromptToRepeat={null}
                currentChatHistoryId={historyId}
                ref={inputFormRef}
            >
                sumarize video - https://www.youtube.com/watch?v=ij8w9LIsxSA

                {
                    showSummarize &&
                    <ResultContentYTSummarize progressValue={progressValue} isLoading={isLoading} themeColor={themeColor} showSummarize={showSummarize} currentSummarize={youtubeSummarizeHistory ? youtubeSummarizeHistory[historyId] : []} />
                }

            </WorkspaceCard>
        </>
    )
}

export default YouTubeSummarize;