import { Box, Portal } from '@chakra-ui/react';

import styles from './WorkspaceStyles.module.css';
import Header from '../../components/Workspace/Header/Header';
import MainArea from '../../components/Workspace/MainArea/MainArea';
import Footer from '../../components/PagesFooter/Footer';
import MotionModalSignOut from '@/src/components/Modal/MotionSignOutModal';
import MotionZoomImgModal from '@/src/components/Modal/MotionZoomImgModal';
import { useUISettingsContext } from '@/src/context/UISettingsContext';

const Workspace = () => {

    const userUISettings = useUISettingsContext();
    const showModalSettings = userUISettings.showModalWindow;
    const userWorkspaceType = userUISettings.userWorkspaceType;

    const closeModal = () => {
        showModalSettings.setShowModal({ isShow: false, type: null, body: null });
        return null
    }

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
                <MotionModalSignOut
                    showModal={showModalSettings.showModal}
                    handleClose={closeModal}
                />

                <MotionZoomImgModal
                    showModal={showModalSettings.showModal}
                    handleClose={closeModal}
                />
            </Portal>
        </>
    )
};

export default Workspace;

