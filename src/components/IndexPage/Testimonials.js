'use client'

import { Box, Stack, Container } from '@chakra-ui/react';
import Carousel from './Carousel';
import styles from './IndexPageStyles.module.css';

const cardsTestimonials = [
    {
        name: 'Aaron Smith',
        descr: 'publicist',
        text: `It has truly become an invaluable tool in my professional life. I've become more productive. Highly recommend!`
    },
    {
        name: 'Ivan Angelov',
        descr: 'student',
        avatar: './user_avatar/user2.jpg',
        text: `Awesome! It's like a genius study buddy who helps with assignments, answers my questions, and cracks hilarious jokes. A total lifesaver! Thanks for saving my GPA!`
    }

]
export default function Testimonials() {

    return (
        <Box py={0}
            px={['1', '4']}
            mb={0}
            w='full'
            position={'relative'}
        >
            <BottomTriangleBackGround />

            <Container maxW={'4xl'} mt={'4'} as='section'>
                <Stack
                    py={2}
                    px={8}
                    spacing={{ base: 8, md: 10 }}
                    align={'center'}
                    direction={'column'}
                >
                    <Carousel cards={cardsTestimonials} />
                </Stack>
            </Container>
        </Box>
    )
}

const BottomTriangleBackGround = () => {
    return (
        <div className={styles.customBgTriangle}>
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M892.25 114.72L0 0 0 120 1200 120 1200 0 892.25 114.72z" className={styles.shapeFill}></path>
            </svg>
        </div>
    )
}