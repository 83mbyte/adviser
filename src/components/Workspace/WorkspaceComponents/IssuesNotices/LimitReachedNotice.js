import { Box, Text, Highlight, Tooltip, Button, IconButton } from "@chakra-ui/react";

import { forwardRef } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";


const LimitReachedNotice = forwardRef(function LimitReachedNoticeRef({ buttonVariant, trialOffers, themeColor, gotoCheckout }, ref) {

    let warnings = [];
    if (trialOffers.youtube >= process.env.NEXT_PUBLIC_TRIAL_LIMIT_YT) {
        warnings.push('Youtube video summarizing');
    }
    if (trialOffers.images >= process.env.NEXT_PUBLIC_TRIAL_LIMIT_IMAGE) {
        warnings.push('image creations')
    }

    let warningString = `You have reached the limit of ${warnings.join(' and ')} allowed in the 'Trial' plan. To continue enjoying the service, we advise upgrading your subscription to the 'Premium' plan.`;


    return (
        <Box
            ref={ref}
            bg={`red.400`} w='100%'
            px={1}
            mb={2}
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
                    {warningString}
                </Highlight>
            </Text>
            <Box p={0} m={0} mr={1}>

                {
                    buttonVariant == 'Button'
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