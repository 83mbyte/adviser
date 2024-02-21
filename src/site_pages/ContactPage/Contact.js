'use client'
import { useRef, useState, Fragment } from 'react';
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
    useToast,
    Textarea,
    useBreakpointValue,
    InputGroup,
    InputRightElement,
    Icon
} from '@chakra-ui/react'

import { sanitize } from 'isomorphic-dompurify';

import Link from 'next/link';

import styles from './ContactStyle.module.css';
import Footer from '../../components/PagesFooter/Footer';

import { FaCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
import { dbAPI } from '@/src/lib/dbAPI';

const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;

export default function Contact() {

    const textareaRows = useBreakpointValue(
        {
            base: 4,
            sm: 5,
            md: 7,
        }
    );

    const formRef = useRef(null);
    const formFullnameRef = useRef(null);
    const formEmailRef = useRef(null);
    const formMessageRef = useRef(null);

    const toast = useToast({
        // status: 'error',
        duration: 9000,
        isClosable: true,
        variant: 'solid',
        position: 'top',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(null);
    const [isValidMessage, setIsValidMessage] = useState(null);
    const [charsCount, setCharsCount] = useState(0);

    const sanitizeString = (dirtyString) => {
        return sanitize(dirtyString);
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
            case 'message':
                if (value.length > 5) {
                    setIsValidMessage(true);
                } else {
                    setIsValidMessage(false);
                }
                break;
            default:
                break;
        }
    }

    const generateTimeId = () => {
        const beatifyDate = (originalDate) => {

            if (originalDate < 10) {
                return `0${originalDate}`
            }
            return originalDate;
        }

        let today = new Date();
        let year = today.getFullYear();
        let month = beatifyDate(today.getMonth() + 1);
        let day = beatifyDate(today.getDate());
        let time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();

        return (`${year}-${month}-${day}-${time}`)
    }


    const onSubmit = async (e) => {
        e.preventDefault();

        let email = formEmailRef.current.value;
        let fullname = formFullnameRef.current.value;
        let message = formMessageRef.current.value;
        if (fullname && fullname.length > 1) {
            fullname = sanitizeString(fullname);
        }
        if (email && email.length > 1) {
            email = sanitizeString(email);
        }
        if (message && message.length > 1) {
            message = sanitizeString(message);
        }

        if (isValidEmail && message !== '') {

            setIsLoading(true);
            try {

                let resp = await dbAPI.sendContactForm({ id: generateTimeId(), fullname, email, message });

                if (resp && resp.status == 'ok') {
                    toast({
                        title: `Success!`,
                        description: `${resp.message}`,
                        status: 'success',
                    });
                    formEmailRef.current.value = '';
                    formMessageRef.current.value = '';
                    formFullnameRef.current.value = '';
                    setIsValidEmail(null);
                    setCharsCount(0);
                    setIsValidMessage(null);
                } else {
                    throw new Error('while submiting a form')
                }

            } catch (error) {

                toast({
                    status: 'error',
                    title: `Warning!`,
                    description: `${error}`,
                })
            }
            finally {
                setIsLoading(false);
            }
        }
        return null
    }


    return (
        <Fragment>
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
                                    >{APP_NAME}</Heading>
                                </Link>
                            </Box>
                            <Heading fontSize={'2xl'}>Get in touch</Heading>
                            <form ref={formRef} onSubmit={onSubmit}>
                                <Stack >
                                    <FormControl id="fullname">
                                        <FormLabel>Name</FormLabel>
                                        <Input ref={formFullnameRef} _focus={{ outline: 'none' }}
                                            _focusVisible={{ outline: 'none' }} type="text" placeholder={'John Doe'} name={'fullname'} />
                                    </FormControl>
                                    <FormControl id="email">
                                        <FormLabel>Email</FormLabel>
                                        <InputGroup>
                                            <Input ref={formEmailRef}
                                                _focus={{ outline: 'none' }}
                                                _focusVisible={{ outline: 'none' }}
                                                type="email" placeholder={'email@example.com'} name={'email'} onChange={(e) => validateInput(e.target)} />
                                            {
                                                isValidEmail !== null &&
                                                <InputRightElement color={isValidEmail ? 'green' : 'red'} mr={1}>
                                                    <Icon as={isValidEmail ? FaCheckCircle : FaRegTimesCircle} boxSize={4} />
                                                </InputRightElement>
                                            }
                                        </InputGroup>


                                    </FormControl>
                                    <FormControl id="message">
                                        <FormLabel>Message</FormLabel>
                                        <InputGroup>
                                            <Textarea ref={formMessageRef}
                                                _focus={{ outline: 'none' }}
                                                _focusVisible={{ outline: 'none' }}
                                                resize='none' placeholder='your message...' maxLength={800} height={'100%'} rows={textareaRows} name='message' onChange={(e) => {
                                                    setCharsCount(formMessageRef.current.value.length)
                                                    validateInput(e.target);
                                                }} />
                                            {
                                                isValidMessage !== null &&
                                                <InputRightElement color={isValidMessage ? 'green' : 'red'} mr={'1'}>
                                                    <Icon as={isValidMessage ? FaCheckCircle : FaRegTimesCircle} boxSize={4} />
                                                </InputRightElement>
                                            }
                                        </InputGroup>
                                        <Text textAlign={'right'} fontSize={{ base: '10px', md: 'xs' }}>
                                            {`${charsCount}/800 chars`}
                                        </Text>

                                    </FormControl>

                                </Stack>
                                <Stack spacing={6}>
                                    <Box></Box>
                                    <Button colorScheme={'green'} variant={'solid'} onClick={(e) => onSubmit(e)} type={'submit'}
                                        isLoading={isLoading}
                                        isDisabled={isValidEmail !== true || isValidMessage !== true}
                                        size={['sm', 'md']}
                                    >
                                        Send
                                    </Button>
                                </Stack>

                            </form>

                            <Stack pt={1} direction={'row'} alignItems={'center'} justifyContent={'center'} fontSize={['sm', 'md']}>
                                <Text>Back to  </Text>

                                <Link href={{
                                    pathname: '/',
                                }}>
                                    <Text color='green'>Index</Text>
                                </Link>
                            </Stack>
                        </Stack>
                    </Flex>
                    <Flex flex={1} display={{ base: 'none', sm: 'flex' }} >
                        <Image
                            alt={'Contact Image'}
                            objectFit={'cover'}
                            style={{ filter: 'blur(10px) sepia(10%) opacity(25%)' }}
                            src={'./sign_img.jpg'}
                        />
                    </Flex>
                </Stack>
            </Box >

            {/* footer */}
            < Box as='footer' className={styles.footer} >
                <Footer />
            </Box >
        </Fragment >

    )
}


