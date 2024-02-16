import { forwardRef } from "react";
import { Box, Text, Tooltip, IconButton, Button, Highlight } from "@chakra-ui/react";

import { MdClose, MdOutlineShoppingCart } from "react-icons/md";

const NoHistoryNotice = forwardRef(function NoHistoryNoticeRef({ themeColor, buttonVariant, gotoCheckout, closeNotice }, ref) {

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
                        query={['upgrade to', 'Basic', 'Premium']}
                        styles={{ fontWeight: 'bold' }}
                    >
                        Please be aware that the history cannot be stored while you are using the Trial plan. Kindly upgrade to either the Basic or Premium plan to ensure the storage of your activities history.
                    </Highlight>
                </Text>

                <Box p={0} m={0} mr={1}>
                    {
                        buttonVariant == 'Button'
                            ? <Button variant={'outline'} colorScheme={themeColor} size={'xs'} onClick={gotoCheckout}>upgrade</Button>
                            :
                            <Tooltip label='Upgrade' hasArrow bg={`${themeColor}.500`}>
                                <IconButton
                                    colorScheme={themeColor}
                                    size={'sm'}
                                    variant='outline'
                                    icon={<MdOutlineShoppingCart />}
                                    onClick={gotoCheckout}
                                />
                            </Tooltip>
                    }
                </Box>
                <Box p={0} m={0}>
                    <Tooltip label='Hide' hasArrow bg={`${themeColor}.500`}>
                        <IconButton colorScheme={themeColor} size={'sm'} variant='link' icon={<MdClose />}
                            onClick={() => closeNotice(false)}
                        /></Tooltip>
                </Box>
            </Box>
        </>
    )

});
export default NoHistoryNotice;