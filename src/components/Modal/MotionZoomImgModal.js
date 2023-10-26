import {
    Button, Box, Card, CardBody, CardFooter, HStack, Text, VStack
} from '@chakra-ui/react'
import { Fragment } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { animationProps } from "@/src/lib/animationProps";
import { useUISettingsContext } from '@/src/context/UISettingsContext';

const MotionZoomImgModal = ({ handleClose, showModal = { isShow: false, type: null } }) => {
    const { themeColor } = useUISettingsContext().userThemeColor;

    return (
        <Fragment>
            <AnimatePresence mode='wait'>

                {
                    showModal.isShow === true && showModal.type === 'ZoomImgModal' &&
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
                            variants={animationProps.scaleFromMinToMax}
                            initial={'hidden'}
                            animate={'visible'}
                            exit={'exit'}
                            style={{ backgroundColor: '', height: '95%', width: '100%' }}
                        >
                            <Box w='100%' maxW={['full', 'xl', '2xl', '4xl']} p={['4', '4']} h='100%' m={'0 auto'}>
                                <Card h='100%' w='100%'>
                                    <CardBody p={[1, 2]} h='auto'  >

                                        <Box bg={'#FAFAFA'} border={'1px dashed #DEDEDE'} borderTopRadius={'10px'} w='100%' h="100%" p={0.5}>
                                            {showModal.body && showModal.body !== undefined

                                                ?
                                                <Box
                                                    h='100%'
                                                    w='100%'
                                                    backgroundRepeat={'no-repeat'}
                                                    backgroundPosition={'center'}
                                                    backgroundSize={'contain'}
                                                    backgroundImage={`url(${showModal.body})`}
                                                >
                                                </Box>
                                                : <VStack h='100%' justifyContent={'center'} as={motion.div}
                                                    initial={{ scale: 0.25, opacity: 0 }}
                                                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.5, duration: 0.5 } }}
                                                >
                                                    <Text fontSize={['xs', 'md']}>Something went wrong.</Text>
                                                    <Text fontSize={['xs', 'md']}> Seems no image available.</Text>
                                                </VStack>
                                            }
                                        </Box>
                                    </CardBody>
                                    <CardFooter pt={0} pb={2}>
                                        <HStack w='full' justifyContent={'center'}>
                                            <Button colorScheme={themeColor} size={['xs', 'sm']} variant='outline' onClick={handleClose}>close</Button>
                                        </HStack>
                                    </CardFooter>
                                </Card>
                            </Box>
                        </motion.div>
                    </motion.div>
                }
            </AnimatePresence>
        </Fragment >
    );
};

export default MotionZoomImgModal;