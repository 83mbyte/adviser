
import { Box, HStack, Icon, IconButton, StackDivider, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { MdDelete } from 'react-icons/md';
import { useState } from 'react';

import { RiChatHistoryLine } from "react-icons/ri";
import { animationProps } from '@/src/lib/animationProps';


const ChatAllHistory = ({ themeColor, allHistory, clearChatFromHistory, chooseHistory }) => {
    const [isLoading, setIsLoading] = useState(false);
    const onClickDeleteHandler = async (chatId) => {
        setIsLoading(true);
        let res = await clearChatFromHistory(chatId);
        setIsLoading(false);
    }

    return (
        <VStack
            divider={<StackDivider borderColor={`${themeColor}.200`} />}
            spacing={4}
            alignItems={'flex-start'}
            w='full'
            bg=''
        >
            {
                Object.keys(allHistory).map((chatId, index) => {
                    return (
                        <HStack w='full' spacing={'1'} color={`${themeColor}.800`} key={`history_${index}`}
                            as={motion.div}
                            whileInView={animationProps.listLikeItems.listItem}
                            variants={animationProps.listLikeItems}
                            viewport={{ once: true, amount: 0.2 }}
                            custom={index}

                            layout
                        >
                            <Box bg='' pr={1} display={'flex'} alignItems={'center'}>
                                <Icon as={RiChatHistoryLine} />
                            </Box>
                            <Box bg='' w='full'
                                _hover={{ cursor: 'pointer' }}
                                onClick={() => chooseHistory(`${chatId}`)}
                            >
                                {`${allHistory[chatId][0].user.content.slice(0, 80)}...`}
                            </Box>
                            <Box bg=''
                                as={motion.div}
                                custom={index + 1}
                                initial={animationProps.listLikeItems.rightIcon.init}
                                whileInView={animationProps.listLikeItems.rightIcon.ready}
                                variants={animationProps.listLikeItems}
                                viewport={{ once: true }}
                            >
                                <IconButton
                                    isLoading={isLoading}
                                    icon={<MdDelete />}
                                    colorScheme={themeColor}
                                    _hover={{ color: 'red' }}
                                    variant={'link'}
                                    onClick={() => onClickDeleteHandler(chatId)}
                                />
                            </Box>
                        </HStack>

                    )
                })
            }
        </VStack>
    )
}


export default ChatAllHistory;