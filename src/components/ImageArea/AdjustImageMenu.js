import React from 'react';
import {
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItemOption,
    MenuOptionGroup,
} from '@chakra-ui/react'
import { TbAdjustmentsHorizontal } from "react-icons/tb";
const AdjustImageMenu = ({ themeColor, size, setSize }) => {

    return (
        <Menu placement={'auto-start'} autoSelect={false}>
            <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<TbAdjustmentsHorizontal size={'22px'} />}
                variant='outline'

                colorScheme={themeColor}

            />
            <MenuList  >
                <MenuOptionGroup defaultValue={size} title='Image Size' type='radio' onChange={setSize} >
                    <MenuItemOption value='256' fontSize={'sm'} _hover={{ backgroundColor: `${themeColor}.50` }}

                    >256x256 pixels</MenuItemOption>
                    <MenuItemOption value='512' fontSize={'sm'} _hover={{ backgroundColor: `${themeColor}.50` }}>512x512 pixels</MenuItemOption>
                    <MenuItemOption value='1024' fontSize={'sm'} _hover={{ backgroundColor: `${themeColor}.50` }}>1024x1024 pixels</MenuItemOption>
                </MenuOptionGroup>

            </MenuList>
        </Menu >
    );
};

export default AdjustImageMenu;