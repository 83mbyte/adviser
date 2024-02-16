import { motion } from 'framer-motion';
import { animationProps } from '@/src/lib/animationProps';
import { Box, Icon } from '@chakra-ui/react';

import { MdChevronRight } from 'react-icons/md';

const predefinedData = [
    'Vintage car in front of the Eiffel Tower.',
    'Spaceship flying above planet Earth.',
    'Ruby necklace on a chocolate background.',
    'Milk chocolate cake with berries on top',
    'Space landscape with two moons and green clouds.',
    'Faucet with a purple and blue design for the bathroom.',
    'Cocktail dress with sparkles and feathers on the main fashion runway.',
    'Vase with artificial pink flowers on a window overlooking the mountains.',
    'Abstract painting in shades of blue and purple on a white canvas.',
    'Romantic sunset on an island with a sandy beach and palm trees.',
    'Football field in a round hall with purple and green lighting.',
    'Exotic bird species with vibrant colors perched on a tree branch.',
    'Two-story castle in pastel hues with white towers and a roof made of antique tiles.',
    'Parachutists soaring over the setting sun against a backdrop of mountains.',
    'Futuristic city of high-rise buildings and flying cars.',
    'Flying dragon amidst fiery summer clouds.',
    'Majestic waterfall in a dense forest with blooming trees',
    'Arctic Northern Lights with bright green and purple rays.',
    'Grizzly bear against a backdrop of mountains and a pine forest. ',
    'Pink evening shoes on a bedspread with a leopard print.'
]

const IdeasList = ({ themeColor, selectIdeaHandler }) => {
    return (

        <motion.ul style={{ listStyle: 'none' }}>
            {
                predefinedData &&
                predefinedData.map((item, index) => {
                    return (
                        <motion.li key={index}
                            whileInView={animationProps.listLikeItems.listItem}
                            variants={animationProps.listLikeItems}
                            viewport={{ once: true, amount: 0.2 }}
                            custom={index}
                            layout
                            style={{ margin: '15px 0', backgroundColor: '', padding: '5px' }}
                        >
                            <Box display={'flex'}
                                justifyContent={'space-between'}
                                _hover={{ cursor: 'pointer', color: `${themeColor}` }}
                                color={`${themeColor}.800`}
                                alignItems={'center'}
                                width={'full'}
                                onClick={(e) => selectIdeaHandler(e.target.innerText)}
                            >

                                <Box as={motion.div} layout>
                                    {item}
                                </Box>

                                <Box
                                    px={0}
                                    display={'flex'}
                                    bg=''
                                    alignItems={'center'}
                                    as={motion.div}
                                    custom={index + 1}
                                    initial={animationProps.listLikeItems.rightIcon.init}
                                    whileInView={animationProps.listLikeItems.rightIcon.ready}
                                    variants={animationProps.listLikeItems}
                                    viewport={{ once: true }}
                                >
                                    <Icon as={MdChevronRight} boxSize={'5'} />
                                </Box>
                            </Box>
                        </motion.li>
                    )
                })
            }
        </motion.ul>
    );
};

export default IdeasList;