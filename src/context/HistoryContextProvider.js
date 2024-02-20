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

            let resp = await dbAPI.getHistoryData(userId);
            if (resp) {
                setHistory(resp);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error while getHistoryFromRemoteDB', error)
        }
    }

    const historyObj = {
        history: {
            chats: history.chats,
            summarizeYT: history.summarizeYT
        },
        addToHistory: (path, historyId, data) => {
            if (history[path][historyId]) {
                setHistory({
                    ...history,
                    [path]: {
                        ...history[path],
                        [historyId]: [
                            ...history[path][historyId],
                            data
                        ]
                    }
                })

            } else {
                setHistory({
                    ...history,
                    [path]: {
                        ...history[path],
                        [historyId]: [
                            data
                        ]
                    }
                })
            }
        },
        deleteFromHistory: (path, historyId) => {
            const { [historyId]: removedData, ...restHistory } = history[path];
            setHistory({
                ...history,
                [path]: restHistory
            })
        }
    }

    useEffect(() => {
        if (user && user.uid && user.uid !== undefined) {
            getHistoryFromRemoteDB(user.uid);
        }
    }, [])

    return (
        <HistoryContext.Provider value={historyObj} >
            {
                loading
                    ? <LoadingSpinner spinnerColor={'pink'} progress={75} />
                    : children
            }
        </HistoryContext.Provider>
    );
};

export default HistoryContextProvider;