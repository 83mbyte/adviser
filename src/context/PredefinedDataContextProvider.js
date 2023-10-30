import { useEffect, useContext, createContext, useState } from 'react';

import { dbAPI } from '../lib/dbAPI';

const PredefinedDataContext = createContext();

export const usePredefinedDataContext = () => {
    return useContext(PredefinedDataContext);
}

const PredefinedDataContextProvider = ({ children }) => {
    const [predefinedData, setPredefinedData] = useState(null);

    useEffect(() => {
        const getPredefinedData = async (documentName) => {
            let res = await dbAPI.getPredefinedData(documentName);
            if (res) {
                setPredefinedData({
                    prompts: res
                })
            }
        }

        getPredefinedData('prompts')
    }, []);

    return <PredefinedDataContext.Provider value={predefinedData}>
        {children}
    </PredefinedDataContext.Provider>
}


export default PredefinedDataContextProvider;