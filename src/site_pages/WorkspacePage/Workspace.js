
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Box, Portal } from '@chakra-ui/react';

import styles from './WorkspaceStyles.module.css';
import Header from '../../components/Workspace/Header/Header';
import MainArea from '../../components/Workspace/MainArea/MainArea';
import Footer from '../../components/PagesFooter/Footer';
import { useSettingsContext } from '@/src/context/SettingsContext';
import { AnimatePresence, motion } from 'framer-motion';
import { animationProps } from '@/src/lib/animationProps';
import SignOutModal from '@/src/components/Modal/SignOutModal';
import ZoomImgModal from '@/src/components/Modal/ZoomImgModal';

import CheckoutResultModal from '@/src/components/Modal/CheckoutResultModal';
import SubscriptionNoticeModal from '@/src/components/Modal/SubscriptionNoticeModal';

const Workspace = () => {

    const settingsContext = useSettingsContext();
    const showModalSettings = settingsContext.showModalWindow;
    const userWorkspaceType = settingsContext.userWorkspaceType;
    const { subscription } = settingsContext.userSubscription;

    const params = useSearchParams();

    const closeModal = () => {
        showModalSettings.setShowModal({ isShow: false, type: null, body: null });
        history.pushState(null, "", "workspace");
        return null
    }

    const gotoCheckout = () => {
        userWorkspaceType.setWorkspaceType('subscription');
        closeModal();
    }

    useEffect(() => {
        if (params.has('checkout')) {
            showModalSettings.setShowModal({ isShow: true, type: 'CheckoutResult', body: params.get('checkout') });
        }
    }, [])
    useEffect(() => {
        if (subscription) {
            if (subscription.period < Date.now()) {
                showModalSettings.setShowModal({ isShow: true, type: 'SubscriptionNotice', body: null });
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
                <MainArea workspaceType={userWorkspaceType.workspaceType} />
            </Box>

            {/* footer */}
            <Box as='footer' className={styles.footer}>
                <Footer type={'workspace'} />
            </Box>

            <Portal>
                <AnimatePresence mode='wait'>

                    {
                        showModalSettings.showModal.isShow == true &&
                        <motion.div
                            //onClick={closeModal}
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
                                    showModalSettings.showModal.type === 'SubscriptionNotice' &&
                                    <SubscriptionNoticeModal handleClose={closeModal} renewCheckout={gotoCheckout} />
                                }
                                {
                                    showModalSettings.showModal.type === 'SignOut' &&
                                    <SignOutModal handleClose={closeModal} />
                                }
                                {showModalSettings.showModal.type === 'ZoomImgModal' &&
                                    <ZoomImgModal handleClose={closeModal} image={showModalSettings.showModal.body && showModalSettings.showModal.body !== undefined ? showModalSettings.showModal.body : null} />
                                }
                                {
                                    showModalSettings.showModal.type === 'CheckoutResult' &&
                                    <CheckoutResultModal handleClose={closeModal} result={showModalSettings.showModal.body} renewCheckout={gotoCheckout} />
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

