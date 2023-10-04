import { Flex, SimpleGrid } from '@chakra-ui/react';

import { motion } from 'framer-motion';
import TopicsItem from './TopicsItem';



const variantsItemVisibility = {
    hidden: {
        opacity: 0,

        transition: { duration: 0.5, type: 'spring' }
    },
    visible: custom => ({
        opacity: 1,

        transition: {
            duration: 0.5,
            delay: custom * 0.04
        }
    }),
};

const TopicsGrid = ({ toggleShowTopics, setSelectedTopic, predefinedData }) => {

    const onClickHandler = (value) => {
        setSelectedTopic(value);
        toggleShowTopics();
    }

    return (
        //grids for items
        //
        // <GridLayout predefinedData={predefinedData} onClickHandler={onClickHandler} />
        //
        //
        // or
        //
        //flex container for items
        //
        <FlexLayout predefinedData={predefinedData} onClickHandler={onClickHandler} />
    );
};

export default TopicsGrid;

const MTopicsItem = motion(TopicsItem)




const FlexLayout = ({ predefinedData, onClickHandler }) => {
    return (
        <Flex flexWrap={'wrap'} gap={'6'} bg='' justifyContent={'center'} alignItems={'center'}>

            {
                predefinedData &&
                Object.keys(predefinedData).map((item, index) => {

                    return (

                        <MTopicsItem key={index}
                            data={item}
                            onClick={() => onClickHandler(item)}
                            layoutId={`${index}_item`}
                            variants={variantsItemVisibility}
                            initial={'hidden'}
                            whileInView={'visible'}
                            custom={index + 1}
                            viewport={{ margin: '-5px 0 -100px 0' }}
                            transition={
                                {
                                    type: 'tween',
                                    ease: 'linear',

                                }
                            }
                        />
                    )
                })
            }
        </Flex>
    )
}

const GridLayout = ({ predefinedData, onClickHandler }) => {
    return (
        <SimpleGrid
            columns={{ base: 2, md: 3, lg: 4 }}
            width={'100%'}
            spacing={'6'}
        //padding={3}
        // border={'1px solid red'}
        //margin={'0 auto'}
        >
            {
                predefinedData &&
                Object.keys(predefinedData).map((item, index) => {

                    return (
                        // need to adjust items sizes 
                        <MTopicsItem key={index}
                            data={item}
                            onClick={() => onClickHandler(item)}
                            variants={variantsItemVisibility}
                            initial={'hidden'}
                            whileInView={'visible'}
                            viewport={{ margin: '-155px 0 -100px 0' }}
                            transition={
                                {
                                    type: 'tween',
                                    ease: 'linear'
                                }
                            }
                        />
                    )
                })
            }
        </SimpleGrid>
    )
}