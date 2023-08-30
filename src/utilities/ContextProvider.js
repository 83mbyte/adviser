import React, { createContext, useContext } from 'react';

const StateContext = createContext();

export const useStateContext = () => {
    return useContext(StateContext)
}


const ContextProvider = ({ children }) => {
    const [chatHistory, setChatHistory] = React.useState({});
    const [activeButton, setActiveButton] = React.useState(
        {
            length: '',
            context: '',
            tone: 'Tone_2',  //example. default tone 
            role: 'Role_1',  //example. default role 
            theme: 'Purple',
        }
    )

    const [isVisibleMenu, setIsVisibleMenu] = React.useState(false);
    const [isVisibleHistory, setIsVisibleHistory] = React.useState(false);
    const [isVisibleChatArea, setIsVisibleChatArea] = React.useState(false);
    const [themeColor, setThemeColor] = React.useState('purple')


    const contextObj = {

        chatHistory: { chatHistory, setChatHistory },
        activeButton: { activeButton, setActiveButton },
        isVisibleMenu: { isVisibleMenu, setIsVisibleMenu },
        isVisibleHistory: { isVisibleHistory, setIsVisibleHistory },
        isVisibleChatArea: { isVisibleChatArea, setIsVisibleChatArea },
        themeColor: { themeColor, setThemeColor }
    }

    return (
        <StateContext.Provider value={contextObj}  >
            {children}
        </StateContext.Provider >
    );
};

export default ContextProvider;