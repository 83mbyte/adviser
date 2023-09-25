'use client'


import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
    HStack,
    InputGroup,
    InputRightElement,
    IconButton,
    Icon,
} from '@chakra-ui/react';
import Footer from '../Footer/Footer';
import styles from './SignUpStyle.module.css';
import { FaEyeSlash, FaEye, FaCheckCircle, FaRegTimesCircle } from 'react-icons/fa'
import { authAPI } from '@/src/lib/authAPI';

const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const SignUp = () => {
    const formRef = React.useRef(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [isValidEmail, setIsValidEmail] = React.useState(null);
    const [isValidPass, setIsValidPass] = React.useState(null);

    const params = useSearchParams();
    const router = useRouter();

    let plan = null;
    if (params) {
        plan = params.get('plan');
    }
    const validateInput = (input) => {
        let value = input.value;

        switch (input.name) {
            case 'email':
                if (value.match(emailPattern)) {
                    setIsValidEmail(true);
                } else {
                    setIsValidEmail(false);
                }
                break;
            case 'password':
                if (value.length > 5) {
                    setIsValidPass(true);
                } else {
                    setIsValidPass(false);
                }
                break;
            default:
                break;
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData(formRef.current);
        let email = formData.get('email');
        let password = formData.get('password');
        let firstName = formData.get('firstName');
        let lastName = formData.get('lastName');
        if (email && password) {
            setIsLoading(true);
            try {
                // let user = await authAPI.signIn(email, password);
                let signUpResp = await authAPI.signUp(email, password);
                console.log('RESP: ', signUpResp)

                if (signUpResp && signUpResp.uid && signUpResp.uid !== '') {
                    setIsLoading(false);
                    router.push(`/chat`);
                } else {
                    formRef.current.password.value = '';
                    throw new Error(`Unsuccessful sign up. ${signUpResp.errorCode}`)

                }
            } catch (error) {
                console.error('Warning: ', error)
            }
            finally {
                setIsLoading(false);
            }
        }
        return null
    }
    React.useEffect(() => {
        if (plan) {
            sessionStorage.setItem('planToSubscribe', `${plan}`)
        }
    }, [plan])

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
                                <Link href='/'>
                                    <Heading as={'h2'} size={'3xl'} color={`green.500`}>Helpi</Heading>
                                </Link>
                            </Box>
                            <Heading fontSize={'2xl'}>Create a new account</Heading>
                            <form ref={formRef} onSubmit={onSubmit}>
                                <HStack >
                                    <Box>
                                        <FormControl id="firstName" mb={2}>
                                            <FormLabel>First name</FormLabel>
                                            <Input type="text" name="firstName" />
                                        </FormControl>
                                    </Box>
                                    <Box>
                                        <FormControl id="lastName" mb={2}>
                                            <FormLabel>Last name</FormLabel>
                                            <Input type="text" name="lastName" />
                                        </FormControl>
                                    </Box>
                                </HStack>
                                <FormControl id="email" isRequired mb={2}>
                                    <FormLabel >Email address</FormLabel>
                                    <InputGroup>
                                        <Input type="email" placeholder={'email@example.com'} name={'email'} onChange={(e) => validateInput(e.target)} />
                                        {
                                            isValidEmail !== null &&
                                            <InputRightElement color={isValidEmail ? 'green' : 'red'} mr={'10px'}>
                                                <Icon as={isValidEmail ? FaCheckCircle : FaRegTimesCircle} boxSize={4} />
                                            </InputRightElement>
                                        }
                                    </InputGroup>
                                </FormControl>
                                <FormControl id="password" isRequired mb={2}>
                                    <FormLabel>Password</FormLabel>
                                    {/* <Input type="password" name={'password'} /> */}

                                    <InputGroup >
                                        <Input name="password" type={showPassword ? 'text' : 'password'} onChange={(e) => validateInput(e.target)} pr={'90px'} />
                                        <InputRightElement h={'full'} w={'90px'} mr={'10px'} >

                                            <Stack direction={'row'}>
                                                <IconButton
                                                    fontSize={'sm'}
                                                    variant={'link'}
                                                    colorScheme='gray'
                                                    color='gray'
                                                    onClick={() => setShowPassword((showPassword) => !showPassword)}
                                                    icon={showPassword ? <FaEye /> : <FaEyeSlash />}>
                                                </IconButton>
                                                {
                                                    isValidPass !== null &&
                                                    <Icon as={isValidPass ? FaCheckCircle : FaRegTimesCircle} boxSize={4} color={isValidPass ? 'green' : 'red'} />
                                                }
                                            </Stack>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                                <Stack spacing={6}>
                                    <Box></Box>
                                    <Button colorScheme={'green'} variant={'solid'} onClick={(e) => onSubmit(e)} type={'submit'}
                                        isLoading={isLoading}
                                        isDisabled={isValidEmail !== true || isValidPass !== true}
                                    >
                                        Sign Up
                                    </Button>
                                </Stack>
                            </form>
                            <Stack pt={1} direction={{ base: 'column', md: 'row' }} alignItems={'center'} justifyContent={'center'}>
                                <Text>Already registered?</Text>

                                <Link href={{
                                    pathname: '/login',
                                }}>
                                    <Text color='green'>Login</Text>
                                </Link>
                            </Stack>
                            {/* <AlternativeSignInForm>
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
                            </AlternativeSignInForm> */}
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

export default SignUp;