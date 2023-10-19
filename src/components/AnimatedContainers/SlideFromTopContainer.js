const { Box } = require("@chakra-ui/react")
const { AnimatePresence, motion } = require("framer-motion")

const slideFromTopAnimation = {
    hidden: {
        y: '-100vh',
        opacity: 0
    },
    visible: custom => ({
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            delay: custom * 0.8,
            stiffness: 100
        }
    }),
    exit: { opacity: 0, y: '100vh', transition: { duration: 0.5, delay: 0.2 } },
}

const SlideFromTopContainer = ({ height = 'auto', width = 'full', delay, children }) => {
    return (
        <AnimatePresence mode='wait'>
            <Box
                bg=' '
                custom={delay}
                key='slideFromTopContainer'
                height={height}
                width={width}
                display={'flex'}
                flexDirection={'column'}
                as={motion.div}
                variants={slideFromTopAnimation}
                initial='hidden'
                animate='visible'
            >
                {children}
            </Box>
        </AnimatePresence>
    )
}

export default SlideFromTopContainer;