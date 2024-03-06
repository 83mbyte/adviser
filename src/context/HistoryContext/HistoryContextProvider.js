'use client'

import LoadingSpinner from '@/src/components/LoadingSpinner/LoadingSpinner';
import { useState, useContext, createContext, useCallback, useEffect } from 'react';

const HistoryContext = createContext();

const HistoryContextProvider = ({ data, children }) => {
    const [history, setHistory] = useState(null);
    const context = useCreateHistoryContext(history, setHistory);

    useEffect(() => {
        if (data) {
            setHistory(data);
        } else {
            setHistory({ chats: {}, summarizeYT: {} })
        }
    }, [data]);

    return (
        <HistoryContext.Provider value={context}>
            {
                !history
                    ? <LoadingSpinner spinnerColor={'pink'} progress={75} />
                    : children
            }
        </HistoryContext.Provider>

    )
}

export const useHistoryContext = () => {
    return useContext(HistoryContext);
}
export default HistoryContextProvider;


function useCreateHistoryContext(history, setHistory) {
    const addToHistory = useCallback((path, historyId, data) => {
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
    }, [history]);

    const deleteFromHistory = useCallback((path, historyId) => {
        const { [historyId]: removedData, ...restHistory } = history[path];
        setHistory({
            ...history,
            [path]: restHistory
        })
    }, [history]);

    return (
        {
            history,
            addToHistory,
            deleteFromHistory
        }
    )
}