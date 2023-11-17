import { useSettingsContext } from '@/src/context/SettingsContext';
import { Box, Card, CardBody, CardFooter, Button, HStack, Heading, Text, VStack } from '@chakra-ui/react';

const CheckoutResultModal = ({ handleClose, result, renewCheckout }) => {
    const { themeColor } = useSettingsContext().userThemeColor;
    const isSuccess = result === 'complete';

    return (
        <Box w={['full', 'md']} p={['4', '4']} mt={'-50%'}>
            <Card>
                <CardBody bg='' m={0} p={['2', '3']} >
                    <VStack spacing={'2'} py={4} px={'2'} bg={'#FAFAFA'} h='100%' maxHeight={'100%'} border={'1px dashed #DEDEDE'} borderTopRadius={'10px'}>
                        <Heading as={'h4'} fontSize={'xl'} color={isSuccess ? 'green' : 'red'}>
                            {isSuccess ? 'Congratulation!' : 'Operation unsuccessful.'}
                        </Heading>
                        {
                            isSuccess
                                ? <Text textAlign={'center'}>Your plan will be updated within seconds.</Text>
                                : <Text textAlign={'center'} fontSize={['sm', 'md']}>Unfortunately your payment was not fulfilled.<br /> Try again OR complete it later.</Text>
                        }
                    </VStack>
                </CardBody>
                <CardFooter pt={0} pb={2}>
                    <HStack bg='' w='full' justifyContent={'center'}>
                        {
                            isSuccess
                                ? <Button size={['xs', 'sm']} colorScheme={themeColor} variant='solid' onClick={handleClose}>Close</Button>
                                :
                                <>
                                    <Button size={['xs', 'sm']} colorScheme={themeColor} variant='solid' onClick={renewCheckout}>Try again</Button>
                                    <Button size={['xs', 'sm']} colorScheme={themeColor} variant='outline' onClick={handleClose}>Close</Button>
                                </>
                        }
                    </HStack>
                </CardFooter>
            </Card>
        </Box>
    );
};

export default CheckoutResultModal;