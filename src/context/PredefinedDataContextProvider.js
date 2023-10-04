import { useEffect, useContext, createContext, useState } from 'react';

import { dbAPI } from '../lib/dbAPI';

const PredefinedDataContext = createContext();

export const usePredefinedDataContext = () => {
    return useContext(PredefinedDataContext);
}

const PredefinedDataContextProvider = ({ children }) => {

    const [predefinedDatadata, setPredefinedData] = useState(null);

    useEffect(() => {
        const getPredefinedData = async (documentName) => {
            let res = await dbAPI.getPredefinedData(documentName)
            if (res) {
                setPredefinedData({
                    ...predefinedDatadata,
                    prompts: res
                })
            }
        }

        getPredefinedData('prompts')
    }, []);

    return <PredefinedDataContext.Provider value={predefinedDatadata}>
        {children}
    </PredefinedDataContext.Provider>
}


export default PredefinedDataContextProvider;