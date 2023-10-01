import { Box, HStack, IconButton, Text } from '@chakra-ui/react';

import { MdArrowBackIosNew, MdOutlineNotes } from 'react-icons/md';

const HeaderWithButtons = ({ toggleShowTopics, themeColor, selectedTopic = '...', togglePredefinedList }) => {
    return (

        <Box bg={'#FAFAFA'}
            position={'absolute'}
            zIndex={10}
            display={'block'}
            w='full'
            p={0}
            pb={2}
            borderBottomWidth={'1px'}
            borderBottomColor={'gray.200'}
        >
            <HStack alignItems={'center'} justifyContent={'space-between'} bg='' w='full'>

                <IconButton icon={<MdArrowBackIosNew size={'22px'} />} colorScheme={themeColor} variant={'ghost'} onClick={toggleShowTopics} size={'sm'}
                    p={2}
                />
                <Text bg='' w='full' fontSize={'20px'} fontWeight={'600'} pl={2} textAlign={'center'}>{selectedTopic}</Text>

                <IconButton icon={<MdOutlineNotes size={'28px'} />} colorScheme={themeColor} variant={'ghost'} onClick={togglePredefinedList} size={'sm'}
                    p={2}
                />

            </HStack>
        </Box>
    );
};

export default HeaderWithButtons;