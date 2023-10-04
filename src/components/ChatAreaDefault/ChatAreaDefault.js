import React from 'react';
import { Box, Card, CardBody, useBreakpointValue } from '@chakra-ui/react';

import { motion, AnimatePresence } from 'framer-motion';

import { useUISettingsContext } from '@/src/context/UISettingsContext';

import OpacityBox from '../OpacityBox/OpacityBox';
import TopicsGrid from './Topics/TopicsGrid';
import ChatAreaFooter from './ChatAreaFooter/ChatAreaFooter';
import ChatAreaWorkspace from './ChatAreaWorkspace/ChatAreaWorkspace';
import { usePredefinedDataContext } from '@/src/context/PredefinedDataContextProvider';


const ChatAreaDefault = ({ isBtnLoading, onClickBtn, currentChat, selectedTopic, setSelectedTopic, showTopics, setShowTopics }) => {

    const predefinedData = usePredefinedDataContext();
    const UISettingsContext = useUISettingsContext();
    const { themeColor, setThemeColor } = UISettingsContext.userThemeColor;

    const [isVisible, setIsVisible] = React.useState(false);
    const [showPredefined, setShowPredefined] = React.useState(false);
    const [predefinedPrompt, setPredefinedPrompt] = React.useState('');

    const [showFooter, setShowFooter] = React.useState(false);

    const toggleShowTopics = () => {

        setShowTopics(!showTopics);
        setPredefinedPrompt('');
        setShowPredefined(true);
    }

    const clickToSelectItemFromList = (data) => {
        setPredefinedPrompt(data);
    }

    const togglePredefinedList = () => {
        setShowPredefined(!showPredefined);
    }

    const footerHeightVariant = useBreakpointValue(
        {
            base: '115px',
            md: '80px'
        }
    )

    React.useEffect(() => {
        setIsVisible(true);
        if (currentChat && currentChat[0]?.subject) {

            setSelectedTopic(currentChat[0].subject)
        }
        return () => setIsVisible(false);
    }, []);

    React.useEffect(() => {
        if (showTopics !== true) {
            setShowFooter(true)
        } else {
            setShowFooter(false)
        }
    }, [showTopics])

    return (
        <OpacityBox isVisible={isVisible}>
            <Box
                bg=''
                display={'flex'}
                flexDirection={'column'}
                height={'100%'}
                maxHeight={'100%'}
                width={['full', 'md', 'lg', '3xl']}
                alignItems={'center'}
                marging={'0 auto'}
                justifyContent={'center'}
            >
                <Card w={'full'} h={'100%'} bg={''} borderTopRadius={'10px'} borderBottomRadius={0} >

                    <CardBody bg='' display={'block'} flexDirection={'column'} overflow={'hidden'} m={0} p={['2', '3']} >

                        <Box
                            border={'1px dashed #DEDEDE'}
                            borderRadius={'10px'}
                            w={'full'}
                            display={'flex'}
                            flexDirection={'column'}
                            p={2}
                            bg={'#FAFAFA'}
                            h={'100%'}
                            overflow={'auto'}
                            position='relative'
                            justifyContent={showTopics === true ? 'center' : 'flex-end'}
                        >

                            <Box bg='' overflow={'auto'} pb={2} as={'section'} h={!showTopics ? '100%' : ''} position={'relative'} >
                                {
                                    showTopics &&
                                    <TopicsGrid
                                        toggleShowTopics={toggleShowTopics}
                                        setSelectedTopic={setSelectedTopic}
                                        predefinedData={predefinedData ? predefinedData.prompts : null}
                                    />
                                }
                                {
                                    !showTopics &&
                                    <ChatAreaWorkspace
                                        themeColor={themeColor}
                                        currentChat={currentChat}
                                        isBtnLoading={isBtnLoading}
                                        toggleShowTopics={toggleShowTopics}
                                        clickToSelectItemFromList={clickToSelectItemFromList}
                                        showPredefined={showPredefined}
                                        togglePredefinedList={togglePredefinedList}
                                        predefinedList={selectedTopic && predefinedData.prompts ? predefinedData.prompts[selectedTopic] : null}
                                    />

                                }
                            </Box>
                        </Box>
                    </CardBody>


                    {/*  ChatArea footer (CardFooter) */}

                    <AnimatePresence>
                        {
                            (showFooter || (showFooter && currentChat.length > 0)) &&
                            <MotionFooter
                                variants={footerAnimation}
                                initial={'hidden'}
                                exit={'hidden'}
                                layout
                                predefinedPrompt={predefinedPrompt}
                                transition={{
                                    duration: 0.5,
                                    delay: 0,
                                    type: 'spring',
                                    bounce: 0.25
                                }}
                                animate={'visible'}
                                themeColor={themeColor}
                                isBtnLoading={isBtnLoading}
                                onClickBtn={onClickBtn}
                                custom={footerHeightVariant}
                                setShowPredefined={setShowPredefined}
                            />
                        }
                    </AnimatePresence>


                </Card>
            </Box>
        </OpacityBox>
    );
};

export default ChatAreaDefault;



const MotionFooter = motion(ChatAreaFooter);

const footerAnimation = {
    visible: custom => ({
        opacity: 1,

        height: custom,
        transition: {
            delay: 0.1
        }
    }),
    hidden: {
        height: 0,
        opacity: 0,
        transition: {
            duration: 0.1
        }
    }
}