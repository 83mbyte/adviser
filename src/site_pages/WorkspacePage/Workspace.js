import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Box, Portal } from '@chakra-ui/react';
import { sanitize } from "isomorphic-dompurify";

import styles from './WorkspaceStyles.module.css';
import Header from '../../components/Workspace/Header/Header';
import MainArea from '../../components/Workspace/MainArea/MainArea';
import Footer from '../../components/PagesFooter/Footer';
import { useSettingsContext } from '@/src/context/SettingsContext/SettingsContextProvider';
import { AnimatePresence, motion } from 'framer-motion';
import { animationProps } from '@/src/lib/animationProps';
import SignOutModal from '@/src/components/Modal/SignOutModal';
import ZoomImgModal from '@/src/components/Modal/ZoomImgModal';

import CheckoutResultModal from '@/src/components/Modal/CheckoutResultModal';
import SubscriptionNoticeModal from '@/src/components/Modal/SubscriptionNoticeModal';
import VoiceRecordingModal from '@/src/components/Modal/VoiceRecordingModal';
import { useAuthContext } from '@/src/context/AuthContextProvider';
import { dbAPI } from '@/src/lib/dbAPI';

const Workspace = () => {
    const user = useAuthContext();
    const settingsContext = useSettingsContext();

    const isEmailVerifiedSavedOnDB = settingsContext.settings.userInfo.isEmailVerified;
    const showModalSettings = settingsContext.settings.UI.showModal;
    const userWorkspaceType = settingsContext.settings.UI.workspaceType;

    const subscription = settingsContext.settings.userInfo.subscription;

    const params = useSearchParams();

    const sanitizeString = (dirtyString) => {
        return sanitize(dirtyString);
    }

    const closeModal = () => {
        settingsContext.updateSettings('UI', 'showModal', { isShow: false, type: null, body: null })
        history.pushState(null, "", "workspace");
        return null
    }

    const gotoCheckout = () => {
        settingsContext.updateSettings('UI', 'workspaceType', 'subscription');
        closeModal();
    }

    useEffect(() => {

        const updateUserData = async () => {
            let data = {
                ...settingsContext.settings.userInfo,
                isEmailVerified: true
            }
            await dbAPI.updateServerData({ userId: user.uid, docName: 'settings', field: 'userInfo', data: data });
        }

        if (user.emailVerified == true && (isEmailVerifiedSavedOnDB == false)) {
            updateUserData();
        }
    }, [isEmailVerifiedSavedOnDB]);

    useEffect(() => {
        if (params.has('checkout')) {
            let bodyString = sanitizeString(params.get('checkout'));
            settingsContext.updateSettings('UI', 'showModal', { isShow: true, type: 'CheckoutResult', body: bodyString })
        }
    }, [])

    useEffect(() => {
        if (subscription && subscription.period) {
            if (subscription.period < Date.now()) {
                settingsContext.updateSettings('UI', 'showModal', { isShow: true, type: 'SubscriptionNotice', body: null });
            }
        }
    }, [subscription])

    return (
        <>
            <Box as='header' className={styles.header}  >
                <Header />
            </Box>

            {/* main  */}
            <Box as='main'
                bg={'gray.500'}
                className={styles.main}
                top={['45px', '55px']}
                bottom={['20px', '23px']}
                overflowY={'hidden'}
                px={['1', '2']}
                pt={['1', '2']}
                pb={'0'}
                display={'flex'}
                flexDir={"column"}
                alignItems={'center'}
                overflow={'hidden'}
            >
                <MainArea workspaceType={userWorkspaceType} />
            </Box>

            {/* footer */}
            <Box as='footer' className={styles.footer}>
                <Footer type={'workspace'} />
            </Box>

            <Portal>
                <AnimatePresence mode='wait'>

                    {
                        showModalSettings.isShow == true &&
                        <motion.div
                            key={'backdrop'}
                            style={{ zIndex: 3001, position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}
                            variants={animationProps.opacity}
                            initial={'hidden'}
                            animate={'show'}
                            exit={'exit'}
                        >
                            <motion.div
                                key={'modalInner'}
                                variants={animationProps.slideFromTop}
                                initial={'hidden'}
                                animate={'visible'}
                                exit={'exit'}
                            >

                                {
                                    showModalSettings.type === 'SubscriptionNotice' &&
                                    <SubscriptionNoticeModal renewCheckout={gotoCheckout} />
                                }
                                {
                                    showModalSettings.type === 'SignOut' &&
                                    <SignOutModal handleClose={closeModal} />
                                }
                                {showModalSettings.type === 'ZoomImgModal' &&
                                    <ZoomImgModal handleClose={closeModal} image={showModalSettings.body && showModalSettings.body !== undefined ? showModalSettings.body : null} />
                                }
                                {
                                    showModalSettings.type === 'CheckoutResult' &&
                                    <CheckoutResultModal handleClose={closeModal} result={showModalSettings.body} renewCheckout={gotoCheckout} />
                                }
                                {
                                    showModalSettings.type === 'VoiceRecording' &&
                                    <VoiceRecordingModal handleClose={closeModal} />
                                }
                            </motion.div>
                        </motion.div>
                    }
                </AnimatePresence>
            </Portal>
        </>
    )
};

export default Workspace;

