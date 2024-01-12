import { Box, Text, Highlight, Tooltip, Button, IconButton } from "@chakra-ui/react";

import { forwardRef } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";


const LimitReachedNotice = forwardRef(function LimitReachedNoticeRef({ variant, themeColor, gotoCheckout }, ref) {

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
            alignItems={'center'}

        >
            <Text textAlign={'center'} px={2} fontSize={['xs', 'sm']} w='full' color={'#FFF'} >
                <Highlight
                    query={['Premium']}
                    styles={{ px: '0', py: '0', rounded: 'sm', fontWeight: 'bold', color: '#FFF' }}
                >
                    You have reached the limit of image creations allowed in the &quot;Trial&quot; plan. To continue enjoying image creation, we advise upgrading your subscription to the &quot;Premium&quot; plan.
                </Highlight>
            </Text>
            <Box p={0} m={0} mr={1}>

                {
                    variant == 'Button'
                        ? <Button variant={'outline'} color={'white'} size={'xs'} onClick={gotoCheckout}
                        >upgrade</Button>
                        :
                        <Tooltip label='Upgrade' hasArrow bg={`${themeColor}.500`}><IconButton color={'white'} size={'sm'} variant='outline' icon={<MdOutlineShoppingCart />}
                            onClick={gotoCheckout}
                        /></Tooltip>

                }

            </Box>
        </Box>
    )
});

export default LimitReachedNotice;