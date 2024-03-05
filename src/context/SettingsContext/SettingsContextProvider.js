import LoadingSpinner from "@/src/components/LoadingSpinner/LoadingSpinner";

const { createContext, useContext, useState, useCallback, useEffect } = require("react");


const SettingsContext = createContext();

const initialSettingsState = {
    UI: {
        themeColor: 'green',
        workspaceType: 'image',
        loading: { userUi: true, plans: true },
        showModal: { isShow: false, type: '' },

    },
    userInfo: {
        subscription: {
            type: 'Trial',
            period: null,
            trialOffers: { images: 0, youtube: 0 }
        },
        isEmailVerified: false,
    },

    chatSettings: {
        replyLength: '100 words',
        replyStyle: 'Facts only',
        replyTone: 'Casual',
        replyFormat: 'Plain text',
        replyCount: '1',
        systemVersion: 'GPT-3.5',
        temperature: 1,
        frequency_p: 0,
        presence_p: 0
    },
    transcribedText: {
        text: null
    },

    imageSettings: {
        size: 'A',
        style: 'vivid',
        quality: 'standard'
    },

    summarizeSettings: {
        operation: 'summarize',
    },

    plansPrices: {  //TODO move this data to server
        Basic: { currency: 'usd', price: 50, period: '6 months', options: { excl: ['Image Generator'], incl: ['GPT-3.5', 'History', 'Fast Support'] } },
        Premium: { currency: 'usd', price: 80, period: '1 year', options: { incl: ['GPT-3.5 & GPT-4', 'History', 'Fast Support', 'Image Generator'] } }

    },
}

const SettingsContextProvider = ({ data, children }) => {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            let updatedSettingsState = { ...initialSettingsState };

            Object.keys(data).forEach((item) => {
                updatedSettingsState = {
                    ...updatedSettingsState,
                    [item]: { ...updatedSettingsState[item], ...data[item] }
                }
            })
            setSettings(updatedSettingsState);
        }
        // else {
        //     setSettings(initialSettingsState)
        // }
    }, [data])

    const context = createSettingsContext(settings, setSettings);


    return (
        <SettingsContext.Provider value={context}>

            {
                !settings
                    ? <LoadingSpinner spinnerColor={'green'} progress={95} />
                    : children
            }

        </SettingsContext.Provider>
    )
}

export default SettingsContextProvider;

export const useSettingsContext = () => {
    return useContext(SettingsContext)
}

function createSettingsContext(settings, setSettings) {
    const updateSettings = useCallback((settingsPath, key, value) => {

        setSettings({
            ...settings,
            [settingsPath]: {
                ...settings[settingsPath],
                [key]: value
            }
        })
    }, [settings])

    return ({
        settings,
        updateSettings
    })

}