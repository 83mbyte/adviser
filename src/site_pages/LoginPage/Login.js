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
    useToast,
} from '@chakra-ui/react'

import { useRouter } from 'next/navigation';
import { authAPI } from '@/src/lib/authAPI';

import styles from './LoginStyle.module.css';

import { FcGoogle } from 'react-icons/fc';
import { FaEyeSlash, FaEye } from 'react-icons/fa';

import Link from 'next/link';
import Footer from '../../components/PagesFooter/Footer';
import AlternativeSignInUpForm from '@/src/components/AlternativeSignInUpForm/AlternativeSignInUpForm';



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
                        router.refresh();
                        router.push(`/workspace`);
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
            setIsLoadingGoogle(true);

            try {
                let signInResp = await authAPI.signInAfterRedirect();

                if (signInResp) {
                    if (signInResp.status === 'ok' && signInResp.user.uid && signInResp.user.uid !== '') {
                        router.prefetch('/workspace');
                        setIsLoadingGoogle(false);
                        router.push(`/workspace`);
                    } else if (signInResp.status === 'error') {

                        throw new Error(`Unsuccessful sign in. ${signInResp.errorMessage}`)
                    }
                }
                else {
                    throw new Error(`Unsuccessful sign in. No response from a server.`)
                }
            } catch (error) {
                console.error(error);
                toast({
                    title: `Error!`,
                    description: error.message,
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
            >
                <Stack h='100%' maxH={'100%'} direction={{ base: 'column', md: 'row' }}   >

                    <Flex p={8} flex={1} align={'center'} justify={'center'} >
                        <Stack spacing={[1, 4]} w={'full'} maxW={'md'}>
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
                                        size={['sm', 'md']}
                                    >
                                        Sign In
                                    </Button>
                                </Stack>
                            </form>

                            <AlternativeSignInUpForm>
                                <Button
                                    onClick={signInWithGoogleHandler}
                                    w={'full'}
                                    variant={'outline'}
                                    colorScheme='green'
                                    isLoading={isLoadingGoogle}
                                    leftIcon={<FcGoogle />}
                                    _hover={{ backgroundColor: 'white' }}
                                    size={['sm', 'md']}
                                >
                                    <Text>Sign In with {'Google'}</Text>
                                </Button>
                            </AlternativeSignInUpForm>

                            <Stack pt={1} direction={'row'} alignItems={'center'} justifyContent={'center'} fontSize={['sm', 'md']}>
                                <Text>Not registered yet?</Text>

                                <Link href={{
                                    pathname: '/signup',
                                }}>
                                    <Text color='green'>Sign up</Text>
                                </Link>
                            </Stack>
                        </Stack>
                    </Flex>
                    <Flex flex={1} display={{ base: 'none', sm: 'flex' }} >
                        <Image
                            alt={'Login Image'}
                            objectFit={'cover'}
                            style={{ filter: 'blur(10px) sepia(10%) opacity(25%)' }}
                            src={'./sign_img.jpg'}
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


