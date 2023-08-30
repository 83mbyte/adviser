'use client'
import { useStateContext } from '@/src/utilities/ContextProvider';
import { Box, VStack, Portal } from '@chakra-ui/react';
import React from 'react';

import ChatArea from './ChatArea/ChatArea';
import Header from './Header/Header';
import SettingsContainer from './Settings/SettingsContainer';
import HistoryContainer from './Settings/HistoryContainer';
import Footer from './Footer/Footer';

import { deleteData, putData } from '@/src/lib/fetchData';


const AppClient = ({ chatHistoryObj }) => {


    const appContext = useStateContext();
    const { chatHistory, setChatHistory } = { ...appContext.chatHistory };
    const { activeButton, setActiveButton } = { ...appContext.activeButton };
    const { isVisibleMenu, setIsVisibleMenu } = { ...appContext.isVisibleMenu };
    const { isVisibleHistory, setIsVisibleHistory } = { ...appContext.isVisibleHistory };
    const { isVisibleChatArea, setIsVisibleChatArea } = { ...appContext.isVisibleChatArea };

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
        } else {
            alert(`something wrong.. a new chat can't be created`);
        }
    }



    const onClickBtnHandler = async (inputRef) => {
        setIsBtnLoading(true);

        let chatQuestionAndReplyItem =
            [
                { role: 'user', content: inputRef.current.value },
                { role: 'assistant', content: 'Assistant reply at AppClient.js' }
            ]
        if (chatHistory && chatHistory[chatId]) {

            setChatHistory({
                ...chatHistory,
                [chatId]: [
                    ...chatHistory[chatId],
                    chatQuestionAndReplyItem
                ]
            })
        } else {

            setChatHistory({
                ...chatHistory,
                [chatId]: [chatQuestionAndReplyItem]
            })
        }


        if (chatHistory && chatHistory[chatId]) {

            dataToUpload = [
                ...chatHistory[chatId],
                chatQuestionAndReplyItem
            ]
        } else {

            dataToUpload = [
                chatQuestionAndReplyItem
            ]
        }

        try {
            await putData(chatId, dataToUpload);

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

    const clearChatFromHistory = async (postId) => {
        let resp = await deleteData(postId);
        if (resp) {
            const { [postId]: removedData, ...newChatHistory } = chatHistory;
            setChatHistory(newChatHistory);
        }
        return 'done'
    }


    React.useEffect(() => {
        openNewChat();
    }, []);

    React.useEffect(() => {
        if (chatHistoryObj) {
            setChatHistory(chatHistoryObj)
        }
    }, [chatHistoryObj]);


    return (

        <>
            <VStack
                bg=''
                justifyContent={'space-between'}
                minHeight={'10vh'}
                height={'100vh'}
                maxHeight={'100vh'}
                spacing={'0'}
                w={'full'}
            >
                {/* Header */}
                <Box bg='gray.50' w='full' as={'header'}>
                    <Header
                        openNewChat={openNewChat}
                        toggleMenuView={toggleMenuView}
                        toggleHistoryView={toggleHistoryView}
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
                        chatId &&
                        <ChatArea
                            isBtnLoading={isBtnLoading}
                            isVisibleChatArea={isVisibleChatArea}
                            setChatHistory={setChatHistory}
                            currentChat={chatHistory[chatId] ? chatHistory[chatId] : []}
                            onClickBtn={(data) => onClickBtnHandler(data)}
                            themeColor={themeColor}
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
    );
};

export default AppClient;