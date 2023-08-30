'use client'
import React from 'react';

import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    Text,
    HStack,
    Box,
    IconButton, Icon,
} from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';

import { RiChatHistoryLine, RiDeleteBin7Line } from "react-icons/ri";


const HistoryContainer = ({ isOpen, toggleHistoryView, chatHistory, chooseHistory, themeColor, clearChatFromHistory }) => {


    return (
        <Drawer size={{ sm: 'full', md: 'sm' }} isOpen={isOpen} placement={'left'} onOverlayClick={toggleHistoryView} >
            <DrawerOverlay />
            <DrawerContent  >

                <DrawerHeader borderBottomWidth='1px' py={[2, 4]}>
                    <HStack>
                        <Box bg=''   >
                            <IconButton icon={<MdArrowBack />} colorScheme={themeColor} variant={'ghost'} onClick={toggleHistoryView} />
                        </Box>
                        <Box w='full' >
                            <Text textAlign={'center'}>{`Chats' History`}</Text>
                        </Box>
                    </HStack>
                </DrawerHeader>

                <DrawerBody>
                    <Text pb={2}>Section is still under construction..</Text>
                    {
                        Object.keys(chatHistory).map((chatName, index) => {
                            return (
                                <ChatHistoryItem key={index} themeColor={themeColor} chatHistory={chatHistory} chatName={chatName} chooseHistory={chooseHistory} />
                            )
                        })
                    }
                </DrawerBody>
            </DrawerContent>
        </Drawer >
    );
};

export default HistoryContainer;

const ChatHistoryItem = ({ themeColor, chatHistory, chatName, chooseHistory }) => {

    const [isLoading, setIsLoading] = React.useState(false);

    const onClickHandler = async () => {
        setIsLoading(true);
        let res = await clearChatFromHistory(`${chatName}`);
        console.log('res::', res)
        setIsLoading(false);
    }
    return (
        <HStack w={'full'} bg='' justifyContent={'space-between'} mb={3} _hover={{ backgroundColor: `${themeColor}.50` }}>

            <HStack color={themeColor}>
                <Icon as={RiChatHistoryLine} />
                <Box
                    w='100%'
                    _hover={{ cursor: 'pointer' }}
                    onClick={() => chooseHistory(`${chatName}`)}
                >
                    {`${chatHistory[chatName][0][0].content.slice(0, 30)}..`}
                </Box>
            </HStack>
            <IconButton
                isLoading={isLoading}
                icon={<RiDeleteBin7Line />}
                colorScheme={themeColor}
                _hover={{ color: 'red' }}
                variant={'link'}
                onClick={onClickHandler}
            />

        </HStack>
    )
}
