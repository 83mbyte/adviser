import { useEffect, useState, useRef } from 'react';
import { Box, Card, CardBody, VStack, Text, Highlight, useBreakpointValue } from '@chakra-ui/react';
import { animationProps } from "@/src/lib/animationProps";

import ImageCreatorFooter from './ImageCreatorFooter';
import { useSettingsContext } from '@/src/context/SettingsContext';
import { getReplyFromAssistant } from '@/src/lib/fetchingData';
import { AnimatePresence, motion } from 'framer-motion';

import ImageResult from './ImageResult';
import ImageCreatorHeader from './ImageCreatorHeader';
import IdeasList from './Ideas/IdeasList';
import LimitReachedNotice from './Notices/LimitReachedNotice';
import StoreImageNotice from './Notices/StoreImageNotice';
// import browserCheck from '@/src/lib/browserCheck';   // uncomment to check broser compatibilities
// import BrowserNotice from './Notices/BrowserNotice'; // uncomment to check broser compatibilities

import { dbAPI } from '@/src/lib/dbAPI';
import { useAuthContext } from '@/src/context/AuthContextProvider';



const ImageCreatorWindow = () => {

    const settingsContext = useSettingsContext();

    const variant = useBreakpointValue(
        {
            base: 'IconButton',
            sm: 'Button',
        })

    const user = useAuthContext();

    const { themeColor } = settingsContext.userThemeColor;

    const { subscription, setSubscription } = settingsContext.userSubscription;
    const trialCountOnServer = subscription.imgTrial;
    const subscriptionType = subscription.type;
    const userWorkspaceType = settingsContext.userWorkspaceType;


    // states

    const [trialImagesCount, setTrialImagesCount] = useState(trialCountOnServer);
    const limitImgCount = process.env.NEXT_PUBLIC_TRIAL_LIMIT;

    const [isLoadingBtn, setIsLoadingBtn] = useState(false); //to show loading button
    const textAreaRef = useRef(null); //textarea 
    const [noticeAboutImages, setNoticeAboutImages] = useState(true);
    const [noticeAboutBrowser, setNoticeAboutBrowser] = useState({ status: false, type: null });

    const [imgCreatorId, setImgCreatorId] = useState(null);
    const [imgSize, setImgSize] = useState('A'); //default Img size
    const [imgStyle, setImgStyle] = useState('vivid'); //default Img size
    const [imgQuality, setImgQuality] = useState('standard'); //default Img size
    const [imgHistory, setImgHistory] = useState({});

    const [showHeaderReturnPanel, setShowHeaderReturnPanel] = useState({ state: false, title: '' });
    const [showHistoryScreen, setShowHistoryScreen] = useState(false);

    const [showIdeas, setShowIdeas] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState(null);


    // 
    // handlers //
    // 

    const gotoCheckout = () => {
        userWorkspaceType.setWorkspaceType('subscription');
    }
    const submitButtonHandler = async () => {
        setIsLoadingBtn(true);
        closeBackToChat();
        try {

            let resp = await getReplyFromAssistant({ size: imgSize, request: textAreaRef.current.value, quality: imgQuality, style: imgStyle }, 'image');
            if (resp) {


                let imgRequestAndReplyItem = {
                    user: { content: textAreaRef.current.value },
                    assistant: { content: resp.content }
                }


                if (imgHistory && imgHistory[imgCreatorId]) {
                    setImgHistory({
                        ...imgHistory,
                        [imgCreatorId]: [
                            ...imgHistory[imgCreatorId],
                            imgRequestAndReplyItem
                        ]
                    });

                } else {

                    setImgHistory({
                        [imgCreatorId]: [imgRequestAndReplyItem]
                    });
                }
                if (subscriptionType == 'Trial') {
                    let newValueTrialImagesCount = trialImagesCount + 1;
                    setTrialImagesCount(newValueTrialImagesCount);
                    let dataToUpload = {
                        ...subscription,
                        imgTrial: newValueTrialImagesCount
                    }

                    setSubscription({ ...subscription, imgTrial: newValueTrialImagesCount })

                    try {

                        await dbAPI.updateUserData(user.uid, 'plan', dataToUpload);
                    } catch (error) {
                        console.error(error)
                    }
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
        setShowHistoryScreen(false);
    }

    const headerReturnPanelToggler = (titleText) => {
        setShowHeaderReturnPanel({
            state: !showHeaderReturnPanel.state,
            title: titleText ? titleText : ''
        })
    }

    const headerBackButtonHandler = () => {
        closeBackToChat();
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
            setImgCreatorId(generatedId);
            // let checkResult = browserCheck();    //check browser for image compatibilities
            // if (checkResult.notice) {
            //     setNoticeAboutBrowser(checkResult.notice);
            // }
        } else {
            alert(`something wrong.. a new image can't be created`);
        }
    }

    useEffect(() => {
        openImageCreator();
    }, []);


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
                                w={'full'}
                                p={0}
                                borderTopRadius={'10px'}
                                borderBottomWidth={'1px'}
                                borderBottomColor={'gray.200'}
                                overflowX={'hidden'}
                                height={'55px'}
                                minH={'52px'}
                                display={'flex'}
                                flexDirection={'row'}
                                zIndex={1003}
                            >
                                <ImageCreatorHeader
                                    themeColor={themeColor}
                                    showHeaderReturnPanel={showHeaderReturnPanel}
                                    ideaBtnHandler={ideaBtnHandler}
                                    headerBackButtonHandler={headerBackButtonHandler}
                                />
                            </Box>

                            {/* issues notifications start*/}
                            <AnimatePresence>
                                {
                                    (subscriptionType == 'Trial' && trialImagesCount >= limitImgCount) &&
                                    <MotionLimitReachedNotice
                                        variant={variant}
                                        themeColor={themeColor}
                                        gotoCheckout={gotoCheckout}
                                        key={'limitImgCount'}
                                        initial={{ y: -40, opacity: 0 }}
                                        animate={{
                                            y: 0,
                                            opacity: 1,
                                            transition: {
                                                opacity: { delay: 0.8, duration: 0.5 },
                                                y: { delay: 0.8, duration: 0.5 }
                                            }
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -40,
                                            transition: {
                                                opacity: { duration: 0.5 },
                                                y: { delay: 0.1, duration: 0.5 }
                                            }
                                        }} />
                                }

                                {
                                    ((noticeAboutImages && subscriptionType != 'Trial') || (noticeAboutImages && subscriptionType == 'Trial' && trialImagesCount < limitImgCount)) &&
                                    <MotionStoreImageNotice
                                        themeColor={themeColor}
                                        setNoticeAboutImages={setNoticeAboutImages}
                                        key={'ttlImagesNotice'}
                                        initial={{ y: -40, opacity: 0 }}
                                        animate={{
                                            y: 0,
                                            opacity: 1,
                                            transition: {
                                                opacity: { delay: 0.8, duration: 0.5 },
                                                y: { delay: 0.8, duration: 0.5 }
                                            }
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -40,
                                            transition: {
                                                opacity: { duration: 0.5 },
                                                y: { delay: 0.1, duration: 0.5 }
                                            }
                                        }}
                                    />

                                }
                                {
                                    ((noticeAboutBrowser.status && subscriptionType != 'Trial') || (noticeAboutBrowser.status && subscriptionType == 'Trial' && trialImagesCount < limitImgCount)) &&
                                    <MotionBrowserNotice
                                        themeColor={themeColor}
                                        type={noticeAboutBrowser.type}
                                        setNoticeAboutBrowser={setNoticeAboutBrowser}
                                        key={'outdatedBrowser'}
                                        layout
                                        initial={{ y: -40, opacity: 0 }}
                                        animate={{
                                            y: 0,
                                            opacity: 1,
                                            transition: {
                                                opacity: { delay: 2, duration: 0.5 },
                                                y: { delay: 2, duration: 0.5 }
                                            }
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -40,
                                            transition: {
                                                opacity: { duration: 0.5 },
                                                y: { delay: 0.1, duration: 0.5 }
                                            }
                                        }}
                                    />
                                }

                            </AnimatePresence>
                            {/* issues notifications start*/}

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

                                <AnimatePresence mode='wait'>
                                    {(!themeColor && showIdeas !== true) &&
                                        <motion.div
                                            key={'noint'}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1, transition: { delay: 1.5, duration: 0.8 } }}
                                            exit={{ opacity: 0, transition: { duration: 0.1, delay: 0 } }}
                                            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '1px 1px', overflow: 'auto', justifyContent: 'flex-end' }}
                                        >
                                            <Text textAlign={'center'}>No internet connection. The application will operate in offline mode until it is able to successfully connect to the backend. <Highlight query={'refresh the page'} styles={{ px: '0', py: '0', rounded: 'sm', fontWeight: 'bold' }}>Please refresh the page or try again later.</Highlight> </Text>
                                        </motion.div>
                                    }
                                    {
                                        showIdeas === true &&
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
                                        (showIdeas === false && showHistoryScreen === false) &&
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
                    {
                        themeColor &&
                        <ImageCreatorFooter
                            themeColor={themeColor}
                            disabledForm={subscriptionType == 'Trial' && trialImagesCount >= limitImgCount}
                            isLoadingBtn={isLoadingBtn}
                            submitButtonHandler={submitButtonHandler}
                            ref={textAreaRef}
                            imgSize={imgSize}
                            setImgSize={setImgSize}
                            imgStyle={imgStyle}
                            setImgStyle={setImgStyle}
                            imgQuality={imgQuality}
                            setImgQuality={setImgQuality}
                            selectedIdea={selectedIdea}
                        />
                    }
                </Card>
            }

        </>
    );
};

export default ImageCreatorWindow;

const MotionLimitReachedNotice = motion(LimitReachedNotice, { forwardMotionProps: true });
const MotionStoreImageNotice = motion(StoreImageNotice, { forwardMotionProps: true });
const MotionBrowserNotice = motion(BrowserNotice, { forwardMotionProps: true });