import { useEffect, useState, useContext, createContext } from 'react';
import { dbAPI } from '../lib/dbAPI';
import { useAuthContext } from './AuthContextProvider';

const HistoryContext = createContext();

export const useHistoryContext = () => {
    return useContext(HistoryContext);
}

const HistoryContextProvider = ({ children }) => {
    const [history, setHistory] = useState({});
    const user = useAuthContext();


    useEffect(() => {
        const getHistoryFromRemoteDB = async (userId) => {
            try {
                let resp = await dbAPI.getData(userId);
                if (resp) {
                    setHistory(resp);
                }
            } catch (error) {
                console.error(error)
            }
        }
        if (user?.uid) {
            getHistoryFromRemoteDB(user.uid);
        }
    }, [user]);

    return (
        <HistoryContext.Provider value={history} >
            {children}
        </HistoryContext.Provider>
    );
};

export default HistoryContextProvider;