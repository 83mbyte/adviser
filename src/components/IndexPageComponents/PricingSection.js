'use client'

import {
    Box,
    Stack,
    HStack,
    Heading,
    Text,
    VStack,
    List,
    ListItem,
    ListIcon,
    Button,
    Highlight,
    Container,
    SimpleGrid,
    Skeleton
} from '@chakra-ui/react'

import Link from 'next/link'
import { FaCheckCircle, FaRegTimesCircle } from 'react-icons/fa'


//example of subscription details...
// const SUBSCRIPTION = [
//     {
//         id: 0,
//         title: 'Trial Lorem',
//         price: '0',
//         period: '3 days',
//         options: {
//             incl: ['Dolor sit amet'],
//             excl: ['Sed ratione', 'Possimus magni', 'Adipisicing elit']
//         },
//         popular: false
//     },
//     {
//         id: 1,
//         title: 'Basic Ipsum',
//         price: '9.99',
//         period: 'month',
//         options: {
//             incl: ['Dolor sit amet', 'Sed ratione', 'Possimus magni'],
//             excl: ['Adipisicing elit']
//         },
//         popular: true
//     },
// ]

function PriceWrapper(props) {
    const { children } = props;

    return (
        <Box
            mb={4}
            shadow={'sm'}
            borderWidth="1px"
            alignSelf={{ base: 'center', lg: 'flex-start' }}
            borderColor={'gray.200'}
            borderRadius={'xl'}
            width={{ base: 'full' }}
        >
            {children}
        </Box >
    )
}


export default function PricingSection({ pricing }) {

    return (
        <Box py={0} px={['1', '4']} mb={2}>
            <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
                <Heading fontSize={'3xl'} >
                    <Highlight query='Smile' styles={{ color: 'green.500', fontWeight: 'bold' }}>
                        Wallet-Friendly Rates to Make Wallets Smile
                    </Highlight>
                </Heading>
                <Text color={'gray.600'} fontSize={['md', 'xl']}>
                    Explore the features and benefits of each subscription, and select the one that suits you best.
                </Text>
            </Stack>
            <Container maxW={'6xl'} mt={'10'} as='section'>
                <SimpleGrid columns={{ base: 1, md: 1, lg: 3 }} spacing={[5, 10]}>
                    {
                        pricing && pricing.length > 0
                            ?
                            pricing.map((plan) => {
                                return (
                                    <PriceWrapper key={plan.id}>
                                        <Box position="relative">
                                            {
                                                plan.popular &&
                                                <Box
                                                    position="absolute"
                                                    top="-18px"
                                                    w={'full'}
                                                    px={'10'}
                                                    left="50%"
                                                    textAlign={'center'}
                                                    style={{ transform: 'translate(-50%)' }}
                                                >
                                                    <Text
                                                        textTransform="uppercase"
                                                        bg={'orange.100'}
                                                        px={3}
                                                        py={1}
                                                        color={'gray.900'}
                                                        fontSize="sm"
                                                        fontWeight="600"
                                                        rounded="xl"
                                                    >
                                                        Most Popular
                                                    </Text>
                                                </Box>
                                            }
                                            <Box py={[3, 4]} px={12}>
                                                <Text fontWeight="500" fontSize={["lg", "2xl"]} textAlign={['center', 'left']}>
                                                    {plan.title}
                                                </Text>


                                                <HStack justifyContent="center" spacing={1}>
                                                    <Text fontSize={{ base: 'xs', md: 'xl' }} fontWeight="600">$</Text>
                                                    <Text fontSize={{ base: 'lg', md: '3xl' }} fontWeight="900" color={'green.800'}>
                                                        {plan.price}
                                                    </Text>
                                                    <Text fontSize={{ base: 'xx-small', md: 'md' }} color="gray.500">
                                                        {`/${plan.period}`}
                                                    </Text>
                                                </HStack>
                                            </Box>
                                            <VStack
                                                bg={'gray.50'}
                                                py={4}
                                                borderBottomRadius={'xl'}>
                                                <List spacing={3} textAlign="start" px={12}>
                                                    {
                                                        plan.options.incl && plan.options.incl.map((item, index) => {
                                                            return (
                                                                <ListItem key={index} fontSize={['sm', 'md']}>
                                                                    <ListIcon as={FaCheckCircle} color="green.400" />
                                                                    {item}
                                                                </ListItem>
                                                            )
                                                        })
                                                    }
                                                    {
                                                        plan.options.excl !== undefined && plan.options.excl.map((item, index) => {

                                                            return (
                                                                <ListItem key={index} fontSize={['sm', 'md']} color="gray.400">
                                                                    <ListIcon as={FaRegTimesCircle} />
                                                                    {item}
                                                                </ListItem>
                                                            )
                                                        })
                                                    }

                                                </List>
                                                <Box w="80%" pt={7}>
                                                    <Link
                                                        href={{
                                                            pathname: '/signup',
                                                            query: { plan: `${plan.title}` },
                                                        }}
                                                        prefetch={true}>
                                                        <Button w="full" colorScheme='green' variant="outline">
                                                            Get Started
                                                        </Button>
                                                    </Link>
                                                </Box>
                                            </VStack>
                                        </Box>
                                    </PriceWrapper>
                                )
                            })
                            : Array.apply(null, Array(3)).map(function (x, i) {
                                return (<Skeleton rounded={'md'} height={['60px', '130px']} key={i} startColor='gray.50' endColor='gray.100' />)
                            })
                    }
                </SimpleGrid>


            </Container>
        </Box >
    )
}