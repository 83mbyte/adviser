import { CardFooter, VStack, useBreakpointValue, Box, Textarea, Button } from '@chakra-ui/react';
import { forwardRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdjustImageMenu from '../../Menus/AdjustImageMenu';

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

const ImageCreatorFooter = forwardRef(function ImageCreatorFooterRef({ themeColor, disabledForm, isLoadingBtn, submitButtonHandler, imgSize, setImgSize, selectedIdea }, ref) {
    const [changeHeight, setChangeHeight] = useState(false);
    const footerHeightVariant = useBreakpointValue(
        {
            base: '115px',
            md: '80px'
        })

    const checkInputHeight = (e) => {
        if (e.target.scrollHeight > 39 && e.target.value !== '') {
            setChangeHeight(true);
        } else if (e.target.value == '' || e.target.value.length < 20) {
            setChangeHeight(false);
        }
    }

    useEffect(() => {
        if (selectedIdea && (selectedIdea !== '' || selectedIdea !== undefined)) {
            ref.current.value = '';
            ref.current.value = selectedIdea;
            ref.current.focus();
        }

    }, [selectedIdea, ref])
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
            <VStack w={'full'} spacing={0}>
                <Box bg={`${themeColor}.300`} w={'full'} h={'1px'} ></Box>
                <Box bg=''
                    my={3}
                    display={'flex'}
                    flexDirection={['column', 'row']}
                    alignItems={'center'}
                    w='full'
                    columnGap={2}
                    rowGap={2}
                >
                    <Textarea
                        ref={ref}
                        resize={'none'}
                        rows={1}
                        isDisabled={disabledForm}
                        marginBottom={{ base: '0', sm: '0px' }}
                        borderColor={`${themeColor}.200`}
                        _hover={{ borderColor: `${themeColor}.600` }}
                        _focusVisible={{ borderColor: `${themeColor}.600` }}
                        placeholder={'A sunflower seeds..'}
                        onChange={(e) => checkInputHeight(e)}
                        onFocus={(e) => { checkInputHeight(e); e.target.setSelectionRange(e.target.value.length, e.target.value.length) }}
                        defaultValue={selectedIdea}
                        as={motion.textarea}
                        variants={textAreaAnimation}
                        initial={'oneRow'}
                        animate={changeHeight ? 'multiRows' : 'oneRow'}
                        layout
                    />
                    <Box display={'flex'} flexDirection={'row'} columnGap={2}>
                        <AdjustImageMenu themeColor={themeColor} size={imgSize} setSize={setImgSize} />
                        <Button
                            w={['full', 'min']}
                            colorScheme={themeColor}
                            isDisabled={disabledForm}
                            isLoading={isLoadingBtn}
                            size={{ base: 'sm', sm: 'md' }}
                            onClick={() => submitButtonHandler()}
                        >Create</Button>
                    </Box>
                </Box>
            </VStack>

        </CardFooter>
    );
});

export default ImageCreatorFooter;