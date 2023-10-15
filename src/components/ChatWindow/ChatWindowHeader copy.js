import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { MdOutlineNotes, MdApps, MdChevronLeft, MdTune } from 'react-icons/md';

const headerBtnsAnimation = {
    hidden: {
        opacity: 0,
        x: -100,
        zIndex: 1,
    },
    visible: custom => ({
        x: 0,
        opacity: 1,
        transition: {
            x: { delay: custom * 0.2, duration: 0.5 },
            opacity: { delay: 0.2, duration: 0.2 }
        }
    }),
    exit: {
        opacity: 0,
        x: -100,
        transition: {
            x: { delay: 0.1, duration: 0.5 },
            opacity: { delay: 0.2, duration: 0.2 }
        }
    }
}

const headerBtnsAnimationInverted = {
    hidden: {
        opacity: 0,
        x: 100,
        zIndex: 1,
    },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            x: { delay: 0, duration: 0.5 },
            opacity: { delay: 0.1, duration: 0.2 }
        }
    },
    exit: {
        opacity: 0,
        x: 100,
        transition: {
            x: { delay: 0.1, duration: 0.5 },
            opacity: { delay: 0.2, duration: 0.2 }
        }
    }
}

const headerTextAnimation = {
    hidden: { opacity: 0, scale: 0.75 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.5 } },
    exit: { opacity: 0, scale: 0.75, delay: 0.5 }
}

const ChatWindowHeader = ({ themeColor, currentTopic, showHeaderReturnPanel, headerBackButtonHandler, topicsButtonHandler, promptsButtonHandler, settingsButtonHandler }) => {

    return (
        <HStack justifyContent={'space-between'} px={0} borderTopRadius={'10px'} alignItems={'center'} h={'auto'} w='full'>
            <AnimatePresence mode='wait'>

                {/* Header Return Button Panel */}
                {
                    showHeaderReturnPanel.state === true &&
                    <HStack justifyContent={'space-between'} w='full' as={motion.div} key={'returnPanel'}>

                        <Box
                            as={motion.div}
                            key={'returnPanel'}
                            variants={headerBtnsAnimation}
                            initial={'hidden'}
                            animate={'visible'}
                            exit={'exit'}
                            flex={1}
                        >
                            <IconButton icon={<MdChevronLeft size={'28px'} />}
                                colorScheme={themeColor}
                                variant={'ghost'}
                                onClick={() => {
                                    headerBackButtonHandler();
                                }}
                                size={'sm'}
                            />
                        </Box>

                        <Box
                            as={motion.div}
                            key={'currentTopicHeadingReturnPanel'}
                            variants={headerTextAnimation}
                            initial={'hidden'}
                            animate={'visible'}
                            exit={'exit'}
                        // initial={{ opacity: 0, scale: 0.75 }}
                        // animate={{ opacity: 1, scale: 1, transition: { delay: 0.5 } }}
                        // exit={{ opacity: 0, scale: 0.75, delay: 0.5 }}

                        >
                            <Text textAlign={'center'} fontSize={['xs', 'md']}>{showHeaderReturnPanel.title}</Text>
                        </Box>


                        <Box flex={1}>&nbsp;</Box>
                    </HStack>
                }





                {/* Header Buttons Panel */}
                {
                    showHeaderReturnPanel.state === false &&
                    <HStack justifyContent={'space-between'} w='full' bg='' as={motion.div} key={'btnPanel'} p={0}>

                        <LeftSideButtons themeColor={themeColor} currentTopic={currentTopic} topicsButtonHandler={topicsButtonHandler} promptsButtonHandler={promptsButtonHandler} />

                        {
                            currentTopic !== 'Blank' &&
                            <motion.div
                                style={{ backgroundColor: '', width: "100%" }}
                                key={'currentTopicHeading'}
                                variants={headerTextAnimation}
                                initial={'hidden'}
                                animate={'visible'}
                                exit={'exit'}
                            // initial={{ opacity: 0, scale: 0.75 }}
                            // animate={{ opacity: 1, scale: 1, transition: { delay: 0.5 } }}
                            // exit={{ opacity: 0, scale: 0.75, delay: 0.5 }}
                            >
                                <Text textAlign={'center'} fontSize={['xs', 'md']} ml={'-4'}>{currentTopic}</Text>
                            </motion.div>
                        }

                        <RightSideButtons themeColor={themeColor} settingsButtonHandler={settingsButtonHandler} />
                    </HStack>
                }
            </AnimatePresence >
        </HStack >
    )
};
export default ChatWindowHeader;

const LeftSideButtons = ({ themeColor, currentTopic, topicsButtonHandler, promptsButtonHandler }) => {
    return (
        <HStack bg='red'>
            <motion.div
                key={'topicsButton'}
                variants={headerBtnsAnimation}
                initial={'hidden'}
                animate={'visible'}
                exit={'exit'}
            >
                <IconButton icon={<MdApps size='20px' />}
                    colorScheme={themeColor}
                    variant={'ghost'}
                    onClick={topicsButtonHandler}
                    size={'sm'}
                />
            </motion.div>

            {
                currentTopic !== null && currentTopic !== undefined && currentTopic !== 'Blank' &&
                <motion.div
                    key={'promptsButton'}
                    style={{ margin: 0, padding: 0 }}
                    variants={headerBtnsAnimation}
                    initial={'hidden'}
                    animate={'visible'}
                    exit={'exit'}
                    custom={3}
                >
                    <IconButton icon={<MdOutlineNotes size={'20px'} />}
                        colorScheme={themeColor}
                        variant={'ghost'}
                        onClick={promptsButtonHandler}
                        size={'sm'}
                    />
                </motion.div>
            }
        </HStack>
    )
}

const RightSideButtons = ({ themeColor, settingsButtonHandler }) => {
    return (
        <motion.div
            key={'settingsBtn'}
            style={{ margin: 0, padding: 0, display: 'flex', justifyContent: 'flex-end', }}
            variants={headerBtnsAnimationInverted}
            initial={'hidden'}
            animate={'visible'}
            exit={'exit'}
        >
            <IconButton icon={<MdTune size={'20px'} />}
                colorScheme={themeColor}
                variant={'ghost'}
                onClick={settingsButtonHandler}
                size={'sm'}
            />
        </motion.div>
    )
}