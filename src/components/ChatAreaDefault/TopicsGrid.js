import { SimpleGrid } from '@chakra-ui/react';
import React from 'react';


import { motion } from 'framer-motion';
import TopicsItem from './TopicsItem';

const tempData = ['Examples', 'Finance', 'Technology', 'Food and cooking', 'Music', 'Examples', 'Finance', 'Technology', 'Food and cooking', 'Music', 'Examples', 'Finance', 'Technology', 'Food and cooking', 'Music', 'Examples', 'Finance', 'Technology', 'Food and cooking', 'Music', 'Examples', 'Finance', 'Technology', 'Food and cooking', 'Music', 'Examples', 'Finance', 'Technology', 'Food and cooking', 'Music', 'Examples', 'Finance', 'Technology', 'Food and cooking', 'Music',];



const variantsItemVisibility = {

    hidden: {
        opacity: 0,
        transition: { duration: 0.5 }
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
        }
    },
};

const TopicsGrid = ({ toggleShowTopics, setSelectedTopic }) => {
    const onClickHandler = (value) => {
        setSelectedTopic(value);
        toggleShowTopics();
    }
    return (
        <SimpleGrid
            columns={{ base: 3, md: 3, lg: 4 }}
            spacing={'6'}
            padding={3}
        >
            {
                tempData.map((item, index) => {

                    return (
                        <MTopicsItem key={index}
                            data={item}
                            onClick={() => onClickHandler(item)}
                            variants={variantsItemVisibility}
                            initial={'hidden'}
                            whileInView={'visible'}
                            viewport={{ margin: '-115px 0 -100px 0' }}
                        />
                    )
                })
            }
        </SimpleGrid>
    );
};

export default TopicsGrid;

const MTopicsItem = motion(TopicsItem)