'use client'
import { VStack, Box, Button, Text, StackDivider, Divider, Stack, Icon, HStack } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { Fragment, useEffect, useState } from 'react';


import { MdRule } from "react-icons/md";

import { RiSpeakLine } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import { dbAPI } from '@/src/lib/dbAPI';
import { useAuthContext } from '@/src/context/AuthContextProvider';
import { useSettingsContext } from '@/src/context/SettingsContext';
const settingsArray = [
    {
        title: `Assistant's adjustment`,
        data: [
            {
                subTitle: 'Set reply length (as max)',
                key: 'replyLength',
                buttons: ['100 words', '300 words', '500 words'],
                icon: AiFillEdit,
            },
            {
                subTitle: 'Set reply style',
                key: 'replyStyle',
                buttons: ['Detailed', 'Facts only'],
                icon: MdRule,
            },
            {
                subTitle: 'Set reply tone',
                key: 'replyTone',
                buttons: ['Funny', 'Casual', 'Philosophical', 'Professional'],
                icon: RiSpeakLine,
            }
        ]
    },
    // {
    //     title: 'Chat settings',
    //     data: [
    //         {
    //             subTitle: 'Clear chat',
    //             buttons: ['Clear chat']

    //         }
    //     ]
    // },
]

const ChatSettings = ({ themeColor }) => {
    const { chatSettings, setChatSettings } = useSettingsContext().chatSettings;
    const [settingsUpdated, setSettingsUpdated] = useState(false);
    const user = useAuthContext();

    useEffect(() => {
        const onExitSave = async () => {
            if (settingsUpdated === true) {
                let resp = await dbAPI.updateUserData(user.uid, 'chatSettings', chatSettings);
                setSettingsUpdated(false);
            }
        }
        return () => onExitSave();

    })

    return (
        <>
            <Box m={4} p={4} border={'1px dashed red'} display={'flex'} justifyContent={'center'}>
                This page is still under construction.. but it WORKS.
            </Box>
            {/* <SimpleGrid columns={{ base: 1, sm: 1, }} spacing={'20px'}> */}
            <Stack direction={['column', 'row']} p={['0', 4]}>
                {
                    settingsArray.map((item, index) => {
                        return (
                            <SettingsBlock title={item.title} key={index} custom={index + 1}>

                                <VStack bg='' alignItems={'flex-start'} divider={<StackDivider borderColor={`${themeColor}.200`} />} spacing={'4'} >
                                    {
                                        item.data.map((el, elIndex) => {

                                            return (
                                                <Fragment key={elIndex}>
                                                    <HStack  >
                                                        {el.icon && <Icon as={el.icon} color={`${themeColor}.600`} boxSize={'1em'} />}
                                                        <Text fontSize={['2xs', 'md']} color={`${themeColor}.700`}>{el.subTitle}:</Text>
                                                    </HStack>
                                                    <Stack flexWrap={'wrap'} flexDirection={'row'} mb={1}>
                                                        {
                                                            el.buttons.map((btn, btnIndex) => {
                                                                return (
                                                                    <Button
                                                                        key={btnIndex}
                                                                        leftIcon={
                                                                            chatSettings[el.key] === btn ? <CheckIcon color='green' show={true} /> : <CheckIcon color='green' show={false} />

                                                                        }
                                                                        colorScheme={themeColor}
                                                                        variant={'ghost'}
                                                                        size={['xs', 'md']}
                                                                        py={['2', '3']}

                                                                        onClick={() => {

                                                                            setChatSettings({
                                                                                ...chatSettings,
                                                                                [el.key]: btn
                                                                            });
                                                                            setSettingsUpdated(true);
                                                                        }}
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

            </Stack>
            {/* </SimpleGrid> */}

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
                <Divider w="70%" m={0} />

            </Box>
            {children}
        </Box>
    )
}



const CheckIcon = ({ color, show }) => {
    return (

        <Icon
            strokeWidth='0'
            stroke={color}
            viewBox='0 0 24 24'
            height='1rem' width='1rem'
        >
            <motion.path
                stroke={'#A0AEC0'}
                strokeWidth={1}
                key={'path'}
                fill="none" d="M0 0h24v24H0z"
            ></motion.path>

            <AnimatePresence mode='wait'>
                {
                    show == true && <motion.path
                        key={'path2'}
                        strokeWidth={'1'}
                        fill='none'
                        initial={{ pathLength: 0, fill: '#F0FFF4' }}
                        animate={{
                            pathLength: 1,
                            fill: '#38A169',
                            transition: {
                                fill: { duration: 0.5 },
                                scale: { duration: 1, delay: 0.5 }
                            }
                        }}
                        exit={{ scale: 0.3, transition: { duration: 0.4 } }}
                        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></motion.path>
                }
            </AnimatePresence>
        </Icon >
    )
}