import { Box, Text, CircularProgress, CircularProgressLabel, Card, CardBody, CardHeader, Icon, VStack, StackDivider, HStack } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, useEffect, useRef } from 'react';
import { animationProps } from '@/src/lib/animationProps';

import { TfiYoutube } from "react-icons/tfi";

import { sanitize } from 'isomorphic-dompurify';

import styles from './ResultContentStyles.module.css';
import CopyToClipboardButton from '../CopyToClipboardButton/CopyToClipboardButton';

const sanitizeString = (dirtyString) => {
    return sanitize(dirtyString);
}

const ResultContentYTSummarize = ({ currentSummarize, showSummarize, isLoading, themeColor, progressValue }) => {

    const chatHistoryRef = useRef(null);
    const loaderRef = useRef(null);



    useEffect(() => {
        //messages scroll to bottom 
        if (currentSummarize && currentSummarize.length > 0) {
            let lastChild = chatHistoryRef?.current?.lastElementChild;
            lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
        if (isLoading) {
            let lastChild = loaderRef?.current?.lastElementChild;
            lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [currentSummarize, isLoading]);

    return (
        <Box
            ref={chatHistoryRef}
            bg=''
            py={2}
            display={'block'}
            overflow={'scroll'}
        >
            <AnimatePresence mode='wait'>
                {
                    showSummarize &&
                    <motion.div
                        key={'messages'}
                        // ref={ref}
                        variants={animationProps.chatWindowScreens.opacityDelayed}
                        initial={'hidden'}
                        animate={'show'}
                        exit={'exit'}
                    >

                        {

                            (currentSummarize && currentSummarize.length > 0) &&
                            currentSummarize.map((chatItem, index) => {
                                return (
                                    <Fragment key={`fragment_${index}`}>

                                        <Card m={1} mb={8}>
                                            <CardHeader bg='' pb={0}>
                                                <Box display='flex' pb={5} borderBottomWidth={'1px'} borderColor={`${themeColor}.100`} alignItems='center'>
                                                    <Icon as={TfiYoutube} boxSize={[5, 8]} m={1} mr={2} />
                                                    <Box>
                                                        <Text fontSize='xs'>{`Source: ${chatItem['assistant'].source}`}</Text>
                                                        <Text fontSize='xs'>{`Title: ${chatItem['assistant'].title}`}</Text>
                                                    </Box>
                                                </Box>
                                            </CardHeader>

                                            <CardBody>
                                                <VStack
                                                    divider={<StackDivider borderColor='gray.200' />}
                                                >
                                                    <Box className={styles.YouTubeResult}
                                                        dangerouslySetInnerHTML={{ __html: sanitizeString(chatItem['assistant'].content) }}
                                                    ></Box>
                                                    <HStack
                                                        divider={<StackDivider borderColor='gray.200' />}
                                                        w='full' bg=''
                                                        justifyContent={'flex-end'}
                                                        pr={6}
                                                    >
                                                        <CopyToClipboardButton data={chatItem['assistant'].content} format='HTML' themeColor={themeColor} />
                                                    </HStack>

                                                </VStack>

                                            </CardBody>
                                        </Card>
                                    </Fragment>
                                )
                            })
                        }

                        {
                            isLoading &&
                            <AnimatePresence mode='wait'>
                                <Box ref={loaderRef} px={0} py={[2, 2]} w={'full'} display={'block'} position={'relative'}
                                    as={motion.div}
                                    key={'progressWarning'}
                                    variants={animationProps.chatWindowScreens.slideFromLeft}
                                    initial={'hidden'}
                                    animate={'show'}
                                    exit={'exit'}
                                >
                                    <Box bg='' display='flex' mx={6} justifyContent='center' borderColor={`${themeColor}.100`} borderWidth='1px' borderRadius={'lg'} p={1}>
                                        <Box bg='' alignItems='center' display='flex'>
                                            <CircularProgress size={['65px', '100px']} thickness='3px' value={progressValue} color='green.400'>
                                                <CircularProgressLabel>{`${progressValue}%`}</CircularProgressLabel>
                                            </CircularProgress>
                                        </Box>
                                        <Box fontSize={['xs', 'sm']} justifyContent='center' alignItems='flex-start' display='flex' flexDirection='column' pl={1}>
                                            <Text>Please do not close this window and wait while we analyze the video.</Text>
                                            <Text>The duration of this process may vary depending on the length of the video and may  take from a few seconds to 10-15 minutes.</Text>
                                        </Box>
                                    </Box>
                                </Box>
                            </AnimatePresence>

                        }

                    </motion.div>
                }
            </AnimatePresence>
        </Box>
    )
}

export default ResultContentYTSummarize;