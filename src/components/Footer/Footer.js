'use client'
import React from 'react';
import { Box, Text, Container, Stack } from '@chakra-ui/react';
import styles from './FooterStyle.module.css'

const Footer = () => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        if (!isVisible) {
            setIsVisible(true)
        }
    }, [isVisible]);

    return (

        <Box bg={'gray.300'}
            color={'gray.400'}
            borderTop={'0px'}
            borderTopStyle={'solid'}
            borderTopColor={'gray.100'}
            w={'full'}
            as={'footer'}
            h={['25px', '35px']}
        >
            <Container
                as={Stack}
                maxW={'6xl'}
                py={[1, 2]}
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                justify={{ base: 'center', md: 'center' }}
                align={{ base: 'center', md: 'center' }}
                className={isVisible ? `${styles.footer} ${styles.visible}` : styles.footer}
            >
                <Text fontSize={'sm'}>© 2023 Helpi AI-Bot. All rights reserved</Text>
            </Container>
        </Box>

    );
};

export default Footer;