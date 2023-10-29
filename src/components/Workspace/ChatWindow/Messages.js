import { Box, Text, IconButton, useToast, Tooltip, Skeleton, SkeletonCircle, VStack, Image } from "@chakra-ui/react";
import { Fragment, useRef, useEffect } from "react";

import { FaRobot } from "react-icons/fa6";
import { RxAvatar } from "react-icons/rx";
import { RiFileCopy2Fill } from "react-icons/ri";

const Messages = ({ currentChat, themeColor, isLoadingBtn, }) => {

    const chatHistoryRef = useRef(null);

    useEffect(() => {
        if (currentChat && currentChat.length > 0) {
            let lastChild = chatHistoryRef?.current?.lastElementChild;
            lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [currentChat]);

    return (
        <Box ref={chatHistoryRef} bg='' display={'block'} overflow='auto'  >

            {
                currentChat && currentChat.length > 0 &&
                currentChat.map((chatItem, index) => {
                    return (
                        <Fragment key={`fragment_${index}`}>
                            {
                                !chatItem['assistant']
                                    ? <Box px={0} py={[1, 2]} key={`${index}_chat`} w={'full'} justifyContent={'flex-start'} display={'flex'} flexDirection={'row'} position={'relative'}>
                                        <ChatItem data={chatItem['user']} role={'user'} themeColor={themeColor} />
                                    </Box>
                                    :
                                    <Fragment>
                                        <Box px={0} py={[1, 2]} key={`${index}_user`} w={'full'} justifyContent={'flex-start'} display={'flex'} flexDirection={'row'} >
                                            <ChatItem data={chatItem['user']} role={'user'} themeColor={themeColor} />
                                        </Box>
                                        <Box px={0} py={[1, 2]} key={`${index}_assistant`} w={'full'} justifyContent={'flex-end'} display={'flex'} flexDirection={'row'} >
                                            <ChatItem data={chatItem['assistant']} role={'assistant'} themeColor={themeColor} />
                                        </Box>
                                    </Fragment>
                            }
                        </Fragment>
                    )
                })
            }
            {
                isLoadingBtn && <Box px={0} py={[2, 2]} w={'full'} justifyContent={'flex-end'} display={'flex'} flexDirection={'row'} position={'relative'}>
                    <Box w={'95%'} display={'flex'} flexDirection={'row'}>
                        <Box display={'flex'} alignItems={'flex-end'} mr={1}><SkeletonCircle /></Box>
                        <VStack bg='' w={'full'} alignItems={'flex-start'}>
                            <Skeleton w={'90%'} h={'10px'} />
                            <Skeleton w={'95%'} h={'10px'} />
                            <Skeleton w={'full'} h={'20px'} />
                        </VStack>
                    </Box>
                </Box>
            }


        </Box>
    );
};

export default Messages;

const ChatItem = ({ data, role, themeColor, }) => {

    return (
        <Box maxW={'90%'} border={'0px solid black'}>
            <Box bg='' display={'flex'} justifyContent={role === 'user' ? 'flex-start' : 'flex-end'} flexDirection={role !== 'user' ? 'row-reverse' : 'row'}>
                <Box bg={''} display={'flex'} alignItems={'flex-end'}>
                    <Box p={0} pl={role !== 'user' ? 2 : 0} pr={role === 'user' ? 2 : 0} mb={0}>
                        {
                            role === 'assistant'
                                ? <FaRobot size={'21px'} />
                                : <RxAvatar size={'21px'} />
                        }
                    </Box>
                </Box>
                <Box
                    display={'flex'}
                    px={2}
                    py={1}
                    bg={role !== 'user' ? `${'gray.100'}` : `${themeColor}.100`}
                    borderWidth={'1px'}
                    borderStyle={'solid'}
                    borderRadius={'10px'}
                    borderBottomLeftRadius={role === 'user' ? 0 : '10px'}
                    borderBottomRightRadius={role !== 'user' ? 0 : '10px'}
                    borderColor={role !== 'user' ? `${'gray.200'}` : `${themeColor}.200`}
                >
                    <Text fontSize={['xs', 'md']} w={'full'}  >{data.content}</Text>
                    {
                        role !== 'user' && <CopyToClipboardButton data={data.content} themeColor={themeColor} />
                    }

                </Box>
            </Box>
        </Box >
    )
}

const CopyToClipboardButton = ({ data, themeColor }) => {
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
            position={'relative'}
            color={'gray.400'}
            alignItems={'center'}
            display={'flex'}
            p={0}
            pl={'1'}
        >

            <Tooltip label='Copy' hasArrow bg={`${themeColor}.500`}>
                <IconButton
                    size={'xs'}
                    onClick={copyToClipboard}
                    icon={<RiFileCopy2Fill size={'18px'} />}
                    color={'inherit'}
                    _hover={{ color: `${themeColor}.500` }}
                    variant={'link'}
                    aria-label={'Copy to Clipboard'}
                />
            </Tooltip>
        </Box>
    )
}