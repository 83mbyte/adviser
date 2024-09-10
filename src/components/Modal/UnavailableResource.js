import { useSettingsContext } from '@/src/context/SettingsContext/SettingsContextProvider';
import { Box, Card, CardBody, CardFooter, HStack, VStack, Heading, Text } from '@chakra-ui/react';
import React from 'react';

const UnavailableResource = () => {
    const themeColor = useSettingsContext().settings.UI.themeColor;

    return (
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'row'} h='100%'>
            <Box w={['full', 'md']} p={['4', '4']} >
                <Card>
                    <CardBody bg='' m={0} p={['2', '3']} >
                        <VStack spacing={'2'} py={4} px={'0'} bg={'#FAFAFA'} h='100%' maxHeight={'100%'} border={'1px dashed #DEDEDE'} borderTopRadius={'10px'}>
                            <Heading as={'h4'} fontSize={'xl'} color={themeColor}>
                                Summarize YouTube video
                            </Heading>
                            <Text textAlign={'center'}> This service is temporarily suspended.. We apologize for any inconvenience this may have caused.</Text>
                        </VStack>
                    </CardBody>
                    <CardFooter pt={0} pb={2}>
                        <HStack bg='' w='full' justifyContent={'center'}>
                            {/* <Button size={['xs', 'sm']} colorScheme={themeColor} variant='solid' onClick={null}>Close</Button> */}

                        </HStack>
                    </CardFooter>
                </Card>
            </Box>
        </Box>
    );
};

export default UnavailableResource;