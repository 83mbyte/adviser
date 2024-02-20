import { useState } from 'react';
import { Box, HStack, Icon, IconButton, StackDivider, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { MdDelete } from 'react-icons/md';
import { RiChatHistoryLine } from "react-icons/ri";

import { animationProps } from '@/src/lib/animationProps';

const WorkspaceHistory = ({ themeColor, allHistory, clearItemFromHistory, chooseHistory, type }) => {

    const [isLoading, setIsLoading] = useState(false);
    const onClickDeleteHandler = async (historyId) => {
        setIsLoading(true);
        await clearItemFromHistory(historyId);
        setIsLoading(false);
    }

    return (
        <VStack
            divider={<StackDivider borderColor={`${themeColor}.100`} />}
            spacing={4}
            alignItems={'flex-start'}
            w='full'
            bg=''
            mt={4}
        >
            {
                (allHistory && Object.keys(allHistory).length > 0) &&
                Object.keys(allHistory).map((historyId, index) => {

                    return (
                        <HStack w='full' spacing={'1'} color={`${themeColor}.800`} key={`history_${index}`}
                            as={motion.div}
                            whileInView={animationProps.listLikeItems.listItem}
                            variants={animationProps.listLikeItems}
                            viewport={{ once: true, amount: 0.2 }}
                            custom={index}
                            layout
                        >
                            <Box bg='' px={1} display={'flex'} alignItems={'center'}>
                                <Icon as={RiChatHistoryLine} />
                            </Box>
                            <Box bg='' w='full'
                                _hover={{ cursor: 'pointer' }}
                                onClick={() => chooseHistory(`${historyId}`)}
                            >
                                {type == 'chat'
                                    && `${allHistory[historyId][0].user.content.slice(0, 80)}...`
                                }
                                {type == 'summarize'
                                    && `${allHistory[historyId][0].assistant.title.slice(0, 80)}...`
                                }
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
                                    onClick={() => onClickDeleteHandler(historyId)}
                                />
                            </Box>
                        </HStack>
                    )
                })
            }
        </VStack>
    );
};

export default WorkspaceHistory;