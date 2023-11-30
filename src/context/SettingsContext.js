
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
    const [subscription, setSubscription] = React.useState(null);
    const [plansPrices, setPlansPrices] = React.useState({
        Basic: { currency: 'usd', price: 50, period: '6 month', },
        Premium: { currency: 'usd', price: 80, period: '1 year', }
    })

    const [chatSettings, setChatSettings] = React.useState({
        replyLength: '100 words',
        replyStyle: 'Facts only',
        replyTone: 'Casual',
        systemVersion: 'GPT-3.5'
    });

    const user = useAuthContext();

    let settingsObject = {
        userThemeColor: { themeColor, setThemeColor },
        showModalWindow: { showModal, setShowModal },
        userWorkspaceType: { workspaceType, setWorkspaceType },
        chatSettings: { chatSettings, setChatSettings },
        userSubscription: { subscription, setSubscription },
        paidPlans: plansPrices
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
                    if (resp.plan) {
                        setSubscription(resp.plan)
                    }
                }
            } catch (error) {
                console.error(error)
            }
        }

        const getPaidPlansDetails = async () => {
            try {
                let resp = await dbAPI.getSectionData('plans');
                if (resp) {
                    setPlansPrices(resp);
                }
            } catch (error) {

            }
        }

        if (user?.uid) {
            getUserUISettings();
            getPaidPlansDetails();
        }
    }, [user])

    return (
        <SettingsContext.Provider value={settingsObject}>
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsContextProvider;