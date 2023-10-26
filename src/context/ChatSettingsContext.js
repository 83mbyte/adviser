const { createContext, useContext, useState } = require("react");


const ChatSettingsContext = createContext();

export const useChatSettingsContext = () => {
    return useContext(ChatSettingsContext);
}

const ChatSettingsProvider = ({ children }) => {

    const [settingsOptions, setSettingsOptions] = useState({
        replyLength: '100 words',
        replyStyle: 'Facts only',
        replyTone: 'Casual'
    })

    const contextObject = {
        settingsOptions,
        setSettingsOptions
    }
    return (
        <ChatSettingsContext.Provider value={contextObject}>
            {children}
        </ChatSettingsContext.Provider>
    )
}

export default ChatSettingsProvider;