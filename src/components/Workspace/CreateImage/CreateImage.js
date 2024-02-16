import { useAuthContext } from "@/src/context/AuthContextProvider";
import { useSettingsContext } from "@/src/context/SettingsContext";
import { useToast } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

import { animationProps } from "@/src/lib/animationProps";


import { HiOutlineLightBulb } from "react-icons/hi";
import WorkspaceCard from "../WorkspaceComponents/WorkspaceCard";
import IdeasList from "./Ideas/IdeasList";
import ResultContentImages from "../WorkspaceComponents/WorkspaceResultsToShow/ResultContentImages";
import { getReplyFromAssistant } from "@/src/lib/fetchingData";
import { dbAPI } from "@/src/lib/dbAPI";

const CreateImage = ({ showNoStoreImagesIssue, setShowNoStoreImagesIssue }) => {


    const inputFormRef = useRef(null);
    const toast = useToast();
    const user = useAuthContext();

    const settingsContext = useSettingsContext();
    const { themeColor } = settingsContext.userThemeColor;
    const { subscription, setSubscription } = settingsContext.userSubscription;
    const subscriptionType = subscription.type;

    const { imageSettings } = settingsContext.imageSettings;


    //states

    const [showHeaderReturnPanel, setShowHeaderReturnPanel] = useState({ state: false, title: '' });  //return panel state

    const [promptToRepeat, setPromptToRepeat] = useState(null);
    const [showImages, setShowImages] = useState(true);
    const [historyId, setHistoryId] = useState(null);  //id for an open window

    const [imgHistory, setImgHistory] = useState({});

    const { trialOffers, setTrialOffers } = settingsContext.trialOffers;

    const [showIdeas, setShowIdeas] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState(null);

    const [showFooter, setShowFooter] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    //handlers
    const closeAll = () => {
        // headerReturnPanelToggler();
        if (showIdeas == true) {
            setShowIdeas(false);
        }
        if (showHeaderReturnPanel.state) {
            headerReturnPanelToggler();
        }
        if (showFooter == false) {
            setShowFooter(true);
        }
        setShowImages(true);

    }
    const ideaBtnHandler = (panelTitleText) => {
        headerReturnPanelToggler(panelTitleText);
        setShowImages(false);
        setShowFooter(false);
        setShowIdeas(true);
    }

    const headerReturnPanelToggler = (titleText) => {
        setShowHeaderReturnPanel({
            state: !showHeaderReturnPanel.state,
            title: titleText ? titleText : ''
        })
    }
    const headerReturnButtonHandler = () => {
        //return button in the header panel.. 
        closeAll();
        setShowFooter(true);
        // if (chatsHistory) {
        //     setShowChatMessages(true)
        // }
    }

    const selectIdeaHandler = (data) => {
        if (showFooter == false) {
            setShowFooter(true);
        }
        setSelectedIdea(data);
    }

    //card header buttons
    const headerLeftButtons = [
        {
            key: 'ImageIdeasButton',
            tooltipText: 'Ideas',
            icon: <HiOutlineLightBulb size='22px' />,
            callback: () => ideaBtnHandler('Drawing ideas'),
            isVisible: true,
        },
    ];

    // const headerRightButtons = null;


    const submitData = async (data) => {
        setIsLoading(true);
        closeAll();

        try {

            // let resp = { content: 'image_source_must_be_here' }
            let resp = await getReplyFromAssistant({ size: imageSettings.size, request: data.value, quality: imageSettings.quality, style: imageSettings.style }, 'image');

            if (resp) {

                let imgRequestAndReplyItem = {
                    user: { content: data.value },
                    assistant: { content: resp.content }
                }

                if (imgHistory && imgHistory[historyId]) {
                    setImgHistory({
                        ...imgHistory,
                        [historyId]: [
                            ...imgHistory[historyId],
                            imgRequestAndReplyItem
                        ]
                    });

                } else {

                    setImgHistory({
                        [historyId]: [imgRequestAndReplyItem]
                    });

                }
                if (subscriptionType == 'Trial') {

                    let newValueTrialImagesCount = trialOffers.images + 1;

                    setTrialOffers({
                        ...trialOffers,
                        images: newValueTrialImagesCount
                    });

                    let dataToUpload = {
                        ...subscription,
                        trialOffers: {
                            ...subscription.trialOffers,
                            images: newValueTrialImagesCount
                        }
                    }

                    setSubscription({
                        ...subscription,
                        trialOffers: {
                            ...subscription.trialOffers,
                            images: newValueTrialImagesCount
                        }
                    });

                    await dbAPI.updateUserData(user.uid, 'plan', dataToUpload);
                }
            }

        } catch (error) {
            console.error(error);
            toast({
                position: 'top-right',
                title: `Error.. the request can not be fulfilled`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                containerStyle: {
                    maxWidth: '100%',
                    marginTop: '100px'
                },
            });

        } finally {
            setIsLoading(false);
            inputFormRef.current.value = '';
            setSelectedIdea(null);
        }
    }


    const generateHistoryId = () => {
        let generatedId = Date.now();
        if (generatedId) {
            setHistoryId(generatedId);
        } else {
            alert(`something wrong.. please refresh the page.`);
        }
    }

    useEffect(() => {
        if (!historyId) {
            generateHistoryId();
        }
    }, []);

    return (
        <>
            {
                <WorkspaceCard
                    cardTitle={'Generate Image'}
                    showIssueNotice={showImages && showNoStoreImagesIssue}
                    closeIssueNotice={setShowNoStoreImagesIssue}
                    showHeaderReturnPanel={showHeaderReturnPanel}
                    headerLeftButtons={headerLeftButtons}
                    headerRightButtons={null}
                    headerReturnButtonHandler={headerReturnButtonHandler}
                    callback={submitData}
                    inputValue={selectedIdea}
                    showFooter={showFooter}
                    isLoading={isLoading}
                    promptToRepeat={promptToRepeat}
                    setPromptToRepeat={setPromptToRepeat}
                    currentChatHistoryId={historyId}
                    ref={inputFormRef}
                >
                    <AnimatePresence mode='wait'>
                        {
                            showIdeas &&
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

                    </AnimatePresence>
                    {
                        showImages &&
                        <ResultContentImages themeColor={themeColor} isLoading={isLoading} currentImages={imgHistory ? imgHistory[historyId] : []} setPromptToRepeat={setPromptToRepeat} />
                    }
                </WorkspaceCard>
            }
        </>
    );
};

export default CreateImage;