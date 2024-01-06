'use client'

import { Stack, Flex, Button, Text, VStack, useBreakpointValue, Heading, } from '@chakra-ui/react';
import Link from 'next/link';


export default function HeroSection() {

    return (
        <Flex
            w={'full'}
            h={'100vh'}
            // backgroundImage={'url(./herosection-3.jpg)'}
            backgroundImage={
                'url(https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)'
            }
            backgroundSize={'cover'}
            backgroundPosition={'center center'}
        >
            <VStack
                w={'full'}
                justify={'center'}
                px={useBreakpointValue({ base: 4, md: 8 })}
                bgGradient={'linear(to-r, blackAlpha.600, transparent)'} >
                <Stack maxW={'2xl'} align={'flex-start'} spacing={6}>
                    <Heading
                        as={'h2'} size={'4xl'} color={`green.400`}

                    >Helpi</Heading>
                    <Text
                        color={'white'}

                        fontWeight={700}
                        lineHeight={1.2}
                        fontSize={'4xl'}
                    >
                        Our intelligent AI-Powered Assistant that understands your needs.
                    </Text>
                    <Text
                        color={'white'}
                        fontWeight={500}
                        lineHeight={0.8}
                        fontSize={'md'}
                    >
                        Effortlessly streamline your everyday tasks.
                    </Text>
                    <Stack direction={'row'}>
                        <ChakraNextLinkButton href={'/login'}
                            colorScheme="green"
                            prefetch={true}
                        >
                            Sign In
                        </ChakraNextLinkButton>
                        <ChakraNextLinkButton href={'/signup'}

                            prefetch={true}
                            bg={'whiteAlpha.300'}
                            variant={'outline'}
                            color={'white'}
                            _hover={{ bg: 'whiteAlpha.500' }}
                        >
                            Register
                        </ChakraNextLinkButton>
                        <ChakraNextLinkButton href={'/contact'}

                            prefetch={true}
                            bg={'whiteAlpha.300'}
                            variant={'outline'}
                            color={'white'}
                            _hover={{ bg: 'whiteAlpha.500' }}
                        >
                            Contact Us
                        </ChakraNextLinkButton>
                    </Stack>
                </Stack>
            </VStack>
        </Flex >
    )
}


function ChakraNextLinkButton({ href, prefetch, children, ...props }) {
    return (
        <Link href={href} passHref prefetch={prefetch}>
            <Button  {...props}>
                {children}
            </Button >
        </Link>
    );
}
