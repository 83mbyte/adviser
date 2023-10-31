'use client'
import { useEffect, useRef, useState } from "react";

import { Box, Card, CardBody, Text, VStack } from "@chakra-ui/react";

import { useUISettingsContext } from "@/src/context/UISettingsContext";
import { usePredefinedDataContext } from "@/src/context/PredefinedDataContextProvider";
import { useAuthContext } from "@/src/context/AuthContextProvider";
import { useHistoryContext } from "@/src/context/HistoryContextProvider";

import { AnimatePresence, motion } from "framer-motion";
import { animationProps } from "@/src/lib/animationProps";

import SelectTopics from "./TopicsAndQuestions/SelectTopics";
import ChatWindowHeader from "./ChatWindowHeader";
import ChatWindowFooter from "./ChatWindowFooter";
import SelectQuestions from "./TopicsAndQuestions/SelectQuestions";
import ChatSettings from "./ChatSettings/ChatSettings";
import Messages from "./Messages";
import ChatAllHistory from "./ChatAllHistory/ChatAllHistory";

import { getReplyFromAssistant } from "@/src/lib/fetchingData";
import { dbAPI } from "@/src/lib/dbAPI";

const ChatWindow = () => {
    let dataToUpload;
    const textAreaRef = useRef(null);

    //contexts
    const user = useAuthContext()
    const UISettingsContext = useUISettingsContext();
    const { themeColor } = UISettingsContext.userThemeColor;
    const predefinedData = usePredefinedDataContext();
    const historyContext = useHistoryContext();

    // states
    const [showHeaderReturnPanel, setShowHeaderReturnPanel] = useState({ state: false, title: '' });
    const [showFooter, setShowFooter] = useState(true);

    //show topics and select topic
    const [showTopics, setShowTopics] = useState(false);
    const [currentTopic, setCurrentTopic] = useState(null);

    //show topic questions and select question
    const [showTopicQuestions, setShowTopicQuestions] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    //show chat settings
    const [showChatSettings, setShowChatSettings] = useState(false);

    //chatId
    const [chatId, setChatId] = useState(null);
    //show current chat
    const [showCurrentChat, setShowCurrentChat] = useState(true)
    // history for a chat window
    const [chatHistory, setChatHistory] = useState({});
    const [showHistoryScreen, setShowHistoryScreen] = useState(false);

    const [isLoadingBtn, setIsBtnLoadingBtn] = useState(false);

    //handlers
    const headerReturnPanelToggler = (titleText) => {
        // setShowHeaderReturnPanel(!showHeaderReturnPanel)
        setShowHeaderReturnPanel({
            state: !showHeaderReturnPanel.state,
            title: titleText ? titleText : ''
        })
    }

    const closeBackToChat = () => {
        // hide open screens
        setShowHeaderReturnPanel({
            state: false,
            title: ''
        });
        setShowTopics(false);
        setShowTopicQuestions(false);
        setShowChatSettings(false);
        setShowHistoryScreen(false)
        // show footer and chat
        setShowFooter(true);
        setShowCurrentChat(true);
    }
    const headerBackButtonHandler = () => {
        closeBackToChat()
    }

    const topicsButtonHandler = () => {
        headerReturnPanelToggler(`Ideas library`);
        setShowTopics(true);
        setShowFooter(false);
        setShowCurrentChat(false);
    }

    const promptsButtonHandler = () => {
        headerReturnPanelToggler(currentTopic);
        setShowTopicQuestions(true);
        setShowCurrentChat(false);
    }

    const settingsButtonHandler = () => {
        headerReturnPanelToggler('Settings');
        setShowFooter(false);
        setShowCurrentChat(false)
        setShowChatSettings(true);
    }
    const historyButtonHandler = () => {
        headerReturnPanelToggler('Your chats history');
        setShowFooter(false);
        setShowCurrentChat(false);

        setShowHistoryScreen(true);

    }

    const selectTopicHandler = (topic) => {
        if (topic) {
            setCurrentTopic(topic);
            if (topic == 'Blank') {
                headerReturnPanelToggler();
                setShowTopicQuestions(false);
            } else {
                setShowTopicQuestions(true);
            }
            setShowTopics(false);
            setSelectedQuestion(null);
            setShowFooter(true);
        }
    }

    const selectQuestionHandler = (data) => {
        setSelectedQuestion(data);
        if (showFooter == false) {
            setShowFooter(true);
        }
    }

    const clearChatFromHistory = async (chatId) => {
        let res = await dbAPI.deleteChat(user.uid, chatId);
        if (res) {
            const { [chatId]: removedData, ...restHistory } = chatHistory;
            setChatHistory(restHistory);
        }
        return 'done'
    }

    const chooseHistory = (data) => {
        setChatId(data);
        closeBackToChat()
    }

    const submitButtonHandler = async () => {
        setIsBtnLoadingBtn(true);
        closeBackToChat();

        const provideDiscussionContext = (arrayHistory) => ({ role: 'assistant', content: arrayHistory[arrayHistory.length - 1].assistant.content });

        let systemMessage = {
            role: 'system',
            content: `You are a helpful assistant. Act as an educated professional and reply with a bit of humor. The reply must be from 5 to 10 words.`
        }

        let messagesArray;
        if (chatHistory[chatId] && chatHistory[chatId].length > 0) {
            messagesArray = [systemMessage, provideDiscussionContext(chatHistory[chatId]), { role: 'user', content: textAreaRef.current.value }]
        } else {
            messagesArray = [systemMessage, { role: 'user', content: textAreaRef.current.value }];
        }


        try {

            let resp = await getReplyFromAssistant({ messagesArray, tokens: 1800 }, 'chat');
            if (resp) {
                // Deve mode test
                // console.log('reply from assist for DEVELOPER mode:: ', resp.content);

                let chatQuestionAndReplyItem =
                {
                    user: { content: textAreaRef.current.value },
                    assistant: { content: resp.content },
                    // subject: { content: selectedTopic }
                }
                if (chatHistory && chatHistory[chatId]) {
                    setChatHistory({
                        ...chatHistory,
                        [chatId]: [
                            ...chatHistory[chatId],
                            chatQuestionAndReplyItem
                        ]
                    });
                    dataToUpload = [
                        ...chatHistory[chatId],
                        chatQuestionAndReplyItem
                    ]

                } else {

                    setChatHistory({
                        ...chatHistory,
                        [chatId]: [chatQuestionAndReplyItem]
                    });

                    dataToUpload = [
                        chatQuestionAndReplyItem
                    ]
                }
                await dbAPI.updateData(user.uid, chatId, dataToUpload)
            }
        } catch (error) {
            console.error(error);
        }
        finally {
            textAreaRef.current.value = '';
            setIsBtnLoadingBtn(false);
            setSelectedQuestion(null);
        }
    }


    // initializing chat area
    const openChatWindow = () => {
        let generatedId = Date.now();
        if (generatedId) {
            setChatId(generatedId);
            // console.log(generatedId); 
        } else {
            alert(`something wrong.. a new chat can't be created`);
        }
    }

    useEffect(() => {
        openChatWindow();
    }, [])

    useEffect(() => {
        if (historyContext) {
            setChatHistory(historyContext)
        }
    }, [historyContext]);


    return (
        <>
            {
                chatId &&

                <>
                    {/* Chat Window  */}
                    <Card h={'99%'} maxHeight={'100%'} bg={''} borderTopRadius={'10px'} borderBottomRadius={0} overflow={'hidden'}>
                        <CardBody m={0} p={['2', '3']} maxH={'100%'} overflow={'hidden'}
                        >
                            <VStack spacing={0} px={'0'} bg={'#FAFAFA'} h='100%' maxHeight={'100%'} border={'1px dashed #DEDEDE'} borderTopRadius={'10px'}
                                willChange={'height'}
                            >
                                <Box
                                    bg={''}
                                    w={'full'}
                                    p={0}
                                    borderTopRadius={'10px'}
                                    borderBottomWidth={'1px'}
                                    borderBottomColor={'gray.200'}
                                    overflowX={'hidden'}
                                    height={'55px'}
                                    minH={'43px'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                >
                                    <ChatWindowHeader
                                        key={'chatHeader'}
                                        themeColor={themeColor}
                                        currentTopic={currentTopic}
                                        showHeaderReturnPanel={showHeaderReturnPanel}
                                        showTopicQuestions={showTopicQuestions}
                                        topicsButtonHandler={topicsButtonHandler}
                                        headerBackButtonHandler={headerBackButtonHandler}
                                        promptsButtonHandler={promptsButtonHandler}
                                        settingsButtonHandler={settingsButtonHandler}
                                        historyButtonHandler={historyButtonHandler}
                                        isChatHistoryExists={Object.keys(chatHistory).length > 0}
                                    />
                                </Box>
                                <Box
                                    w={'full'}
                                    bg=''
                                    display={'flex'}
                                    flexDirection={'column'}
                                    p={2}
                                    height={'100%'}
                                    maxHeight={'100%'}
                                    overflowX={'hidden'}
                                    overflowY={'scroll'}
                                // justifyContent={'flex-end'}
                                >
                                    <AnimatePresence mode='wait'>
                                        {
                                            ((!themeColor || !predefinedData || !historyContext) && showTopics !== true && showTopicQuestions !== true && showChatSettings !== true && showHistoryScreen !== true) &&
                                            <motion.div
                                                key={'noint'}
                                                // variants={animationProps.chatWindowScreens.opacity}
                                                // initial={'hidden'}
                                                // animate={'show'}
                                                //exit={'exit'}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1, transition: { delay: 1.5, duration: 0.8 } }}
                                                exit={{ opacity: 0, transition: { duration: 0.1, delay: 0 } }}
                                                style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', padding: '0px 1px', overflow: 'auto', }}
                                            >
                                                <Text textAlign={'center'}>Your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend. You may try to refresh the page now or visit it later. </Text>
                                            </motion.div>

                                        }

                                        {/* Select a topic */}
                                        {
                                            showTopics == true &&
                                            <motion.div
                                                key={'sectionTopics'}
                                                variants={animationProps.chatWindowScreens.slideFromLeft}
                                                initial={'hidden'}
                                                animate={'show'}
                                                exit={'exit'}
                                                h='100%'
                                                bg=''
                                            >
                                                <SelectTopics themeColor={themeColor}
                                                    predefinedData={predefinedData ? predefinedData : []}
                                                    selectTopicHandler={selectTopicHandler} />
                                            </motion.div>
                                        }

                                        {/* predefined questions of a selected topic */}
                                        {
                                            (currentTopic && currentTopic !== undefined && currentTopic !== 'Blank' && showTopics == false && showTopicQuestions == true) &&
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
                                        {
                                            showHistoryScreen &&
                                            <motion.section
                                                key={'sectionHistoryChats'}
                                                variants={animationProps.chatWindowScreens.slideFromLeft}
                                                initial={'hidden'}
                                                animate={'show'}
                                                exit={'exit'}
                                            >
                                                <ChatAllHistory themeColor={themeColor} allHistory={chatHistory} clearChatFromHistory={clearChatFromHistory} chooseHistory={chooseHistory} />
                                            </motion.section>

                                        }
                                        {
                                            // show current chat and messages
                                            chatHistory && showCurrentChat == true &&
                                            <motion.div
                                                key={'messages'}
                                                variants={animationProps.chatWindowScreens.opacity}
                                                initial={'hidden'}
                                                animate={'show'}
                                                exit={'exit'}
                                                style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', padding: '0px 1px', overflow: 'auto' }}
                                            >
                                                <Messages
                                                    currentChat={chatHistory[chatId] ? chatHistory[chatId] : []}
                                                    themeColor={themeColor}
                                                    isLoadingBtn={isLoadingBtn}
                                                />
                                            </motion.div>
                                        }
                                    </AnimatePresence>
                                </Box>
                            </VStack>
                        </CardBody>

                        {/* Card footer */}
                        <AnimatePresence mode="wait">
                            {
                                showFooter &&
                                <ChatWindowFooter themeColor={themeColor} selectedQuestion={selectedQuestion} isLoadingBtn={isLoadingBtn} submitButtonHandler={submitButtonHandler} ref={textAreaRef} />
                            }
                        </AnimatePresence>
                    </Card>
                </>
            }
        </>
    )
};

export default ChatWindow;
