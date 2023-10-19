const transitionSpring = {
    type: 'spring',
    duration: 1,
    bounce: 0.3
}
export const animationProps = {

    buttons: {
        // slide from left
        slideFromLeft: {
            hidden: { opacity: 0, x: -200 },
            visible: {
                opacity: 1,
                x: 0,
                transition: {
                    ...transitionSpring,
                    staggerChildren: 0.4
                }
            },
            exit: { opacity: 0, x: -200, transition: { duration: 0.3, delay: 0.2 } }
        },
        // slide from left child
        slideFromLeftChild: {
            hidden: { opacity: 0, x: -200 },
            visible: {
                opacity: 1,
                x: 0,
                transition: transitionSpring,
            },
            exit: { opacity: 0, x: -200 }
        },
        // slide from right
        slideFromRight: {
            hidden: { opacity: 0, x: 200 },
            visible: {
                opacity: 1,
                x: 0,
                transition: {
                    ...transitionSpring,
                    delay: 0.6,
                    staggerChildren: 0.9,
                    staggerDirection: -1
                }
            },
            exit: { opacity: 0, x: 200, transition: { duration: 0.3, delay: 0.2 } }
        },
        // slide from right child
        slideFromRightChild: {
            hidden: { opacity: 0, x: 200 },
            visible: {
                opacity: 1,
                x: 0,
                transition: transitionSpring,
            },
            exit: { opacity: 0, x: 200 }
        },
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
    ,
    slideFromTop: {
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
        exit: { opacity: 0, y: '-100vh', transition: { duration: 0.5, delay: 0.2 } },
    }
}