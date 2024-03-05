import { Box, Card, CardBody, CardFooter, Button, HStack, Heading, Text, VStack } from "@chakra-ui/react";

import { authAPI } from "@/src/lib/authAPI";
import { useSettingsContext } from "@/src/context/SettingsContext/SettingsContextProvider";

const SignOutModal = ({ handleClose }) => {

    const themeColor = useSettingsContext().settings.UI.themeColor;


    return (

        <Box w={['full', 'md']} p={['4', '4']} mt={'-50%'}>
            <Card>
                <CardBody bg='' m={0} p={['2', '3']} >
                    <VStack spacing={'2'} py={4} px={'0'} bg={'#FAFAFA'} h='100%' maxHeight={'100%'} border={'1px dashed #DEDEDE'} borderTopRadius={'10px'}>
                        <Heading as={'h4'} fontSize={'xl'} color={themeColor}>
                            Are you sure?
                        </Heading>
                        <Text textAlign={'center'}>Your current session will be closed. Please confirm.</Text>
                    </VStack>
                </CardBody>
                <CardFooter pt={0} pb={2}>
                    <HStack bg='' w='full' justifyContent={'center'}>
                        <Button size={['xs', 'sm']} colorScheme={themeColor} variant='solid' onClick={() => authAPI.signOut()}>Confirm</Button>
                        <Button size={['xs', 'sm']} colorScheme={themeColor} variant='outline' onClick={handleClose}>cancel</Button>
                    </HStack>
                </CardFooter>
            </Card>
        </Box>
    )
}

export default SignOutModal;
