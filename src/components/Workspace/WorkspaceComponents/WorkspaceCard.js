import { useEffect, forwardRef } from "react";
import { Card, CardBody, VStack, Box } from "@chakra-ui/react";

import { useSettingsContext } from "@/src/context/SettingsContext";

import WorkspaceCardHeader from "./WorkspaceCardHeader";
import WorkspaceCardFooter from "./WorkspaceCardFooter";
import IssuesNotices from "./IssuesNotices";

const WorkspaceCard = forwardRef(function WorkspaceCardRef({ cardTitle = 'default title', showFooter = true, headerLeftButtons = null, headerRightButtons = null, showHeaderReturnPanel, headerReturnButtonHandler, currentChatHistoryId, inputValue, callback, isLoading, promptToRepeat, setPromptToRepeat, showIssueNotice, closeIssueNotice, children }, ref) {

    //common settings for all cards..
    const settingsContext = useSettingsContext();
    const { themeColor } = settingsContext.userThemeColor;
    const { workspaceType, setWorkspaceType } = settingsContext.userWorkspaceType;
    const { subscription } = settingsContext.userSubscription;
    const subscriptionType = subscription.type;
    const { trialOffers } = settingsContext.trialOffers;

    let inputFormRef = ref;

    useEffect(() => {
        if (promptToRepeat) {
            inputFormRef.current.value = promptToRepeat;
            setPromptToRepeat(null);
        }
    }, [promptToRepeat])

    return (
        <>
            {
                currentChatHistoryId &&
                <Card h={'99%'} maxHeight={'100%'} bg={''} borderTopRadius={'10px'} borderBottomRadius={0} overflow={'hidden'}>
                    <CardBody m={0} p={['2', '3']} maxH={'100%'} overflow={'hidden'}
                    >
                        <VStack spacing={0} px={'0'} bg={'#FAFAFA'} h='100%' maxHeight={'100%'} border={'1px dashed #DEDEDE'} borderTopRadius={'10px'}
                            willChange={'height'}
                        >
                            <Box
                                bg={''}
                                w={'full'}
                                p={0}
                                borderTopRadius={'10px'}
                                borderBottomWidth={'1px'}
                                borderBottomColor={'gray.200'}
                                overflowX={'hidden'}
                                height={'55px'}
                                minH={'54px'}
                                display={'flex'}
                                flexDirection={'row'}
                                zIndex={1005}
                            >

                                {/* card header panel */}
                                <WorkspaceCardHeader
                                    themeColor={themeColor}
                                    cardTitle={cardTitle}
                                    showHeaderReturnPanel={showHeaderReturnPanel}
                                    headerReturnButtonHandler={headerReturnButtonHandler}
                                    buttons={{ left: headerLeftButtons, right: headerRightButtons }}

                                />
                                {/* card header panel end */}


                            </Box>

                            {/* issues notifications start*/}
                            {
                                showIssueNotice &&
                                <IssuesNotices themeColor={themeColor}
                                    subscriptionType={subscription.type}
                                    setWorkspaceType={setWorkspaceType}
                                    workspaceType={workspaceType}
                                    trialLimit={subscriptionType == 'Trial' && ((workspaceType == 'ytsummarize' && trialOffers.youtube >= process.env.NEXT_PUBLIC_TRIAL_LIMIT_YT) || (workspaceType == 'image' && trialOffers.images >= process.env.NEXT_PUBLIC_TRIAL_LIMIT_IMAGE))}
                                    closeIssueNotice={closeIssueNotice}
                                    noStoreImages={workspaceType == 'image'}
                                    historyWarning={subscriptionType === 'Trial' && workspaceType !== 'image'}
                                    trialOffers={trialOffers}
                                />
                            }
                            {/* issues notifications end */}
                            <Box
                                w={'100%'}
                                display={'flex'}
                                flexDirection={'column'}
                                p={1}
                                bg=''
                                my={0.5}
                                height={'100%'}
                                maxHeight={'100%'}
                                overflowX={'hidden'}
                                overflowY={'scroll'}
                            // justifyContent={'flex-end'}
                            >
                                {
                                    children
                                }
                            </Box>
                        </VStack>
                    </CardBody>

                    <WorkspaceCardFooter inputValue={inputValue} showFooter={showFooter} themeColor={themeColor} footerVariant={workspaceType} onSubmitHandler={callback} ref={inputFormRef}
                        isLoading={isLoading}
                        isDisabled={subscriptionType == 'Trial' && ((workspaceType == 'ytsummarize' && trialOffers.youtube >= process.env.NEXT_PUBLIC_TRIAL_LIMIT_YT) || (workspaceType == 'image' && trialOffers.images >= process.env.NEXT_PUBLIC_TRIAL_LIMIT_IMAGE))
                        }
                        currentChatHistoryId={currentChatHistoryId}
                    />
                </Card >
            }
        </>
    )
});

export default WorkspaceCard;
