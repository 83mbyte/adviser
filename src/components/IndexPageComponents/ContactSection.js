import { Box, Stack, Heading, Highlight, Text, Container, Button } from '@chakra-ui/react';
import Link from 'next/link';

const ContactSection = () => {
    return (
        <Box py={0} px={['1', '4']} mb={0} bg='gray.300' pt={16} pb={6}>
            <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
                <Heading fontSize={'3xl'}   >
                    <Highlight query='Just' styles={{ color: 'green.500', fontWeight: 'bold' }}>
                        Have a Question? We're Just a Click Away
                    </Highlight>
                </Heading>
                <Text color={'gray.600'} fontSize={['md', 'xl']} mb={1}>
                    Connect with us today, and our support staff will guide You through the process, providing detailed information and resolving any issues that may arise along the way.
                </Text>

                <Link href={'/contact'} passHref prefetch={true}>
                    <Button colorScheme="green" variant='outline'>
                        Get in Touch
                    </Button>
                </Link>
            </Stack>
        </Box>
    );
};

export default ContactSection;