import { useEffect, useState, useContext, createContext } from 'react';
import { dbAPI } from '../lib/dbAPI';

const HistoryContext = createContext();

export const useHistoryContext = () => {
    return useContext(HistoryContext);
}

const HistoryContextProvider = ({ userId, children }) => {
    const [history, setHistory] = useState({});

    useEffect(() => {
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