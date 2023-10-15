'use client'
import { VStack, Box, Button, Text, Divider, Stack, SimpleGrid } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { Fragment } from 'react';


const settingsArray = [
    {
        title: `Assistant's adjustment`,
        data: [
            {
                subTitle: 'Set reply length',
                buttons: ['100 words', '200 words', '400 words']
            },
            {
                subTitle: 'Set reply style',
                buttons: ['Detailed', 'Facts only']
            }
        ]
    },
    {
        title: 'Chat settings',
        data: [
            {
                subTitle: 'Clear chat',
                buttons: ['Clear chat']

            }
        ]
    },
]

const ChatSettings = ({ themeColor }) => {

    return (
        <>
            <Box m={4} p={4} border={'1px dashed red'} display={'flex'} justifyContent={'center'}>
                Hi. This page is still under construction..
            </Box>
            <SimpleGrid columns={{ base: 1, sm: 2, }} spacing={'20px'}>
                {
                    settingsArray.map((item, index) => {
                        return (
                            <SettingsBlock title={item.title} key={index} custom={index + 1}>

                                <VStack bg='' alignItems={'flex-start'}>
                                    {
                                        item.data.map((el, elIndex) => {
                                            return (
                                                <Fragment key={elIndex}>
                                                    <Text fontSize={['2xs', 'sm']}>{el.subTitle}:</Text>
                                                    <Stack flexWrap={'wrap'} flexDirection={'row'} mb={4}>
                                                        {
                                                            el.buttons.map((btn, btnIndex) => {
                                                                return (
                                                                    <Button key={btnIndex}
                                                                        colorScheme={themeColor}
                                                                        variant={'outline'}
                                                                        size={'xs'}
                                                                        py={['2', '3']}
                                                                        onClick={() => alert('Under construction.')}
                                                                    >{btn}</Button>
                                                                )
                                                            })
                                                        }
                                                    </Stack>
                                                </Fragment>
                                            )
                                        })
                                    }
                                </VStack>
                            </SettingsBlock>
                        )
                    })
                }
            </SimpleGrid>

        </>
    );
};

export default ChatSettings;

const settingBlocksAnimation = {
    hidden: { opacity: 0 },
    visible: cystom => ({
        opacity: 1,
        transition: {
            delay: cystom * 0.3,
            duration: 0.5,
        }
    })
}

const SettingsBlock = ({ title, custom, children }) => {

    return (
        <Box bg={'rgb(247,247,247)'} border={'1px solid lightgray'} borderRadius={'10px'} flex={1} minW={'49%'} maxW={['full']} minH={'100px'} p={2} as={motion.div}
            custom={custom}
            variants={settingBlocksAnimation}
            initial={'hidden'}
            animate={'visible'}
        >
            <Text textAlign={'center'} mb={1} fontSize={['sm', 'md']}>{title}</Text>
            <Box display={'flex'} justifyContent={'center'} mb={[2, 5]}>
                <Divider w="50%" m={0} />

            </Box>
            {children}
        </Box>
    )
}

