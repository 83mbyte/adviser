'use client'
import React from 'react';
import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Icon,
    Text,
    Stack,
    HStack,
    VStack,
    Highlight,
    Skeleton,
    SkeletonText,
} from '@chakra-ui/react';

import { FaCheckCircle } from 'react-icons/fa';

// example of dataArray structure
// const dataArray = [
//     {
//         title: `Lorem ipsum dolor sit amet.`,
//         text: `Possimus magni harum temporibus cupiditate laboriosam sequi necessitatibus maxime distinctio et!`
//     },
//     {
//         title: `Soluta eligendi sunt voluptates.`,
//         text: `Sed ratione sunt nobis molestias optio, fugiat repudiandae fugit. Impedit consectetur ad exercitationem sit ratione rem aliquam rerum vero consequatur?`
//     },
// ]


const FeaturesSection = ({ features }) => {
    return (
        <Box py={'4'} mt={['8', '12']} mb={2} px={['1', '4']} >
            <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>

                <Heading fontSize={'3xl'} id='features'>
                    What Makes Us Special </Heading>
                <Text color={'gray.600'} fontSize={['md', 'xl']}>
                    <Highlight query='Helpi.bg' styles={{ color: 'green.500', fontWeight: 'bold' }}>
                        At Helpi.bg, we pride ourselves on providing a unique and exceptional experience. Discover our unparalleled features, innovative solutions, and commitment to delivering excellence. Explore how we stand out from the crowd and make a difference in AI industry..
                    </Highlight>
                </Text>

            </Stack>

            <Container maxW={'6xl'} mt={10} as='section'>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={[8, 10]}>

                    {features.length > 0
                        ?
                        features.map((feature, index) => (
                            <HStack key={index} align={'top'}>
                                <Box color={'green.400'} mt={1} px={1} display={'flex'} alignItems={'flex-start'}>
                                    <Icon as={FaCheckCircle} boxSize={4} />
                                </Box>
                                <VStack align={'start'} >
                                    <Heading pt={'2px'} as={'h4'} fontSize={'16px'} fontWeight={600}>{feature.title}</Heading>
                                    <Text color={'gray.600'}>{feature.text}</Text>
                                </VStack>
                            </HStack>
                        ))
                        : Array.apply(null, Array(3)).map(function (x, i) {
                            return (<SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' key={i} />)
                        })
                    }
                </SimpleGrid>


            </Container>
        </Box >
    )
};

export default FeaturesSection;
