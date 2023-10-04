'use client'
import React from "react";
import { Box, Icon, Stack, Text } from "@chakra-ui/react";

import styles from './TopicsStyles.module.css';

import { FcIdea, FcCurrencyExchange, FcSms, FcGraduationCap, FcBusiness, FcStatistics, FcSportsMode, FcOldTimeCamera, FcElectronics } from "react-icons/fc";



const TopicsItem = React.forwardRef(function TopicsItemRef(props, ref) {
    let icon;
    switch (props.data) {
        case 'Technology and Innovation':
            icon = FcElectronics;
            break;
        case 'Personal Finance':
            icon = FcCurrencyExchange;
            break;
        case 'Education':
            icon = FcGraduationCap;
            break;
        case 'Travel':
            icon = FcBusiness;
            break;
        case 'Language learning':
            icon = FcSms;
            break;

        case 'Digital Marketing':
            icon = FcStatistics;
            break;
        case 'Health and Wellness':
            icon = FcSportsMode;
            break;

        case 'Photography':
            icon = FcOldTimeCamera;
            break;
        default:
            icon = FcIdea
            break;
    }
    return (
        <Box
            className={styles.topicsItem}
            height={{ base: '90px', md: '140px' }}
            maxW={['90px', '140px']}
            width={['90px', '30%']}
            paddingX={'1'}
            paddingY={'3'}
            bg='white'
            borderWidth={'1px'}
            borderRadius={'lg'}
            as={'button'}
            ref={ref}
            onClick={props.onClick}
        >
            <Stack h={'100%'} flex={1} direction={'column'} justifyContent={'center'} alignItems={'center'} spacing={1} >
                <Box bg='' display={'flex'} flex={1}>
                    <Icon as={icon} mb={{ base: '2px', md: '10px' }} boxSize={{ base: '6', md: '10' }}
                    />
                </Box>
                <Box bg='' display={'flex'} flex={2} wordBreak={'break-word'}>
                    <Text

                        textAlign={'center'}
                        lineHeight={{ base: '1', md: 'auto' }}
                        fontSize={{ base: 'xs', md: 'sm' }}

                    >{
                            props.data.length > 20
                                ? `${props.data.slice(0, 20)}...`
                                : props.data
                        }
                    </Text>
                </Box>
            </Stack>
        </Box>
    )
});


export default TopicsItem;