'use client'
import AppClient from "@/src/components/AppClient";
import styles from "@/app/page.module.css";
import React from "react";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/src/context/AuthContextProvider";
import HistoryContextProvider from "@/src/context/HistoryContextProvider";
import SettingsContextProvider from "@/src/context/SettingsContextProvider";

export default function Home() {

    const router = useRouter();
    const user = useAuthContext();

    React.useEffect(() => {
        if (user === null || user === undefined) {
            router.push('/')
        }

    }, [user])

    return (
        // protected page based on user 
        <div className={styles.mainOuterContainer}>
            {
                user
                    ? <HistoryContextProvider userId={user.uid}>
                        <SettingsContextProvider>
                            <AppClient />
                        </SettingsContextProvider>
                    </HistoryContextProvider>
                    : 'not logged'
            }
        </div>

    )
}