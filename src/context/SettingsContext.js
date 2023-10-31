
'use client'
import React from 'react';
import { dbAPI } from '../lib/dbAPI';
import { useAuthContext } from './AuthContextProvider';

const SettingsContext = React.createContext();

export const useSettingsContext = () => {
    return React.useContext(SettingsContext);
}

const SettingsContextProvider = ({ children }) => {
    const [themeColor, setThemeColor] = React.useState(null);
    const [showModal, setShowModal] = React.useState({ isShow: false, type: '' });
    const [workspaceType, setWorkspaceType] = React.useState('chat');

    const [chatSettings, setChatSettings] = React.useState({
        replyLength: '100 words',
        replyStyle: 'Facts only',
        replyTone: 'Casual'
    })

    const user = useAuthContext();

    const settingsObject = {
        userThemeColor: { themeColor, setThemeColor },
        showModalWindow: { showModal, setShowModal },
        userWorkspaceType: { workspaceType, setWorkspaceType },
        chatSettings: { chatSettings, setChatSettings },
    }

    React.useEffect(() => {
        const getUserUISettings = async () => {
            try {
                let resp = await dbAPI.getUserData(user.uid);
                if (resp) {
                    setThemeColor(resp.theme.toLowerCase());
                    if (resp.chatSettings) {
                        setChatSettings(resp.chatSettings)
                    }
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
        <SettingsContext.Provider value={settingsObject}>
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsContextProvider;