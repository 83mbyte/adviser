'use client'
import MainWrapper from "../../Wrappers/MainWrapper";
import { AnimatePresence, motion } from "framer-motion";
import { animationProps } from "@/src/lib/animationProps";

import ManageSubscription from "../ManageSubscription/ManageSubscription";
import YouTubeSummarize from "../YouTubeSummarize/YouTubeSummarize";
import TextChat from "../TextChat/TextChat";
import CreateImage from "../CreateImage/CreateImage";
import { useState } from "react";

const MainArea = ({ workspaceType }) => {

  //Issues states:
  const [showNoStoreImagesIssue, setShowNoStoreImagesIssue] = useState(true);
  const [showNoHistoryIssue, setShowNoHistoryIssue] = useState(true);
  const [showNoHistoryVideoIssue, setShowNoHistoryVideoIssue] = useState(true);



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
            <CreateImage showNoStoreImagesIssue={showNoStoreImagesIssue} setShowNoStoreImagesIssue={setShowNoStoreImagesIssue} />
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
            <YouTubeSummarize showNoHistoryVideoIssue={showNoHistoryVideoIssue} setShowNoHistoryVideoIssue={setShowNoHistoryVideoIssue} />
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
            <TextChat showNoHistoryIssue={showNoHistoryIssue} setShowNoHistoryIssue={setShowNoHistoryIssue} />
          </motion.div>
        }
      </AnimatePresence>
    </MainWrapper >

  );
};

export default MainArea;