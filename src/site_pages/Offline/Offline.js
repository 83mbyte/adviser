import { Box, Text, Heading } from '@chakra-ui/react';
import React from 'react';

const Offline = () => {
    return (
        <Box display={'flex'}
            h='100%'
            justifyContent={'center'}
            alignItems={'center'}
            padding={5}
            flexDirection={'column'}
        >
            <Heading as='h2' size={'lg'}>Oops!..</Heading>
            <Text pt={1}>The application seems to be offline. Please try again later.</Text>
        </Box>
    );
};

export default Offline;