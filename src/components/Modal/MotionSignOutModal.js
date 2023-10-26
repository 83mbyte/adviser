import { Box, Card, CardBody, CardFooter, Button, HStack, Heading, Text, VStack } from "@chakra-ui/react";

import { useUISettingsContext } from "@/src/context/UISettingsContext";
import { animationProps } from "@/src/lib/animationProps";
import { authAPI } from "@/src/lib/authAPI";

const { motion, AnimatePresence } = require("framer-motion")

const MotionModalSignOut = ({ showModal = { isShow: false, type: null }, handleClose }) => {

    const { themeColor } = useUISettingsContext().userThemeColor;

    return (
        <AnimatePresence mode='wait'>

            {
                showModal.isShow === true && showModal.type === 'SignOut' &&
                <motion.div
                    onClick={handleClose}
                    key={'backdrop'}
                    style={{ zIndex: 3001, position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.55)' }}
                    variants={animationProps.opacity}
                    initial={'hidden'}
                    animate={'show'}
                    exit={'exit'}
                >
                    <motion.div
                        key={'modalInner'}
                        variants={animationProps.slideFromTop}
                        initial={'hidden'}
                        animate={'visible'}
                        exit={'exit'}
                    >
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
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence >
    )
}

export default MotionModalSignOut;
