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
    const [workspaceType, setWorkspaceType] = React.useState('textchat');
    const [subscription, setSubscription] = React.useState(null);
    const [trialOffers, setTrialOffers] = React.useState({ images: 0, youtube: 0 });
    const [isEmailVerified, setIsEmailVerified] = React.useState(null);
    const [transcribedText, setTranscribedText] = React.useState(null)
    const [plansPrices, setPlansPrices] = React.useState({
        Basic: { currency: 'usd', price: 50, period: '6 months', options: { excl: ['Image Generator'], incl: ['GPT-3.5', 'History', 'Fast Support'] } },
        Premium: { currency: 'usd', price: 80, period: '1 year', options: { incl: ['GPT-3.5 & GPT-4', 'History', 'Fast Support', 'Image Generator'] } }
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

    const [imageSettings, setImageSettings] = React.useState({
        size: 'A',
        style: 'vivid',
        quality: 'standard'
    })



    let settingsObject = {
        userThemeColor: { themeColor, setThemeColor },
        showModalWindow: { showModal, setShowModal },
        userWorkspaceType: { workspaceType, setWorkspaceType },
        chatSettings: { chatSettings, setChatSettings },
        imageSettings: { imageSettings, setImageSettings },
        transcribedTextData: { transcribedText, setTranscribedText },
        userSubscription: { subscription, setSubscription },
        trialOffers: { trialOffers, setTrialOffers },
        paidPlans: plansPrices,
        isEmailVerified: isEmailVerified,
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
                    setSubscription(resp.plan);
                    setTrialOffers(resp.plan.trialOffers)
                }
                if (resp.userData) {
                    setIsEmailVerified(resp.userData.isVerified);
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
                let respPricing = await dbAPI.getSectionData('pricing');
                if (respPricing) {
                    let plansWithOptions = {};

                    respPricing.dataArray.forEach(element => {
                        let planName = element.title;

                        if (resp[planName]) {
                            plansWithOptions = {
                                ...plansWithOptions,
                                [planName]: {
                                    ...resp[planName],
                                    options: element.options
                                },
                            }
                        }
                    });
                    setPlansPrices(plansWithOptions)
                }
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
                    ? <LoadingSpinner spinnerColor={'green'} progress={97} />
                    : children
            }
        </SettingsContext.Provider>
    )
}

export default SettingsContextProvider;