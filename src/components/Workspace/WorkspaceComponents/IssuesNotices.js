
import { useBreakpointValue } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

import LimitReachedNotice from "./IssuesNotices/LimitReachedNotice";
import NoHistoryNotice from "./IssuesNotices/NoHistoryNotice";
import NoStoreImagesNotice from "./IssuesNotices/NoStoreImagesNotice";


const animationVariants = {
    initial: { y: -40, opacity: 0, height: 0 },
    animate: custom => ({
        y: 0,
        opacity: 1,
        height: 'auto',
        transition: {
            opacity: { delay: custom + 2, duration: 0.5 },
            y: { delay: custom + 2, duration: 0.5 },
            height: { delay: custom + 0.9, duration: 0.4 },
            // opacity: { delay: custom + 0.8, duration: 0.5 },
            // y: { delay: custom + 0.8, duration: 0.5 },
            // height: { delay: custom + 0.7, duration: 0.4 },
        }
    }),
    exit: {
        opacity: 0,
        y: -40,
        height: 0,
        transition: {
            opacity: { duration: 0.5 },
            y: { delay: 0.1, duration: 0.5 },
            height: { delay: 0.1, duration: 0.3 },
        },
    }
}

const IssuesNotices = ({ themeColor, subscriptionType, setWorkspaceType, trialOffers, trialLimit, noStoreImages, historyWarning, closeIssueNotice }) => {
    // subscriptionType
    const gotoCheckout = () => {
        setWorkspaceType('subscription');
    }
    const buttonVariant = useBreakpointValue(
        {
            base: 'IconButton',
            sm: 'Button',
        })

    const showLimitWarning = trialLimit;


    return (
        <>
            <AnimatePresence mode='wait'>

                {
                    historyWarning &&
                    <MotionNoHistoryNotice
                        themeColor={themeColor}
                        key={'noHistoryNotification'}
                        buttonVariant={buttonVariant}
                        variants={animationVariants}
                        custom={0}
                        initial='initial'
                        animate='animate'
                        exit='exit'
                        gotoCheckout={gotoCheckout}
                        closeNotice={closeIssueNotice}
                    />
                }
            </AnimatePresence>

            <AnimatePresence mode='wait'>
                {
                    (noStoreImages && !showLimitWarning) &&
                    <MotionNoStoreImagesdNotice themeColor={themeColor}
                        key={'NoStoreImagesNotification'}
                        buttonVariant={buttonVariant}
                        variants={animationVariants}
                        initial='initial'
                        animate='animate'
                        exit='exit'
                        custom={(historyWarning == true) && 0.5}
                        closeNotice={closeIssueNotice}
                    />
                }
            </AnimatePresence>
            <AnimatePresence mode='wait'>
                {
                    (showLimitWarning && subscriptionType == 'Trial') &&
                    <MotionLimitReachedNotice themeColor={themeColor}
                        key={'LimitReachedNotification'}
                        buttonVariant={buttonVariant}
                        variants={animationVariants}
                        initial='initial'
                        animate='animate'
                        exit='exit'
                        trialOffers={trialOffers}
                        custom={(showHistoryWarning == true) && 0.5}
                        gotoCheckout={gotoCheckout}
                    />
                }
            </AnimatePresence>
        </>
    );
};

export default IssuesNotices;


const MotionNoHistoryNotice = motion(NoHistoryNotice, { forwardMotionProps: true });
const MotionLimitReachedNotice = motion(LimitReachedNotice, { forwardMotionProps: true })
const MotionNoStoreImagesdNotice = motion(NoStoreImagesNotice, { forwardMotionProps: true })