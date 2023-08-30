'use client'
import { VStack, Text, Box, Button, Icon, HStack, Tooltip } from '@chakra-ui/react';
import React from 'react';


import { RiSpeakFill, RiShareLine, RiBrush2Fill } from "react-icons/ri";
import { FaTheaterMasks } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";


const SettingsMenuItem = ({ title, themeColor, buttons, itemType, wrapType, lastItem = false, activeButton, setSelectedItem }) => {

    return (


        <VStack w={'full'} spacing={1} >
            <HStack justifyContent={'flex-start'} alignItems={'center'} w={'full'}>
                {
                    itemType === 'length' &&
                    <Icon as={AiFillEdit} color={`${themeColor}.600`} />
                }
                {
                    itemType === 'tone' &&
                    <Icon as={RiSpeakFill} color={`${themeColor}.600`} />
                }
                {
                    itemType === 'role' &&
                    <Icon as={FaTheaterMasks} color={`${themeColor}.600`} />
                }
                {
                    itemType === 'context' &&
                    <Icon as={RiShareLine} color={`${themeColor}.600`} />
                }
                {
                    itemType === 'theme' &&
                    <Icon as={RiBrush2Fill} color={`${themeColor}.600`} />
                }
                <Text textAlign={'left'} w={'full'} color={`${themeColor}.700`}>{title}</Text>
            </HStack>

            <HStack flexWrap={wrapType} alignItems={'center'} justifyContent={''} w={'full'} spacing={'1'} bg=''>
                {
                    buttons.length > 0 &&
                    buttons.map((button, index) => {
                        return (
                            <Box bg='' py={0.5} key={`btn_${index}`}>

                                {
                                    itemType === 'role'
                                        ? <ButtomAndTooltip label={button.descr} themeColor={themeColor} button={button.role} activeButton={activeButton} setSelectedItem={setSelectedItem} />
                                        : <Button colorScheme={themeColor} variant={'outline'}
                                            size={['xs', 'xs']}
                                            value={button}
                                            onClick={(e) => {
                                                if (activeButton !== button) { setSelectedItem(e.target.value) }
                                            }
                                            }
                                            isActive={activeButton === button}
                                        >
                                            {button}
                                        </Button>
                                }
                            </Box>
                        )
                    })
                }
            </HStack>

            {
                itemType !== 'theme' &&
                <Box w={'full'} bg={`${themeColor}.100`} h={'1px'} mt={2} my={['3', '4']}></Box>

            }
        </VStack>

    );
};

export default SettingsMenuItem;

const ButtomAndTooltip = ({ label, themeColor, button, activeButton, setSelectedItem }) => {
    return (
        <Tooltip label={label}>
            <Button colorScheme={themeColor} variant={'outline'}
                size={['xs', 'xs']}
                value={button}
                onClick={(e) => {
                    if (activeButton !== button) { setSelectedItem(e.target.value) }
                }
                }
                isActive={activeButton === button}
            >
                {button}
            </Button>
        </Tooltip>
    )
}