"use client";

import {
  Box,
  useColorModeValue,
  Heading,
  HStack,
  Button,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

import { FaCrown } from "react-icons/fa";

import MainWrapper from "../../Wrappers/MainWrapper";
import HeaderSettingsMenu from "../../Menus/HeaderSettingsMenu";
import { useSettingsContext } from "@/src/context/SettingsContext/SettingsContextProvider";


const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;

const navContainerVariants = {
  hidden: {
    // y: -100,
    x: 150,
    // opacity: 1
  },
  visible: {
    // y: 0, 
    x: 0,
    // opacity: 1,
    transition: {
      staggerChildren: 0.1, delayChildren: 0.3,
      type: 'spring',
      // bounce: 0.4
      // damping: 150,
      // stiffness: 200,
      // mass: 0.5,
    }
  },
  exit: { opacity: 0 }
}

const buttonsAnimation = {
  hidden: {
    opacity: 0,
    x: 150
    // y: -100 
  },
  visible: {
    opacity: 1,
    x: 0,
    //  y: 0,
    transition: {
      // type: 'spring',
      // stiffness: 200,
      duration: 0.8,
    }
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: { duration: 0.4 }
    //  y: -100 
  }
}

const Header = () => {
  const settingsContext = useSettingsContext();

  const subscription = settingsContext.settings.userInfo.subscription;


  const themeColor = settingsContext.settings.UI.themeColor;


  return (
    <section as={"header"} style={{ width: "100%" }}>
      <AnimatePresence mode="wait">
        <Box
          as={motion.div}
          key={'header'}
          display="flex"
          flexDirection={"row"}
          justifyContent={"center"}
          minH={["45px", "55px"]}
          h={["45px", "55px"]}
          borderBottom={1}
          borderStyle={"solid"}
          px={{ base: '1', md: '2' }}
          borderColor={useColorModeValue("gray.200", "gray.900")}
          w={"full"}
        >

          <MainWrapper direction='row' >

            {/* Logo */}
            {
              themeColor &&
              <Box bg="" as={motion.div}
                key={'onlinemode'}
                initial={{ opacity: 0, x: -150 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.5, duration: 0.8 } }}
              >
                <Heading as={"h5"} color={`${themeColor}.500`}>
                  {APP_NAME}
                </Heading>
              </Box>
            }
            {
              !themeColor &&
              <Box bg="" as={motion.div}
                key={'offlinemode'}
                initial={{ opacity: 0, }}
                animate={{ opacity: 1, transition: { delay: 1.3, duration: 0.4 } }}
                exit={{ opacity: 0, x: -150 }}
              >
                <HStack>
                  <Heading as={"h5"} >
                    {APP_NAME}
                  </Heading>
                  <Text fontSize='sm'>offline</Text>
                </HStack>
              </Box>
            }

            {/* Header buttons  */}
            <Box
              display="flex"
              alignItems={"center"}
            >
              <NavigationButtons show={true} themeColor={themeColor} subscription={subscription} updateSettings={settingsContext.updateSettings} />
            </Box>
          </MainWrapper>
        </Box>
      </AnimatePresence>
    </section >
  );
};

export default Header;


const NavigationButtons = ({ show, themeColor, subscription, updateSettings }) => {

  const openNewWindowHandler = (type) => {
    updateSettings('UI', 'workspaceType', type);
  }

  return (
    <>
      <AnimatePresence mode='wait'>
        {show === true &&
          <HStack
            as={motion.div}
            variants={navContainerVariants}
            initial={'hidden'}
            animate={'visible'}
            exit={'exit'}
            key={"headerNav"}
            spacing='10px'
          >
            {
              (subscription?.type && subscription.type !== 'Premium') &&
              <motion.div
                key={'getPremium'}
                variants={buttonsAnimation}
              >

                <Tooltip label='Get premium subscription' hasArrow bg={`${themeColor}.500`}>
                  <Button leftIcon={<FaCrown />} colorScheme={'orange'} size={'sm'} variant={'outline'} onClick={() => { openNewWindowHandler('subscription') }}>Premium</Button>
                </Tooltip>
              </motion.div>
            }

            <motion.div
              key={'SettingsButton2'}
              variants={buttonsAnimation}
            >

              <HeaderSettingsMenu openNewWindowHandler={openNewWindowHandler} />
            </motion.div>
          </HStack>
        }
      </AnimatePresence >
    </>
  );
};


