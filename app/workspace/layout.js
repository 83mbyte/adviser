import AuthContextProvider from '@/src/context/AuthContextProvider';
import { NecessaryProviders } from '@/src/context/providers';
import React from 'react';


export const metadata = {
    title: 'Helpi - Workspace Area',
    description: 'Helpi - Your personal AI-based assistant. Workspace area.',
    manifest: './icons/site.webmanifest',
}

export default function WorkspaceLayout({ children }) {
    return (
        <NecessaryProviders>
            <AuthContextProvider>

                <>
                    {children}
                </>
            </AuthContextProvider>
        </NecessaryProviders>
    )
}