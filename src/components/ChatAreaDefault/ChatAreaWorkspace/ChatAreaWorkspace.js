
import { Stack, Box } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import HeaderWithButtons from '../ChatAreaHeader/HeaderWithButtons';
import PredefinedPromptsList from '../Topics/PredefinedPromptsList';
import ChatMessages from '../../Messages/Messages';


const ChatAreaWorkspace = ({ themeColor, currentChat, isBtnLoading, toggleShowTopics, clickToSelectItemFromList, togglePredefinedList, showPredefined, predefinedList }) => {
    return (
        <Stack
            height={'100%'}
            w={'full'}
            display={'flex'}
            flexDirection={'column'}
            overflow={'auto'}
            overflowX={'hidden'}
            as={motion.div}
            bg=''
            rowGap={'5px'}
            justifyContent={'space-between'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1, duration: 0.5 } }}
        >
            <Box bg='' zIndex={100}>
                <HeaderWithButtons themeColor={themeColor} toggleShowTopics={toggleShowTopics} togglePredefinedList={togglePredefinedList} showIconList={predefinedList !== null}
                />
            </Box>

            <Box height={'100%'} w='full' zIndex={10} overflow={'auto'}  >
                <AnimatePresence >

                    {
                        (predefinedList !== null && showPredefined === true) &&
                        <motion.section
                            key={1}
                            layoutScroll
                            initial={'ready'}
                            exit={'hidden'}
                            variants={variantsPredefinedItems}
                        >
                            <PredefinedPromptsList onClickHandler={clickToSelectItemFromList} themeColor={themeColor}
                                predefinedList={predefinedList}
                            />
                        </motion.section>
                    }
                    {
                        !showPredefined &&
                        currentChat && currentChat.length > 0 &&
                        <ChatMessages currentChat={currentChat} themeColor={themeColor} isBtnLoading={isBtnLoading} />
                    }
                </AnimatePresence>

            </Box>
        </Stack >
    );
};

export default ChatAreaWorkspace;


const variantsPredefinedItems = {
    ready: {
        opacity: 1
    },
    hidden: {
        opacity: 0,
        transition: {
            duration: 0.5
        }
    }
}
