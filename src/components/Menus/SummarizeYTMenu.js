
import { useSettingsContext } from '@/src/context/SettingsContext/SettingsContextProvider';
import {
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItemOption,
    MenuOptionGroup,
} from '@chakra-ui/react'
import { MdSettings } from "react-icons/md";


const SummarizeYTMenu = ({ themeColor, isDisabled, summarizeSettings, updateSummarizeSettings }) => {

    const settingsContext = useSettingsContext();

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
                isDisabled={true}
            // isDisabled={isDisabled}
            />
            <MenuList zIndex={1011} >
                <MenuOptionGroup defaultValue={summarizeSettings.operation} title='Operation type' type='radio' onChange={(value) => updateSummarizeSettings(value)} >
                    <MenuItemOption value='summarize' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>Get a summary</MenuItemOption>
                    <MenuItemOption value='fullText' fontSize={['xs', 'sm']} _hover={{ backgroundColor: `${themeColor}.50` }}>Get a full text</MenuItemOption>
                </MenuOptionGroup>

            </MenuList>
        </Menu >
    );
};

export default SummarizeYTMenu;