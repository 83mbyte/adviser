import React from 'react';
import { dbAPI } from '../lib/dbAPI';

const HistoryContext = React.createContext();

export const useHistoryContext = () => {
    return React.useContext(HistoryContext);
}

const HistoryContextProvider = ({ userId, children }) => {
    const [history, setHistory] = React.useState({});

    React.useEffect(() => {
        const getHistoryFromRemoteDB = async (userId) => {
            let resp = await dbAPI.getData(userId);
            if (resp) {
                setHistory(resp)
            }
        }
        getHistoryFromRemoteDB(userId);
    }, [userId]);

    return (
        <HistoryContext.Provider value={history} >
            {children}
        </HistoryContext.Provider>
    );
};

export default HistoryContextProvider;