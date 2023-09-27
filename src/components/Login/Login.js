'use client'
import React from 'react';
import {
    Box,
    Button,
    IconButton,
    Flex,
    Text,
    FormControl,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Image,
    VStack,
    HStack,
    Divider,
    useToast,
} from '@chakra-ui/react'

import { useRouter } from 'next/navigation';
import { authAPI } from '@/src/lib/authAPI';

import styles from './LoginStyle.module.css';

import { FcGoogle } from 'react-icons/fc';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import Footer from '../Footer/Footer';
import Link from 'next/link';



export default function Login() {
    const formRef = React.useRef(null);

    const toast = useToast({
        status: 'error',
        duration: 9000,
        isClosable: true,
        variant: 'solid',
        position: 'top',
    });

    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const router = useRouter();


    const onSubmit = async (e) => {
        e.preventDefault();

        let formData = new FormData(formRef.current);
        let email = formData.get('email');
        let password = formData.get('password');

        if (email !== '' && password !== '') {

            setIsLoading(true);
            try {

                let signInResp = await authAPI.signIn(email, password);

                if (signInResp) {
                    if (signInResp.status === 'error') {
                        toast({
                            title: 'Unsuccessful sign in.',
                            description: 'Please check your email/password.',
                        })
                        throw new Error(`Unsuccessful sign in. ${signInResp.errorCode}`)
                    }
                    // dev temporal else if
                    // dev temporal else if
                    else if (
                        (signInResp.status === 'ok' && signInResp.user.emailVerified === true) || (signInResp.status === 'ok' && signInResp.user.email === process.env.NEXT_PUBLIC_DEV_EMAIL)
                    ) {
                        setIsLoading(false);
                        router.push(`/chat`);
                    }
                    else if (signInResp.status === 'ok' && signInResp.user.emailVerified === false) {
                        toast({
                            title: 'Unsuccessful sign in.',
                            description: 'Please verify your email first.',
                        })
                        throw new Error(`Unsuccessful sign in. Please verify your email.`)
                    }
                }

            } catch (error) {
                console.error(error);
            }
            finally {
                setIsLoading(false);
            }
        }
    }


    const signInWithGoogleHandler = async () => {
        console.log('signInWithGoogle');
        await authAPI.signInGoogle();
    }

    React.useEffect(() => {
        const signInAfterRedirect = async () => {
            setIsLoadingGoogle(true)
            let signInResp;
            try {
                signInResp = await authAPI.signInAfterRedirect();

                if (signInResp) {
                    if (signInResp.status === 'ok' && signInResp.user.uid && signInResp.user.uid !== '') {
                        setIsLoadingGoogle(false);
                        router.push(`/chat`);
                    } else if (signInResp.status === 'error') {
                        throw new Error(`Unsuccessful sign in. ${signInResp.errorCode}`)
                    }
                }
                else {
                    throw new Error(`Unsuccessful sign in. No response from a server.`)
                }
            } catch (error) {
                console.error(error);
                toast({
                    title: `Error!`,
                    description: error,
                })
            }
            finally {
                setIsLoadingGoogle(false);
            }
        }

        if (sessionStorage.getItem(`firebase:pendingRedirect:${process.env.NEXT_PUBLIC_FIREBASE_APIKEY}:[DEFAULT]`)) {
            signInAfterRedirect();
        }
    }, []);

    return (
        <React.Fragment>
            {/* main */}
            <Box
                as='main'
                className={styles.main}
                bottom={['25px', '35px']}
            >
                <Stack minH={'100vh'} maxH={'100vh'} h={'100%'} direction={{ base: 'column', md: 'row' }}>

                    <Flex p={8} flex={1} align={'center'} justify={'center'}>
                        <Stack spacing={4} w={'full'} maxW={'md'}>
                            <Box bg='' mb={[2, 6]} >
                                <Link href={'/'}>
                                    <Heading as={'h2'} size={'3xl'} color={`green.500`}

                                    >Helpi</Heading>
                                </Link>

                            </Box>
                            <Heading fontSize={'2xl'}>Sign in to your account</Heading>
                            <form ref={formRef} onSubmit={onSubmit}>
                                <FormControl id="email">
                                    <FormLabel>Email address</FormLabel>
                                    <Input type="email" placeholder={'email@example.com'} defaultValue={process.env.NEXT_PUBLIC_DEV_EMAIL} name={'email'} />
                                </FormControl>
                                <FormControl id="password" isRequired mb={2}>
                                    <FormLabel>Password</FormLabel>
                                    <InputGroup >
                                        <Input name="password" type={showPassword ? 'text' : 'password'} />
                                        <InputRightElement h={'full'}   >

                                            <Stack direction={'row'}>
                                                <IconButton
                                                    fontSize={'sm'}
                                                    variant={'link'}
                                                    colorScheme='gray'
                                                    color='gray'
                                                    onClick={() => setShowPassword((showPassword) => !showPassword)}
                                                    icon={showPassword ? <FaEye /> : <FaEyeSlash />}>
                                                </IconButton>

                                            </Stack>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                                <Stack spacing={6}>
                                    <Box></Box>
                                    <Button colorScheme={'green'} variant={'solid'} onClick={(e) => onSubmit(e)} type={'submit'}
                                        isLoading={isLoading}
                                    >
                                        Sign In
                                    </Button>
                                </Stack>
                            </form>
                            <AlternativeSignInForm>
                                <Button
                                    onClick={signInWithGoogleHandler}
                                    w={'full'}
                                    variant={'outline'}
                                    colorScheme='green'
                                    isLoading={isLoadingGoogle}
                                    leftIcon={<FcGoogle />}
                                    _hover={{ backgroundColor: 'white' }}
                                >
                                    <Text>Sign In with {'Google'}</Text>
                                </Button>
                            </AlternativeSignInForm>
                            <Stack pt={6} direction={{ base: 'column', md: 'row' }} alignItems={'center'} justifyContent={'center'}>
                                <Text>Not registered yet?</Text>

                                <Link href={{
                                    pathname: '/signup',
                                }}>
                                    <Text color='green'>Sign up</Text>
                                </Link>
                            </Stack>
                        </Stack>
                    </Flex>
                    <Flex flex={1}>
                        <Image
                            alt={'Login Image'}
                            objectFit={'cover'}
                            style={{ filter: 'blur(10px) sepia(10%) opacity(25%)' }}
                            src={'./sign_img.jpg'}
                        // src={
                        //     'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
                        // }
                        />
                    </Flex>
                </Stack>
            </Box>

            {/* footer */}
            <Box as='footer' className={styles.footer}>
                <Footer />
            </Box>
        </React.Fragment>

    )
}


const AlternativeSignInForm = ({ children }) => {
    return (
        <Box w='full'>
            <VStack spacing={[3, 4]} >
                <HStack w={'full'} justifyContent={'space-between'}>
                    <Divider w={'full'} />
                    <Text backgroundColor={''} textAlign={'center'} px={1} w={10} fontSize={'xs'}>else</Text>
                    <Divider w={'full'} />
                </HStack>
                <Box w='full' bg=''>
                    {children}
                </Box>
            </VStack >
        </Box >
    )
}