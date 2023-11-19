import {
    Image, Button, Box, Card, CardBody, CardFooter, HStack, Text, VStack
} from '@chakra-ui/react'
import { motion } from 'framer-motion';
import { useSettingsContext } from '@/src/context/SettingsContext';

const ZoomImgModal = ({ handleClose, image }) => {
    const { themeColor } = useSettingsContext().userThemeColor;
    return (
        <Box w='100%' maxW={['full', 'xl', '2xl']} p={['4', '4']} h='100%' m={'0 auto'}>
            <Card h='100%' w='100%' >
                <CardBody p={[1, 2]} h='auto' >

                    <Box bg={'#FAFAFA'} border={'1px dashed #DEDEDE'} borderTopRadius={'10px'} w='100%' h="100%" p={1}>
                        {
                            image
                                ?
                                <Box
                                // minH={['256px', '512px']}
                                // minW={['100%', '512px']}
                                // width={'100%'}
                                // height={'100%'}
                                // backgroundRepeat={'no-repeat'}
                                // backgroundPosition={'center'}
                                // backgroundSize={'contain'}
                                // backgroundImage={`url(${image})`}

                                >
                                    <Image src={`data:image/png;base64,${image}`} alt={'expanded_image'} w={'100%'} />
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
    );
};

export default ZoomImgModal;