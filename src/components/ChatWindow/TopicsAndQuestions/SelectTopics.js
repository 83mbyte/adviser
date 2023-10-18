import { Box, SimpleGrid, Text, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import TopicIcon from '../../Icons/TopicIcon';

const SelectTopics = ({ predefinedData, selectTopicHandler, themeColor }) => {

    const predefinedDataExtended = {
        Blank: [],
        ...predefinedData.prompts,
    }

    return (

        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }}
            width={'100%'}
            border={'0px solid green'}
            spacing={['2', '16']}
            px={['0', '8']}
        >
            {
                Object.keys(predefinedDataExtended).map((topic, index) => {
                    return (
                        <Box m={0} key={index}
                            height={{ base: '150px', md: '140px' }}
                            width={'full'}
                            paddingX={'1'}
                            paddingY={'3'}
                            bg='white'
                            // style={{
                            //     background: 'rgb(219, 219, 219)',
                            //     background: 'linear-gradient(130deg, rgba(219,219,219,0.7469362745098039) 0%, rgba(226,228,228,0.427608543417367) 25%, rgba(238,237,237,1) 85%)'
                            // }}
                            borderWidth={'1px'}
                            borderRadius={'lg'}
                            display={'flex'}
                            alignItems={'center'}
                            // justifyContent={'space-between'}
                            flexDirection={'column'}
                            onClick={() => selectTopicHandler(topic)}
                            _hover={{ cursor: 'pointer' }}
                            as={motion.div}
                            whileHover={{ scale: 1.05 }}
                            initial={{ x: -100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1, transition: { duration: 0.5 } }}
                        // exit={{ x: 100 }}
                        // viewport={{ margin: '-170px 0 -100px 0' }}

                        >
                            <Flex bg='' flex={1} alignItems={'center'}>
                                {topic !== 'Blank' &&
                                    <Box key={'iconWrapper'} borderWidth='0px' borderColor={themeColor} p={3} borderRadius={'50%'} as={motion.div} whileInView={{ scale: [0.2, 0.75, 1.1, 1] }} bg={'RGBA(0, 0, 0, 0.04)'}>
                                        <TopicIcon iconSize={['24px', '38px']} topicName={topic} />
                                    </Box>}
                            </Flex>
                            <Flex bg='' flex={2}>
                                <Text textAlign={'center'} fontSize={['xs', 'sm']} wordBreak={'break-word'} py={2}>
                                    {topic.length > 20 ? `${topic.slice(0, 20)}...` : topic}
                                </Text>
                            </Flex>
                        </Box >
                    )
                })
            }
        </SimpleGrid>
    )
}

export default SelectTopics;