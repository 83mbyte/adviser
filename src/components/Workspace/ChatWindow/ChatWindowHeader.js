import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { animationProps } from '@/src/lib/animationProps';
import { MdOutlineNotes, MdHistory, MdChevronLeft, MdTune, } from 'react-icons/md';

import { HiOutlineLightBulb } from "react-icons/hi";

const ChatWindowHeader = ({ themeColor, currentTopic, showHeaderReturnPanel, showTopicQuestions, headerBackButtonHandler, topicsButtonHandler, promptsButtonHandler, settingsButtonHandler, historyButtonHandler, isChatHistoryExists }) => {
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
                historyButtonHandler={historyButtonHandler}
                isChatHistoryExists={isChatHistoryExists}
            />
        </Box >
    )
};
export default ChatWindowHeader;


const HeaderPanel = ({ themeColor, currentTopic, topicsButtonHandler, promptsButtonHandler, settingsButtonHandler, headerBackButtonHandler, showHeaderReturnPanel, showTopicQuestions, historyButtonHandler, isChatHistoryExists }) => {
    return (
        <HStack w='full' h='100%' px={2}>

            <Box bg='' flex={1} >
                <LeftSideButtons showButtons={showHeaderReturnPanel.state == false} themeColor={themeColor} currentTopic={currentTopic} topicsButtonHandler={topicsButtonHandler} promptsButtonHandler={promptsButtonHandler} headerBackButtonHandler={headerBackButtonHandler} />
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
                </AnimatePresence>
            </Box>

            <Box bg='' flex={1}   >

                <RightSideButtons showButtons={showHeaderReturnPanel.state == false} themeColor={themeColor} settingsButtonHandler={settingsButtonHandler} historyButtonHandler={historyButtonHandler} isChatHistoryExists={isChatHistoryExists} />
            </Box>
        </HStack >
    )
}

const LeftSideButtons = ({ showButtons, themeColor, currentTopic, topicsButtonHandler, promptsButtonHandler, headerBackButtonHandler }) => {
    return (
        <HStack >
            <AnimatePresence mode='wait'>
                {
                    showButtons == true &&
                    <motion.div
                        style={{ display: 'flex', flexDirection: 'row' }}
                        key={'leftBtnsContainer'}
                        variants={animationProps.buttons.slideFromLeft}
                        initial={'hidden'}
                        animate={'visible'}
                        exit={'exit'}

                    >
                        <motion.div
                            key={'ideaBtn'}
                            variants={animationProps.buttons.slideFromLeftChild}
                        >
                            <Tooltip label='Ideas' hasArrow bg={`${themeColor}.500`}>
                                <IconButton icon={<HiOutlineLightBulb size='22px' />}
                                    colorScheme={themeColor}
                                    variant={'ghost'}
                                    onClick={topicsButtonHandler}
                                    size={'sm'}
                                />
                            </Tooltip>
                        </motion.div>
                        {
                            (currentTopic && currentTopic !== undefined && currentTopic !== 'Blank') &&
                            <motion.div
                                key={'promptsBtn'}
                                variants={animationProps.buttons.slideFromLeftChild}
                            >
                                <Tooltip label='Prompts list' hasArrow bg={`${themeColor}.500`}>
                                    <IconButton icon={<MdOutlineNotes size={'20px'} />}
                                        colorScheme={themeColor}
                                        variant={'ghost'}
                                        onClick={promptsButtonHandler}
                                        size={'sm'}
                                    />
                                </Tooltip>
                            </motion.div>
                        }
                    </motion.div>
                }
                {
                    showButtons == false &&
                    <motion.div
                        key={'returnContainer'}
                        variants={animationProps.buttons.slideFromLeft}
                        initial={'hidden'}
                        animate={'visible'}
                        exit={'exit'}
                    >
                        <motion.div
                            key={'returnBtn'}
                            variants={animationProps.buttons.slideFromLeftChild}
                        >
                            <IconButton icon={<MdChevronLeft size={'28px'} />}
                                colorScheme={themeColor}
                                variant={'ghost'}
                                onClick={() => {
                                    headerBackButtonHandler();
                                }}
                                size={'sm'}
                            />
                        </motion.div>

                    </motion.div>
                }
            </AnimatePresence>
        </HStack>
    )
}

const RightSideButtons = ({ showButtons, themeColor, settingsButtonHandler, historyButtonHandler, isChatHistoryExists }) => {
    return (
        <HStack justifyContent={'flex-end'} >
            <AnimatePresence mode='wait'>
                {
                    showButtons == true &&
                    <motion.div
                        style={{ display: 'flex', flexDirection: 'row' }}
                        key={'rightBtnsContainer'}
                        variants={animationProps.buttons.slideFromRight}
                        initial={'hidden'}
                        animate={'visible'}
                        exit={'exit'}
                    >
                        {
                            isChatHistoryExists &&
                            <motion.div
                                key={'historyBtn'}
                                variants={animationProps.buttons.slideFromRightChild}
                            >
                                <Tooltip label='History' hasArrow bg={`${themeColor}.500`}>
                                    <IconButton icon={<MdHistory size={'20px'} />}
                                        colorScheme={themeColor}
                                        variant={'ghost'}
                                        onClick={historyButtonHandler}
                                        size={'sm'}
                                    />
                                </Tooltip>
                            </motion.div>
                        }
                        <motion.div
                            key={'settingsBtn'}
                            variants={animationProps.buttons.slideFromRightChild}
                        >
                            <Tooltip label='Chat settings' hasArrow bg={`${themeColor}.500`}>
                                <IconButton icon={<MdTune size={'20px'} />}
                                    colorScheme={themeColor}
                                    variant={'ghost'}
                                    onClick={settingsButtonHandler}
                                    size={'sm'}
                                />
                            </Tooltip>
                        </motion.div>
                    </motion.div>
                }
                {
                    showButtons === false &
                    <Box key={'emptyBox'}>&nbsp;</Box>
                }
            </AnimatePresence>
        </HStack >
    )
}