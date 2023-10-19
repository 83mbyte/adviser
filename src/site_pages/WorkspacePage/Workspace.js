import { Box, Portal } from '@chakra-ui/react';
import React from 'react';
import styles from './WorkspaceStyles.module.css';
import Header from '../../components/Workspace/Header/Header';
import MainArea from '../../components/Workspace/MainArea/MainArea';
import Footer from '../../components/PagesFooter/Footer';
import { authAPI } from '@/src/lib/authAPI';
import MotionModal from '@/src/components/Modal/MotionModal';

const Workspace = () => {
    const [showModalSignOut, setShowModalSignOut] = React.useState(false);
    return (

        <>
            <Box as='header' className={styles.header}  >
                <Header setShowModalSignOut={setShowModalSignOut} />
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
                <MainArea />
            </Box>

            {/* footer */}
            <Box as='footer' className={styles.footer}>
                <Footer />
            </Box>
            <Portal>
                <MotionModal showModal={showModalSignOut}
                    headerText='Are you sure?'
                    bodyText='Your current session will be closed. Please confirm.'
                    handleClose={() => setShowModalSignOut(false)}
                    confirmAction={() => authAPI.signOut()}
                />
            </Portal>
        </>
    )
};

export default Workspace;

