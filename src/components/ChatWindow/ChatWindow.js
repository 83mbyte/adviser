'use client'
import { Box, Card, CardBody, VStack } from "@chakra-ui/react";

import SlideFromTopContainer from "../AnimatedContainers/SlideFromTopContainer";
import { useUISettingsContext } from "@/src/context/UISettingsContext";

import { useState } from "react";

import { usePredefinedDataContext } from "@/src/context/PredefinedDataContextProvider";
import { AnimatePresence, motion } from "framer-motion";

import SelectTopics from "./TopicsAndQuestions/SelectTopics";
import ChatWindowHeader from "./ChatWindowHeader";
import ChatWindowFooter from "./ChatWindowFooter";
import SelectQuestions from "./TopicsAndQuestions/SelectQuestions";
import ChatSettings from "./ChatSettings/ChatSettings";
import { RiTreasureMapLine } from "react-icons/ri";

const ChatWindow = () => {
    const UISettingsContext = useUISettingsContext();
    const { themeColor, setThemeColor } = UISettingsContext.userThemeColor;

    const predefinedData = usePredefinedDataContext();

    // states
    const [showHeaderReturnPanel, setShowHeaderReturnPanel] = useState({ state: false, title: '' });

    const [showFooter, setShowFooter] = useState(true);

    //show topics and select topic
    const [showTopics, setShowTopics] = useState(false);
    const [currentTopic, setCurrentTopic] = useState(null);

    //show topic questions and select question
    const [showTopicQuestions, setShowTopicQuestions] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    //show chat settings
    const [showChatSettings, setShowChatSettings] = useState(false);

    //handlers
    const headerReturnPanelToggler = (titleText) => {
        setShowHeaderReturnPanel(!showHeaderReturnPanel)
        setShowHeaderReturnPanel({
            state: !showHeaderReturnPanel.state,
            title: titleText ? titleText : ''
        })
    }
    const headerBackButtonHandler = () => {
        setShowHeaderReturnPanel({
            state: false,
            title: ''
        });
        setShowTopics(false);
        setShowTopicQuestions(false);
        setShowChatSettings(false);
        setShowFooter(true);
    }

    const topicsButtonHandler = () => {
        headerReturnPanelToggler(`Topics variants`);
        setShowTopics(true);
        setShowFooter(false);
    }

    const promptsButtonHandler = () => {
        headerReturnPanelToggler('Prompts list');
        setShowTopicQuestions(true);
    }

    const settingsButtonHandler = () => {
        headerReturnPanelToggler('Settings');
        setShowChatSettings(RiTreasureMapLine)
    }

    const selectTopicHandler = (topic) => {
        if (topic) {
            setCurrentTopic(topic);
            headerReturnPanelToggler();
            setShowTopics(false);
            setShowTopicQuestions(false);
            setSelectedQuestion(null);
            setShowFooter(true);
        }
    }

    const selectQuestionHandler = (data) => {
        setSelectedQuestion(data);
        if (showFooter == false) {
            setShowFooter(true);
        }
    }


    const animationSlide = {
        hidden: {
            x: '-300px',
            opacity: 0
        },
        show: {
            x: 0,
            opacity: 1
        },
        exit: {
            x: '300px',
            opacity: 0,
            transition: {
                duration: 0.4
            }
        }
    }

    const transitionVar = {
        duration: 0.8
    }


    return (
        <SlideFromTopContainer height={'100%'} delay={2}>
            <>
                {/* Chat Window  */}
                <Card h={'99%'} maxHeight={'100%'} bg={''} borderTopRadius={'10px'} borderBottomRadius={0} overflow={'hidden'}>
                    <CardBody m={0} p={['2', '3']} maxH={'100%'} overflow={'hidden'}>
                        <VStack spacing={0} px={'0'} bg={'#FAFAFA'} h='100%' maxHeight={'100%'} border={'1px dashed #DEDEDE'} borderTopRadius={'10px'} >
                            <Box
                                bg={''}
                                // bg={'#FAFAFA'}
                                w={'full'}
                                p={0}
                                borderTopRadius={'10px'}
                                borderBottomWidth={'1px'}
                                borderBottomColor={'gray.200'}
                                overflowX={'hidden'}
                                height={'55px'}
                                minH={'43px'}
                                display={'flex'}
                                flexDirection={'row'}
                            // alignItems={'center'}
                            >
                                <ChatWindowHeader
                                    key={'chatHeader'}
                                    themeColor={themeColor}
                                    currentTopic={currentTopic}
                                    showHeaderReturnPanel={showHeaderReturnPanel}
                                    topicsButtonHandler={topicsButtonHandler}
                                    headerBackButtonHandler={headerBackButtonHandler}
                                    promptsButtonHandler={promptsButtonHandler}
                                    settingsButtonHandler={settingsButtonHandler}
                                />
                            </Box>
                            <Box
                                w={'full'}
                                bg=''
                                display={'flex'}
                                flexDirection={'column'}
                                p={2}
                                height={'800%'}
                                maxHeight={'100%'}
                                overflowX={'hidden'}
                                overflowY={'scroll'}
                            >
                                <AnimatePresence mode='wait'>

                                    {/* Select a topic */}
                                    {
                                        showTopics &&
                                        <motion.div
                                            key={'sectionTopics'}
                                            variants={animationSlide}
                                            initial={'hidden'}
                                            animate={'show'}
                                            exit={'exit'}
                                            transition={transitionVar}
                                            h='100%'
                                            bg=''
                                        >
                                            <SelectTopics themeColor={themeColor}
                                                predefinedData={predefinedData ? predefinedData : []}
                                                selectTopicHandler={selectTopicHandler} />
                                        </motion.div>
                                    }

                                    {/* predefined questions of a selected topic */}
                                    {
                                        (currentTopic && currentTopic !== undefined && currentTopic !== 'Blank' && showTopics == false && showTopicQuestions == true) &&
                                        <motion.section
                                            key={'sectionQuestions'}
                                            variants={animationSlide}
                                            initial={'hidden'}
                                            animate={'show'}
                                            exit={'exit'}
                                            transition={transitionVar}
                                        >
                                            <SelectQuestions predefinedData={predefinedData ? predefinedData.prompts[currentTopic] : null} themeColor={themeColor} selectQuestionHandler={selectQuestionHandler} />
                                        </motion.section>
                                    }

                                    {/* chat settings  */}
                                    {showChatSettings &&
                                        <motion.section
                                            key={'sectionSettings'}
                                            variants={animationSlide}
                                            initial={'hidden'}
                                            animate={'show'}
                                            exit={'exit'}
                                            transition={transitionVar}
                                        >
                                            <ChatSettings themeColor={themeColor} />
                                        </motion.section>
                                    }
                                </AnimatePresence>
                            </Box>
                        </VStack>
                    </CardBody>

                    {/* Card footer */}
                    <AnimatePresence mode="wait">
                        {
                            showFooter &&
                            <ChatWindowFooter themeColor={themeColor} selectedQuestion={selectedQuestion} />
                        }
                    </AnimatePresence>
                </Card>
            </>
        </SlideFromTopContainer>
    )
};

export default ChatWindow;
