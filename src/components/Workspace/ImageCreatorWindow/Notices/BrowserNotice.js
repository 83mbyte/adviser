import { forwardRef } from "react";

import { Box, Text, Highlight, Tooltip, IconButton } from "@chakra-ui/react";
import { MdClose, } from "react-icons/md";

const BrowserNotice = forwardRef(function BrowserNoticeRef({ themeColor, type, setNoticeAboutBrowser }, ref) {
    return (

        <Box
            ref={ref}
            bg={`red.400`} w='100%'
            px={1}
            zIndex={1001}
            borderBottomWidth={'1px'}
            borderBottomColor={'gray.200'}
            display={'flex'}
            flexDir={'row'}
            // as={motion.div}
            alignItems={'center'}

        >
            {
                !type &&
                <Text textAlign={'center'} px={2} fontSize={['xs', 'sm']} w='full' color={'#FFF'}>

                    <Highlight
                        query={['browser is outdated', 'the images will no longer be accessible']}
                        styles={{ px: '0', py: '0', fontWeight: 'bold', color: '#FFF', textDecoration: 'underline' }}
                    >Your web browser is outdated and may not be able to properly display this content. Please update or change your browser to access the images.
                    </Highlight>

                </Text>
            }
            {
                type === 'osOutdated' &&
                <Text textAlign={'center'} px={2} fontSize={['xs', 'sm']} w='full' color={'#FFF'}>
                    <Highlight
                        query={['operating system is not compatible', 'Firefox, Chrome, Opera']}
                        styles={{ px: '0', py: '0', fontWeight: 'bold', color: '#FFF', textDecoration: 'underline' }}>
                        Your operating system is not compatible with displaying images in Safari browser. To properly view images, we recommend switching to a different browser such as Firefox, Chrome, Opera, or any other compatible browser.
                    </Highlight>
                </Text>
            }
            <Box p={0} m={0}>
                <Tooltip label='Hide' hasArrow bg={`${themeColor}.500`}>
                    <IconButton color={'white'} variant='link' size={'sm'} icon={<MdClose />}
                        onClick={() => setNoticeAboutBrowser({ status: false, type: null })}
                    />
                </Tooltip>
            </Box>
        </Box>

    )
})

export default BrowserNotice;