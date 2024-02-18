import AuthContextProvider from '@/src/context/AuthContextProvider';
import { NecessaryProviders } from '@/src/context/providers';


export const metadata = {
    title: `${process.env.NEXT_PUBLIC_APP_NAME} - Workspace Area`,
    description: `${process.env.NEXT_PUBLIC_APP_NAME} - Your personal AI-based assistant. Workspace area.`,
    manifest: './icons/site.webmanifest',
}

export default function WorkspaceLayout({ children }) {
    return (
        <NecessaryProviders>
            <AuthContextProvider>

                {children}

            </AuthContextProvider>
        </NecessaryProviders>
    )
}