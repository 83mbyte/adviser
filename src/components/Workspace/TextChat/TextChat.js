
import { useState, useEffect, useRef } from "react";

import { useAuthContext } from "@/src/context/AuthContextProvider";
import { useSettingsContext } from "@/src/context/SettingsContext";
import { usePredefinedDataContext } from "@/src/context/PredefinedDataContextProvider";
import { useHistoryContext } from "@/src/context/HistoryContextProvider";

import { useToast } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

import { MdOutlineNotes, MdHistory, MdTune, } from 'react-icons/md';
import { HiOutlineLightBulb } from "react-icons/hi";

import { dbAPI } from "@/src/lib/dbAPI";
import { promptTemplatesAPI } from "@/src/lib/promptsAPI";
import { getReplyFromAssistant } from "@/src/lib/fetchingData";
import { animationProps } from "@/src/lib/animationProps";

import WorkspaceCard from "../WorkspaceComponents/WorkspaceCard";
import SelectTopics from "./TopicsAndQuestions/SelectTopics";
import SelectQuestions from "./TopicsAndQuestions/SelectQuestions";
import ResultContentMessages from "../WorkspaceComponents/WorkspaceResultsToShow/ResultContentMessages";
import WorkspaceHistory from "../WorkspaceComponents/WorkspaceHistory/WorkspaceHistory";
import ChatSettings from "./ChatSettings/ChatSettings";


const TextChat = ({ showNoHistoryIssue, setShowNoHistoryIssue }) => {
    const inputFormRef = useRef(null);
    const toast = useToast();
    const user = useAuthContext();

    const predefinedData = usePredefinedDataContext();

    const settingsContext = useSettingsContext();
    const { themeColor } = settingsContext.userThemeColor;
    const { subscription } = settingsContext.userSubscription;
    const { replyLength, replyStyle, replyTone, replyFormat, systemVersion, temperature, frequency_p, presence_p } = settingsContext.chatSettings.chatSettings;
    const { transcribedText, setTranscribedText } = settingsContext.transcribedTextData;

    const historyContext = useHistoryContext();
    const history = historyContext.history.chats;
    const [historyId, setHistoryId] = useState(null);

    const [showChatMessages, setShowChatMessages] = useState(true); //show chat conversation
    const [inputValue, setInputValue] = useState(null);

    const [showHeaderReturnPanel, setShowHeaderReturnPanel] = useState({ state: false, title: '' });  //return panel state
    const [isLoading, setIsLoading] = useState(false); // set it to True while async operation works...

    //show topic questions and select question
    const [showTopicQuestions, setShowTopicQuestions] = useState(false);
    const [showTopicIdeas, setShowTopicIdeas] = useState(false);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [promptToRepeat, setPromptToRepeat] = useState(null);

    //show chat settings
    const [showChatSettings, setShowChatSettings] = useState(false);

    //show history
    const [showHistoryScreen, setShowHistoryScreen] = useState(false);

    //showFooter
    const [showFooter, setShowFooter] = useState(true);

    const closeAll = () => {

        if (showTopicQuestions === true) {
            setShowTopicQuestions(false);
        }

        if (showTopicIdeas === true) {

            setShowTopicIdeas(false);
        }
        if (showHistoryScreen === true) {
            setShowHistoryScreen(false);
        }
        if (showChatSettings === true) {
            setShowChatSettings(false);
        }
        if (showChatMessages === true) {
            setShowChatMessages(false);
        }
        if (showHeaderReturnPanel.state == true) {
            headerReturnPanelToggler();
        }
    }

    const selectTopicIdeaHandler = (idea) => {
        if (idea) {

            setCurrentTopic(idea);

            if (idea == 'Blank') {
                headerReturnPanelToggler();
                generateHistoryId();
                setShowFooter(true);
                setShowTopicQuestions(false);
            } else {
                setShowTopicQuestions(true);
            }
            setShowTopicIdeas(false);
            setInputValue('');
        }
    }

    const headerReturnPanelToggler = (titleText) => {
        setShowHeaderReturnPanel({
            state: !showHeaderReturnPanel.state,
            title: titleText ? titleText : ''
        })
    }
    const headerReturnButtonHandler = () => {
        //return button in the header panel.. 
        closeAll();
        headerReturnPanelToggler();
        setShowFooter(true);
        if (history) {
            setShowChatMessages(true)
        }
    }
    const IdeasButtonHandler = (panelTitleText) => {
        headerReturnPanelToggler(panelTitleText);
        setShowFooter(false);
        setShowChatMessages(false);
        setShowTopicIdeas(true);
    }

    const promptsButtonHandler = (panelTitleText) => {
        headerReturnPanelToggler(panelTitleText);
        setShowChatMessages(false); //  hide current chat if exists
        setShowFooter(false);
        setShowTopicQuestions(true);
    }

    const selectQuestionHandler = (data) => {
        setInputValue(data);
        if (showFooter == false) {
            setShowFooter(true);
        }
    }

    const historyButtonHandler = (panelTitleText) => {
        headerReturnPanelToggler(panelTitleText);
        setShowFooter(false);
        setShowChatMessages(false);
        setShowHistoryScreen(true);
    }


    const clearItemFromHistory = async (historyId) => {

        let res = await dbAPI.deleteDocument('chats', user.uid, historyId);
        if (res && res.status == 'Success') {

            historyContext.deleteFromHistory('chats', historyId)
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
        setShowChatMessages(true);
    }

    const settingsButtonHandler = (panelTitleText) => {
        closeAll();
        headerReturnPanelToggler(panelTitleText);
        setShowFooter(false);
        setShowChatSettings(true);
    }

    const addToHistory = async (userRequest, assistantReply) => {
        let requestAndReplyItem =
        {
            user: { content: userRequest },
            assistant: { content: assistantReply },
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

                await dbAPI.updateData('chats', user.uid, historyId, dataToUpload);
                setIsLoading(false);
            }
        }

        historyContext.addToHistory('chats', historyId, requestAndReplyItem);
    }



    const submitData = async (data) => {

        setIsLoading(true);
        closeAll();
        setShowChatMessages(true);
        let systemMessage;
        try {

            switch (replyFormat) {
                case 'Plain text':
                    systemMessage = promptTemplatesAPI.default({ replyTone, replyLength, replyStyle });
                    break;
                case 'HTML':
                    systemMessage = promptTemplatesAPI.replyAsHTML({ replyTone, replyLength, replyStyle });
                    break;
                default:
                    systemMessage = promptTemplatesAPI.default({ replyTone, replyLength, replyStyle });
                    break;
            }

            const provideDiscussionContext = (arrayHistory) => {
                let arrayDiscussionContext = [{ role: 'user', content: arrayHistory[0].user.content }];

                switch (systemVersion) {
                    case 'GPT-4':

                        if (arrayHistory.length > 0) {
                            for (let i = 0; i <= arrayHistory.length - 1; i++) {
                                arrayDiscussionContext.push({ role: 'assistant', content: arrayHistory[i].assistant.content })
                            }
                        }
                        break;
                    case 'GPT-3.5':

                        if (arrayHistory.length >= 2) {
                            arrayDiscussionContext.push({ role: 'assistant', content: arrayHistory[arrayHistory.length - 2].assistant.content });
                            arrayDiscussionContext.push({ role: 'assistant', content: arrayHistory[arrayHistory.length - 1].assistant.content });
                        }
                        else {
                            arrayDiscussionContext.push({ role: 'assistant', content: arrayHistory[arrayHistory.length - 1].assistant.content });
                        }

                    default:
                        arrayDiscussionContext.push({ role: 'assistant', content: arrayHistory[arrayHistory.length - 1].assistant.content });
                        break;
                }

                return arrayDiscussionContext
            };

            let messagesArray;

            if (history[historyId] && history[historyId].length > 0) {

                messagesArray = [systemMessage, ...provideDiscussionContext(history[historyId])];
                messagesArray.push({ role: 'user', content: data.value })
            } else {
                messagesArray = [systemMessage, { role: 'user', content: data.value }];
            }

            let resp = await getReplyFromAssistant({ messagesArray, tokens: 4000, systemVersion, temperature, frequency_p, presence_p }, 'chat');

            if (resp) {
                addToHistory(data.value, resp.content)
            }

        } catch (error) {

            console.error(error);
            toast({
                position: 'top-right',
                title: `Error.. the request can not be fulfilled`,
                status: 'error',
                duration: 2000,
                containerStyle: {
                    maxWidth: '100%',
                    marginTop: '100px'
                },
            });
        } finally {
            setIsLoading(false);
            setInputValue(null);
            inputFormRef.current.value = '';
        }
    }
    const headerLeftButtons = [
        {
            key: 'ChatIdeasButton',
            tooltipText: 'Ideas',
            icon: <HiOutlineLightBulb size='22px' />,
            callback: () => IdeasButtonHandler('Ideas'),
            isVisible: true,
        },
        {
            key: 'ChatPromptsButton',
            tooltipText: 'Prompts list',
            icon: <MdOutlineNotes size='22px' />,
            callback: () => promptsButtonHandler('Prompts list'),
            isVisible: currentTopic && currentTopic !== undefined && currentTopic !== 'Blank'
        },
    ];

    const headerRightButtons = [
        {
            key: 'ChatsHistoryButton',
            tooltipText: 'History',
            icon: <MdHistory size='22px' />,
            callback: () => historyButtonHandler('History'),
            isVisible: history && Object.keys(history).length > 0
        },
        {
            key: 'ChatSettingsButton',
            tooltipText: 'Settings',
            icon: <MdTune size='22px' />,
            callback: () => settingsButtonHandler('Settings'),
            isVisible: true
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

    useEffect(() => {
        if (transcribedText && transcribedText !== undefined && transcribedText.length > 0) {
            try {
                setInputValue(transcribedText);
                submitData({ value: transcribedText });
            } catch (error) {
                console.error(error)
            } finally {
                setTranscribedText(null);
            }
        }
    }, [transcribedText])



    return (
        <>
            <WorkspaceCard
                cardTitle={'Chat'}
                showIssueNotice={showChatMessages && showNoHistoryIssue}
                closeIssueNotice={setShowNoHistoryIssue}
                showHeaderReturnPanel={showHeaderReturnPanel}
                headerLeftButtons={headerLeftButtons}
                headerRightButtons={headerRightButtons}
                headerReturnButtonHandler={headerReturnButtonHandler}
                callback={submitData}
                inputValue={inputValue}
                showFooter={showFooter}
                isLoading={isLoading}
                promptToRepeat={promptToRepeat}
                setPromptToRepeat={setPromptToRepeat}
                currentChatHistoryId={historyId}
                ref={inputFormRef}
            >

                <AnimatePresence mode='wait'>
                    {
                        showTopicIdeas &&
                        <MotionSelectTopics
                            key={'sectionTopics'}
                            variants={animationProps.chatWindowScreens.slideFromLeft}
                            initial={'hidden'}
                            animate={'show'}
                            exit={'exit'}
                            h='100%'
                            bg=''
                            selectIdeaHandler={selectTopicIdeaHandler}
                            predefinedData={predefinedData ? predefinedData : []}
                        />
                    }

                    {
                        (currentTopic && currentTopic !== undefined && currentTopic !== 'Blank' && showTopicIdeas == false && showTopicQuestions == true && showChatMessages == false) &&
                        <motion.section
                            key={'sectionQuestions'}
                            variants={animationProps.chatWindowScreens.slideFromLeft}
                            initial={'hidden'}
                            animate={'show'}
                            exit={'exit'}
                        >
                            <SelectQuestions predefinedData={predefinedData ? predefinedData.prompts[currentTopic] : null} themeColor={themeColor} selectQuestionHandler={selectQuestionHandler} />
                        </motion.section>
                    }

                    {
                        showHistoryScreen &&
                        <motion.section
                            key={'sectionHistoryChats'}
                            variants={animationProps.chatWindowScreens.slideFromLeft}
                            initial={'hidden'}
                            animate={'show'}
                            exit={'exit'}
                        >
                            <WorkspaceHistory themeColor={themeColor} allHistory={history} clearItemFromHistory={clearItemFromHistory} chooseHistory={chooseHistory} type='chat' />
                        </motion.section>
                    }

                    {/* chat settings  */}
                    {showChatSettings &&
                        <motion.section
                            key={'sectionSettings'}
                            variants={animationProps.chatWindowScreens.slideFromLeft}
                            initial={'hidden'}
                            animate={'show'}
                            exit={'exit'}
                        >
                            <ChatSettings themeColor={themeColor} />
                        </motion.section>
                    }

                </AnimatePresence>

                {
                    showChatMessages &&
                    <ResultContentMessages isLoading={isLoading} themeColor={themeColor} showMessages={showChatMessages} currentChat={(history && Object.keys(history).length > 0) ? history[historyId] : []} setPromptToRepeat={setPromptToRepeat} />
                }
            </WorkspaceCard>
        </>
    );
};

export default TextChat;

const MotionSelectTopics = motion(SelectTopics, { forwardMotionProps: true });

