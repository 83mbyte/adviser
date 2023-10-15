import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { animationProps } from '@/src/lib/animationProps';
import { MdOutlineNotes, MdApps, MdChevronLeft, MdTune } from 'react-icons/md';

const ChatWindowHeader = ({ themeColor, currentTopic, showHeaderReturnPanel, headerBackButtonHandler, topicsButtonHandler, promptsButtonHandler, settingsButtonHandler }) => {
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
            />
        </Box >
    )
};
export default ChatWindowHeader;


const HeaderPanel = ({ themeColor, currentTopic, topicsButtonHandler, promptsButtonHandler, settingsButtonHandler, headerBackButtonHandler, showHeaderReturnPanel }) => {
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
                        showHeaderReturnPanel.state == true &&
                        <motion.div
                            key={'titleOne'}
                            variants={animationProps.text.scale}
                            initial={'hidden'}
                            animate={'visible'}
                            exit={'exit'}
                        >
                            <Text textAlign={'center'}>{showHeaderReturnPanel.title}</Text>
                        </motion.div>
                    }

                    {
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
                    }
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
            <IconButton icon={<MdApps size='20px' />}
                colorScheme={themeColor}
                variant={'ghost'}
                onClick={topicsButtonHandler}
                size={'sm'}
            />
            {
                (currentTopic && currentTopic !== undefined && currentTopic !== 'Blank') &&
                <IconButton icon={<MdOutlineNotes size={'20px'} />}
                    colorScheme={themeColor}
                    variant={'ghost'}
                    onClick={promptsButtonHandler}
                    size={'sm'}
                />

            }
        </HStack>
    )
}

const RightSideButtons = ({ themeColor, settingsButtonHandler }) => {
    return (
        <HStack justifyContent={'flex-end'}>
            <IconButton icon={<MdTune size={'20px'} />}
                colorScheme={themeColor}
                variant={'ghost'}
                onClick={settingsButtonHandler}
                size={'sm'}
            />
        </HStack>
    )
}



