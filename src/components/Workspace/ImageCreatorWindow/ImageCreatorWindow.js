import { useEffect, useState, useRef } from 'react';
import { Box, Card, CardBody, VStack, Text } from '@chakra-ui/react';
import { animationProps } from "@/src/lib/animationProps";

import ImageCreatorFooter from './ImageCreatorFooter';
import { useUISettingsContext } from '@/src/context/UISettingsContext';
import { getReplyFromAssistant } from '@/src/lib/fetchingData';
import { AnimatePresence, motion } from 'framer-motion';

import ImageResult from './ImageResult';
import ImageCreatorHeader from './ImageCreatorHeader';
import IdeasList from './Ideas/IdeasList';

const ImageCreatorWindow = () => {
    // contexts
    const { themeColor } = useUISettingsContext().userThemeColor;

    // states
    const [isLoadingBtn, setIsLoadingBtn] = useState(false); //to show loading button
    const textAreaRef = useRef(null); //textarea 

    const [imgCreatorId, setImgCreatorId] = useState(null);
    const [imgSize, setImgSize] = useState('256'); //default Img size
    const [imgHistory, setImgHistory] = useState(null);

    const [showHeaderReturnPanel, setShowHeaderReturnPanel] = useState({ state: false, title: '' });

    const [showIdeas, setShowIdeas] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState(null);


    // 
    // handlers //
    // 
    const submitButtonHandler = async () => {
        setIsLoadingBtn(true);
        try {

            let resp = await getReplyFromAssistant({ size: imgSize, request: textAreaRef.current.value }, 'image');
            if (resp) {
                console.log(resp.content);

                let imgRequestAndReplyItem = {
                    user: { content: textAreaRef.current.value },
                    assistant: { content: resp.content }
                }


                if (imgHistory && imgHistory[imgCreatorId]) {
                    console.log('history with ID')
                    setImgHistory({
                        ...imgHistory,
                        [imgCreatorId]: [
                            ...imgHistory[imgCreatorId],
                            imgRequestAndReplyItem
                        ]
                    })
                } else {
                    console.log('history  NO ID')
                    setImgHistory({
                        [imgCreatorId]: [imgRequestAndReplyItem]
                    })
                }
            }
        } catch (error) {
            console.error(error)

        } finally {
            textAreaRef.current.value = '';
            setIsLoadingBtn(false);
        }
    }

    const closeBackToChat = () => {
        // hide open screens
        setShowHeaderReturnPanel({
            state: false,
            title: ''
        });
        setShowIdeas(false);

    }

    const headerReturnPanelToggler = (titleText) => {
        setShowHeaderReturnPanel({
            state: !showHeaderReturnPanel.state,
            title: titleText ? titleText : ''
        })
    }

    const headerBackButtonHandler = () => {
        closeBackToChat()
    }
    const ideaBtnHandler = () => {
        headerReturnPanelToggler('Drawing ideas')
        setShowIdeas(true);
    }

    const selectIdeaHandler = (data) => {
        setSelectedIdea(data);
    }

    // initialize image creator
    const openImageCreator = () => {
        let generatedId = Date.now();
        if (generatedId) {
            console.log('creatorID: ', generatedId)
            setImgCreatorId(generatedId);
        } else {
            alert(`something wrong.. a new image can't be created`);
        }
    }

    useEffect(() => {
        openImageCreator();
    }, [])
    return (
        <>

            {/* Image Creator Window */}
            {
                imgCreatorId &&
                <Card h={'99%'} maxHeight={'100%'} bg={''} borderTopRadius={'10px'} borderBottomRadius={0} overflow={'hidden'}>
                    <CardBody m={0} p={['2', '3']} maxH={'100%'} overflow={'hidden'}
                    >
                        <VStack spacing={0} px={'0'} bg={'#FAFAFA'} h='100%' maxHeight={'100%'} border={'1px dashed #DEDEDE'} borderTopRadius={'10px'}
                            willChange={'height'}
                            backgroundImage={'url("imageCreatorBg.svg")'}
                            backgroundRepeat={'no-repeat'}
                            backgroundSize={'25%'}
                            backgroundPosition={'center'}
                        >
                            {/* window header */}
                            <Box bg={''}
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
                            >

                                <ImageCreatorHeader
                                    themeColor={themeColor}
                                    showHeaderReturnPanel={showHeaderReturnPanel}
                                    ideaBtnHandler={ideaBtnHandler}
                                    headerBackButtonHandler={headerBackButtonHandler}
                                />
                            </Box>

                            {/* render images */}
                            <Box w={'full'}
                                bg='transparent'
                                display={'flex'}
                                flexDirection={'column'}
                                p={2}
                                height={'100%'}
                                maxHeight={'100%'}
                                overflowX={'hidden'}
                                overflowY={'scroll'}
                            >

                                {/* dev */}
                                {/* <ImageResult
                                    currentChat={imgHistory ? imgHistory[imgCreatorId] : []}
                                    themeColor={themeColor}
                                    isLoadingBtn={isLoadingBtn} /> */}
                                {/* dev */}



                                <AnimatePresence mode='wait'>
                                    {(!themeColor && showIdeas !== true) &&
                                        <motion.div
                                            key={'noint'}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1, transition: { delay: 1.5, duration: 0.8 } }}
                                            exit={{ opacity: 0, transition: { duration: 0.1, delay: 0 } }}
                                            style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: '1px 1px', overflow: 'auto' }}
                                        >
                                            <Text textAlign={'center'}>No internet connection. The application will operate in offline mode until it is able to successfully connect to the backend. Please try again later. </Text>
                                        </motion.div>
                                    }
                                    {
                                        showIdeas == true &&
                                        <motion.div
                                            key={'showIdeas'}
                                            variants={animationProps.chatWindowScreens.slideFromLeft}
                                            initial={'hidden'}
                                            animate={'show'}
                                            exit={'exit'}
                                            style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', padding: '0px 1px', overflow: 'auto' }}
                                        >
                                            <IdeasList themeColor={themeColor} selectIdeaHandler={selectIdeaHandler} />
                                        </motion.div>
                                    }
                                    {
                                        showIdeas === false &&
                                        <motion.div
                                            key={'imageResult'}
                                            variants={animationProps.chatWindowScreens.opacity}
                                            initial={'hidden'}
                                            animate={'show'}
                                            exit={'exit'}
                                            style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', padding: '0px 1px', overflow: 'auto' }}
                                        >

                                            <ImageResult
                                                currentChat={imgHistory ? imgHistory[imgCreatorId] : []}
                                                themeColor={themeColor}
                                                isLoadingBtn={isLoadingBtn} />

                                        </motion.div>
                                    }
                                </AnimatePresence>
                            </Box>
                        </VStack>
                    </CardBody>
                    <ImageCreatorFooter
                        themeColor={themeColor}
                        isLoadingBtn={isLoadingBtn}
                        submitButtonHandler={submitButtonHandler}
                        ref={textAreaRef}
                        imgSize={imgSize}
                        setImgSize={setImgSize}
                        selectedIdea={selectedIdea}
                    />
                </Card>
            }

        </>
    );
};

export default ImageCreatorWindow;