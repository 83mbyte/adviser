import { Box, Text, Tooltip, IconButton, VStack, Skeleton, SkeletonCircle, StackDivider, HStack } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, forwardRef, useEffect, useRef, useState } from 'react';
import { animationProps } from '@/src/lib/animationProps';
import { sanitize } from 'isomorphic-dompurify';
import styles from './ResultContentStyles.module.css';


import { FaRobot } from "react-icons/fa6";
import { RxAvatar, RxChevronLeft, RxChevronRight } from "react-icons/rx";
import { BsArrowRepeat } from "react-icons/bs";
import CopyToClipboardButton from '../CopyToClipboardButton/CopyToClipboardButton';


const ResultContentMessages = forwardRef(function ResultContentMessagesRef({ currentChat, showMessages, themeColor, isLoading, setPromptToRepeat }, ref) {

    const chatHistoryRef = useRef(null);

    useEffect(() => {
        //messages scroll to bottom 
        if (isLoading || (!isLoading && currentChat && currentChat.length > 0)) {
            let lastChild = chatHistoryRef?.current?.lastElementChild;
            lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [currentChat, isLoading]);

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
                    {role == 'user'
                        ? <Text fontSize={['xs', 'md']} w={'full'} >{data.content}</Text>
                        : <AssistantReplyBlock data={data.content} format={data.format} themeColor={themeColor} />
                    }

                    {
                        role == 'user' && <RepeatPrompt data={data.content} themeColor={themeColor} setPromptToRepeat={setPromptToRepeat} />
                    }


                </Box>
            </Box>
        </Box >
    )
}

const AssistantReplyBlock = ({ data, format, themeColor }) => {

    const [currentNumber, setCurrentNumber] = useState(0);
    const [showReply, setShowReply] = useState(() => {
        return {
            id: 0,
        }
    });


    const sanitizeString = (dirtyString) => {
        return sanitize(dirtyString);
    }

    const movePage = (offset) => {
        setShowReply({
            id: showReply.id + offset
        })
        setCurrentNumber(currentNumber + offset);  // offset as +1 or -1
    }


    return (
        <VStack divider={<StackDivider borderColor='gray.200' />} >

            <AnimatePresence mode='wait' initial={false}>
                {
                    (showReply.id == currentNumber) &&
                    <Box as={motion.div} key={`assistReply_${currentNumber}`} className={styles.htmlResult} fontSize={['xs', 'md']} dangerouslySetInnerHTML={{ __html: sanitizeString(data[currentNumber]) }}
                        variants={animationProps.opacity}
                        initial={'hidden'}
                        animate={'show'}
                        exit={'exit'}
                        layout
                    ></Box>
                }
            </AnimatePresence>

            <HStack divider={<StackDivider borderColor='gray.200' />} w='full' bg='' justifyContent={'flex-end'}
                pr={6}>
                {data.length > 1 &&
                    <HStack spacing={0} bg=''>
                        <Box bg=''>
                            <IconButton variant='link'
                                colorScheme={themeColor}
                                size={'sm'}
                                aria-label='previous variant'
                                icon={currentNumber != 0 && <RxChevronLeft />}
                                onClick={() => movePage(-1)}
                                isDisabled={currentNumber == 0}
                            />
                        </Box>
                        <Box bg='' fontSize={['2xs', 'xs']}>{`${currentNumber + 1}/${data.length}`}</Box>
                        <Box bg=''>
                            {<IconButton variant='link'
                                size='sm'
                                colorScheme={themeColor}
                                aria-label='next variant'
                                icon={currentNumber !== data.length - 1 && <RxChevronRight />}
                                onClick={() => movePage(1)}
                                isDisabled={currentNumber == data.length - 1}
                            />}
                        </Box>
                    </HStack>
                }
                <CopyToClipboardButton data={data[currentNumber]} themeColor={themeColor} format={format} />

            </HStack>

        </VStack >
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
