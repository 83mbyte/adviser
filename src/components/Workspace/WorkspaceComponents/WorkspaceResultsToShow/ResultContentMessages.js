import { Box, Text, useToast, Tooltip, IconButton, VStack, Skeleton, SkeletonCircle } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, forwardRef, useEffect, useRef } from 'react';
import { animationProps } from '@/src/lib/animationProps';
import { sanitize } from 'isomorphic-dompurify';
import styles from './ResultContentStyles.module.css';


import { FaRobot } from "react-icons/fa6";
import { RxAvatar } from "react-icons/rx";
import { RiFileCopy2Fill } from "react-icons/ri";
import { BsArrowRepeat } from "react-icons/bs";
const ResultContentMessages = forwardRef(function ResultContentMessagesRef({ currentChat, showMessages, themeColor, isLoading, setPromptToRepeat }, ref) {
    const chatHistoryRef = useRef(null);

    useEffect(() => {
        //messages scroll to bottom 
        if (currentChat && currentChat.length > 0) {
            let lastChild = chatHistoryRef?.current?.lastElementChild;
            lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [currentChat]);

    return (

        <Box
            ref={chatHistoryRef}
            bg=''
            py={2}
            display={'block'}
            overflow={'scroll'}
        >

            <AnimatePresence mode='wait'>
                {(showMessages) &&
                    <motion.div
                        key={'messages'}
                        ref={ref}
                        variants={animationProps.chatWindowScreens.opacityDelayed}
                        initial={'hidden'}
                        animate={'show'}
                        exit={'exit'}
                    >

                        {
                            (currentChat && currentChat.length > 0) &&
                            currentChat.map((chatItem, index) => {
                                return (
                                    <Fragment key={`fragment_${index}`}>
                                        {
                                            !chatItem['assistant']
                                                ? <Box px={0} py={[1, 2]} key={`${index}_chat`} w={'full'} justifyContent={'flex-start'} display={'flex'} flexDirection={'row'} position={'relative'}>
                                                    <ChatItem data={chatItem['user']} role={'user'} themeColor={themeColor} setPromptToRepeat={setPromptToRepeat} />
                                                </Box>
                                                :
                                                <Fragment>
                                                    <Box px={0} py={[1, 2]} key={`${index}_user`} w={'full'} justifyContent={'flex-start'} display={'flex'} flexDirection={'row'} >
                                                        <ChatItem data={chatItem['user']} role={'user'} themeColor={themeColor} setPromptToRepeat={setPromptToRepeat} />
                                                    </Box>
                                                    <Box px={0} py={[1, 2]} key={`${index}_assistant`} w={'full'} justifyContent={'flex-end'} display={'flex'} flexDirection={'row'} mb={6}>
                                                        <ChatItem data={chatItem['assistant']} role={'assistant'} themeColor={themeColor} />
                                                    </Box>
                                                </Fragment>
                                        }
                                    </Fragment>
                                )
                            })
                        }{
                            isLoading &&
                            <Box px={0} py={[2, 2]} w={'full'} justifyContent={'flex-end'} display={'flex'} flexDirection={'row'} position={'relative'}>
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
                    </motion.div>
                }

            </AnimatePresence>

        </Box>
    )
})

export default ResultContentMessages;


const ChatItem = ({ data, role, themeColor, setPromptToRepeat }) => {
    const sanitizeString = (dirtyString) => {
        return sanitize(dirtyString);
    }
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
                    {role == 'user' ? <Text fontSize={['xs', 'md']} w={'full'} >{data.content}</Text> : <Box className={styles.htmlResult} fontSize={['xs', 'md']} dangerouslySetInnerHTML={{ __html: sanitizeString(data.content) }}></Box>
                    }

                    {
                        role !== 'user' ? <CopyToClipboardButton data={data.content} themeColor={themeColor} /> : <RepeatPrompt data={data.content} themeColor={themeColor} setPromptToRepeat={setPromptToRepeat} />
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
            color={`${themeColor}.600`}
            // color={'gray.400'}
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

const RepeatPrompt = ({ data, themeColor, setPromptToRepeat }) => {
    const repeatPrompt = () => {
        setPromptToRepeat(data);
    }
    return (
        <Box bg=''
            position={'relative'}
            color={`${themeColor}.600`}
            // color={'gray.400'}
            alignItems={'center'}
            display={'flex'}
            p={0}
            pl={'1'}
        >

            <Tooltip label='Repeat it' hasArrow bg={`${themeColor}.500`}>
                <IconButton
                    size={'xs'}
                    onClick={repeatPrompt}
                    icon={<BsArrowRepeat size={'18px'} />}
                    color={'inherit'}
                    _hover={{ color: `${themeColor}.500` }}
                    variant={'link'}
                    aria-label={'Copy to Clipboard'}
                />
            </Tooltip>
        </Box>
    )
}
