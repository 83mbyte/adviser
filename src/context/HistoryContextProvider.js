'use client'
import { useEffect, useState, useContext, createContext } from 'react';
import { dbAPI } from '../lib/dbAPI';
import { useAuthContext } from './AuthContextProvider';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const HistoryContext = createContext();

export const useHistoryContext = () => {
    return useContext(HistoryContext);
}

const HistoryContextProvider = ({ children }) => {
    const [history, setHistory] = useState({});

    const [loading, setLoading] = useState(true);
    const user = useAuthContext();

    const getHistoryFromRemoteDB = async (userId) => {
        try {

            let resp = await dbAPI.getData(userId);
            if (resp) {
                setHistory(resp);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error while getHistoryFromRemoteDB', error)
        }
    }

    useEffect(() => {
        if (user && user.uid && user.uid !== undefined) {
            getHistoryFromRemoteDB(user.uid);
        }
    }, [])

    return (
        <HistoryContext.Provider value={history} >
            {
                loading
                    ? <LoadingSpinner spinnerColor={'pink'} progress={75} />
                    : children
            }
        </HistoryContext.Provider>
    );
};

export default HistoryContextProvider;