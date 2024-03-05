import { useAuthContext } from '@/src/context/AuthContextProvider';
import { useSettingsContext } from '@/src/context/SettingsContext/SettingsContextProvider';
import { dbAPI } from '@/src/lib/dbAPI';
import {
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItemOption,
    MenuOptionGroup,
    MenuDivider
} from '@chakra-ui/react'
import { useState } from 'react';
import { MdSettings } from "react-icons/md";

const AdjustImageMenu = ({ themeColor, isDisabled }) => {

    const [isImageStyleModified, setIsImageStyleModified] = useState(null);
    const settingsContext = useSettingsContext();
    const imageSettings = settingsContext.settings.imageSettings;

    const user = useAuthContext();

    const updateSettings = (key, value) => {

        if (key == 'style') {
            console.log('style chagned')
            setIsImageStyleModified(value)
        }
        settingsContext.updateSettings('imageSettings', key, value);

    }

    const saveOnCloseMenu = async () => {
        if (isImageStyleModified) {
            try {
                await dbAPI.updateServerData({
                    userId: user.uid, docName: 'settings', field: 'imageSettings', data: {
                        style: settingsContext.settings.imageSettings.style
                    }
                });
                setIsImageStyleModified(null);
            } catch (error) {
                console.error(error)
            }
        }
    }


    return (
        <Menu placement={'auto-start'} autoSelect={false} onClose={saveOnCloseMenu}>
            <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<MdSettings fontSize={'20px'} />}
                variant='outline'
                colorScheme={themeColor}
                size={['sm', 'md']}
                px={'2'}
                isDisabled={isDisabled}
            />
            <MenuList zIndex={1011} >
                <MenuOptionGroup defaultValue={imageSettings.size} title='Image Size' type='radio' onChange={(value) => updateSettings('size', value)} >
                    <MenuItemOption value='A' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>1024x1024 pixels</MenuItemOption>
                    <MenuItemOption value='B' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>1792x1024 pixels</MenuItemOption>
                    <MenuItemOption value='C' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>1024x1792 pixels</MenuItemOption>
                </MenuOptionGroup>
                <MenuDivider />
                <MenuOptionGroup defaultValue={imageSettings.style} title='Image Style' type='radio' onChange={(value) => updateSettings('style', value)} >
                    <MenuItemOption value='vivid' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>
                        Colorful (hyper-real and dramatic images)
                    </MenuItemOption>
                    <MenuItemOption value='natural' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>Natural</MenuItemOption>
                </MenuOptionGroup>
                <MenuOptionGroup defaultValue={imageSettings.quality} title='Image Quality' type='radio' onChange={(value) => updateSettings('quality', value)} >
                    <MenuItemOption value='standard' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>Standard</MenuItemOption>
                    <MenuItemOption value='hd' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>HD (for enhanced detail)</MenuItemOption>
                </MenuOptionGroup>
            </MenuList>
        </Menu >
    );
};

export default AdjustImageMenu;