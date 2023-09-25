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
    VStack, Divider, Portal,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
} from '@chakra-ui/react';
import Footer from '../Footer/Footer';
import styles from './SignUpStyle.module.css';
import { FaEyeSlash, FaEye, FaCheckCircle, FaRegTimesCircle } from 'react-icons/fa'


import { FcGoogle } from 'react-icons/fc';
import { authAPI } from '@/src/lib/authAPI';

const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const SignUp = () => {
    const formRef = React.useRef(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [isValidEmail, setIsValidEmail] = React.useState(null);
    const [isValidPass, setIsValidPass] = React.useState(null);
    const [isOpenModal, setIsOpenModal] = React.useState(false);

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

                let signUpResp = await authAPI.signUp(email, password);

                if (signUpResp && signUpResp.uid && signUpResp.uid !== '') {
                    setIsLoading(false);
                    setIsOpenModal({ status: 'ok', open: true });

                } else {
                    formRef.current.password.value = '';
                    throw new Error(`Unsuccessful sign up. ${signUpResp.errorCode}`)
                }
            } catch (error) {
                console.error('Warning: ', error);
                setIsOpenModal({ status: 'error', open: true });
            }
            finally {
                setIsLoading(false);
                formRef.current.password.value = '';
            }
        }
        return null
    }

    const signUpWithGoogleHandler = async () => {
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
                            <AlternativeSignInForm>
                                <Button
                                    onClick={signUpWithGoogleHandler}
                                    w={'full'}
                                    variant={'outline'}
                                    colorScheme='green'
                                    isDisabled={isLoading}
                                    isLoading={isLoadingGoogle}
                                    leftIcon={<FcGoogle />}
                                    _hover={{ backgroundColor: 'white' }}
                                >
                                    <Text>Sign Up with {'Google'}</Text>
                                </Button>
                            </AlternativeSignInForm>
                            <Stack pt={1} direction={{ base: 'column', md: 'row' }} alignItems={'center'} justifyContent={'center'}>
                                <Text>Already registered?</Text>
                                <Link href={{
                                    pathname: '/login',
                                }}>
                                    <Text color='green'>Login</Text>
                                </Link>
                            </Stack>


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
            <Portal>
                <ModalNotification isOpen={isOpenModal} setIsOpen={setIsOpenModal} router={router} />
            </Portal>
        </React.Fragment>

    )
}

export default SignUp;


const AlternativeSignInForm = ({ children }) => {

    return (
        <Box w='full'>
            <VStack spacing={[3, 4]} >
                <HStack w={'full'} justifyContent={'space-between'}>
                    <Divider w={'full'} />
                    <Text backgroundColor={''} textAlign={'center'} px={1} w={10} fontSize={'xs'}>or</Text>
                    <Divider w={'full'} />
                </HStack>
                <Box w='full' bg=''>
                    {children}
                </Box>
            </VStack >
        </Box >
    )
}

const ModalNotification = ({ isOpen, setIsOpen, router }) => {
    const onClose = () => {
        setIsOpen({ type: null, open: false });
        if (isOpen.status === 'ok') {
            router.push('/chat');
        }
    }

    return (
        <Modal isOpen={isOpen.open} onClose={onClose} motionPreset='slideInBottom' isCentered size={['xs', 'md']}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign={'center'} >{isOpen.status === 'ok' ? 'Thank you!' : 'Warning..'}</ModalHeader>

                <ModalBody>
                    <Text textAlign={'center'}>{
                        `Registration ${isOpen.status === 'ok' ? 'complete' : 'error'}.`}</Text>
                    <Box display={'flex'} alignItems={'center'}>
                        <Icon as={isOpen.status === 'ok' ? FaCheckCircle : FaRegTimesCircle} color={isOpen.status === 'ok' ? 'green' : 'red'} boxSize={'16'} mx={'auto'} my={2} />
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme={isOpen.status === 'ok' ? 'green' : 'red'} mx={'auto'} onClick={onClose} w='full'
                        variant={isOpen.status === 'ok' ? 'solid' : 'outline'}
                    >
                        OK
                    </Button>

                </ModalFooter>
            </ModalContent>
        </Modal >)
}