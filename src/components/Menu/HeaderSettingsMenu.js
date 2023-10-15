import React from 'react';
import {
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    HStack,
    Box,
    Spacer,
} from '@chakra-ui/react';

import { motion } from 'framer-motion';
import { MdSettings } from "react-icons/md";

const colors = ['green', 'teal', 'orange', 'purple', 'pink']

const HeaderSettingsMenu = ({ setThemeColor, themeColor }) => {

    return (
        <Menu autoSelect={false}>
            <MenuButton
                as={IconButton}
                aria-label='Settings'
                icon={<MdSettings size={'24px'} />}
                variant='outline'
                colorScheme={themeColor}
            />
            <MenuList >
                <MenuGroup title='Accent color'>
                    <MenuItem display={'flex'} flexDirection={'column'} _hover={{ backgroundColor: 'transparent' }}>

                        <HStack spacing={'2'}>
                            {
                                colors.map((color, index) => {

                                    return (
                                        <Box as={motion.div} initial={{ scale: 1 }} whileHover={{ scale: 1.3, y: -5 }} key={index} boxSize={color == themeColor ? '33px' : '30px'} borderRadius={'50%'} bg={color}
                                            borderColor={'red.500'}
                                            borderWidth={color == themeColor ? '2px' : '0px'}
                                            onClick={() => setThemeColor(color)}><Spacer /></Box>
                                    )
                                })
                            }
                        </HStack>
                    </MenuItem>
                </MenuGroup>
                <MenuDivider />

            </MenuList>
        </Menu>
    );
};

export default HeaderSettingsMenu;