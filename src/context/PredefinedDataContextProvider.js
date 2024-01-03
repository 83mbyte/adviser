'use client'
import { useEffect, useContext, createContext, useState } from 'react';
import { dbAPI } from '../lib/dbAPI';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const PredefinedDataContext = createContext();

export const usePredefinedDataContext = () => {
    return useContext(PredefinedDataContext);
}

const PredefinedDataContextProvider = ({ children }) => {
    const [predefinedData, setPredefinedData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getPredefinedData = async (documentName) => {
        try {

            let res = await dbAPI.getPredefinedData(documentName);
            if (res) {
                setPredefinedData({
                    prompts: res
                })
                setLoading(false);
            }

        } catch (error) {
            console.error('Error while getPredefinedData', error)
        }
    }

    useEffect(() => {
        getPredefinedData('prompts');
    }, [])


    return <PredefinedDataContext.Provider value={predefinedData}>
        {
            loading
                ? <LoadingSpinner spinnerColor={'orange'} progress={49} />
                : children
        }
    </PredefinedDataContext.Provider>
}


export default PredefinedDataContextProvider;