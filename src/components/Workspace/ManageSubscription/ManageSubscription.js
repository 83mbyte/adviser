import { Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, Highlight, Text, VStack, HStack, Stack, Menu, MenuButton, MenuList, MenuOptionGroup, MenuItemOption } from '@chakra-ui/react';

import { createCheckoutSession, getExchangeRates } from '@/src/lib/fetchingData';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/src/context/AuthContextProvider';

import { MdOutlineShoppingCart, MdExpandMore, MdChevronRight } from "react-icons/md";
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



    const submitHandler = async (period, price) => {
        setIsLoading(true)
        let data = await createCheckoutSession(user.email, user.uid, currency.toLocaleLowerCase(), period, price);
        if (data?.url) {
            setIsLoading(false)
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
                setExchangeRates({
                    BGN: Number(resp.rates.BGN).toFixed(3),
                    EUR: Number(resp.rates.EUR).toFixed(3),
                    GBP: Number(resp.rates.GBP).toFixed(3),
                    CHF: Number(resp.rates.CHF).toFixed(3),
                    JPY: Number(resp.rates.JPY).toFixed(3),
                    CNY: Number(resp.rates.CNY).toFixed(3),
                    ZAR: Number(resp.rates.ZAR).toFixed(3),
                    USD: '1.0'
                })
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
                                <motion.div
                                    key={'subscriptionsPlans'}
                                    variants={animationProps.chatWindowScreens.opacityDelayed}
                                    initial={'hidden'}
                                    animate={'show'}
                                    exit={'exit'}
                                    h='100%'
                                    bg=''
                                >
                                    <Stack my={4} spacing={0} direction={'row'} alignItems={'center'} justifyContent={'flex-end'}>

                                        {
                                            exchangeRates &&
                                            <>
                                                <Text >Select preferred currency:</Text>

                                                <Box ml={1} maxWidth='10%' minW={'80px'}  >

                                                    <Menu placement={'bottom'} autoSelect={false}
                                                        onOpen={changeIconMenu}
                                                        onClose={changeIconMenu}

                                                    >
                                                        <MenuButton
                                                            m={0}
                                                            p={0}
                                                            as={Button}
                                                            aria-label='Options'
                                                            leftIcon={iconCurr ? <MdChevronRight fontSize={'16px'} /> : <MdExpandMore fontSize={'16px'} />}
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
                                    <Stack bg='' direction={['column', 'row']} justifyContent={'space-around'} alignItems={'center'} p={'2'} spacing={'8'}>
                                        {
                                            Object.keys(paidPlans).sort().map((planName, index) => {
                                                return (
                                                    <PlanCard key={`pl_${index}`} isLoading={isLoading} title={planName} themeColor={themeColor} period={paidPlans[planName].period} price={paidPlans[planName].price} currency={paidPlans[planName].currency} submitHandler={() => submitHandler(paidPlans[planName].period, paidPlans[planName].price)} />
                                                )
                                            })
                                        }

                                    </Stack>

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
                    isLoading={isLoading}
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