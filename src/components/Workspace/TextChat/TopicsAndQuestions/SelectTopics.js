import { Box, SimpleGrid, Text, Flex } from '@chakra-ui/react';
import { motion, } from 'framer-motion';

import TopicIcon from '../../../Icons/TopicIcon';
import { forwardRef } from 'react';


const SelectTopics = forwardRef(function SelectTopicsRef({ predefinedData, selectIdeaHandler, themeColor }, ref) {
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
            ref={ref}
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
                            borderWidth={'1px'}
                            borderRadius={'lg'}
                            display={'flex'}
                            alignItems={'center'}
                            flexDirection={'column'}
                            onClick={() => selectIdeaHandler(topic)}
                            _hover={{ cursor: 'pointer' }}
                            as={motion.div}
                            whileHover={{ scale: 1.05 }}
                            initial={{ x: -100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1, transition: { duration: 0.5 } }}
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
})

export default SelectTopics;