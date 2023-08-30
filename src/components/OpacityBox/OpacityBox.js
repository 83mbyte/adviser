'use client'
import { Box, Center } from '@chakra-ui/react';
import React from 'react';

import styles from './OpacityBox.module.css';

const OpacityBox = ({ isVisible, children }) => {

    return (
        <Box className={!isVisible ? `${styles.opacityBox} ` : `${styles.opacityBox} ${styles.visible}`}
        >
            <Center h="100%">
                {children}
            </Center>
        </Box >
    );
};

export default OpacityBox;