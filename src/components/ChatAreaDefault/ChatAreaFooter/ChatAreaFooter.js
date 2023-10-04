import React from 'react';
import { Box, Button, CardFooter, Flex, Input, VStack } from '@chakra-ui/react';

const ChatAreaFooter = React.forwardRef(function ChatAreaFooterWithRef(props, ref) {
    const inputRef = React.useRef(null);

    const onClickHandler = () => {
        setShowPredefined(false);
        onClickBtn(inputRef);
    }

    const { themeColor, predefinedPrompt, isBtnLoading, onClickBtn, setShowPredefined } = props;
    React.useEffect(() => {
        if (predefinedPrompt !== '') {
            inputRef.current.focus()
        }
    }, [predefinedPrompt]);
    return (
        <CardFooter ref={ref} bg='' py={0}  >

            <VStack w='full'>
                <Box bg={`${themeColor}.300`} w={'full'} h={'1px'} my={'5px'}>
                </Box>
                <Flex w='full' flexDirection={['column', 'row']} alignItems={'center'}
                    columnGap={2}
                >
                    <Input
                        marginTop={'2px'}
                        ref={inputRef}
                        borderColor={`${themeColor}.200`}
                        _hover={{ borderColor: `${themeColor}.600` }}
                        _focusVisible={{ borderColor: `${themeColor}.600` }}
                        defaultValue={predefinedPrompt}
                        placeholder={'ask me.. or use a predefined prompt'}
                        w={'full'}
                        marginBottom={{ base: '10px', md: '1px' }}
                    />
                    <Button
                        isLoading={isBtnLoading}
                        colorScheme={themeColor}
                        onClick={onClickHandler}
                        w={['full', 'min']}
                    >
                        Send
                    </Button>
                </Flex>
            </VStack>

        </CardFooter>
    );
});

export default ChatAreaFooter;