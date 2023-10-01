import React from 'react';
import { Box, Card, CardBody } from '@chakra-ui/react';

import { motion, AnimatePresence } from 'framer-motion';

import { useUISettingsContext } from '@/src/context/UISettingsContext';

import OpacityBox from '../OpacityBox/OpacityBox';
import TopicsGrid from './TopicsGrid';
import ChatAreaFooter from './ChatAreaFooter/ChatAreaFooter';
import ChatAreaTopicSelected from './ChatAreaTopicSelected/ChatAreaTopicSelected';


const ChatAreaDefault = ({ isBtnLoading, onClickBtn, setChatId, currentChat }) => {
    const UISettingsContext = useUISettingsContext();

    const { themeColor, setThemeColor } = UISettingsContext.userThemeColor;

    const [isVisible, setIsVisible] = React.useState(false);
    const [showTopics, setShowTopics] = React.useState(true);
    const [selectedTopic, setSelectedTopic] = React.useState(null);

    const [showPredefined, setShowPredefined] = React.useState(true);
    const [predefinedPrompt, setPredefinedPrompt] = React.useState('');

    const [showFooter, setShowFooter] = React.useState(false);

    const toggleShowTopics = (data) => {
        setShowTopics(!showTopics);
        setShowFooter(!showFooter);
        setPredefinedPrompt('');
        setShowPredefined(true);
    }

    const clickToSelectItemFromList = (data) => {

        let generatedId = Date.now();
        if (generatedId) {
            setChatId(generatedId);
            console.log('ID: ', generatedId);
            setPredefinedPrompt(data);
        }
    }

    const togglePredefinedList = () => {
        setShowPredefined(!showPredefined);
    }

    React.useEffect(() => {
        setIsVisible(true);
        return () => setIsVisible(false);
    }, []);

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
                            justifyContent={'flex-end'}
                        >

                            <Box bg='' overflow={'auto'} pb={2} as={'section'} h={!showTopics ? '100%' : ''} position={'relative'} >
                                {
                                    showTopics &&
                                    <TopicsGrid
                                        toggleShowTopics={toggleShowTopics}
                                        setSelectedTopic={setSelectedTopic}
                                    />
                                }
                                {
                                    !showTopics &&
                                    // 'dddd'
                                    <ChatAreaTopicSelected
                                        themeColor={themeColor}
                                        currentChat={currentChat}
                                        isBtnLoading={isBtnLoading} toggleShowTopics={toggleShowTopics}
                                        selectedTopic={selectedTopic}
                                        clickToSelectItemFromList={clickToSelectItemFromList}
                                        showPredefined={showPredefined}
                                        togglePredefinedList={togglePredefinedList}
                                    />

                                }
                            </Box>
                        </Box>
                    </CardBody>


                    {/*  card footer */}
                    <AnimatePresence>
                        {
                            showFooter &&
                            <MotionFooter
                                variants={footerAnimation}
                                initial={'hidden'}
                                exit={'hidden'}
                                //predefinedPrompt={null}
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
                                //setShowPredefined={null}
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
    visible: {
        opacity: 1,
        height: '115px',
        transition: {
            delay: 0.1
        }
    },
    hidden: {
        height: 0,
        opacity: 0,
        transition: {
            duration: 0.1
        }
    }
}