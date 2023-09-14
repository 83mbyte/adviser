import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const steps = [
    {
        popover: {
            title: 'Welcome',
            description: 'Here is a  short guide to introduce some main functions.',
            showProgress: false
        }
    },
    {
        element: '#newChat',
        popover: {
            title: 'Create Chat',
            description: 'Here you can create a new chat for your conversation.',
            showProgress: true
        }
    },
    {
        element: '#newImage', popover: {
            title: 'Create Image', description: 'Here you can generate an image based on your request.',
            showProgress: true
        }
    },
    {
        element: '#settingsToggler', popover: {
            title: 'Settings', description: 'Here you can adjust an assistant settings like a reply tone, length, etc.',
            showProgress: true
        },

    },
];

const disableGuide = () => {
    try {
        localStorage.setItem('showGuide', 'false');
    } catch (error) {
        console.error('Unable to save data to local storage. Here is the received error:', error);
    }
}


export const driverObj = driver({
    showButtons: ['next', 'close'],
    doneBtnText: 'Finish',
    steps: steps,

    onNextClick: () => {
        // Implement your own functionality here
        if (driverObj.getActiveStep().element !== '#settingsToggler') {
            console.log('saved');
            disableGuide();
        }
        driverObj.moveNext();
    },
    onPopoverRender: (popover, { config, state }) => {

        // remove arrow on small displays
        if (window.innerWidth < 500) {
            popover.arrow.style.display = 'none';
        }

        const skipButton = document.createElement("button");
        skipButton.innerText = "Skip tutorial";
        skipButton.style.backgroundColor = 'lightgreen';

        popover.footerButtons.appendChild(skipButton);

        skipButton.addEventListener("click", () => {
            disableGuide();
            driverObj.destroy();
        });
    }
});
