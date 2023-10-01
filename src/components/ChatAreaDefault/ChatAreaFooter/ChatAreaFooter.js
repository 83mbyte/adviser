import React from 'react';
import { Box, Button, CardFooter, Flex, Input, VStack } from '@chakra-ui/react';

const ChatAreaFooter = React.forwardRef((props, ref) => {
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
        <CardFooter ref={ref}>

            <VStack w='full' rowGap={4}>
                <Box bg={`${themeColor}.300`} w={'full'} h={'1px'}>

                </Box>
                <Flex w='full' gap={3} flexDirection={['column', 'row']} alignItems={'center'}>
                    <Input
                        ref={inputRef}
                        borderColor={`${themeColor}.200`}
                        _hover={{ borderColor: `${themeColor}.600` }}
                        _focusVisible={{ borderColor: `${themeColor}.600` }}
                        defaultValue={predefinedPrompt}
                        placeholder={'ask me.. or use a predefined prompt'}
                        w={'full'}
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