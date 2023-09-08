'use client'
import { Box, Button, Card, CardBody, CardFooter, Flex, Input, VStack } from '@chakra-ui/react';
import React, { useRef } from 'react';
import Messages from './Messages/Messages';
import OpacityBox from '../OpacityBox/OpacityBox';

const ChatArea = ({ currentChat, isBtnLoading, onClickBtn, themeColor }) => {

    const [isVisible, setIsVisible] = React.useState(false);
    const inputRef = useRef(null);

    React.useEffect(() => {
        setIsVisible(true)
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

                <Card w={'full'} h={'100%'} mx={'2'} bg={''}>
                    <CardBody bg='' display={'block'} flexDirection={'column'} overflow={'hidden'}>
                        <Messages currentChat={currentChat} themeColor={themeColor} isBtnLoading={isBtnLoading} />
                    </CardBody>

                    <CardFooter>
                        <VStack w='full' rowGap={4}>
                            <Box bg={`${themeColor}.300`} w={'full'} h={'1px'}></Box>
                            <Flex w='full' gap={3} flexDirection={['column', 'row']} alignItems={'center'}>
                                <Input
                                    ref={inputRef}
                                    borderColor={`${themeColor}.200`}
                                    _hover={{ borderColor: `${themeColor}.600` }}
                                    _focusVisible={{ borderColor: `${themeColor}.600` }}
                                    placeholder={'ask me..'}
                                />
                                <Button
                                    isLoading={isBtnLoading}
                                    colorScheme={themeColor}
                                    onClick={() => onClickBtn(inputRef)}
                                >
                                    Send
                                </Button>
                            </Flex>
                        </VStack>

                    </CardFooter>
                </Card>

            </Box>
        </OpacityBox>
    );
};

export default ChatArea;