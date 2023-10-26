import React from 'react';
import {
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItemOption,
    MenuOptionGroup,
} from '@chakra-ui/react'
import { MdSettings } from "react-icons/md";
const AdjustImageMenu = ({ themeColor, size, setSize }) => {

    return (
        <Menu placement={'auto-start'} autoSelect={false}>
            <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<MdSettings fontSize={'20px'} />}
                variant='outline'
                colorScheme={themeColor}
                size={{ base: 'sm', md: '' }}
                px={'2'}
            />
            <MenuList  >
                <MenuOptionGroup defaultValue={size} title='Image Size' type='radio' onChange={setSize} >
                    <MenuItemOption value='256' fontSize={'sm'} _hover={{ backgroundColor: `${themeColor}.50` }}>256x256 pixels</MenuItemOption>
                    <MenuItemOption value='512' fontSize={'sm'} _hover={{ backgroundColor: `${themeColor}.50` }}>512x512 pixels</MenuItemOption>
                    <MenuItemOption value='1024' fontSize={'sm'} _hover={{ backgroundColor: `${themeColor}.50` }}>1024x1024 pixels</MenuItemOption>
                </MenuOptionGroup>
            </MenuList>
        </Menu >
    );
};

export default AdjustImageMenu;