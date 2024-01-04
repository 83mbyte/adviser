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
    Portal,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    useToast,
} from '@chakra-ui/react';

import styles from './SignUpStyle.module.css';
import { FaEyeSlash, FaEye, FaCheckCircle, FaRegTimesCircle } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc';
import { authAPI } from '@/src/lib/authAPI';
import { sanitize } from "isomorphic-dompurify";
import Footer from '../../components/PagesFooter/Footer';
import AlternativeSignInUpForm from '@/src/components/AlternativeSignInUpForm/AlternativeSignInUpForm';

const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const SignUp = () => {
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
    const sanitizeString = (dirtyString) => {
        return sanitize(dirtyString);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData(formRef.current);
        let email = formData.get('email');
        let password = formData.get('password');
        let firstName = formData.get('firstName');
        let lastName = formData.get('lastName');

        if (firstName && firstName.length > 1) {
            firstName = sanitizeString(firstName)
        }
        if (lastName && lastName.length > 1) {
            lastName = sanitizeString(lastName)
        }

        if (email && password) {
            setIsLoading(true);
            try {

                let signUpResp = await authAPI.signUp(email, password, firstName, lastName);

                if (signUpResp && signUpResp.status === 'ok' && signUpResp.message === 'verify-email') {
                    setIsLoading(false);
                    setIsOpenModal({ status: 'ok', open: true, email: signUpResp.user.email });
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
            try {
                signInResp = await authAPI.signInAfterRedirect();

                if (signInResp && signInResp.status === 'ok' && signInResp.user.uid && signInResp.user.uid !== '') {
                    router.prefetch('/workspace');
                    setIsLoadingGoogle(false);
                    router.push(`/workspace`);
                } else {
                    setIsLoadingGoogle(false);
                    console.error('No response');
                    throw new Error(`Unsuccessful sign up. No response from a server.`)
                }
            } catch (error) {
                console.error(error);
                toast({
                    title: `Error!`,
                    description: `${error}`,
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
    React.useEffect(() => {
        if (plan) {
            sessionStorage.setItem('planToSubscribe', `${sanitize(plan)}`)
        }
    }, [plan])

    return (
        <React.Fragment>
            {/* main */}
            <Box
                as='main'
                className={styles.main}
            //bottom={['20px', '23px']}
            >
                <Stack h='100%' maxH={'100%'} direction={{ base: 'column', md: 'row' }}  >

                    <Flex p={8} flex={1} align={'center'} justify={'center'}  >
                        <Stack spacing={[1, 4]} w={'full'} maxW={'md'} >
                            <Box bg='' mb={[4, 6]}>
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
                                        size={['sm', 'md']}
                                    >
                                        Sign Up
                                    </Button>
                                </Stack>
                            </form>
                            <AlternativeSignInUpForm>
                                <Button
                                    onClick={signUpWithGoogleHandler}
                                    w={'full'}
                                    variant={'outline'}
                                    colorScheme='green'
                                    isDisabled={isLoading}
                                    isLoading={isLoadingGoogle}
                                    leftIcon={<FcGoogle />}
                                    _hover={{ backgroundColor: 'white' }}
                                    size={['sm', 'md']}
                                >
                                    <Text>Sign Up with {'Google'}</Text>
                                </Button>
                            </AlternativeSignInUpForm>
                            <Stack pt={1} direction={'row'} alignItems={'center'} justifyContent={'center'} fontSize={['sm', 'md']}>
                                <Text>Already registered?</Text>
                                <Link href={{
                                    pathname: '/login',
                                }}>
                                    <Text color='green'>Login</Text>
                                </Link>
                            </Stack>
                        </Stack>
                    </Flex>
                    <Flex flex={1} display={{ base: 'none', sm: 'flex' }}>
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
            <Portal>
                <ModalNotification isOpen={isOpenModal} setIsOpen={setIsOpenModal} router={router} />
            </Portal>
        </React.Fragment >

    )
}
export default SignUp;


const ModalNotification = ({ isOpen, setIsOpen, router }) => {
    const onClose = () => {

        if (isOpen.status === 'ok') {
            setIsOpen({ type: null, open: false, email: null });
            router.push('/login');
        } else {
            setIsOpen({ type: null, open: false, email: null });
        }
    }

    return (
        <Modal isOpen={isOpen.open} onClose={onClose} motionPreset='slideInBottom' isCentered size={['xs', 'md']}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign={'center'} >{isOpen.status === 'ok' ? `Thank you! It's almost complete.` : 'Warning..'}</ModalHeader>

                <ModalBody>
                    <Box textAlign={'center'}>
                        {
                            isOpen.status === 'ok'
                                ? <>
                                    <Text>Please <span style={{ fontWeight: 'bold' }}>verify</span> your email by visiting a link we sent to:</Text>
                                    <Text my={1} fontSize={'lg'} as='mark'>{isOpen.email}</Text>

                                </>
                                : <Text>Registration error.</Text>
                        }
                    </Box>
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