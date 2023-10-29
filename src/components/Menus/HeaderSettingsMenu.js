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
import { MdMenu, MdChat, MdImage } from "react-icons/md";
import { dbAPI } from '@/src/lib/dbAPI';
import { useAuthContext } from '@/src/context/AuthContextProvider';
import { useUISettingsContext } from '@/src/context/UISettingsContext';

const colors = ['green', 'teal', 'orange', 'purple', 'pink']

const HeaderSettingsMenu = ({ setThemeColor, themeColor, }) => {

    const userUISettings = useUISettingsContext();
    const showModalSettings = userUISettings.showModalWindow;
    const userWorkspaceType = userUISettings.userWorkspaceType;

    const user = useAuthContext();

    const [colorChanged, setColorChanged] = useState(false);

    const themeChangeHandler = (e, color) => {
        e.preventDefault();
        e.stopPropagation();
        setThemeColor(color);
        setColorChanged(true);
    }

    const saveColorScheme = async () => {
        if (colorChanged === true) {
            try {
                await dbAPI.updateUserData(user.uid, 'theme', themeColor);
                setColorChanged(false);
            } catch (error) {
                console.error(error)
            }
        }
    }

    const openNewWindowHandler = (type) => {
        userWorkspaceType.setWorkspaceType(type);
    }

    return (
        <Popover placement='bottom-end' bg='transparent' border={'none'} onClose={saveColorScheme}>
            {
                ({ isOpen, onClose }) => (
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
                                                <Button leftIcon={<MdChat />} size='sm' variant={'ghost'} colorScheme='red' onClick={() => { openNewWindowHandler('chat'); onClose(); }}>Start chat</Button>
                                                <Button leftIcon={<MdImage />} size='sm' variant={'ghost'} colorScheme='red' onClick={() => { openNewWindowHandler('image'); onClose() }}>Create image</Button>
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
                                                                whileInView={themeColor === color ? { y: [0, -7, 0], transition: { repeat: Infinity, duration: 0.8, type: 'tween', ease: 'easeInOut' } } : { y: 0 }}
                                                                key={index}
                                                                boxSize={color == themeColor ? '33px' : '30px'}
                                                                borderRadius={'50%'} bg={color}
                                                                // borderColor={'red.500'}
                                                                borderWidth={color == themeColor ? '2px' : '0px'}
                                                                onClick={(e) => themeChangeHandler(e, color)}><Spacer /></Box>
                                                        )
                                                    })
                                                }
                                            </HStack>
                                        </Box>
                                        <Button size='sm' variant={'outline'} colorScheme='red' onClick={() => showModalSettings.setShowModal({ isShow: true, type: 'SignOut' })}>Sign out</Button>
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