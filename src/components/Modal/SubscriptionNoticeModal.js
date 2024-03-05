import React from 'react';
import { useSettingsContext } from '@/src/context/SettingsContext/SettingsContextProvider';
import { Box, Button, Card, CardBody, CardFooter, HStack, VStack, Heading, Text } from '@chakra-ui/react';


const SubscriptionNoticeModal = ({ renewCheckout }) => {
    const themeColor = useSettingsContext().settings.UI.themeColor;


    return (
        <Box w={['full', 'md']} p={['4', '4']} mt={'-50%'}>
            <Card>
                <CardBody bg='' m={0} p={['2', '3']} >
                    <VStack spacing={'2'} py={4} px={'0'} bg={'#FAFAFA'} h='100%' maxHeight={'100%'} border={'1px dashed #DEDEDE'} borderTopRadius={'10px'}>
                        <Heading as={'h4'} fontSize={'xl'} color={themeColor}>
                            Upgrade your subscription.
                        </Heading>
                        <Text textAlign={'center'}>Your current subscription is over.</Text>
                    </VStack>
                </CardBody>
                <CardFooter pt={0} pb={2}>
                    <HStack bg='' w='full' justifyContent={'center'}>
                        <Button size={['xs', 'sm']} colorScheme={themeColor} variant='solid' onClick={renewCheckout}>Upgrade</Button>
                    </HStack>
                </CardFooter>
            </Card>
        </Box>
    );
};

export default SubscriptionNoticeModal;