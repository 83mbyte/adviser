import { Box, HStack, Text, Tooltip, IconButton } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { animationProps } from '@/src/lib/animationProps';

import { MdChevronLeft, } from 'react-icons/md';

const WorkspaceCardHeader = ({ themeColor, cardTitle, showHeaderReturnPanel, headerReturnButtonHandler, buttons }) => {

    return (
        <>
            <Box w='full' bg='#FAFAFA' display={'flex'} flexDirection={'column'} alignItems={'center'} >
                <HStack w='full' h='100%' px={2}>

                    <Box bg='' flex={1} >
                        <LeftButtons
                            themeColor={themeColor}
                            showHeaderReturnPanel={showHeaderReturnPanel}
                            headerReturnButtonHandler={headerReturnButtonHandler}
                            buttonsArray={buttons.left}
                        />
                    </Box >

                    <Box flex={3}  >
                        <AnimatePresence mode='wait'>
                            {
                                showHeaderReturnPanel.state == false &&
                                <motion.div
                                    key={'titlePanel_default'}
                                    variants={animationProps.text.scale}
                                    initial={'hidden'}
                                    animate={'visible'}
                                    exit={'exit'}
                                >
                                    <Box>
                                        <Text textAlign={'center'} lineHeight={'1'}>{cardTitle}</Text>
                                    </Box>
                                </motion.div>
                            }
                            {

                                showHeaderReturnPanel.state == true &&
                                <motion.div
                                    key={'titlePanel_return'}
                                    variants={animationProps.text.scale}
                                    initial={'hidden'}
                                    animate={'visible'}
                                    exit={'exit'}
                                >
                                    <Box>
                                        <Text textAlign={'center'} lineHeight={'1'}>{showHeaderReturnPanel.title ? `${showHeaderReturnPanel.title}` : ''}</Text>
                                    </Box>
                                </motion.div>
                            }
                        </AnimatePresence>
                    </Box>

                    <Box bg='' flex={1} >
                        <RightButtons
                            showButtons={showHeaderReturnPanel.state == false}
                            themeColor={themeColor}
                            buttonsArray={buttons.right}
                        />
                    </Box>
                </HStack >
            </Box>

        </>
    );
};

export default WorkspaceCardHeader;


const LeftButtons = ({ themeColor, showHeaderReturnPanel, headerReturnButtonHandler, buttonsArray }) => {
    return (
        <HStack>
            <AnimatePresence mode='wait'>
                {
                    showHeaderReturnPanel.state == false &&
                    <motion.div
                        style={{ display: 'flex', flexDirection: 'row' }}
                        key={'LeftBtnsContainer'}
                        variants={animationProps.buttons.slideFromLeft}
                        initial={'hidden'}
                        animate={'visible'}
                        exit={'exit'}
                    >

                        {(buttonsArray && buttonsArray.length > 0) &&
                            buttonsArray.map((item, index) => {
                                if (item.isVisible) {
                                    return (
                                        <motion.div
                                            key={item.key}
                                            variants={animationProps.buttons.slideFromLeftChild}
                                        >
                                            <Tooltip label={item.tooltipText} hasArrow bg={`${themeColor}.500`}>
                                                <IconButton
                                                    icon={item.icon}
                                                    colorScheme={themeColor}
                                                    variant={'ghost'}
                                                    onClick={() => {
                                                        item.callback();
                                                    }}
                                                    size={'sm'}
                                                />
                                            </Tooltip>
                                        </motion.div>
                                    )
                                }
                            })}

                    </motion.div>
                }
                {
                    showHeaderReturnPanel.state == true &&
                    <motion.div
                        key={'ReturnButtonContainer'}
                        variants={animationProps.buttons.slideFromLeft}
                        initial={'hidden'}
                        animate={'visible'}
                        exit={'exit'}
                    >
                        <motion.div
                            key={'ReturnButton'}
                            variants={animationProps.buttons.slideFromLeftChild}
                        >
                            <IconButton icon={<MdChevronLeft size={'28px'} />}
                                colorScheme={themeColor}
                                variant={'ghost'}
                                onClick={() => {
                                    headerReturnButtonHandler();
                                }}
                                size={'sm'}
                            />
                        </motion.div>
                    </motion.div>
                }
            </AnimatePresence>
        </HStack >
    )
}

const RightButtons = ({ themeColor, buttonsArray, showButtons }) => {
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
                            (buttonsArray && buttonsArray.length > 0) &&
                            buttonsArray.map((item, index) => {
                                if (item.isVisible) {
                                    return (
                                        <motion.div
                                            key={item.key}
                                            variants={animationProps.buttons.slideFromRight}
                                            initial={'hidden'}
                                            animate={'visible'}
                                            exit={'exit'}
                                        >
                                            <Tooltip label={item.tooltipText} hasArrow bg={`${themeColor}.500`}>
                                                <IconButton icon={item.icon}
                                                    colorScheme={themeColor}
                                                    variant={'ghost'}
                                                    onClick={() => {
                                                        item.callback();
                                                    }}
                                                    size={'sm'}
                                                />
                                            </Tooltip>
                                        </motion.div>
                                    )
                                }
                            })
                        }
                    </motion.div>
                }
            </AnimatePresence>
        </HStack>
    )
}