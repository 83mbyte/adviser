'use client'
import { Box, Text } from '@chakra-ui/react';

import { motion } from 'framer-motion';
const Footer = ({ type = null }) => {

    return (
        <Box bg={type ? 'gray.500' : 'gray.300'} display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'}
            as={'footer'}
            h={['20px', '23px']}
            color={'gray.50'}
        >
            <Text fontSize={'xs'} as={motion.p} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1, duration: 0.8, } }}>© 2023 Helpi AI-Bot. All rights reserved.</Text>
        </Box>
    );
};

export default Footer;