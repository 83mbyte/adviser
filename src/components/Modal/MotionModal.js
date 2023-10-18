import { Box, Card, CardBody, CardFooter, CardHeader, Button, HStack, Heading, Text } from "@chakra-ui/react";

import { useUISettingsContext } from "@/src/context/UISettingsContext";
import { animationProps } from "@/src/lib/animationProps";

const { motion, AnimatePresence } = require("framer-motion")

const MotionModal = ({ showModal, headerText = null, bodyText = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.', handleClose, confirmAction }) => {

    const UISettingsContext = useUISettingsContext();
    const { themeColor } = UISettingsContext.userThemeColor;

    return (
        <AnimatePresence mode='wait'>

            {
                showModal &&
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
                                <CardHeader my={0} bg=''>
                                    {
                                        headerText &&
                                        <Heading as={'h4'} fontSize={'xl'}>
                                            {headerText}
                                        </Heading>}

                                </CardHeader>
                                {bodyText &&
                                    <CardBody bg='' py={0}>
                                        <Text textAlign={'center'}>{bodyText}</Text>
                                    </CardBody>
                                }
                                <CardFooter>
                                    <HStack bg='' w='full' justifyContent={'flex-end'}>
                                        <Button colorScheme={themeColor} variant='solid' onClick={confirmAction}>Confirm</Button>
                                        <Button colorScheme={themeColor} variant='outline' onClick={handleClose}>cancel</Button>
                                    </HStack>
                                </CardFooter>
                            </Card>
                        </Box>
                    </motion.div>

                </motion.div>
            }
        </AnimatePresence>
    )
}

export default MotionModal;
