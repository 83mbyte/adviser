'use client'

import { useAuthContext } from "@/src/context/AuthContextProvider";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { dbAPI } from "@/src/lib/dbAPI";

import HistoryContextProvider from "@/src/context/HistoryContext/HistoryContextProvider";
import PredefinedDataContextProvider from "@/src/context/PredefinedDataContext/PredefinedDataContextProvider";
import SettingsContextProvider from "@/src/context/SettingsContext/SettingsContextProvider";

import Workspace from "@/src/site_pages/WorkspacePage/Workspace";

export default function WorkspacePage() {
    const user = useAuthContext();
    const router = useRouter();

    const [historyFromDB, setHistoryFromDB] = useState(null);
    const [predefinedDataFromDB, setPredefinedDataFromDB] = useState(null);
    const [settingsFromDB, setSettingsFromDB] = useState(null);

    useEffect(() => {
        const getUserData = async (userId) => {
            let resp = await dbAPI.getUserFullData(userId);

            if (resp.status == 'Success') {
                setHistoryFromDB({ historyChats: resp.payload.chats, historySummarizeYT: resp.payload.summarizeYT });
                setSettingsFromDB(resp.payload.settings);
            }
        }

        const getPredefinedData = async () => {
            let resp = await dbAPI.getPredefinedData_new('prompts');

            if (resp.status == 'Success') {
                setPredefinedDataFromDB(resp.payload);
            }
        }

        if (user === null || user === undefined) {
            router.push('/')
        } {
            getPredefinedData();
            getUserData(user.uid);
        }
    }, [user]);

    return (
        <>

            {
                !user
                    ? <WarningMessage message={'Access denied!'} />
                    : <>
                        <PredefinedDataContextProvider data={predefinedDataFromDB}>
                            <HistoryContextProvider data={historyFromDB}>

                                <SettingsContextProvider data={settingsFromDB}>
                                    <Workspace />
                                </SettingsContextProvider>

                            </HistoryContextProvider>
                        </PredefinedDataContextProvider>
                    </>
            }
        </>

    )


}


const WarningMessage = ({ message }) => {
    return (
        <div style={
            {
                backgroundColor: '',
                height: '100vh',
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }
        }
        >
            <div style={{ border: '1px solid rgb(225,180,180)', fontSize: '26px', padding: '20px', }}>{message}</div>
        </div>
    )
}


