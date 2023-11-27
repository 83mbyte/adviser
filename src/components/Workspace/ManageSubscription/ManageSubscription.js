import { Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, Highlight, Text, VStack, HStack, Stack, Menu, MenuButton, MenuList, MenuOptionGroup, MenuItemOption, Divider } from '@chakra-ui/react';

import { createCheckoutSession, getExchangeRates } from '@/src/lib/fetchingData';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/src/context/AuthContextProvider';

import { MdOutlineShoppingCart, MdChevronRight } from "react-icons/md";
import { useSettingsContext } from '@/src/context/SettingsContext';
import { AnimatePresence, motion } from 'framer-motion';

import { animationProps } from '@/src/lib/animationProps';

import { useEffect, useState } from 'react';

const ManageSubscription = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [currency, setCurrency] = useState('USD');
    const [iconCurr, setIconCurr] = useState(true);
    const [exchangeRates, setExchangeRates] = useState(null);

    const router = useRouter();
    const user = useAuthContext();
    const settingsContext = useSettingsContext();
    const { themeColor } = settingsContext.userThemeColor;
    const originalPlans = settingsContext.paidPlans;
    const [paidPlans, setPaidPlans] = useState(originalPlans);
    const { subscription } = settingsContext.userSubscription;


    const submitHandler = async (period, price, planName) => {
        setIsLoading({ status: true, plan: planName })
        let data = await createCheckoutSession(user.email, user.uid, currency.toLocaleLowerCase(), period, price);
        if (data?.url) {
            setIsLoading({ status: false, plan: null });
            router.push(data.url);
        }
    };

    const changeCurrency = (value) => {
        let convertedPlans = {};
        setCurrency(value);
        Object.keys(paidPlans).map((planName) => {
            convertedPlans = {
                ...convertedPlans,
                [planName]: {
                    ...originalPlans[planName],
                    currency: value,
                    price: (originalPlans[planName].price * Number(exchangeRates[value])).toFixed(2)
                }
            }
        })

        setPaidPlans(convertedPlans)
    }

    const changeIconMenu = () => setIconCurr(!iconCurr);

    useEffect(() => {
        const getCurrencyRates = async () => {
            const resp = await getExchangeRates();
            if (resp) {
                let ratesObj = { USD: 1.0 };
                ['BGN', 'EUR', 'GBP', 'CHF', 'CNY', 'JPY', 'ZAR'].forEach((item, index) => {
                    ratesObj = {
                        ...ratesObj,
                        [item]: Number(resp.rates[item]).toFixed(3),
                    }
                });
                setExchangeRates(ratesObj);
            }
        }
        getCurrencyRates();
    }, [])

    return (

        <Card h={'99%'} maxHeight={'100%'} bg={''} borderTopRadius={'10px'} borderBottomRadius={0} overflow={'hidden'}>
            <CardBody m={0} p={['2', '3']} maxH={'100%'} overflow={'hidden'}
            >

                <VStack spacing={0} py={1} px={'0'} bg={'#FAFAFA'} h='100%' maxHeight={'100%'} border={'1px dashed #DEDEDE'} borderTopRadius={'10px'}
                    overflow={'scroll'}>
                    <Box
                        bg={''}
                        w={'full'}
                        p={0}
                        borderTopRadius={'10px'}
                        borderBottomWidth={'1px'}
                        borderBottomColor={'gray.200'}
                        overflowX={'hidden'}
                        height={'55px'}
                        minH={'43px'}
                        display={'flex'}
                        flexDirection={'row'}
                    >
                        <HeaderSubscription />
                    </Box>

                    <Box
                        w={'full'}
                        bg=''
                        display={'flex'}
                        flexDirection={'column'}
                        p={2}
                        height={'100%'}
                        maxHeight={'100%'}
                        overflowX={'hidden'}
                        overflowY={'scroll'}
                    // justifyContent={'flex-end'}
                    >

                        <AnimatePresence mode='wait'>
                            {
                                themeColor && subscription &&
                                <motion.div
                                    key={'subscriptionsPlans'}
                                    variants={animationProps.chatWindowScreens.opacityDelayed}
                                    initial={'hidden'}
                                    animate={'show'}
                                    exit={'exit'}
                                    h='100%'
                                    bg=''
                                >
                                    <Card mt={['4', '6']} mx={4}>
                                        <CardBody>
                                            <Stack direction={['column', 'row']} rowGap={'0'} mb={['2', '0']} alignItems={'center'}>
                                                <Text fontSize={['sm', 'md']}>Your current plan:</Text>
                                                <Text color={themeColor} fontWeight={'bold'} fontSize={['sm', 'md']}>{`"${subscription.type}"`}</Text>
                                            </Stack>
                                            <Stack direction={['column', 'row']} rowGap={'0'} alignItems={'center'}>
                                                <Text fontSize={['sm', 'md']}>Subscription end on:</Text>
                                                <Text color={themeColor} fontWeight={'bold'} fontSize={['sm', 'md']}>{new Date(subscription.period).toLocaleDateString()}</Text>
                                            </Stack>
                                        </CardBody>
                                    </Card>
                                    <HStack w={'full'} justifyContent={'space-between'} mt={['4', '6']} mb={['2', '4']} px={4}>
                                        <Divider w={'full'} />
                                        <Text backgroundColor={''} textAlign={'center'} py={1} px={1} fontSize={'sm'} whiteSpace={'nowrap'}>Available plans</Text>
                                        <Divider w={'full'} />
                                    </HStack>

                                    <Stack mt={0} mb={'4'} spacing={0} direction={'row'} alignItems={'center'} justifyContent={'flex-end'}>

                                        {
                                            exchangeRates &&
                                            <>
                                                <Text>
                                                    Select preferred currency:
                                                </Text>

                                                <Box ml={1} maxWidth='10%' minW={'80px'} bg='' display={'flex'} alignItems={'flex-start'}>

                                                    <Menu placement={'bottom'} autoSelect={false}
                                                        onOpen={changeIconMenu}
                                                        onClose={changeIconMenu}
                                                    >
                                                        <MenuButton
                                                            m={0}
                                                            mt={'4px'}
                                                            p={0}
                                                            gap={0}
                                                            as={Button}
                                                            aria-label='currencies'
                                                            leftIcon={<MdChevronRight fontSize={'16px'} style={iconCurr ? { transform: 'rotate(0)', transition: 'transform 0.2s' } : { transform: 'rotate(90deg)', transition: 'transform 0.2s' }} />}
                                                            variant='link'
                                                            colorScheme={themeColor}
                                                            size={{ base: 'sm', md: 'min' }}

                                                        >{currency}</MenuButton>
                                                        <MenuList minW={'88px'} mt={'-2'}>
                                                            <MenuOptionGroup defaultValue={currency} title='' type='radio' onChange={changeCurrency} bg='yellow'  >

                                                                <MenuItemOption width='85px' value='USD' fontSize={'sm'} _hover={{ backgroundColor: `${themeColor}.50` }}>USD</MenuItemOption>
                                                                <MenuItemOption width='85px' value='EUR' fontSize={'sm'} _hover={{ backgroundColor: `${themeColor}.50` }}>EUR</MenuItemOption>
                                                                <MenuItemOption width='85px' value='CHF' fontSize={'sm'} _hover={{ backgroundColor: `${themeColor}.50` }}>CHF</MenuItemOption>
                                                                <MenuItemOption width='85px' value='GBP' fontSize={'sm'} _hover={{ backgroundColor: `${themeColor}.50` }}>GBP</MenuItemOption>
                                                                <MenuItemOption width='85px' value='BGN' fontSize={'sm'} _hover={{ backgroundColor: `${themeColor}.50` }}>BGN</MenuItemOption>
                                                                <MenuItemOption width='85px' value='JPY' fontSize={'sm'} _hover={{ backgroundColor: `${themeColor}.50` }}>JPY</MenuItemOption>
                                                                <MenuItemOption width='85px' value='CNY' fontSize={'sm'} _hover={{ backgroundColor: `${themeColor}.50` }}>CNY</MenuItemOption>
                                                                <MenuItemOption width='85px' value='ZAR' fontSize={'sm'} _hover={{ backgroundColor: `${themeColor}.50` }}>ZAR</MenuItemOption>
                                                            </MenuOptionGroup>
                                                        </MenuList>
                                                    </Menu >
                                                </Box>
                                            </>
                                        }
                                    </Stack>


                                    <Stack bg='' direction={['column', 'row']} justifyContent={'space-around'} alignItems={'center'} px={'2'} spacing={'8'}>
                                        {
                                            Object.keys(paidPlans).sort().map((planName, index) => {
                                                let price = Math.ceil(paidPlans[planName].price);
                                                return (
                                                    <PlanCard key={`pl_${index}`} isLoading={isLoading} title={planName} themeColor={themeColor} period={paidPlans[planName].period} price={price} currency={paidPlans[planName].currency} submitHandler={() => submitHandler(paidPlans[planName].period, price, planName)} />
                                                )
                                            })
                                        }

                                    </Stack>

                                </motion.div>
                            }
                            {themeColor == null && subscription == null &&
                                <motion.div
                                    key={'subscriptionsPlansNoConnect'}
                                    variants={animationProps.chatWindowScreens.opacityDelayed}
                                    initial={'hidden'}
                                    animate={'show'}
                                    exit={'exit'}
                                    h='100%'
                                    bg=''
                                >
                                    <Text textAlign={'center'}>Your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend. You may try to refresh the page now or visit it later. </Text>
                                </motion.div>
                            }
                        </AnimatePresence>
                    </Box>
                </VStack>
            </CardBody>
        </Card >

    );
};

export default ManageSubscription;


const PlanCard = ({ themeColor, title, price, period, currency, isLoading, submitHandler }) => {

    return (
        <Card w={['85%', '45%']} variant={'elevated'}>
            <CardHeader bg=''>
                <Heading as='h5' size={['md']} textAlign={'center'} color={themeColor}>{title}</Heading>
            </CardHeader>
            <CardBody bg='' py={0}>
                <Box w='full' my={0}>
                    <Text fontSize={'sm'} textAlign={'center'}>{currency}<Highlight query={price + ''} styles={{ px: '1', py: '1', fontSize: '28px', fontWeight: 'bold' }}>{price + ''}</Highlight></Text>
                    <Text textAlign={['end', 'center']} fontSize={'sm'}>for {period}</Text>
                </Box>
            </CardBody>
            <CardFooter justifyContent={'center'}>
                <Button
                    isLoading={isLoading.status === true && isLoading.plan === title}
                    isDisabled={isLoading.status === true && isLoading.plan !== title}
                    colorScheme={themeColor}
                    leftIcon={<MdOutlineShoppingCart />}
                    onClick={submitHandler}
                >
                    Buy
                </Button>
            </CardFooter>
        </Card>
    )
}

const HeaderSubscription = () => {

    return (
        <Box w='full' bg='' display={'flex'} flexDirection={'column'} alignItems={'center'} h={'auto'}>
            <HStack w='full' h='100%' px={2}>
                <Box bg='' flex={1} ></Box>
                <Box bg='' flex={3} >
                    <AnimatePresence mode='wait'>

                        <motion.div key={'subscriptionHeading'}
                            variants={animationProps.text.scale}
                            initial={'hidden'}
                            animate={'visible'}
                            exit={'exit'}
                        >
                            <Text textAlign={'center'} lineHeight={'1'}>Manage subscription</Text>
                        </motion.div>
                    </AnimatePresence>
                </Box>
                <Box bg='' flex={1} ></Box>
            </HStack>
        </Box>
    )
}