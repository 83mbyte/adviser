'use client'

import { useAuthContext } from "@/src/context/AuthContextProvider";
import UISettingsContextProvider from "@/src/context/UISettingsContext";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PredefinedDataContextProvider from "@/src/context/PredefinedDataContextProvider";
import Workspace from "@/src/site_pages/WorkspacePage/Workspace";
import HistoryContextProvider from "@/src/context/HistoryContextProvider";
import SettingsChatContextProvider from "@/src/context/ChatSettingsContext";

export default function WorkspacePage() {
    const user = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (user === null || user === undefined) {
            router.push('/')
        }
    }, [user]);

    return (
        <>
            {
                !user
                    ? <div style={
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
                        <div style={{ border: '1px solid rgb(225,180,180)', fontSize: '26px', padding: '20px', }}>Access denied!</div>
                    </div>
                    :
                    <PredefinedDataContextProvider>
                        <SettingsChatContextProvider>
                            <HistoryContextProvider>
                                <UISettingsContextProvider>

                                    <Workspace />

                                </UISettingsContextProvider>
                            </HistoryContextProvider>
                        </SettingsChatContextProvider>
                    </PredefinedDataContextProvider>
            }
        </>
    )


}

