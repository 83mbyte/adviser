import { Box, Button, CardFooter, IconButton, Textarea, Tooltip, VStack, useBreakpointValue } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, useEffect, useState } from 'react';

import { FaMicrophone } from "react-icons/fa";
import { useSettingsContext } from '@/src/context/SettingsContext';

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


const ChatWindowFooter = forwardRef(function ChatWindowFooterRef({ themeColor, inputTextData, setInputTextData, isLoadingBtn, submitButtonHandler, showFooter }, ref) {

    const userSettings = useSettingsContext();

    const showModalSettings = userSettings.showModalWindow;
    const [changeHeight, setChangeHeight] = useState(false);
    const footerHeightVariant = useBreakpointValue(
        {
            base: '115px',
            md: '80px'
        }
    );

    //setup mic
    const [showMic, setShowMic] = useState(false);

    const toggleMic = () => {
        console.log('click mic');
        showModalSettings.setShowModal({ isShow: true, type: 'VoiceRecording' });

    }

    // setup mic end

    const checkInputHeight = (e) => {
        if (e.target.scrollHeight > 49 && e.target.value !== '') {
            setChangeHeight(true);
        } else if (e.target.value == '' || e.target.value.length < 20) {
            setChangeHeight(false);
        }
    }

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            setShowMic(true);
        }
    }, [])


    useEffect(() => {
        if (inputTextData && (inputTextData !== '' || inputTextData !== undefined)) {
            ref.current.value = '';
            ref.current.value = inputTextData;
            ref.current.focus();
        }
    }, [inputTextData, ref])

    return (
        <AnimatePresence mode='wait'>
            {
                showFooter &&
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

                            <Box
                                borderWidth={'1px'}
                                borderRadius={'8px'}
                                borderColor={`${themeColor}.200`}
                                w='full'
                                px={0}
                                display={'flex'}
                                alignItems={'center'}
                                marginBottom={{ base: '10px', sm: '0px' }}>
                                <Textarea

                                    ref={ref}
                                    resize={'none'}
                                    rows={1}
                                    border={'none'}
                                    _focusVisible={{ borderColor: `${themeColor}.900` }}
                                    placeholder={'ask me.. or use a predefined prompt'}
                                    onChange={(e) => { setInputTextData(e.target.value); checkInputHeight(e) }}
                                    onFocus={(e) => { checkInputHeight(e); e.target.setSelectionRange(e.target.value.length, e.target.value.length) }}
                                    defaultValue={inputTextData}
                                    as={motion.textarea}
                                    variants={textAreaAnimation}
                                    initial={'oneRow'}
                                    fontSize={{ base: 'xs', sm: 'md' }}
                                    animate={changeHeight ? 'multiRows' : 'oneRow'}
                                    layout
                                />
                                {
                                    showMic &&
                                    <Tooltip label='Use your voice' hasArrow bg={`${themeColor}.500`} placement='auto'>
                                        <IconButton
                                            aria-label='microphone'
                                            icon={<FaMicrophone />}
                                            variant={'ghost'}
                                            colorScheme={themeColor}
                                            onClick={() => toggleMic()}
                                        />
                                    </Tooltip>}
                            </Box>

                            <Button colorScheme={themeColor} w={['full', 'min']}
                                isLoading={isLoadingBtn}
                                onClick={() => submitButtonHandler()}
                            >Send</Button>
                        </Box>
                    </VStack>
                </CardFooter>
            }
        </AnimatePresence>
    );
});

export default ChatWindowFooter;