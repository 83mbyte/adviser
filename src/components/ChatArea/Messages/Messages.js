'use client'
import { Box, CardBody, Text, Card, HStack, IconButton, useToast } from '@chakra-ui/react';
import React from 'react';

import { FaRobot } from "react-icons/fa6";
import { RxAvatar } from "react-icons/rx";
import { RiFileCopy2Fill } from "react-icons/ri";

const ChatMessages = ({ currentChat, themeColor }) => {

    const chatHistoryRef = React.useRef(null);

    React.useEffect(() => {
        if (currentChat && currentChat.length > 0) {
            let lastChild = chatHistoryRef?.current?.lastElementChild;
            lastChild.scrollIntoView({ behavior: 'smooth' });
        }
    }, [currentChat]);

    return (

        <Box
            border={'1px dashed #DEDEDE'}
            borderRadius={'5px'}
            w={'full'}
            display={'flex'}
            flexDirection={'column'}
            p={2}
            bg={'#FAFAFA'}
            h={'100%'}
            overflow={'auto'}
            position='relative'
            justifyContent={'flex-end'}
        >

            <Box ref={chatHistoryRef} bg='' display={'block'} overflow={'auto'} >
                {
                    currentChat && currentChat.length > 0 &&
                    currentChat.map((chatItem, index) => {
                        return chatItem.map((item, itemIndex) => {
                            return (
                                <Box px={4} py={2} key={itemIndex} w={'full'} justifyContent={item.role !== 'assistant' ? 'flex-start' : 'flex-end'} display={'flex'} flexDirection={'row'} position={'relative'}>
                                    <ChatItem data={item} themeColor={themeColor} />
                                    {
                                        item.role === 'assistant' &&
                                        <CopyToClipboardButton data={item.content} />
                                    }
                                </Box>
                            )
                        })
                    })
                }
            </Box>
        </Box>
    );
};

export default ChatMessages;

const ChatItem = ({ data, themeColor }) => {
    return (
        <Box w={'90%'}>
            <Card bg={data.role === 'assistant' ? `${'gray.50'}` : `${themeColor}.100`}>
                <CardBody>
                    <HStack alignItems={'flex-start'}>
                        <Box px={1}>
                            {
                                data.role === 'assistant'
                                    ? <FaRobot size={'28px'} />
                                    : <RxAvatar size={'28px'} />
                            }
                        </Box>
                        <Text fontSize={['xs', 'lg']}>{data.content}</Text>
                    </HStack>

                </CardBody>
            </Card>
        </Box>
    )
}


const CopyToClipboardButton = ({ data }) => {
    const toast = useToast();
    const copyToClipboard = () => {
        navigator.clipboard.writeText(data).then(
            () => {
                /* clipboard successfully set */
                console.log('Copied');
                toast({
                    position: 'top-right',
                    title: 'Copied.',
                    status: 'success',
                    duration: 1000,
                    containerStyle: {
                        maxWidth: '100%',
                        marginTop: '100px'
                    },
                });
            },
            () => {
                /* clipboard write failed */
                console.error('Failed copy to clipboard.');
                toast({
                    position: 'top',
                    title: 'Failed copy to clipboard.',
                    status: 'error',
                    duration: 1000,
                    containerStyle: {
                        maxWidth: '100%',
                        marginTop: '100px'
                    },
                })
            },
        );
    }

    return (
        <Box bg=''
            position={'absolute'}
            color={'gray.400'}
            border={'0px solid red'}
            top={'4'}
            right={'3'}

        >

            <IconButton
                onClick={copyToClipboard}
                icon={<RiFileCopy2Fill size={'18px'} />}
                color={'inherit'}
                _hover={{ color: 'purple.500' }}
                variant={'ghost'}
                aria-label={'Copy to Clipboard'}
            />

        </Box>
    )
}