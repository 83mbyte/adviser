import { motion } from 'framer-motion';
import { animationProps } from '@/src/lib/animationProps';
import { Box, Icon } from '@chakra-ui/react';

import { MdChevronRight } from 'react-icons/md';

const predefinedDataTmp = ['An impressionist oil painting of sunflowers in a purple vase', 'A cute kitty', 'Two men riding a horse', 'Black spider on its web', 'Martian landscape', 'One man and its dog', 'A girl with a blue velvet jacket']

const IdeasList = ({ themeColor, selectIdeaHandler }) => {
    return (

        <motion.ul style={{ listStyle: 'none' }}>
            {
                predefinedDataTmp &&
                predefinedDataTmp.map((item, index) => {
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