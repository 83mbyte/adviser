'use client'
import React from 'react';
import { dbAPI } from '../lib/dbAPI';
import { useAuthContext } from './AuthContextProvider';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const SettingsContext = React.createContext();

export const useSettingsContext = () => {
    return React.useContext(SettingsContext);
}

const SettingsContextProvider = ({ children }) => {
    const [loading, setLoading] = React.useState({ userUi: true, plans: true });
    const [themeColor, setThemeColor] = React.useState(null);
    const [showModal, setShowModal] = React.useState({ isShow: false, type: '' });
    const [workspaceType, setWorkspaceType] = React.useState('chat');
    const [subscription, setSubscription] = React.useState(null);
    const [transcribedText, setTranscribedText] = React.useState(null)
    const [plansPrices, setPlansPrices] = React.useState({
        Basic: { currency: 'usd', price: 50, period: '6 month', },
        Premium: { currency: 'usd', price: 80, period: '1 year', }
    })

    const [chatSettings, setChatSettings] = React.useState({
        replyLength: '100 words',
        replyStyle: 'Facts only',
        replyTone: 'Casual',
        systemVersion: 'GPT-3.5',
        temperature: 1,
        frequency_p: 0,
        presence_p: 0
    });



    let settingsObject = {
        userThemeColor: { themeColor, setThemeColor },
        showModalWindow: { showModal, setShowModal },
        userWorkspaceType: { workspaceType, setWorkspaceType },
        chatSettings: { chatSettings, setChatSettings },
        transcribedTextData: { transcribedText, setTranscribedText },
        userSubscription: { subscription, setSubscription },
        paidPlans: plansPrices
    }
    const user = useAuthContext();

    // new
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
                setLoading({ ...loading, userUi: false });
            }
        } catch (error) {
            console.error('Error while getUserUISettings', error)
        }
    }

    const getPaidPlansDetails = async () => {
        try {
            let resp = await dbAPI.getSectionData('plans');
            if (resp) {
                setPlansPrices(resp);
                setLoading({ ...loading, plans: false });
            }
        } catch (error) {
            console.error('Error while getPaidPlansDetails', error)

        }
    }
    React.useEffect(() => {
        if (user && user.uid && user.uid !== undefined) {
            getUserUISettings();
            getPaidPlansDetails();
        }
    }, [])

    return (
        <SettingsContext.Provider value={settingsObject}>
            {
                loading.userUi && loading.plans
                    ? <LoadingSpinner spinnerColor={'green'} progress={99} />
                    : children
            }
        </SettingsContext.Provider>
    )
}

export default SettingsContextProvider;