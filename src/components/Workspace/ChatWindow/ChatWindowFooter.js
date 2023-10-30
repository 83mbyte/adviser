import { Box, Button, CardFooter, Textarea, VStack, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { forwardRef, useEffect, useState } from 'react';


const textAreaAnimation = {
    oneRow: { height: 'auto', minHeight: '40px' },
    multiRows: { height: '70px' }
}

const footerVisibilityAnimation = {
    visible: custom => ({

        opacity: 1,
        height: 'auto',
        transition: {
            height: {
                delay: 0.1,
            },

        }
    }),
    hidden: {
        height: '0',
        opacity: 0,
        transition: {
            opacity: { duration: 0.1 },
            height: {
                type: 'tween',
                ease: 'linear',
                duration: 0.2
            }
        }
    },
    hidden2: {
        y: 200,
        transition: { duration: 1, type: 'tween', ease: 'linear' }
    },
    visible2: {
        y: 0,
        transition: { duration: 1, type: 'tween', ease: 'linear' }
    }
}


const ChatWindowFooter = forwardRef(function ChatWindowFooterRef({ themeColor, selectedQuestion, isLoadingBtn, submitButtonHandler }, ref) {

    const [changeHeight, setChangeHeight] = useState(false);
    const footerHeightVariant = useBreakpointValue(
        {
            base: '115px',
            md: '80px'
        }
    );

    const checkInputHeight = (e) => {

        if (e.target.scrollHeight > 39 && e.target.value !== '') {
            setChangeHeight(true);
        } else if (e.target.value == '' || e.target.value.length < 20) {
            setChangeHeight(false);
        }
    }

    useEffect(() => {
        if (selectedQuestion && (selectedQuestion !== '' || selectedQuestion !== undefined)) {
            ref.current.value = '';
            ref.current.value = selectedQuestion;
            ref.current.focus();
        }
    }, [selectedQuestion, ref])

    return (
        <CardFooter bg='' py={1} px={[2, 3]}
            key={'footerContainer'}
            layout
            as={motion.div}
            variants={footerVisibilityAnimation}
            initial={'hidden'}
            animate={'visible'}
            exit={'hidden'}
            custom={footerHeightVariant}
            style={{ willChange: 'height' }}
        >
            <VStack w={'full'} spacing={0} >
                <Box bg={`${themeColor}.300`} w={'full'} h={'1px'} >
                </Box>
                <Box bg=''
                    my={3}
                    display={'flex'}
                    flexDirection={['column', 'row']}
                    alignItems={'center'}
                    w='full'
                    columnGap={2}
                >
                    <Textarea

                        ref={ref}
                        resize={'none'}
                        rows={1}
                        marginBottom={{ base: '10px', sm: '0px' }}
                        borderColor={`${themeColor}.200`}
                        _hover={{ borderColor: `${themeColor}.600` }}
                        _focusVisible={{ borderColor: `${themeColor}.600` }}
                        placeholder={'ask me.. or use a predefined prompt'}
                        onChange={(e) => checkInputHeight(e)}
                        onFocus={(e) => { checkInputHeight(e); e.target.setSelectionRange(e.target.value.length, e.target.value.length) }}
                        defaultValue={selectedQuestion}
                        as={motion.textarea}
                        variants={textAreaAnimation}
                        initial={'oneRow'}
                        animate={changeHeight ? 'multiRows' : 'oneRow'}
                        layout
                    />

                    <Button colorScheme={themeColor} w={['full', 'min']}
                        isLoading={isLoadingBtn}
                        onClick={() => submitButtonHandler()}
                    >Send</Button>
                </Box>
            </VStack>
        </CardFooter>
    );
});

export default ChatWindowFooter;