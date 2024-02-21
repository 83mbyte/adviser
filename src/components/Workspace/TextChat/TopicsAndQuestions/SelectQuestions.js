import { Box, Icon } from '@chakra-ui/react';

import { MdChevronRight } from 'react-icons/md';
import { motion } from 'framer-motion';
import { animationProps } from '@/src/lib/animationProps';


const SelectQuestions = ({ themeColor, predefinedData, selectQuestionHandler }) => {
    return (
        <motion.ul style={{ listStyle: 'none' }}   >
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
                                onClick={(e) => selectQuestionHandler(e.target.innerText)}
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
        </motion.ul >
    );
};

export default SelectQuestions;