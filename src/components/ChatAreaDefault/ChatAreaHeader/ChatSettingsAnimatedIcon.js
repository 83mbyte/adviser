import { motion } from 'framer-motion';
import { Icon } from '@chakra-ui/react';

const animationVars = {
    hidden: {
        opacity: 0,
        pathLength: 0

    },
    visible: custom => ({
        opacity: 1,
        pathLength: 1,
        transition: {
            duration: 0.8,
            delay: custom * 2,

        }
    })
}

const ChatSettingsAnimatedIcon = ({ color, size }) => {
    return (
        <Icon viewBox={'0 0 24 24'} strokeLinecap={'round'} strokeWidth={'2'} strokeLinejoin={'round'}
            stroke={color}
            fill={'none'}
            height={size}
            width={size}
            strokeDasharray="0 1"
            as={motion.svg}

        >
            <motion.path variants={animationVars} initial={'hidden'} animate={'visible'} viewport={{ once: true }} custom={1} fill='red' d="M20 7h-9"></motion.path>
            <motion.path variants={animationVars} initial={'hidden'} animate={'visible'} viewport={{ once: true }} custom={0.9} fill='red' d="M14 17H5"></motion.path>
            <motion.circle variants={animationVars} initial={'hidden'} animate={'visible'} viewport={{ once: true }} custom={0.8} cx="17" cy="17" r="3"></motion.circle>
            <motion.circle cx="7" variants={animationVars} initial={'hidden'} animate={'visible'} viewport={{ once: true }} custom={0.5} cy="7" r="3"></motion.circle>
        </Icon>


    );
};

export default ChatSettingsAnimatedIcon;

