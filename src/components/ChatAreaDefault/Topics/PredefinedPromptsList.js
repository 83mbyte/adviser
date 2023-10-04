
import { Box, Icon } from '@chakra-ui/react';

import { MdChevronRight } from 'react-icons/md';
import { motion } from 'framer-motion';

const variants = {
    readyLi: custom => ({
        opacity: [0, 0.5, 1],
        transition: {
            delay: custom * 0.08,
            duration: 0.5,
            ease: 'linear',
            opacity: { duration: 1, delay: custom * 0.08 }
        }
    }),

    initIcon: {
        opacity: 0,
        x: '-40px',
        transition: { duration: 0.5 }
    },
    readyIcon: custom => ({
        opacity: [0.1, 1],
        x: ['-40px', '0px'],
        transition: { duration: 0.8, delay: custom * 0.1 }
    })
};

const PredefinedPromptsList = ({ onClickHandler, themeColor, predefinedList }) => {

    return (
        <motion.ul style={{ listStyle: 'none' }}   >
            {
                predefinedList &&
                predefinedList.map((item, index) => {
                    return (
                        <motion.li key={index}
                            whileInView={'readyLi'}
                            variants={variants}
                            viewport={{ once: true, amount: 0.2 }}
                            custom={index}
                            transition={{ ease: 'anticipate' }}
                            style={{ margin: '15px 0', backgroundColor: '', padding: '5px' }}
                        >

                            <Box display={'flex'}
                                justifyContent={'space-between'}
                                _hover={{ cursor: 'pointer', color: `${themeColor}.800` }}
                                color={themeColor}
                                alignItems={'center'}
                                width={'full'}
                                onClick={(e) => onClickHandler(e.target.innerText)}
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
                                    initial={'initIcon'}
                                    whileInView={'readyIcon'}
                                    variants={variants}
                                    viewport={{ once: true }}
                                >
                                    <Icon as={MdChevronRight} boxSize={'5'} />
                                </Box>
                            </Box>
                        </motion.li>
                    )
                })
            }
        </motion.ul >
    );
};

export default PredefinedPromptsList;