import { Box, HStack, IconButton, Spacer, Text } from '@chakra-ui/react';

import { MdOutlineNotes, MdApps, } from 'react-icons/md';

import ChatSettingsAnimatedIcon from './ChatSettingsAnimatedIcon';


const HeaderWithButtons = ({ toggleShowTopics, themeColor, togglePredefinedList, showIconList, setShowChatSettings, showChatSettings, setShowPredefined }) => {
    return (

        <Box bg={'#FAFAFA'}
            zIndex={10}
            display={'block'}
            w='full'
            p={0}
            pb={2}
            borderBottomWidth={'1px'}
            borderBottomColor={'gray.200'}
        >
            <HStack justifyContent={'space-between'}>
                <HStack bg=''>
                    <IconButton icon={<MdApps size={'22px'} />} colorScheme={themeColor} variant={'ghost'} onClick={toggleShowTopics} size={'sm'}
                        p={2}
                    />

                    {showIconList &&
                        <IconButton icon={<MdOutlineNotes size={'28px'} />} colorScheme={themeColor} variant={'ghost'}
                            onClick={() => { setShowChatSettings(false); togglePredefinedList() }} size={'sm'}
                            p={2}
                        />
                    }

                </HStack>
                <HStack bg='' w='100%'>
                    {
                        showChatSettings == true ? <Text textAlign={'center'} w="100%" bg='' marginLeft={'-40px'}>Chat Settings</Text> : <Spacer w={'100%'} />
                    }

                    <IconButton
                        icon={<ChatSettingsAnimatedIcon color={themeColor} size={'26px'} />}
                        variant={'ghost'}
                        colorScheme={themeColor}
                        size={'sm'}
                        onClick={() => { setShowPredefined(false); setShowChatSettings(!showChatSettings); }}
                    />
                </HStack>
            </HStack>
        </Box>
    );
};

export default HeaderWithButtons;

