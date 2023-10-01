import React from 'react';
import {
    Button,
} from '@chakra-ui/react';

import { MdChevronRight } from 'react-icons/md';
import { motion } from 'framer-motion';

const data = ['11 Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Integer molestie lorem at massa', 'Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Integer molestie lorem at massa', 'Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Integer molestie lorem at massa', 'Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Integer molestie lorem at massa', 'Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Integer molestie lorem at massa', 'Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Integer molestie lorem at massa'];

const variants = {

    readyLi: custom => ({
        opacity: [0, 0.5, 1],
        width: ['0%', '50%', '100%'],
        transition: {
            delay: custom * 0.08,
            duration: 1,
            ease: 'linear',
            opacity: { duration: 1.2, delay: custom * 0.08 }
        }
    }),


};

const PredefinedPromptsList = ({ onClickHandler, themeColor }) => {


    return (
        <motion.ul style={{ listStyle: 'none' }}   >
            {
                data.map((item, index) => {
                    return (
                        <motion.li key={index}
                            whileInView={'readyLi'}
                            variants={variants}
                            viewport={{ once: true, amount: 0.2 }}
                            custom={index}
                            transition={{ ease: 'anticipate' }}
                            style={{ margin: '10px 0' }}
                        >
                            <Button onClick={(item) => onClickHandler(item.target.innerText)} colorScheme={themeColor}
                                variant={'ghost'}
                                textAlign={'start'}
                                width={'full'}
                                justifyContent={'space-between'}
                                _hover={{ backgroundColor: '', color: `${themeColor}.800` }}
                                rightIcon={<MdChevronRight />}
                            >{item}</Button>
                        </motion.li>
                    )
                })
            }
        </motion.ul >
    );
};

export default PredefinedPromptsList;