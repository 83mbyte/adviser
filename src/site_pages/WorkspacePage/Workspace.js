import { Box } from '@chakra-ui/react';
import React from 'react';
import styles from './WorkspaceStyles.module.css';
import Header from '../../components/Workspace/Header/Header';
import MainArea from '../../components/Workspace/MainArea/MainArea';
import Footer from '../../components/PagesFooter/Footer';

const Workspace = () => {
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
                <MainArea />
            </Box>

            {/* footer */}
            <Box as='footer' className={styles.footer}>
                <Footer />
            </Box>
        </>
    )
};

export default Workspace;