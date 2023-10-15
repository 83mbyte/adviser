'use client'
import React from 'react';
import { Box, Text } from '@chakra-ui/react';

import { motion } from 'framer-motion';
const Footer = () => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        if (!isVisible) {
            setIsVisible(true)
        }
    }, [isVisible]);

    return (

        <Box bg='gray.500' display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'}
            as={'footer'}
            h={['20px', '23px']}
            color={'gray.200'}
        >
            <Text fontSize={'xs'} as={motion.p} initial={{ y: '100px' }} animate={{ y: '0px', transition: { delay: 1, duration: 0.8, } }}>© 2023 Helpi AI-Bot. All rights reserved.</Text>

        </Box>
    );
};

export default Footer;