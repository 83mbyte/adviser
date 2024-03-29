import { useState } from 'react';
import {
    IconButton,
    HStack,
    Box,
    Spacer,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverBody,
    Stack,
    StackDivider,
    Text,
    Portal,
    VStack,
} from '@chakra-ui/react';

import { motion } from 'framer-motion';
import { MdMenu, MdChat, MdImage, MdAttachMoney } from "react-icons/md";
import { RiYoutubeFill } from "react-icons/ri";
import { dbAPI } from '@/src/lib/dbAPI';
import { useAuthContext } from '@/src/context/AuthContextProvider';
import { useSettingsContext } from '@/src/context/SettingsContext/SettingsContextProvider';


const colors = ['green', 'teal', 'orange', 'purple', 'pink']

const HeaderSettingsMenu = ({ openNewWindowHandler }) => {

    const settingsContext = useSettingsContext();

    const subscription = settingsContext.settings.userInfo.subscription;
    const themeColor = settingsContext.settings.UI.themeColor;

    const user = useAuthContext();

    const [colorChanged, setColorChanged] = useState(false);

    const themeChangeHandler = (e, color) => {
        e.preventDefault();
        e.stopPropagation();
        settingsContext.updateSettings('UI', 'themeColor', color)
        setColorChanged(true);
    }

    const saveColorScheme = async () => {
        if (colorChanged === true) {
            try {

                await dbAPI.updateServerData({
                    userId: user.uid, docName: 'settings', field: 'UI', data: {

                        themeColor
                    }
                });
                setColorChanged(false);
            } catch (error) {
                console.error(error)
            }
        }
    }


    return (
        <Popover placement='bottom-end' bg='transparent' border={'none'} onClose={saveColorScheme}>
            {
                ({ onClose }) => (
                    <>
                        <PopoverTrigger>
                            <IconButton
                                icon={<MdMenu size={'20px'} />}
                                variant='outline'
                                colorScheme={themeColor}
                                size={'sm'}
                            />
                        </PopoverTrigger>
                        <Portal>
                            <PopoverContent style={{ outline: 'none', width: 'auto', boxShadow: 'rgba(0, 0, 0, 0.15) 0px 1px 2px 0px' }}>
                                <PopoverArrow />
                                <PopoverBody  >
                                    <Stack spacing={'4'} direction={'column'} px={'1'} py={2} divider={<StackDivider borderColor='gray.200' />}>
                                        <Box>
                                            <Text mb={'2'}>Model</Text>
                                            <VStack alignItems={'flex-start'}>
                                                <HStack>
                                                    <Button leftIcon={<MdImage />} isDisabled={subscription?.period && subscription.period < Date.now() || subscription?.type && subscription.type == 'Basic'} size='sm' variant={'ghost'} colorScheme={themeColor} onClick={() => { openNewWindowHandler('image'); onClose() }}>Generate image</Button>
                                                    {
                                                        subscription?.type && subscription.type == 'Basic' && <Box>
                                                            <Box borderWidth='1px' borderColor={'yellow.400'} p={'1px 3px'} mx={0} borderRadius={'3px'} >
                                                                <Text color='yellow.600' fontSize={['2xs', 'xs']} fontWeight={'semibold'}>Premium plan required</Text>
                                                            </Box>
                                                        </Box>
                                                    }
                                                </HStack>

                                                <Button isDisabled={subscription?.period && subscription.period < Date.now()} leftIcon={<MdChat />} size='sm' variant={'ghost'} colorScheme={themeColor} onClick={() => { openNewWindowHandler('textchat'); onClose(); }}>Chat bot</Button>

                                                <HStack>
                                                    <Button isDisabled={subscription?.period && subscription.period < Date.now() || subscription?.type && subscription.type == 'Basic'} leftIcon={<RiYoutubeFill />} size='sm' variant={'ghost'} colorScheme={themeColor} onClick={() => { openNewWindowHandler('ytsummarize'); onClose(); }}>Summarize video</Button>
                                                    {
                                                        subscription?.type && subscription.type == 'Basic' && <Box>
                                                            <Box borderWidth='1px' borderColor={'yellow.400'} p={'1px 3px'} mx={0} borderRadius={'3px'} >
                                                                <Text color='yellow.600' fontSize={['2xs', 'xs']} fontWeight={'semibold'}>Premium plan required</Text>
                                                            </Box>
                                                        </Box>
                                                    }
                                                </HStack>
                                            </VStack>

                                        </Box>
                                        <Box>
                                            <Text mb={'2'}>Subscription</Text>
                                            <VStack alignItems={'flex-start'}>

                                                <Button leftIcon={<MdAttachMoney />} size='sm' variant={'ghost'} colorScheme={themeColor} onClick={() => { openNewWindowHandler('subscription'); onClose(); }}>Manage</Button>
                                            </VStack>
                                        </Box>
                                        <Box>
                                            <Text mb={'2'}>Accent color</Text>
                                            <HStack spacing={'2'} bg='' alignItems={'center'} justifyContent={'center'} >
                                                {
                                                    colors.map((color, index) => {
                                                        return (
                                                            <Box _hover={{ cursor: 'pointer' }}
                                                                as={motion.div}
                                                                initial={{ scale: 1 }}
                                                                whileHover={{ scale: 1.2, y: -5 }}
                                                                whileInView={themeColor === color ? { y: [0, -3, 0], transition: { repeat: Infinity, duration: 0.8, type: 'tween', ease: 'easeInOut' } } : { y: 0 }}
                                                                key={index}
                                                                boxSize={color == themeColor ? '30px' : '25px'}
                                                                borderRadius={'2px'} bg={color}
                                                                // borderColor={'red.500'}
                                                                borderWidth={color == themeColor ? '2px' : '0px'}
                                                                onClick={(e) => themeChangeHandler(e, color)}><Spacer /></Box>
                                                        )
                                                    })
                                                }
                                            </HStack>
                                        </Box>
                                        <Button size='sm' variant={'outline'} colorScheme='red'
                                            onClick={() => settingsContext.updateSettings('UI', 'showModal', { isShow: true, type: 'SignOut' })}>Sign out</Button>
                                    </Stack>
                                </PopoverBody>
                            </PopoverContent>
                        </Portal >
                    </>
                )
            }
        </Popover >

    );
};

export default HeaderSettingsMenu;
