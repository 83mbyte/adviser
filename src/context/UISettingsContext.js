
'use client'
import React from 'react';
import { dbAPI } from '../lib/dbAPI';
import { useAuthContext } from './AuthContextProvider';

const UISettingsContext = React.createContext();

export const useUISettingsContext = () => {
    return React.useContext(UISettingsContext);
}

const UISettingsContextProvider = ({ children }) => {
    const [themeColor, setThemeColor] = React.useState(null);
    const [showModal, setShowModal] = React.useState({ isShow: false, type: '' });
    const [workspaceType, setWorkspaceType] = React.useState('chat');

    const user = useAuthContext();

    const settingsObject = {
        userThemeColor: { themeColor, setThemeColor },
        showModalWindow: { showModal, setShowModal },
        userWorkspaceType: { workspaceType, setWorkspaceType }
    }

    React.useEffect(() => {
        const getUserUISettings = async () => {
            try {
                let resp = await dbAPI.getUserData(user.uid);
                if (resp) {
                    setThemeColor(resp.theme.toLowerCase());
                }
            } catch (error) {
                console.error(error)
            }
        }

        if (user?.uid) {
            getUserUISettings();
        }
    }, [user])

    return (
        <UISettingsContext.Provider value={settingsObject}>
            {children}
        </UISettingsContext.Provider>
    )
}

export default UISettingsContextProvider;