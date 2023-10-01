
import { Stack, Box } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import HeaderWithButtons from './HeaderWithButtons';
import PredefinedPromptsList from '../PredefinedPromptsList';
import ChatMessages from '../../ChatArea/Messages/Messages';


const ChatAreaTopicSelected = ({ themeColor, currentChat, isBtnLoading, toggleShowTopics, selectedTopic, clickToSelectItemFromList, togglePredefinedList, showPredefined }) => {
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
            //justifyContent={'space-between'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1, duration: 0.5 } }}
        >
            <Box>
                <HeaderWithButtons themeColor={themeColor} toggleShowTopics={toggleShowTopics} selectedTopic={selectedTopic} togglePredefinedList={togglePredefinedList} />
            </Box>
            <Box marginTop={'37px'} bg='' w='full'>
                <AnimatePresence >

                    {
                        showPredefined &&
                        <motion.section
                            key={1}
                            initial={'ready'}
                            exit={'hidden'}
                            variants={variantsPredefinedItems}
                        >
                            <PredefinedPromptsList onClickHandler={clickToSelectItemFromList} themeColor={themeColor}
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
        </Stack>
    );
};

export default ChatAreaTopicSelected;


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