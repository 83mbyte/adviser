import { forwardRef } from "react";
import { Box, Text, Tooltip, IconButton, Highlight } from "@chakra-ui/react";

import { MdClose, } from "react-icons/md";

const NoStoreImagesNotice = forwardRef(function NoStoreImagesNoticeRef({ themeColor, closeNotice }, ref) {

    return (
        <>
            <Box
                ref={ref}
                bg={`${themeColor}.50`} w='100%'
                px={1}
                mb={2}
                borderBottomWidth={'1px'}
                borderBottomColor={'gray.200'}
                display={'flex'}
                flexDir={'row'}
                alignItems={'center'}
                style={{ willChange: 'height' }}
                zIndex={1002}
            >
                <Text textAlign={'center'} px={2} fontSize={['xs', 'sm']} w='full' >
                    <Highlight
                        query={['Please note', 'the images will no longer be accessible']}
                        styles={{ px: '0', py: '0', rounded: 'sm', fontWeight: 'bold' }}
                    >
                        Please note that we do not store images on our server. If you leave the Generate Image screen or refresh your browser tab, the images will no longer be accessible. However, you have the option to download and save them to your local storage.
                    </Highlight>
                </Text>
                <Box p={0} m={0}>
                    <Tooltip label='Hide' hasArrow bg={`${themeColor}.500`}>
                        <IconButton colorScheme={themeColor} size={'sm'} variant='link' icon={<MdClose />}
                            onClick={() => closeNotice(false)}
                        />
                    </Tooltip>
                </Box>
            </Box>
        </>
    )

});

export default NoStoreImagesNotice;