import { Box, HStack, IconButton, Tooltip, Text } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import { animationProps } from '@/src/lib/animationProps';
import { HiOutlineLightBulb } from "react-icons/hi";
import { MdChevronLeft } from 'react-icons/md';




const ImageCreatorHeader = ({ themeColor, showHeaderReturnPanel, ideaBtnHandler, headerBackButtonHandler, }) => {
    return (
        <Box w='full' bg='#FAFAFA' display={'flex'} flexDirection={'column'} alignItems={'center'} h={'auto'} zIndex={1203}>
            <ImageCreatorHeaderPanel themeColor={themeColor} showHeaderReturnPanel={showHeaderReturnPanel} ideaBtnHandler={ideaBtnHandler} headerBackButtonHandler={headerBackButtonHandler} />
        </Box>
    );
};

export default ImageCreatorHeader;


const ImageCreatorHeaderPanel = ({ themeColor, showHeaderReturnPanel, ideaBtnHandler, headerBackButtonHandler, }) => {
    return (
        <HStack w='full' h='100%' px={2}>
            <Box flex={1}>
                <ImageCreatorLeftSideButtons
                    themeColor={themeColor}
                    showHeaderReturnPanel={showHeaderReturnPanel}
                    ideaBtnHandler={ideaBtnHandler}
                    headerBackButtonHandler={headerBackButtonHandler}
                />
            </Box>
            <Box flex={3}>
                <AnimatePresence mode='wait'>

                    {
                        showHeaderReturnPanel.state == true &&
                        <motion.div
                            key={'titleReturnPanel'}
                            variants={animationProps.text.scale}
                            initial={'hidden'}
                            animate={'visible'}
                            exit={'exit'}
                        >
                            <Box>
                                <Text textAlign={'center'} lineHeight={'1'}>{showHeaderReturnPanel.title}</Text>
                            </Box>
                        </motion.div>
                    }
                    {
                        showHeaderReturnPanel.state == false &&
                        <motion.div
                            key={'titlePanel'}
                            variants={animationProps.text.scale}
                            initial={'hidden'}
                            animate={'visible'}
                            exit={'exit'}
                        >
                            <Box>
                                <Text textAlign={'center'} lineHeight={'1'}>{'Create image'}</Text>
                            </Box>
                        </motion.div>
                    }
                </AnimatePresence>
            </Box>
            <Box flex={1}>
            </Box>
        </HStack>
    )
}



const ImageCreatorLeftSideButtons = ({ themeColor, showHeaderReturnPanel, ideaBtnHandler, headerBackButtonHandler }) => {
    return (
        <HStack>
            <AnimatePresence mode='wait'>
                {
                    showHeaderReturnPanel.state == false &&
                    <motion.div
                        style={{ display: 'flex', flexDirection: 'row' }}
                        key={'imageCreatorLeftBtnsContainer'}
                        variants={animationProps.buttons.slideFromLeft}
                        initial={'hidden'}
                        animate={'visible'}
                        exit={'exit'}
                    >
                        <motion.div
                            key={'imageCreatorIdeaBtn'}
                            variants={animationProps.buttons.slideFromLeftChild}
                        >
                            <Tooltip label='Drawing ideas' hasArrow bg={`${themeColor}.500`}>
                                <IconButton icon={<HiOutlineLightBulb size='22px' />}
                                    colorScheme={themeColor}
                                    variant={'ghost'}
                                    onClick={ideaBtnHandler}
                                    size={'sm'}
                                />
                            </Tooltip>
                        </motion.div>

                    </motion.div>
                }
                {
                    showHeaderReturnPanel.state == true &&
                    <motion.div
                        key={'imageCreatorReturnContainer'}
                        variants={animationProps.buttons.slideFromLeft}
                        initial={'hidden'}
                        animate={'visible'}
                        exit={'exit'}
                    >
                        <motion.div
                            key={'imageCreatorReturnBtn'}
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