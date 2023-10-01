'use client'
import React from "react";
import { Box, Icon, Stack, Text } from "@chakra-ui/react";

import styles from './TopicsStyles.module.css';

import { FcIdea, FcCurrencyExchange, FcMultipleDevices, FcMusic, FcIcons8Cup } from "react-icons/fc";
import { motion } from "framer-motion";


const itemText = {
    show: {
        x: '0px',
        transition: {
            duration: 0.75,
            type: 'spring',
            bounce: 0.3,
        }
    },
    hidden: { x: '-35px' }
}


const TopicsItem = React.forwardRef((props, ref) => {
    let icon;
    switch (props.data) {
        case 'Finance':
            icon = FcCurrencyExchange;
            break;
        case 'Technology':
            icon = FcMultipleDevices;
            break;
        case 'Music':
            icon = FcMusic;
            break;
        case 'Food and cooking':
            icon = FcIcons8Cup;
            break;

        default:
            icon = FcIdea
            break;
    }
    return (
        <Box
            className={styles.topicsItem}
            height={{ base: '120px', md: '160px' }}
            paddingX={'1'}
            paddingY={'2'}
            bg='white'
            borderWidth={'1px'}
            borderRadius={'lg'}
            as={'button'}
            ref={ref}
            onClick={props.onClick}
        >
            <Stack h={'100%'} flex={1} direction={'column'} justifyContent={'center'} alignItems={'center'} spacing={1} >
                <Icon as={icon} mb={{ base: '2px', md: '10px' }} boxSize={{ base: '6', md: '10' }}
                />
                <Text
                    as={motion.p}
                    initial={'hidden'}
                    whileInView={'show'}
                    variants={itemText}
                    viewport={{ amount: 0.5 }}
                    textAlign={'center'}
                    lineHeight={{ base: '1', md: '2' }}
                    fontSize={{ base: 'xs', md: 'md' }}
                >{props.data}
                </Text>
            </Stack>
        </Box>
    )
});


export default TopicsItem;