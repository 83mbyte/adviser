'use client'
import {
    Box, Heading, useColorModeValue, Flex, IconButton, Tooltip
} from '@chakra-ui/react';
import React from 'react';

import { FiSettings } from "react-icons/fi";
import { RiHistoryLine, RiChatNewLine } from "react-icons/ri";
import OpacityBox from '../OpacityBox/OpacityBox';


const Header = ({ toggleMenuView, toggleHistoryView, isChatHistoryExists, openNewChat, themeColor, }) => {

    return (
        <Box
            bg={useColorModeValue('white', 'gray.800')}
            color={useColorModeValue('gray.600', 'white')}
            minH={['45px', '55px']}
            borderBottom={1}
            borderStyle={'solid'}
            borderColor={useColorModeValue('gray.200', 'gray.900')}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}
            display={'flex'}
        >
            <Box display={'flex'} flexDirection={'row'}
                w={'full'} bg=''
                h={'100%'}
                width={['full', 'md', 'lg', '3xl']}
                alignItems={'center'}
                justifyContent={'space-between'}
                px={2}
            >
                <Box bg=''>
                    <Heading as={'h5'} color={`${themeColor}.500`}>Adviser</Heading>
                </Box>
                <Box bg='' position={'relative'} >

                    <Flex
                        flex={{ base: 1, md: 'auto' }}
                        ml={{ base: -2 }}
                        display={{ base: 'flex', md: 'flex' }}
                        columnGap={'3'}
                    >
                        {
                            <OpacityBox isVisible={isChatHistoryExists}>
                                <Tooltip label={'History'} hasArrow bg={`${themeColor}.500`} aria-label='A tooltip History'>
                                    <IconButton
                                        onClick={toggleHistoryView}
                                        icon={<RiHistoryLine size={'28px'} />}
                                        colorScheme={themeColor}
                                        variant={'ghost'}
                                        aria-label={'Toggle ChatHistory'}
                                        display={isChatHistoryExists ? 'flex' : 'none'}
                                    />
                                </Tooltip>
                            </OpacityBox>}

                        <Tooltip label='New Chat' hasArrow bg={`${themeColor}.500`} aria-label='A tooltip NewChat'>
                            <IconButton
                                onClick={openNewChat}
                                icon={<RiChatNewLine size={'28px'} />}
                                colorScheme={themeColor}
                                variant={'ghost'}
                                aria-label={'New Chat'}

                            />
                        </Tooltip>

                        <Tooltip label="Settings" aria-label='A tooltip Setting' hasArrow bg={`${themeColor}.500`}>
                            <IconButton
                                onClick={toggleMenuView}
                                icon={<FiSettings size={'28px'} />}
                                colorScheme={themeColor}
                                variant={'ghost'}
                                aria-label={'Toggle Settings'}
                            />
                        </Tooltip>

                    </Flex>
                </Box>
            </Box>
        </Box >
    );
};


export default Header;

