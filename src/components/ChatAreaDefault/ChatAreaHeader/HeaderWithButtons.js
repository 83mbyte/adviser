import { Box, HStack, IconButton, Text } from '@chakra-ui/react';

import { MdOutlineNotes, MdApps } from 'react-icons/md';

const HeaderWithButtons = ({ toggleShowTopics, themeColor, togglePredefinedList, showIconList }) => {
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
            <HStack alignItems={'center'} justifyContent={'flex-start'} bg='' w='full'>

                <IconButton icon={<MdApps size={'22px'} />} colorScheme={themeColor} variant={'ghost'} onClick={toggleShowTopics} size={'sm'}
                    p={2}
                />
                {/* <Box>
                    <Text bg='' w='full' fontSize={'xs'} textAlign={'center'} mb={0} lineHeight={'3'}>Assistance with</Text>
                    <Text bg='' w='full' fontSize={'md'} textAlign={'center'} fontWeight={'600'} lineHeight={'4'}>{selectedTopic}</Text>  
                </Box> */}

                {showIconList &&
                    <IconButton icon={<MdOutlineNotes size={'28px'} />} colorScheme={themeColor} variant={'ghost'} onClick={togglePredefinedList} size={'sm'}
                        p={2}
                    />}

            </HStack>
        </Box>
    );
};

export default HeaderWithButtons;