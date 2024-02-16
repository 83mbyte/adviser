'use client'
import { VStack, Box, Button, Text, StackDivider, Divider, Stack, Icon, HStack, } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { Fragment, useEffect, useState } from 'react';

import { MdRule } from "react-icons/md";
import { RiSpeakLine } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import { BiSolidNetworkChart } from "react-icons/bi";
import { RxSlider } from "react-icons/rx";

import { dbAPI } from '@/src/lib/dbAPI';
import { useAuthContext } from '@/src/context/AuthContextProvider';
import { useSettingsContext } from '@/src/context/SettingsContext';
import SliderTemplate from '@/src/components/Slider/SliderTemplate';

const settingsArray = [
    {
        title: 'AI system',
        data: [
            {
                subTitle: 'Select version',
                key: 'systemVersion',
                uiElement: 'buttons',
                buttons: ['GPT-3.5', 'GPT-4'],
                icon: BiSolidNetworkChart,
                descr: {
                    0: 'GPT-3.5 model can understand and generate natural language or code. The GPT-3.5 model has been optimized for chat using.',
                    1: 'GPT-4 is a large multimodal model that can solve difficult problems with greater accuracy, thanks to its broader general knowledge and advanced reasoning capabilities.',
                }
            }
        ]
    },
    {
        title: `AI behavior`,
        data: [
            {
                subTitle: 'Creativity control',
                key: 'temperature',
                uiElement: 'slider',
                icon: RxSlider,
            },
            {
                subTitle: `The same words' frequency`,
                // subTitle: 'A level of repeating the same words frequently',
                key: 'frequency_p',
                uiElement: 'slider',
                icon: RxSlider,
            },
            {
                // subTitle: 'Vocabulary',
                subTitle: 'Vocabulary (a variety of words)',
                key: 'presence_p',
                uiElement: 'slider',
                icon: RxSlider,
            },
        ]
    },
    {
        title: `Assistant's adjustment`,
        data: [
            {
                subTitle: 'Set reply length (as max)',
                key: 'replyLength',
                uiElement: 'buttons',
                buttons: ['100 words', '300 words', '500 words'],
                icon: AiFillEdit,
            },
            {
                subTitle: 'Set reply style',
                key: 'replyStyle',
                uiElement: 'buttons',
                buttons: ['Detailed', 'Facts only'],
                icon: MdRule,
            },
            {
                subTitle: 'Set reply tone',
                key: 'replyTone',
                uiElement: 'buttons',
                buttons: ['Funny', 'Casual', 'Philosophical', 'Professional'],
                icon: RiSpeakLine,
            }
        ]
    },
]

const ChatSettings = ({ themeColor }) => {
    const settingsContext = useSettingsContext();
    const { chatSettings, setChatSettings } = settingsContext.chatSettings;
    const { subscription } = settingsContext.userSubscription;
    const [settingsUpdated, setSettingsUpdated] = useState(false);
    const user = useAuthContext();

    const updateSliderValue = (val, el) => {

        setChatSettings({
            ...chatSettings,
            [el.key]: val
        });
        setSettingsUpdated(true);

    }
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
            <Stack direction={['column', 'row']} p={['0', 4]} flexWrap={'wrap'}>
                {
                    settingsArray.map((item, index) => {
                        return (
                            <SettingsBlock title={item.title} key={index} custom={index + 1}>

                                <VStack bg='' alignItems={'flex-start'} divider={<StackDivider borderColor={`${themeColor}.200`} />} spacing={'4'} >
                                    {
                                        item.data.map((el, elIndex) => {

                                            return (
                                                <Fragment key={elIndex}>
                                                    <HStack mt={0} mb={2} bg=''>
                                                        {el.icon && <Icon as={el.icon} color={`${themeColor}.600`} boxSize={'1em'} />}
                                                        <Text fontSize={['xs', 'md']} color={`${themeColor}.700`}>{el.subTitle}:</Text>
                                                    </HStack>
                                                    {
                                                        el.uiElement == 'buttons' &&
                                                        <Stack flexWrap={'wrap'} flexDirection={'row'} mb={1}  >
                                                            {

                                                                el.buttons.map((btn, btnIndex) => {
                                                                    return (
                                                                        <Fragment key={btnIndex}>
                                                                            <Button

                                                                                leftIcon={
                                                                                    chatSettings[el.key] === btn ? <CheckIcon color='green' show={true} /> : <CheckIcon color='green' show={false} />

                                                                                }
                                                                                colorScheme={themeColor}
                                                                                variant={'ghost'}
                                                                                size={['xs', 'md']}
                                                                                py={['2', '3']}
                                                                                isDisabled={subscription?.type && subscription.type !== 'Premium' && btn == 'GPT-4'}
                                                                                onClick={() => {

                                                                                    setChatSettings({
                                                                                        ...chatSettings,
                                                                                        [el.key]: btn
                                                                                    });
                                                                                    setSettingsUpdated(true);
                                                                                }}
                                                                            >{btn}</Button>
                                                                            {
                                                                                subscription?.type && subscription.type !== 'Premium' && btn == 'GPT-4' && <Box>
                                                                                    <Box borderWidth='1px' borderColor={'yellow.400'} p={'1px 3px'} mx={0} borderRadius={'3px'} >
                                                                                        <Text color='yellow.600' fontSize={['2xs', 'xs']} fontWeight={'semibold'}>Premium plan required</Text>
                                                                                    </Box>
                                                                                </Box>
                                                                            }

                                                                            {
                                                                                el.descr &&
                                                                                <Box display={'flex'} justifyContent={'center'} mb={[2, 5]}>
                                                                                    <Text fontSize={['xs', 'sm']}>{el.descr[btnIndex]}</Text>
                                                                                </Box>
                                                                            }
                                                                        </Fragment>
                                                                    )
                                                                })
                                                            }

                                                        </Stack>
                                                    }
                                                    {
                                                        el.uiElement == 'slider' &&
                                                        <Box w='100%' px={4} mt={0} mb={4} bg='' h={'45px'} overflowY={'visible'}>
                                                            {
                                                                el.key == 'temperature' &&
                                                                <SliderTemplate themeColor={themeColor} value={chatSettings.temperature} callback={(val) => updateSliderValue(val, el)} labels={['Strict', 'Default', 'Creative']} valuesSettings={{ min: 0, max: 2, step: 0.1 }} defaultTooltipValue={1} arialLabel='temperature' />
                                                            }
                                                            {
                                                                el.key == 'frequency_p' &&
                                                                <SliderTemplate themeColor={themeColor} value={chatSettings.frequency_p} callback={(val) => updateSliderValue(val, el)} labels={['Low', 'Default', 'High']} valuesSettings={{ min: -1.6, max: 1.6, step: 0.1 }} defaultTooltipValue={0} arialLabel='frequency' />
                                                            }
                                                            {
                                                                el.key == 'presence_p' &&
                                                                <SliderTemplate themeColor={themeColor} value={chatSettings.presence_p} callback={(val) => updateSliderValue(val, el)} labels={['Limited', 'Default', 'Wide']} valuesSettings={{ min: -1.6, max: 1.6, step: 0.1 }} defaultTooltipValue={0} arialLabel='presence' />
                                                            }
                                                        </Box>
                                                    }

                                                </Fragment>
                                            )
                                        })
                                    }
                                </VStack>
                            </SettingsBlock >
                        )
                    })
                }

            </Stack >
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