import React from 'react';
import { useAuthContext } from '../context/AuthContextProvider';
import { useSettingsContext } from '../context/SettingsContextProvider';
import { useHistoryContext } from '../context/HistoryContextProvider';
import { useUISettingsContext } from '../context/UISettingsContext';

import { getReplyFromAssistant } from '@/src/lib/fetchData';
import { promptsAPI } from '../lib/promptsAPI';
import { dbAPI } from '../lib/dbAPI';

import styles from './AppClient.module.css';
import { Box, Portal, } from '@chakra-ui/react';


import Header from './Header/Header';
import Footer from './Footer/Footer';
import ImageArea from './ImageArea/ImageArea';
import SettingsContainer from './Settings/SettingsContainer';
import HistoryContainer from './Settings/HistoryContainer';
import ChatArea from './ChatArea/ChatArea';
import ChatAreaDefault from './ChatAreaDefault/ChatAreaDefault';
import PredefinedDataContextProvider from '../context/PredefinedDataContextProvider';



const AppClient = () => {
    const user = useAuthContext();
    const settingsContext = useSettingsContext();
    const historyContext = useHistoryContext();

    const UISettingsContext = useUISettingsContext();

    const { themeColor, setThemeColor } = UISettingsContext.userThemeColor;

    const [imgUrl, setImgUrl] = React.useState(null);
    const [size, setSize] = React.useState('256');
    const [chatHistory, setChatHistory] = React.useState({});

    const { activeButton, setActiveButton } = { ...settingsContext.activeButton };
    const { isVisibleMenu, setIsVisibleMenu } = { ...settingsContext.isVisibleMenu };
    const { isVisibleHistory, setIsVisibleHistory } = { ...settingsContext.isVisibleHistory };
    const { model, setModel } = { ...settingsContext.model };

    const [chatId, setChatId] = React.useState(null);
    const [isBtnLoading, setIsBtnLoading] = React.useState(false);

    const [selectedTopic, setSelectedTopic] = React.useState(null);
    const [showTopics, setShowTopics] = React.useState(true);

    let dataToUpload;

    const toggleMenuView = () => {
        setIsVisibleMenu(!isVisibleMenu)
    }
    const toggleHistoryView = () => {
        setIsVisibleHistory(!isVisibleHistory);
    }

    const openNewChat = () => {
        let generatedId = Date.now();
        if (generatedId) {
            setChatId(generatedId);
            setModel('chat');
        } else {
            alert(`something wrong.. a new chat can't be created`);
        }
    }

    const openDefaultChat = () => {
        let generatedId = Date.now();
        if (generatedId) {
            setChatId(generatedId);
            console.log()
            setModel('defaultChat');
        } else {
            alert(`something wrong.. a new chat can't be created`);
        }
    }

    const setApplicationModel = (model) => {
        switch (model) {
            case 'defaultChat':
                openDefaultChat();
                break;
            case 'chat':
                openNewChat();
                break;
            case 'image':
                setModel('image');
                break;
            default:
                break;
        }
    }


    const onClickGenerateImageHandler = async (inputRef) => {
        setIsBtnLoading(true);
        try {
            let data = await getReplyFromAssistant({ size: size, request: inputRef.current.value }, 'image');
            if (data) {
                setImgUrl(data.content)
            }
        } catch (error) {

        } finally {
            inputRef.current.value = '';
            setIsBtnLoading(false);
        }
    }

    const onClickBtnHandler = async (inputRef) => {
        //just DEV test return
        //
        // if (inputRef) {
        //     console.log('!!!', inputRef);
        //     return
        // }
        setIsBtnLoading(true);

        const systemMessage = (activeButton) => promptsAPI.createSystemMessage(activeButton);

        const discussionContext = (arrayHistory) => ({ role: 'assistant', content: arrayHistory[arrayHistory.length - 1].assistant.content });

        const getUserInput = (value) => ({ role: 'user', content: value });

        let messagesArray;
        if (chatHistory[chatId] && chatHistory[chatId].length > 0) {
            messagesArray = [systemMessage(activeButton), discussionContext(chatHistory[chatId]), getUserInput(inputRef.current.value)]
        } else {
            messagesArray = [systemMessage(activeButton), getUserInput(inputRef.current.value)];
        }

        try {

            let data = await getReplyFromAssistant({ messagesArray, tokens: 1800 }, 'chat');
            if (data) {
                console.log('reply from assist for DEVELOPER mode:: ', data.content)
                let chatQuestionAndReplyItem =
                {
                    user: { content: inputRef.current.value },
                    assistant: { content: data.content },
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

                await dbAPI.updateData(user.uid, chatId, dataToUpload);
            }

        } catch (error) {
            console.error(error);
        }
        finally {
            inputRef.current.value = '';
            setIsBtnLoading(false);
        }
    }

    const chooseHistory = (data) => {
        setChatId(data);
        setIsVisibleHistory(false);
        setShowTopics(false);
    }

    const clearChatFromHistory = async (chatId) => {
        let res = await dbAPI.deleteChat(user.uid, chatId)

        if (res) {
            const { [chatId]: removedData, ...restHistory } = chatHistory;
            setChatHistory(restHistory);
        }
        return 'done'
    }


    React.useEffect(() => {
        setApplicationModel('defaultChat')
    }, []);

    React.useEffect(() => {
        if (historyContext) {
            setChatHistory(historyContext)
        }
    }, [historyContext]);

    return (
        <React.Fragment>
            {
                !user
                    ? 'Access Denied.'
                    :
                    <React.Fragment>
                        {/* header */}
                        <Box as='header' className={styles.header}  >
                            <Header
                                openNewChat={openNewChat}
                                toggleMenuView={toggleMenuView}
                                toggleHistoryView={toggleHistoryView}
                                openCreateImage={() => setApplicationModel('image')}
                                isChatHistoryExists={Object.keys(chatHistory).length > 0}
                                themeColor={themeColor}
                            />
                        </Box>

                        {/* main  */}
                        <Box as='main'
                            bg={'gray.300'}
                            className={styles.main}
                            top={['45px', '55px']}
                            bottom={['25px', '35px']}
                            overflowY={'hidden'}
                            px={['1', '2']}
                            pt={['1', '2']}
                            pb={'0.5'}
                        >

                            {

                                chatId && model === 'chat' &&
                                <ChatArea
                                    currentChat={chatHistory[chatId] ? chatHistory[chatId] : []}
                                    isBtnLoading={isBtnLoading}
                                    onClickBtn={(data) => onClickBtnHandler(data)}
                                    themeColor={themeColor}
                                />
                            }
                            {
                                model === 'image' &&
                                <ImageArea
                                    currentChat={chatHistory[chatId] ? chatHistory[chatId] : []}
                                    isBtnLoading={isBtnLoading}
                                    onClickBtn={(data) => onClickGenerateImageHandler(data)}
                                    themeColor={themeColor}
                                    imgUrl={imgUrl}
                                    size={size}
                                    setSize={setSize}

                                />
                            }
                            {
                                model === 'defaultChat' &&

                                <PredefinedDataContextProvider>
                                    <ChatAreaDefault
                                        currentChat={chatHistory[chatId] ? chatHistory[chatId] : []}
                                        isBtnLoading={isBtnLoading}
                                        onClickBtn={(data) => onClickBtnHandler(data)}
                                        selectedTopic={selectedTopic}
                                        setSelectedTopic={setSelectedTopic}
                                        setShowTopics={setShowTopics}
                                        showTopics={showTopics}
                                    />
                                </PredefinedDataContextProvider>
                            }

                        </Box>

                        {/* footer */}
                        <Box as='footer' className={styles.footer}>
                            <Footer themeColor={themeColor} />
                        </Box>
                        <Portal>
                            {
                                isVisibleMenu &&
                                <SettingsContainer isOpen={isVisibleMenu} toggleMenuView={toggleMenuView} activeButton={activeButton} setActiveButton={setActiveButton} themeColor={themeColor} />
                            }

                            {
                                isVisibleHistory &&
                                <HistoryContainer
                                    themeColor={themeColor}
                                    isOpen={isVisibleHistory}
                                    toggleHistoryView={toggleHistoryView}
                                    chatHistory={chatHistory}
                                    setChatHistory={setChatHistory}
                                    chooseHistory={chooseHistory}
                                    clearChatFromHistory={clearChatFromHistory}
                                />
                            }

                        </Portal>

                    </React.Fragment >
            }
        </React.Fragment>
    );
};

export default AppClient;