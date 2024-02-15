'use client'
import MainWrapper from "../../Wrappers/MainWrapper";
import { AnimatePresence, motion } from "framer-motion";
import { animationProps } from "@/src/lib/animationProps";

import ManageSubscription from "../ManageSubscription/ManageSubscription";
import YouTubeSummarize from "../YouTubeSummarize/YouTubeSummarize";
import TextChat from "../TextChat/TextChat";
import CreateImage from "../CreateImage/CreateImage";

const MainArea = ({ workspaceType }) => {



  return (

    <MainWrapper >
      <AnimatePresence mode='wait'>

        {
          workspaceType == 'image' &&
          <motion.div key={'imageWindow'}
            style={{ width: '100%', height: '100%' }}
            variants={animationProps.slideFromTop}
            initial={'hidden'}
            animate={'visible'}
            exit={'exit'}
          >
            <CreateImage />
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
        {
          workspaceType == 'ytsummarize' &&
          <motion.div key={'ytsummarize'}
            style={{ width: '100%', height: '100%' }}
            variants={animationProps.slideFromTop}
            initial={'hidden'}
            animate={'visible'}
            exit={'exit'}
          >
            <YouTubeSummarize />
          </motion.div>
        }
        {
          workspaceType == 'textchat' &&
          <motion.div key={'textchat'}
            style={{ width: '100%', height: '100%' }}
            variants={animationProps.slideFromTop}
            initial={'hidden'}
            animate={'visible'}
            exit={'exit'}
          >
            <TextChat />
          </motion.div>
        }
      </AnimatePresence>
    </MainWrapper >

  );
};

export default MainArea;