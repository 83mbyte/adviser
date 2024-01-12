import React from 'react';
import {
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItemOption,
    MenuOptionGroup,
    MenuDivider
} from '@chakra-ui/react'
import { MdSettings } from "react-icons/md";
const AdjustImageMenu = ({ themeColor, size, setSize, imgStyle, setStyle, imgQuality, setQuality }) => {

    return (
        <Menu placement={'auto-start'} autoSelect={false}>
            <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<MdSettings fontSize={'20px'} />}
                variant='outline'
                colorScheme={themeColor}
                size={['sm', 'md']}
                px={'2'}
            />
            <MenuList zIndex={1011} >
                <MenuOptionGroup defaultValue={size} title='Image Size' type='radio' onChange={setSize} >
                    <MenuItemOption value='A' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>1024x1024 pixels</MenuItemOption>
                    <MenuItemOption value='B' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>1792x1024 pixels</MenuItemOption>
                    <MenuItemOption value='C' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>1024x1792 pixels</MenuItemOption>
                </MenuOptionGroup>
                <MenuDivider />
                <MenuOptionGroup defaultValue={imgStyle} title='Image Style' type='radio' onChange={setStyle} >
                    <MenuItemOption value='vivid' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>
                        Colorful (hyper-real and dramatic images)
                    </MenuItemOption>
                    <MenuItemOption value='natural' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>Natural</MenuItemOption>
                </MenuOptionGroup>
                <MenuOptionGroup defaultValue={imgQuality} title='Image Quality' type='radio' onChange={setQuality} >
                    <MenuItemOption value='standard' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>Standard</MenuItemOption>
                    <MenuItemOption value='hd' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>HD (for enhanced detail)</MenuItemOption>
                </MenuOptionGroup>
            </MenuList>
        </Menu >
    );
};

export default AdjustImageMenu;