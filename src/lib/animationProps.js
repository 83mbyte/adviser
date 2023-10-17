const transitionSpringButtons = {
    type: 'spring',
    duration: 1,
    bounce: 0.3
}
export const animationProps = {

    buttons: {
        slideFromLeft: {
            hidden: { opacity: 0, x: -200 },
            visible: {
                opacity: 1,
                x: 0,
                transition: {
                    ...transitionSpringButtons
                }
            },
            exit: { opacity: 0, x: -200, transition: { duration: 0.3, delay: 0.2 } }
        },
        slideFromRight: {
            hidden: { opacity: 0, x: 200 },
            visible: {
                opacity: 1,
                x: 0,
                transition: {
                    ...transitionSpringButtons,
                    delay: 0.4
                }
            },
            exit: { opacity: 0, x: 200, transition: { duration: 0.3, delay: 0.2 } }
        }
    },

    text: {
        scale: {
            hidden: { opacity: 0, scale: 0.75 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
            exit: { opacity: 0, transition: { duration: 0.5 } }
        }
    },

    chatWindowScreens: {

        slideFromLeft: {
            hidden: {
                x: '-300px',
                opacity: 0
            },
            show: {
                x: 0,
                opacity: 1,
                transition: { delay: 0.1, duration: 0.8 }
            },
            exit: {
                x: '300px',
                opacity: 0,
                transition: {
                    duration: 0.4
                }
            }
        },
        opacity: {
            hidden: {
                opacity: 0
            },
            show: {
                opacity: 1,
                transition: { delay: 0.1, duration: 0.8 }
            },
            exit: {
                opacity: 0,
                transition: {
                    duration: 0.4
                }
            }
        }
    }
}