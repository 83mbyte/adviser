import { useState, useEffect, useRef } from "react";

import { getReplyFromAssistant } from "@/src/lib/fetchingData";
import { useAuthContext } from "@/src/context/AuthContextProvider";
import { useToast } from "@chakra-ui/react";
import { useSettingsContext } from "@/src/context/SettingsContext";
import { useHistoryContext } from "@/src/context/HistoryContextProvider";

import { animationProps } from "@/src/lib/animationProps";

import { dbAPI } from "@/src/lib/dbAPI";
import { promptTemplatesAPI } from "@/src/lib/promptsAPI";

import { MdHistory, } from 'react-icons/md';
import { AnimatePresence, motion } from "framer-motion";

import WorkspaceHistory from "../WorkspaceComponents/WorkspaceHistory/WorkspaceHistory";
import WorkspaceCard from "../WorkspaceComponents/WorkspaceCard";
import ResultContentYTSummarize from "../WorkspaceComponents/WorkspaceResultsToShow/ResultContentYTSummarize.js"


const headerLeftButtons = null;
// const headerRightButtons = null;

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

    const historyContext = useHistoryContext();

    const history = historyContext.history.summarizeYT;
    const [historyId, setHistoryId] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [showFooter, setShowFooter] = useState(true);
    const [showHeaderReturnPanel, setShowHeaderReturnPanel] = useState({ state: false, title: '' });  //return panel state

    const [showSummarize, setShowSummarize] = useState(true);
    const [showHistoryScreen, setShowHistoryScreen] = useState(false);


    const closeAll = () => {

        if (showHistoryScreen === true) {
            setShowHistoryScreen(false);
        }
        if (showHeaderReturnPanel.state == true) {
            headerReturnPanelToggler();
        }
    }
    const headerReturnButtonHandler = () => {
        //return button in the header panel.. 
        closeAll();
        setShowFooter(true);
        if (showSummarize == false) {
            setShowSummarize(true)
        }
    }

    const headerReturnPanelToggler = (titleText) => {
        setShowHeaderReturnPanel({
            state: !showHeaderReturnPanel.state,
            title: titleText ? titleText : ''
        })
    }

    const historyButtonHandler = (panelTitleText) => {
        headerReturnPanelToggler(panelTitleText);
        setShowFooter(false);
        setShowSummarize(false);
        setShowHistoryScreen(true);
    }

    const clearItemFromHistory = async (historyId) => {
        console.log('deleting..')
        let res = await dbAPI.deleteDocument('summarizeYT', user.uid, historyId);
        if (res && res.status == 'Success') {

            historyContext.deleteFromHistory('summarizeYT', historyId)
        }
        else {
            console.error(res.message)
        }

        return 'done'
    }

    const chooseHistory = (data) => {
        setHistoryId(data);
        setShowHistoryScreen(false);
        setShowHeaderReturnPanel({
            state: false,
            title: ''
        });
        setShowFooter(true);
        setShowSummarize(true);
    }

    const getTextFromAudioObject = async (data) => {
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

                            tmpProgressValue = tmpProgressValue + (Math.ceil(20 / filesToTranscribe.length));
                            extractedTextArray.push(respTextFromAudio.content);
                            setProgressValue(tmpProgressValue);
                        }
                    }
                }

                if (extractedTextArray.length > 0) {

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

    const addToHistory = async (source, title, summarizedText) => {

        if (summarizedText) {
            setProgressValue(99);
            let requestAndReplyItem = {
                //user: { content: data.value },
                assistant: { source, title, content: summarizedText }
            }

            if (subscription?.type) {
                if (subscription.type == 'Premium' || subscription.type == 'Basic') {

                    let dataToUpload;
                    if (history && history[historyId]) {
                        dataToUpload = [
                            ...history[historyId],
                            requestAndReplyItem
                        ]
                    } else {
                        dataToUpload = [
                            requestAndReplyItem
                        ]
                    }

                    let updateRes = await dbAPI.updateData('summarizeYT', user.uid, historyId, dataToUpload);

                }
            }

            historyContext.addToHistory('summarizeYT', historyId, requestAndReplyItem);
        }
    }

    const submitData = async (data) => {
        setIsLoading(true);
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
                    addToHistory(textFromAudioObject.urlOnYouTube, textFromAudioObject.title, summarizedText);
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



    const headerRightButtons = [
        {
            key: 'ChatsHistoryButton',
            tooltipText: 'History',
            icon: <MdHistory size='22px' />,
            callback: () => historyButtonHandler('History'),
            isVisible: history && Object.keys(history).length > 0,
        },

    ];

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
                headerRightButtons={headerRightButtons}
                headerReturnButtonHandler={headerReturnButtonHandler}
                callback={submitData}
                inputValue={null}
                showFooter={showFooter}
                isLoading={isLoading}
                promptToRepeat={null}
                setPromptToRepeat={null}
                currentChatHistoryId={historyId}
                ref={inputFormRef}
            >
                <AnimatePresence mode='wait'>
                    {
                        showHistoryScreen &&
                        <motion.section
                            key={'sectionHistoryChats'}
                            variants={animationProps.chatWindowScreens.slideFromLeft}
                            initial={'hidden'}
                            animate={'show'}
                            exit={'exit'}
                        >
                            <WorkspaceHistory themeColor={themeColor} allHistory={history} clearItemFromHistory={clearItemFromHistory} chooseHistory={chooseHistory} type='summarize' />

                        </motion.section>
                    }
                </AnimatePresence>

                {
                    showSummarize &&
                    <>
                        <div>sumarize video - https://www.youtube.com/watch?v=ij8w9LIsxSA</div>
                        <ResultContentYTSummarize progressValue={progressValue} isLoading={isLoading} themeColor={themeColor} showSummarize={showSummarize} currentSummarize={history ? history[historyId] : []} />
                    </>
                }
            </WorkspaceCard>
        </>
    )
}

export default YouTubeSummarize;