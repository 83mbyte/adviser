import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { animationProps } from '@/src/lib/animationProps';
import { MdOutlineNotes, MdApps, MdChevronLeft, MdTune } from 'react-icons/md';

import { FcIdea } from "react-icons/fc";

const ChatWindowHeader = ({ themeColor, currentTopic, showHeaderReturnPanel, showTopicQuestions, headerBackButtonHandler, topicsButtonHandler, promptsButtonHandler, settingsButtonHandler }) => {
    return (

        <Box w='full' bg='' display={'flex'} flexDirection={'column'} alignItems={'center'} h={'auto'}>
            <HeaderPanel
                themeColor={themeColor}
                currentTopic={currentTopic}
                topicsButtonHandler={topicsButtonHandler}
                promptsButtonHandler={promptsButtonHandler}
                settingsButtonHandler={settingsButtonHandler}
                headerBackButtonHandler={headerBackButtonHandler}
                showHeaderReturnPanel={showHeaderReturnPanel}
                showTopicQuestions={showTopicQuestions}
            />
        </Box >
    )
};
export default ChatWindowHeader;


const HeaderPanel = ({ themeColor, currentTopic, topicsButtonHandler, promptsButtonHandler, settingsButtonHandler, headerBackButtonHandler, showHeaderReturnPanel, showTopicQuestions }) => {
    return (
        <HStack w='full' h='100%' px={2}>

            <Box bg='' flex={1} >
                <AnimatePresence mode={'wait'}>
                    {
                        showHeaderReturnPanel.state == false &&
                        <motion.div key={'leftBtns'} variants={animationProps.buttons.slideFromLeft} initial={'hidden'} animate={'visible'} exit={'exit'} layout>
                            <LeftSideButtons themeColor={themeColor} currentTopic={currentTopic} topicsButtonHandler={topicsButtonHandler} promptsButtonHandler={promptsButtonHandler} />
                        </motion.div>
                    }

                    {
                        showHeaderReturnPanel.state == true &&
                        <motion.div key={'backBtn'} variants={animationProps.buttons.slideFromLeft} initial={'hidden'} animate={'visible'} exit={'exit'} layout>
                            <HStack>
                                <IconButton icon={<MdChevronLeft size={'28px'} />}
                                    colorScheme={themeColor}
                                    variant={'ghost'}
                                    onClick={() => {
                                        headerBackButtonHandler();
                                    }}
                                    size={'sm'}
                                />
                            </HStack>
                        </motion.div>
                    }
                </AnimatePresence >
            </Box >

            <Box bg='' flex={3}>
                <AnimatePresence mode='wait'>
                    {
                        showHeaderReturnPanel.state == true && showTopicQuestions == false &&
                        <motion.div
                            key={'titleOne'}
                            variants={animationProps.text.scale}
                            initial={'hidden'}
                            animate={'visible'}
                            exit={'exit'}
                        >
                            <Text textAlign={'center'} lineHeight={'1'}>{showHeaderReturnPanel.title}</Text>
                        </motion.div>
                    }

                    {
                        showHeaderReturnPanel.state == true && showTopicQuestions == true &&
                        <motion.div
                            key={'titleTwo'}
                            variants={animationProps.text.scale}
                            initial={'hidden'}
                            animate={'visible'}
                            exit={'exit'}
                        >
                            <Box>
                                <Text textAlign={'center'} fontSize={'xs'} lineHeight={'1'}>Ideas on:</Text>
                                <Text textAlign={'center'} lineHeight={'1'}>{currentTopic}</Text>
                            </Box>
                        </motion.div>
                    }
                    {/* {
                        showHeaderReturnPanel.state == false &&
                        <motion.div
                            key={'titleTwo'}
                            variants={animationProps.text.scale}
                            initial={'hidden'}
                            animate={'visible'}
                            exit={'exit'}
                        >
                            <Text textAlign={'center'}>{currentTopic}</Text>
                        </motion.div>
                    } */}
                    {/* {
                        currentTopic !== '' || currentTopic !== undefined &&
                        <motion.div
                            key={'titleTh'}
                            variants={animationProps.text.scale}
                            initial={'hidden'}
                            animate={'visible'}
                            exit={'exit'}
                        >
                            <Text textAlign={'center'}>{currentTopic}!!!!!!</Text>
                        </motion.div>
                    } */}
                </AnimatePresence>
            </Box>

            <Box bg='' flex={1}   >
                <AnimatePresence mode='wait'>
                    {
                        showHeaderReturnPanel.state == false &&
                        <motion.div style={{ backgroundColor: '', }} key={'rightBtns'} variants={animationProps.buttons.slideFromRight} initial={'hidden'} animate={'visible'} exit={'exit'} layout>
                            <RightSideButtons themeColor={themeColor} settingsButtonHandler={settingsButtonHandler} />
                        </motion.div>
                    }

                    {
                        showHeaderReturnPanel.state == true && <Box>&nbsp;</Box>
                    }
                </AnimatePresence>
            </Box>
        </HStack >
    )
}

const LeftSideButtons = ({ themeColor, currentTopic, topicsButtonHandler, promptsButtonHandler }) => {
    return (

        <HStack>
            <Tooltip label='Ideas' hasArrow bg={`${themeColor}.500`}>
                <IconButton icon={<FcIdea size='20px' />}
                    colorScheme={themeColor}
                    variant={'ghost'}
                    onClick={topicsButtonHandler}
                    size={'sm'}
                />
            </Tooltip>
            {
                (currentTopic && currentTopic !== undefined && currentTopic !== 'Blank') &&
                <Tooltip label='Prompts list' hasArrow bg={`${themeColor}.500`}>
                    <IconButton icon={<MdOutlineNotes size={'20px'} />}
                        colorScheme={themeColor}
                        variant={'ghost'}
                        onClick={promptsButtonHandler}
                        size={'sm'}
                    />
                </Tooltip>

            }
        </HStack>
    )
}

const RightSideButtons = ({ themeColor, settingsButtonHandler }) => {
    return (
        <HStack justifyContent={'flex-end'}>
            <Tooltip label='Chat settings' hasArrow bg={`${themeColor}.500`}>
                <IconButton icon={<MdTune size={'20px'} />}
                    colorScheme={themeColor}
                    variant={'ghost'}
                    onClick={settingsButtonHandler}
                    size={'sm'}
                />
            </Tooltip>
        </HStack>
    )
}


