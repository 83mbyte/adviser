import LoadingSpinner from "@/src/components/LoadingSpinner/LoadingSpinner";
import { createContext, useContext, useMemo } from "react"


const PredefinedDataContext = createContext();

export const usePredefinedDataContext = () => {
    return useContext(PredefinedDataContext);
}


const initialPredefinedData = {
    textchat: {},
    createImage: {}
}
const PredefinedDataContextProvider = ({ data, children }) => {


    let predefinedDataMemo = useMemo(() => {
        if (data && Object.keys(data).length > 0) {
            let updatedPredefinedData = { ...initialPredefinedData };
            Object.keys(data).forEach((item) => {
                updatedPredefinedData = {
                    ...updatedPredefinedData,
                    [item]: { ...updatedPredefinedData[item], ...data[item] }
                }
            })

            return updatedPredefinedData;
        }

        else {
            return initialPredefinedData;
        }
    }, [data]);

    const context = createPredefinedDataContext(predefinedDataMemo);

    return (
        <PredefinedDataContext.Provider value={context}>
            {
                !predefinedDataMemo
                    ? <LoadingSpinner spinnerColor={'orange'} progress={49} />
                    : children
            }
        </PredefinedDataContext.Provider>
    )
}
export default PredefinedDataContextProvider;

const createPredefinedDataContext = (predefinedData) => {

    return ({
        predefinedData
    })
}