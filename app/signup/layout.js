import { NecessaryProviders } from "@/src/context/providers"

export const metadata = {

    title: `${process.env.NEXT_PUBLIC_APP_NAME} - SignUp page`,
    description: `${process.env.NEXT_PUBLIC_APP_NAME} - Your personal AI-based assistant. Register your account.`,
    manifest: './icons/site.webmanifest',
}

export default function LoginLayout({ children }) {
    return (
        <>
            <NecessaryProviders>
                {children}
            </NecessaryProviders>
        </>
    )
}
