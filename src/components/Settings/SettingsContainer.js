'use client'
import React from 'react';

import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    Text,
    HStack,
    Box,
    IconButton
} from '@chakra-ui/react'
import SettingsMenuItem from './SettingsMenuItem';
import { MdArrowBack } from 'react-icons/md';

import { MENU_ITEMS } from './settingsDefaults';   // see the example of MENU_ITEMS below.


// example of MENU_ITEMS array:
// const MENU_ITEMS = [
//     {
//         type: 'length',
//         title: 'Set Length',
//         buttons: ['Short', 'Medium', 'Long'],
//         wrapType: 'nowrap'
//     },
//     {
//         type: 'role',
//         title: 'Set Role',
//         buttons: [
//             { role: 'Role_1', descr: 'Description to show as  a tooltip_1' },
//             { role: 'Role_2', descr: 'Description to show as  a tooltip_2.' },
//             { role: 'Role_3', descr: 'Description to show as  a tooltip_3' },
//         ],
//         wrapType: 'wrap',

//     },
//     {
//         type: 'context',
//         title: 'Set Context',
//         buttons: ['Context_1', 'Context_2', 'Context_3'],
//         wrapType: 'wrap',

//     },
//     {
//         type: 'tone',
//         title: 'Set Tone',
//         buttons: ['Tone_1', 'Tone_2', 'Tone_3', 'Tone_4'],
//         wrapType: 'wrap'
//     },
//     {
//         type: 'theme',
//         title: 'Set Theme Color',
//         buttons: ['Purple', 'Teal', 'Orange', 'Green'],
//         wrapType: 'wrap'
//     },

// ]


const SettingsContainer = ({ isOpen, toggleMenuView, activeButton, setActiveButton, themeColor }) => {
    const setSelectedItem = (data) => {
        if (activeButton[data.type] === data.button) {
            setActiveButton(
                {
                    ...activeButton,
                    [data.type]: ''
                }
            )
        } else {
            setActiveButton({
                ...activeButton,
                [data.type]: data.button
            })
        }

    }
    return (
        <Drawer size={{ sm: 'full', md: 'md', lg: 'lg', xl: 'xl' }} isOpen={isOpen} placement={'left'} onOverlayClick={toggleMenuView} >
            <DrawerOverlay />
            <DrawerContent  >

                <DrawerHeader borderBottomWidth='1px' py={[2, 4]}>
                    <HStack>
                        <Box>
                            <IconButton icon={<MdArrowBack />} colorScheme={themeColor} variant={'ghost'} onClick={toggleMenuView} />
                        </Box>
                        <Box w='full' >
                            <Text textAlign={'center'}>Settings</Text>
                        </Box>
                    </HStack>
                </DrawerHeader>

                <DrawerBody>
                    {
                        MENU_ITEMS.length > 0 &&
                        MENU_ITEMS.map((menuItem, index) => {
                            return (
                                <SettingsMenuItem
                                    key={`menu_${index}`}
                                    themeColor={themeColor}
                                    title={menuItem.title}
                                    buttons={menuItem.buttons}
                                    wrapType={menuItem.wrapType}
                                    itemType={menuItem.type}
                                    activeButton={activeButton[menuItem.type]}
                                    setSelectedItem={(value) => setSelectedItem({
                                        type: menuItem.type,
                                        button: value
                                    })}
                                />
                            )
                        })
                    }
                </DrawerBody>


            </DrawerContent>
        </Drawer >
    );
};

export default SettingsContainer;