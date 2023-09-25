'use client'

import React from 'react'
import { Avatar, Box, Text, } from '@chakra-ui/react'

// And react-slick as our Carousel Lib
import Slider from 'react-slick'

// Settings for the slider
const settings = {
    dots: true,
    arrows: false,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 300,
    autoplaySpeed: 4400,
    slidesToShow: 1,
    slidesToScroll: 1,
}

export default function Carousel({ cards }) {
    // As we have used custom buttons, we need a reference variable to
    // change the state
    const [slider, setSlider] = React.useState(null);

    return (
        <Box position={'relative'} width={'full'} overflow={'hidden'}>
            {/* CSS files for react-slick */}
            <link
                rel="stylesheet"
                type="text/css"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
            />
            <link
                rel="stylesheet"
                type="text/css"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
            />

            {/* Slider */}
            <Slider {...settings} ref={(slider) => setSlider(slider)}>
                {cards.map((data, index) => (
                    <React.Fragment key={index}>
                        <Text color={'gray.600'} fontSize={['md', 'xl']} textAlign={'center'} >
                            {`"${data.text}"`}
                        </Text>
                        <Box textAlign={'center'} mt={4} mb={2}>
                            <Avatar
                                mb={2}
                                name={data.name}
                                src={data.avatar ? data.avatar : null}
                                bg='orange.300'
                            />

                            <Text fontWeight={600}>{data.name}</Text>
                            <Text fontSize={'sm'} color={'gray.600'}>
                                {data.descr}
                            </Text>
                        </Box>
                    </React.Fragment>
                ))}
            </Slider>
        </Box>
    )
}