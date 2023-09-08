'use client'
import React, { createContext, useContext } from 'react';

const SettingsContext = createContext();

export const useSettingsContext = () => {
    return useContext(SettingsContext)
}


const SettingsContextProvider = ({ children }) => {

    const [activeButton, setActiveButton] = React.useState(
        {
            length: '',
            context: '',
            //tone: 'Tone_2',  //example. default tone 
            //role: 'Role_1',  //example. default role 
            tone: 'Professional',
            role: '',
            theme: 'Purple',
        }
    )

    const [model, setModel] = React.useState('');

    const [isVisibleMenu, setIsVisibleMenu] = React.useState(false);
    const [isVisibleHistory, setIsVisibleHistory] = React.useState(false);
    const [isVisibleChatArea, setIsVisibleChatArea] = React.useState(false);
    const [themeColor, setThemeColor] = React.useState('purple')


    const contextObj = {

        activeButton: { activeButton, setActiveButton },
        isVisibleMenu: { isVisibleMenu, setIsVisibleMenu },
        isVisibleHistory: { isVisibleHistory, setIsVisibleHistory },
        isVisibleChatArea: { isVisibleChatArea, setIsVisibleChatArea },
        themeColor: { themeColor, setThemeColor },
        model: { model, setModel }
    }



    return (
        <SettingsContext.Provider value={contextObj}>
            {children}
        </SettingsContext.Provider >
    );
};

export default SettingsContextProvider;