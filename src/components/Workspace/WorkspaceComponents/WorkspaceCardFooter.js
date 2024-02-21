import { CardFooter, VStack, Box, useBreakpointValue, Input, Button, Textarea, Tooltip, IconButton } from '@chakra-ui/react';
import { Fragment, forwardRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sanitize } from 'isomorphic-dompurify';
import { FaMicrophone } from "react-icons/fa";

import AdjustImageMenu from '../../Menus/AdjustImageMenu';
import { useSettingsContext } from '@/src/context/SettingsContext';
import SummarizeYTMenu from '../../Menus/SummarizeYTMenu';

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

const textAreaAnimation = {
    oneRow: { height: 'auto', minHeight: '40px' },
    multiRows: { height: '70px' }
}

const WorkspaceCardFooter = forwardRef(function WorkspaceCardFooterRef({ inputValue, showFooter, themeColor, footerVariant, onSubmitHandler, isDisabled, currentChatHistoryId, isLoading, }, ref) {

    const footerHeightVariant = useBreakpointValue(
        {
            base: '115px',
            md: '80px'
        })

    const sanitizeString = (dirtyString) => {
        return sanitize(dirtyString);
    }

    function onSubmitButtonHandler(inputValue) {
        let sanitezedValue = sanitizeString(inputValue.trim());
        onSubmitHandler({ id: currentChatHistoryId, value: sanitezedValue });
        ref.current.value = '';
    }

    let footerForm = null;

    switch (footerVariant) {
        case 'ytsummarize':
            footerForm = <FormSummarizeYT ref={ref} defaultValue={inputValue} themeColor={themeColor} onSubmitButtonHandler={onSubmitButtonHandler} isDisabled={isDisabled} isLoading={isLoading} />
            break;
        case 'textchat':
            footerForm = <FormTextChat ref={ref} defaultValue={inputValue} themeColor={themeColor} onSubmitButtonHandler={onSubmitButtonHandler} isDisabled={isDisabled} isLoading={isLoading} />
            break;
        case 'image':
            footerForm = <FormImageCreate ref={ref} defaultValue={inputValue} themeColor={themeColor} onSubmitButtonHandler={onSubmitButtonHandler} isDisabled={isDisabled} isLoading={isLoading} />
            break;
        default:
            break;
    }

    useEffect(() => {
        if (inputValue && (inputValue !== '' || inputValue !== undefined)) {
            ref.current.value = '';
            ref.current.value = inputValue;
            ref.current.focus();
        }
    }, [inputValue, ref])

    return (
        <>
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
                        <VStack w={'full'} spacing={0}>
                            <Box bg={`${themeColor}.300`} w={'full'} h={'1px'} >
                            </Box>
                            <Box bg=''
                                my={3}
                                display={'flex'}
                                flexDirection={['column', 'row']}
                                alignItems={'center'}
                                w='full'
                                columnGap={2}
                                rowGap={2}
                            >
                                {footerForm}
                            </Box>
                        </VStack>
                    </CardFooter>
                }
            </AnimatePresence>
        </>
    )
})

export default WorkspaceCardFooter;

const FormSummarizeYT = forwardRef(function FormSummarizeYTRef({ themeColor, defaultValue, onSubmitButtonHandler, isDisabled, isLoading }, ref) {
    const summarizeSettings = useSettingsContext().summarizeSettings.summarizeSettings;

    return (

        <Fragment key={'formYTubeSummarize'}>
            <Input ref={ref} isDisabled={isDisabled} placeholder="https://www.youtube.com/watch?v=Video_ID" defaultValue={defaultValue} spellCheck={false} />
            <Box display={'flex'} flexDirection={'row'} columnGap={2}>
                <SummarizeYTMenu themeColor={themeColor} isDisabled={isDisabled} />
                <Button
                    colorScheme={themeColor}
                    isDisabled={isDisabled}
                    isLoading={isLoading}
                    w={['full', 'min']}
                    size={{ base: 'sm', sm: 'md' }}
                    onClick={() => onSubmitButtonHandler(ref.current.value)}
                >
                    {summarizeSettings.operation == 'summarize' ? 'Summarize' : 'Get text'}
                </Button>
            </Box>
        </Fragment>
    )
})

const FormTextChat = forwardRef(function FormTextChatRef({ themeColor, onSubmitButtonHandler, isDisabled, defaultValue, isLoading }, ref) {
    const showModalSettings = useSettingsContext().showModalWindow;

    const checkInputHeight = (e) => {
        if (e.target.scrollHeight > 49 && e.target.value !== '') {
            setChangeHeight(true);
        } else if (e.target.value == '' || e.target.value.length < 20) {
            setChangeHeight(false);
        }
    }
    const [showMic, setShowMic] = useState(false);
    const [changeHeight, setChangeHeight] = useState(false);

    const toggleMic = () => {
        showModalSettings.setShowModal({ isShow: true, type: 'VoiceRecording' });
    }

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            setShowMic(true);
        }
    }, []);

    return (
        <Fragment key={'formTextChat'}>
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
                    isDisabled={isDisabled}
                    ref={ref}
                    resize={'none'}
                    rows={1}
                    border={'none'}
                    _focusVisible={{ borderColor: `${themeColor}.900` }}
                    placeholder={showMic ? 'type text message or use a microphone' : 'type text message'}
                    onChange={(e) => { checkInputHeight(e) }}
                    // onBlur={(e) => setInputTextData(e.target.value)}
                    // onFocus={(e) => { checkInputHeight(e); e.target.setSelectionRange(e.target.value.length, e.target.value.length) }}
                    defaultValue={defaultValue}
                    as={motion.textarea}
                    variants={textAreaAnimation}
                    initial={'oneRow'}
                    fontSize={{ base: 'xs', sm: 'md' }}
                    animate={changeHeight ? 'multiRows' : 'oneRow'}
                    layout
                    spellCheck={false}
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
            <Button
                colorScheme={themeColor}
                isDisabled={isDisabled}
                isLoading={isLoading}
                onClick={() => onSubmitButtonHandler(ref.current.value)}
            >
                Send
            </Button>
        </Fragment>
    )
})
const FormImageCreate = forwardRef(function FormImageCreateRef({ themeColor, onSubmitButtonHandler, isDisabled, defaultValue, isLoading, }, ref) {
    const [changeHeight, setChangeHeight] = useState(false);

    const checkInputHeight = (e) => {
        if (e.target.scrollHeight > 39 && e.target.value !== '') {
            setChangeHeight(true);
        } else if (e.target.value == '' || e.target.value.length < 20) {
            setChangeHeight(false);
        }
    }


    return (
        <Fragment key={'formTextChat'}>
            <Textarea
                ref={ref}
                resize={'none'}
                rows={1}
                isDisabled={isDisabled}
                marginBottom={{ base: '0', sm: '0px' }}
                borderColor={`${themeColor}.200`}
                _hover={{ borderColor: `${themeColor}.600` }}
                _focusVisible={{ borderColor: `${themeColor}.600` }}
                placeholder={'A sunflower seeds..'}
                onChange={(e) => checkInputHeight(e)}
                onFocus={(e) => { checkInputHeight(e); e.target.setSelectionRange(e.target.value.length, e.target.value.length) }}
                defaultValue={defaultValue}
                as={motion.textarea}
                variants={textAreaAnimation}
                initial={'oneRow'}
                animate={changeHeight ? 'multiRows' : 'oneRow'}
                layout
                spellCheck={false}
            />
            <Box display={'flex'} flexDirection={'row'} columnGap={2}>

                <AdjustImageMenu themeColor={themeColor} isDisabled={isDisabled} />

                <Button
                    w={['full', 'min']}
                    colorScheme={themeColor}
                    isDisabled={isDisabled}
                    isLoading={isLoading}
                    size={{ base: 'sm', sm: 'md' }}
                    onClick={() => onSubmitButtonHandler(ref.current.value)}
                >Create
                </Button>
            </Box>
        </Fragment>
    )
});
