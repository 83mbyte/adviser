'use client'
import MainWrapper from "../../Wrappers/MainWrapper";
import ChatWindow from "../ChatWindow/ChatWindow";
import ImageCreatorWindow from "../ImageCreatorWindow/ImageCreatorWindow";
import { AnimatePresence, motion } from "framer-motion";
import { animationProps } from "@/src/lib/animationProps";
import ManageSubscription from "../ManageSubscription/ManageSubscription";

const MainArea = ({ workspaceType }) => {



  return (

    <MainWrapper >
      <AnimatePresence mode='wait'>
        {
          workspaceType == 'chat' &&
          <motion.div key={'chatWindow'}
            style={{ width: '100%', height: '100%' }}
            variants={animationProps.slideFromTop}
            initial={'hidden'}
            animate={'visible'}
            exit={'exit'}
          >
            <ChatWindow />
          </motion.div>
        }
        {
          workspaceType == 'image' &&
          <motion.div key={'imageWindow'}
            style={{ width: '100%', height: '100%' }}
            variants={animationProps.slideFromTop}
            initial={'hidden'}
            animate={'visible'}
            exit={'exit'}
          >
            <ImageCreatorWindow />
          </motion.div>
        }
        {
          workspaceType == 'subscription' &&
          <motion.div key={'manageSubscription'}
            style={{ width: '100%', height: '100%' }}
            variants={animationProps.slideFromTop}
            initial={'hidden'}
            animate={'visible'}
            exit={'exit'}
          >
            <ManageSubscription />
          </motion.div>
        }
      </AnimatePresence>
    </MainWrapper >

  );
};

export default MainArea;