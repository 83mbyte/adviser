'use client'
import React from 'react';
import {
    Box,
    Button,
    Flex,
    Text,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Image,
    VStack,
    HStack,
    Divider,
} from '@chakra-ui/react'

import { useRouter } from 'next/navigation';
import { authAPI } from '@/src/lib/authAPI';

import styles from './LoginStyle.module.css';

import { FcGoogle } from 'react-icons/fc';
import Footer from '../Footer/Footer';



export default function Login() {
    const formRef = React.useRef(null);

    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);
    const router = useRouter();


    const onSubmit = async (e) => {
        e.preventDefault();

        let formData = new FormData(formRef.current);
        let email = formData.get('email');
        let password = formData.get('password');

        if (email !== '' && password !== '') {

            setIsLoading(true);
            try {
                // let user = await authAPI.signIn(email, password);
                let signInResp = await authAPI.signIn('1@1.com', password);

                if (signInResp && signInResp.uid && signInResp.uid !== '') {
                    setIsLoading(false);
                    router.push(`/chat`);
                } else {
                    formRef.current.password.value = '';
                    throw new Error(`Unsuccessful sign in. ${signInResp.errorCode}`)

                }
            } catch (error) {
                console.error('Warning: ', error)
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
            signInResp = await authAPI.signInAfterRedirect();

            if (signInResp && signInResp.uid && signInResp.uid !== '') {
                setIsLoadingGoogle(false);
                router.push(`/chat`);
            } else {
                setIsLoadingGoogle(false);
                console.error('No response')
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
                            <Box bg='' mb={[2, 6]}>
                                <Heading as={'h2'} size={'3xl'} color={`green.500`}>Helpi</Heading>
                            </Box>
                            <Heading fontSize={'2xl'}>Sign in to your account</Heading>
                            <form ref={formRef} onSubmit={onSubmit}>
                                <FormControl id="email">
                                    <FormLabel>Email address</FormLabel>
                                    <Input type="email" placeholder={'1@1.com'} defaultValue={'1@1.com'} name={'email'} />
                                </FormControl>
                                <FormControl id="password">
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" name={'password'} />
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
                        </Stack>
                    </Flex>
                    <Flex flex={1}>
                        <Image
                            alt={'Login Image'}
                            objectFit={'cover'}
                            style={{ filter: 'blur(10px) sepia(10%) opacity(25%)' }}
                            src={
                                'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
                            }
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