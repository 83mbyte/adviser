"use client";
import { useUISettingsContext } from "@/src/context/UISettingsContext";
import {
  Box,
  useColorModeValue,
  Heading,
  IconButton,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

import { HiMenu, HiX } from "react-icons/hi";
import MainWrapper from "../../Wrappers/MainWrapper";
import HeaderSettingsMenu from "../../Menu/HeaderSettingsMenu";

const headerVars = {
  hidden: { y: -200 },
  visible: {
    y: 0,
    transition: {
      delay: 0,
      type: "spring",
      snifness: 10,
    },
  },
};

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

const btns = ['one', 'two', 'three'];

const Header = () => {
  const UISettingsContext = useUISettingsContext();
  const { themeColor, setThemeColor } = UISettingsContext.userThemeColor;


  const navVisibility = useBreakpointValue({
    base: false,
    sm: true,
  });

  return (
    <section as={"header"} style={{ width: "100%" }}>
      <AnimatePresence mode="wait">
        <Box
          as={motion.div}
          key={'header'}
          // variants={headerVars}
          // animate={"visible"}
          // initial={"hidden"}
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
            <Box bg="" as={motion.div}
              initial={{ opacity: 0, x: -150 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.5, duration: 0.8 } }}
            >
              <Heading as={"h5"} color={`${themeColor}.500`}>
                Helpi
              </Heading>
            </Box>

            {/* Header buttons  */}
            <Box
              display="flex"
              alignItems={"center"}
            >
              <NavigationButtons show={navVisibility} themeColor={themeColor} setThemeColor={setThemeColor} />
              <MenuBtn show={navVisibility} themeColor={themeColor} />
            </Box>
          </MainWrapper>
        </Box>
      </AnimatePresence>
    </section >
  );
};

export default Header;


const NavigationButtons = ({ show, themeColor, setThemeColor }) => {

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
            <motion.div
              key={'btn1'}
              variants={buttonsAnimation}
            >
              <IconButton icon={<HiX />} variant={'outline'} colorScheme={themeColor} />
            </motion.div>
            <motion.div
              key={'SettingsButton'}
              variants={buttonsAnimation}
            >
              <HeaderSettingsMenu setThemeColor={setThemeColor} themeColor={themeColor} />
            </motion.div>
          </HStack>
        }
      </AnimatePresence>
    </>
  );
};

const MenuBtn = ({ show, themeColor }) => {

  return (
    <>
      <AnimatePresence mode='wait'>
        {
          show === false &&
          <Box as={motion.div}
            variants={buttonsAnimation}
            initial={'hidden'}
            animate={'visible'}
            exit={'exit'}
          >
            <IconButton
              size={"sm"}
              colorScheme={themeColor}
              variant={"outline"}
              icon={<HiMenu size={'22px'} />}
            />
          </Box>
        }
      </AnimatePresence>
    </>
  )
}

