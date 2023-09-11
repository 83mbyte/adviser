'use client'
import { Box, Button, Card, CardBody, CardFooter, Flex, Input, VStack, Image } from '@chakra-ui/react';
import React, { useRef } from 'react';

import OpacityBox from '../OpacityBox/OpacityBox';
import AdjustImageMenu from './AdjustImageMenu';

const ImageArea = ({ imgUrl, isBtnLoading, onClickBtn, themeColor, size, setSize }) => {

    const [isVisible, setIsVisible] = React.useState(false);
    const inputRef = useRef(null);

    React.useEffect(() => {
        setIsVisible(true)
        return () => setIsVisible(false)
    }, []);

    return (

        <OpacityBox isVisible={isVisible} >
            <Box
                bg=''
                display={'flex'}
                flexDirection={'column'}
                height={'100%'}
                maxHeight={'100%'}
                width={['full', 'md', 'lg', '3xl']}
                alignItems={'center'}
                marging={'0 auto'}
                justifyContent={'center'}
            >

                <Card w={'full'} h={'100%'} bg={''} borderTopRadius={'10px'} borderBottomRadius={0} >
                    <CardBody bg='' display={'block'} flexDirection={'column'} overflow={'hidden'} m={0} p={['2', '3']}>
                        <Box
                            border={'1px dashed #DEDEDE'}
                            borderRadius={'5px'}
                            w={'full'}
                            display={'flex'}
                            flexDirection={'column'}
                            p={2}
                            bg={'#FAFAFA'}
                            h={'100%'}
                            overflow={'auto'}
                            position='relative'
                            justifyContent={'flex-end'}
                        >
                            {
                                imgUrl &&
                                <Box boxSize='full' bg='' display={'block'} overflow={'scroll'}>
                                    <Box display={'flex'} h={'100%'} bg='' justifyContent={'center'} flex={1} alignItems={'center'}>
                                        <Image src={imgUrl} alt='ready img' border={'1px solid black'} />
                                    </Box>
                                </Box>
                            }
                        </Box>

                    </CardBody>

                    <CardFooter>
                        <VStack w='full' rowGap={4}>
                            <Box bg={`${themeColor}.300`} w={'full'} h={'1px'}></Box>
                            <Flex w='full' gap={3} flexDirection={['column', 'row']} alignItems={'center'}>
                                <Box w='full' display={'flex'} flex={1}>
                                    <Input
                                        ref={inputRef}
                                        borderColor={`${themeColor}.200`}
                                        _hover={{ borderColor: `${themeColor}.600` }}
                                        _focusVisible={{ borderColor: `${themeColor}.600` }}
                                        placeholder={'An Impressionist oil painting of sunflowers in a purple vase..'}
                                    />
                                </Box>
                                <Box display={'flex'} flexDirection={'row'} gap={3}  >
                                    <AdjustImageMenu themeColor={themeColor} size={size} setSize={setSize} />
                                    <Button
                                        isLoading={isBtnLoading}
                                        colorScheme={themeColor}
                                        onClick={() => onClickBtn(inputRef)}
                                    >
                                        Create
                                    </Button>
                                </Box>
                            </Flex>
                        </VStack>

                    </CardFooter>
                </Card>

            </Box>
        </OpacityBox>
    );
};

export default ImageArea;