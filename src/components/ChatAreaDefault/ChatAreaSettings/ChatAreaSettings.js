
import { HStack, Text, Icon, Button, Box } from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";

const lengthButtons = ['short', 'medium', 'long'];

const ChatAreaSettings = ({ themeColor }) => {
    return (

        <Box p={2}>
            <HStack mb={2}>
                <Icon as={AiFillEdit} color={`${themeColor}.600`} />
                <Text textAlign={'left'} w={'full'} color={`${themeColor}.700`}>Set Assistant's Reply Length</Text>
            </HStack>
            <HStack>
                <AnimatePresence>
                    {
                        lengthButtons.map((textBtn, index) => {
                            let lengthBtnWidth;
                            switch (index) {
                                case 0:
                                    lengthBtnWidth = ''
                                    break;
                                case 1:
                                    lengthBtnWidth = '100px'
                                    break;
                                case 2:
                                    lengthBtnWidth = '150px'
                                    break;

                                default:
                                    break;
                            }
                            return (

                                <motion.div
                                    custom={index}
                                    key={index}
                                    variants={animationVar}
                                    initial={'hidden'}
                                    whileInView={'visible'}
                                >
                                    <Button colorScheme={themeColor} variant={'outline'} size={'sm'} width={lengthBtnWidth}>{textBtn}</Button>
                                </motion.div>
                            )
                        })
                    }
                </AnimatePresence>
            </HStack>
        </Box>

    );
};

export default ChatAreaSettings;

const animationVar = {
    hidden: { opacity: 0, },
    visible: custom => ({
        opacity: 1,
        transition: { delay: custom * 0.5, duration: 0.3 }
    })
}