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
import { useSettingsContext } from '@/src/context/SettingsContext';
const AdjustImageMenu = ({ themeColor,isDisabled }) => {

    const settingsContext = useSettingsContext();

    const { imageSettings, setImageSettings } = settingsContext.imageSettings;

    const updateSettings = (value, type) => {

        setImageSettings({
            ...imageSettings,
            [type]: value
        })
    }


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
                isDisabled={isDisabled}
            />
            <MenuList zIndex={1011} >
                <MenuOptionGroup defaultValue={imageSettings.size} title='Image Size' type='radio' onChange={(value) => updateSettings(value, 'size')} >
                    <MenuItemOption value='A' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>1024x1024 pixels</MenuItemOption>
                    <MenuItemOption value='B' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>1792x1024 pixels</MenuItemOption>
                    <MenuItemOption value='C' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>1024x1792 pixels</MenuItemOption>
                </MenuOptionGroup>
                <MenuDivider />
                <MenuOptionGroup defaultValue={imageSettings.style} title='Image Style' type='radio' onChange={(value) => updateSettings(value, 'style')} >
                    <MenuItemOption value='vivid' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>
                        Colorful (hyper-real and dramatic images)
                    </MenuItemOption>
                    <MenuItemOption value='natural' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>Natural</MenuItemOption>
                </MenuOptionGroup>
                <MenuOptionGroup defaultValue={imageSettings.quality} title='Image Quality' type='radio' onChange={(value) => updateSettings(value, 'quality')} >
                    <MenuItemOption value='standard' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>Standard</MenuItemOption>
                    <MenuItemOption value='hd' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>HD (for enhanced detail)</MenuItemOption>
                </MenuOptionGroup>
            </MenuList>
        </Menu >
    );
};

export default AdjustImageMenu;