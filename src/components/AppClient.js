'use client'

import { Box, VStack, Portal, } from '@chakra-ui/react';
import React from 'react';

import ChatArea from './ChatArea/ChatArea';
import Header from './Header/Header';
import SettingsContainer from './Settings/SettingsContainer';
import HistoryContainer from './Settings/HistoryContainer';
import Footer from './Footer/Footer';

import { getReplyFromAssistant } from '@/src/lib/fetchData';
import { promptsAPI } from '../lib/promptsAPI';
import { dbAPI } from '../lib/dbAPI';

import { useAuthContext } from '../context/AuthContextProvider';
import { useHistoryContext } from '../context/HistoryContextProvider';
import { useSettingsContext } from '../context/SettingsContextProvider';
import ImageArea from './ImageArea/ImageArea';


const AppClient = () => {
    const user = useAuthContext();
    const settingsContext = useSettingsContext();
    const historyContext = useHistoryContext();

    const [imgUrl, setImgUrl] = React.useState(null);
    const [size, setSize] = React.useState('256');
    const [chatHistory, setChatHistory] = React.useState({});

    const { activeButton, setActiveButton } = { ...settingsContext.activeButton };
    const { isVisibleMenu, setIsVisibleMenu } = { ...settingsContext.isVisibleMenu };
    const { isVisibleHistory, setIsVisibleHistory } = { ...settingsContext.isVisibleHistory };
    const { model, setModel } = { ...settingsContext.model };

    let themeColor = (activeButton.theme).toLowerCase();

    const [chatId, setChatId] = React.useState(null);
    const [isBtnLoading, setIsBtnLoading] = React.useState(false)

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

    const openCreateImage = () => {
        setModel('image');
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

                let chatQuestionAndReplyItem =
                {
                    user: { content: inputRef.current.value },
                    assistant: { content: data.content }
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
        openNewChat();
    }, []);

    React.useEffect(() => {
        if (historyContext) {
            setChatHistory(historyContext)
        }
    }, [historyContext]);

    return (

        <>
            {
                !user ? 'Access Denied'
                    : <>
                        <VStack
                            bg='red'
                            justifyContent={'space-between'}
                            minHeight={'10vh'}
                            height={'100vh'}
                            maxHeight={'100vh'}
                            spacing={'0'}
                            w={'full'}
                        >
                            {/* Header */}
                            <Box bg='gray.50' w='full' as={'header'} h={['45px', '55px']}>

                                <Header
                                    openNewChat={openNewChat}
                                    toggleMenuView={toggleMenuView}
                                    toggleHistoryView={toggleHistoryView}
                                    openCreateImage={openCreateImage}
                                    isChatHistoryExists={Object.keys(chatHistory).length > 0}
                                    themeColor={themeColor}
                                />
                            </Box>


                            {/* Chat Area  */}
                            <Box
                                as={'main'}
                                bg={'gray.300'}
                                // bg='#F7FAFC'
                                display={'flex'}
                                flexDirection={'column'}
                                height={'100%'}
                                maxHeight={'100%'}
                                w={'full'}
                                flex={1}
                                alignItems={'center'}
                                justifyContent={'center'}
                                p={2}
                                overflow={'auto'}
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
                            </Box>


                            {/* Footer */}

                            <Box bg='gray.100' w='full' as={'footer'}>
                                <Footer themeColor={themeColor} />
                            </Box>

                        </VStack>

                        <Portal>
                            {
                                isVisibleMenu &&
                                <SettingsContainer isOpen={isVisibleMenu} toggleMenuView={toggleMenuView} activeButton={activeButton} setActiveButton={setActiveButton} themeColor={themeColor} />
                            }
                        </Portal>
                        <Portal>
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
                    </>

            }
        </>
    );
};

export default AppClient;