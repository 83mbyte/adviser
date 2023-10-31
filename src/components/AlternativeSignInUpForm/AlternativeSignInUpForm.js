import { Box, Divider, HStack, Text, VStack } from '@chakra-ui/react';

const AlternativeSignInUpForm = ({ children }) => {
    return (
        <Box w='full'>
            <VStack spacing={[1, 4]} >
                <HStack w={'full'} justifyContent={'space-between'}>
                    <Divider w={'full'} />
                    <Text backgroundColor={''} textAlign={'center'} py={1} px={1} w={10} fontSize={'xs'}>or</Text>
                    <Divider w={'full'} />
                </HStack>
                <Box w='full'>
                    {children}
                </Box>
            </VStack >
        </Box >
    );
};

export default AlternativeSignInUpForm;