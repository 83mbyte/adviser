
import { useAuthContext } from "@/src/context/AuthContextProvider";
import { useSettingsContext } from "@/src/context/SettingsContext";
import { useToast } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

import { animationProps } from "@/src/lib/animationProps";
import { usePredefinedDataContext } from "@/src/context/PredefinedDataContextProvider";


import { MdOutlineNotes, MdHistory, MdTune, } from 'react-icons/md';
import { HiOutlineLightBulb } from "react-icons/hi";

import WorkspaceCard from "../WorkspaceComponents/WorkspaceCard";
import SelectTopics from "./TopicsAndQuestions/SelectTopics";
import SelectQuestions from "./TopicsAndQuestions/SelectQuestions";
import ResultContentMessages from "../WorkspaceComponents/WorkspaceResultsToShow/ResultContentMessages";
import { useHistoryContext } from "@/src/context/HistoryContextProvider";
import { dbAPI } from "@/src/lib/dbAPI";
import ChatAllHistory from "./ChatAllHistory/ChatAllHistory";
import ChatSettings from "./ChatSettings/ChatSettings";
import { promptTemplatesAPI } from "@/src/lib/promptsAPI";
import { getReplyFromAssistant } from "@/src/lib/fetchingData";


const TextChat = ({ showNoHistoryIssue, setShowNoHistoryIssue }) => {
    const inputFormRef = useRef(null);
    const toast = useToast();
    const user = useAuthContext();

    const predefinedData = usePredefinedDataContext();

    const settingsContext = useSettingsContext();
    const { themeColor } = settingsContext.userThemeColor;
    const { subscription } = settingsContext.userSubscription;
    const { replyLength, replyStyle, replyTone, systemVersion, temperature, frequency_p, presence_p } = settingsContext.chatSettings.chatSettings;
    const { transcribedText, setTranscribedText } = settingsContext.transcribedTextData;

    const historyContext = useHistoryContext().chats;


    const [showChatMessages, setShowChatMessages] = useState(true); //show chat conversation
    const [inputValue, setInputValue] = useState(null);

    const [chatsHistory, setChatsHistory] = useState({});
    const [historyId, setHistoryId] = useState(null);

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
        else if (showTopicIdeas === true) {
            setShowTopicIdeas(false);
        }
        else if (showHistoryScreen === true) {
            setShowHistoryScreen(false);
        }
        else if (showChatSettings === true) {
            setShowChatSettings(false);
        }
        else if (showChatMessages === true) {
            setShowChatMessages(false);
        }
        headerReturnPanelToggler();
    }

    const selectTopicIdeaHandler = (idea) => {
        if (idea) {

            setCurrentTopic(idea);

            if (idea == 'Blank') {
                headerReturnPanelToggler();
                generateHistoryId();
                setShowFooter(true);
                setShowTopicQuestions(false);
                // openChatWindow();
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
        if (chatsHistory) {
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

    const clearChatFromHistory = async (chatId) => {
        let res = await dbAPI.deleteDocument('chats', user.uid, chatId);
        if (res) {
            const { [chatId]: removedData, ...restHistory } = chatsHistory;
            setChatsHistory(restHistory);
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



    const submitData = async (data) => {
        let dataToUpload;
        setIsLoading(true);
        closeAll();
        setShowChatMessages(true);

        try {
            const systemMessage = promptTemplatesAPI.default({ replyTone, replyLength, replyStyle });

            const provideDiscussionContext = (arrayHistory) => {

                if (arrayHistory.length >= 2) {
                    let firstItem = { role: 'assistant', content: arrayHistory[arrayHistory.length - 2].assistant.content };
                    let lastItem = { role: 'assistant', content: arrayHistory[arrayHistory.length - 1].assistant.content };
                    return [firstItem, lastItem];
                } else {
                    return [{ role: 'assistant', content: arrayHistory[arrayHistory.length - 1].assistant.content }]
                }
            };

            let messagesArray;

            if (chatsHistory[historyId] && chatsHistory[historyId].length > 0) {
                console.log('with context create')
                messagesArray = [systemMessage, ...provideDiscussionContext(chatsHistory[historyId])];
                messagesArray.push({ role: 'user', content: data.value })
            } else {
                messagesArray = [systemMessage, { role: 'user', content: data.value }];
            }

            let resp = await getReplyFromAssistant({ messagesArray, tokens: 3600, systemVersion, temperature, frequency_p, presence_p }, 'chat');

            if (resp) {
                let chatQuestionAndReplyItem =
                {
                    user: { content: data.value },
                    assistant: { content: resp.content },
                }

                if (subscription?.type) {

                    if (subscription.type == 'Premium' || subscription.type == 'Basic') {

                        if (chatsHistory && chatsHistory[historyId]) {
                            dataToUpload = [
                                ...chatsHistory[historyId],
                                chatQuestionAndReplyItem
                            ]
                        } else {
                            dataToUpload = [
                                chatQuestionAndReplyItem
                            ]
                        }

                        await dbAPI.updateData('chats', user.uid, historyId, dataToUpload);
                        setIsLoading(false);
                    }
                }

                if (chatsHistory && chatsHistory[historyId]) {
                    setChatsHistory({
                        ...chatsHistory,
                        [historyId]: [
                            ...chatsHistory[historyId],
                            chatQuestionAndReplyItem
                        ]
                    });
                } else {
                    setChatsHistory({
                        ...chatsHistory,
                        [historyId]: [chatQuestionAndReplyItem]
                    });
                }
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
            isVisible: chatsHistory && Object.keys(chatsHistory).length > 0,
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
        if (historyContext) {
            setChatsHistory(historyContext);
        }
    }, [historyContext]);

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
                            <ChatAllHistory themeColor={themeColor} allHistory={chatsHistory} clearChatFromHistory={clearChatFromHistory} chooseHistory={chooseHistory} />
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
                    <ResultContentMessages isLoading={isLoading} themeColor={themeColor} showMessages={showChatMessages} currentChat={(chatsHistory && Object.keys(chatsHistory).length > 0) ? chatsHistory[historyId] : []} setPromptToRepeat={setPromptToRepeat} />
                }

            </WorkspaceCard>
        </>
    );
};

export default TextChat;

const MotionSelectTopics = motion(SelectTopics, { forwardMotionProps: true });

