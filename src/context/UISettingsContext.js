
'use client'
import React from 'react';
import { dbAPI } from '../lib/dbAPI';

const UISettingsContext = React.createContext();

export const useUISettingsContext = () => {
    return React.useContext(UISettingsContext);
}

const UISettingsContextProvider = ({ userId, children }) => {
    const [themeColor, setThemeColor] = React.useState('green');

    const settingsObject = {
        userThemeColor: { themeColor, setThemeColor }
    }

    React.useEffect(() => {
        const getUserUISettings = async () => {
            let resp = await dbAPI.getUserData(userId);
            if (resp) {
                setThemeColor(resp.theme.toLowerCase());
            }
            return null
        }

        getUserUISettings();
    }, [])

    return (
        <UISettingsContext.Provider value={settingsObject}>
            {children}
        </UISettingsContext.Provider>
    )
}

export default UISettingsContextProvider;