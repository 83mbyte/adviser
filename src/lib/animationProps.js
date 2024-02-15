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
            exit: { opacity: 0, x: -200, transition: transitionSpring, }
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
            exit: { opacity: 0, x: 200, transition: transitionSpring, }
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
        slideFromTop: {
            hidden: {
                y: '-80vh',
                opacity: 0
            },
            show: {
                y: 0,
                opacity: 1,
                transition: {
                    y: {
                        type: 'spring',
                        delay: 0.1,
                        stiffness: 100
                    }
                }
            },
            exit: {
                opacity: 0, y: '50vh',
                transition: {
                    y: {
                        type: 'spring',
                        delay: 0.1,
                        stiffness: 100
                    }
                }
            }
        },
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
                x: '-300px',
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
        },
        opacityDelayed: {
            hidden: {
                opacity: 0
            },
            show: {
                opacity: 1,
                transition: { delay: 0.8, duration: 0.8 }
            },
            exit: {
                opacity: 0,
                transition: {
                    duration: 0.4
                }
            }
        }
    },
    listLikeItems: {
        listItem: {
            opacity: [0, 0.5, 1],
            // x: ['-500px', '0px'],
            transition: {
                // delay: custom * 0.08,
                duration: 0.5,
                ease: 'linear',
                // opacity: { duration: 1, delay: custom * 0.08 }
            }
        },
        rightIcon: {
            init: {
                opacity: 0,
                x: '-40px',
                transition: { duration: 0.5 }
            },

            ready: custom => ({
                opacity: [0.1, 1],
                x: ['-40px', '0px'],
                transition: { duration: 0.8, delay: custom * 0.1 }
            })
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
    },
    slideFromTop: {
        hidden: {
            y: '-50vh',
            opacity: 0
        },
        visible: custom => ({
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, delay: 0.1 }
            // transition: {
            //     type: 'spring',
            //     delay: custom * 0.8,
            //     stiffness: 100
            // }
        }),
        exit: { opacity: 0, y: '10vh', transition: { duration: 0.5, delay: 0.1 } },
    },
    scaleFromMinToMax: {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                scale: { type: 'spring', bounce: 0.3 }
            }
        },
        exit: { opacity: 0, scale: 0.5 }
    }

}