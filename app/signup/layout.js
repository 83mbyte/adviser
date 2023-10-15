import { NecessaryProviders } from "@/src/context/providers"

export const metadata = {
    title: 'Helpi - SignUp page',
    description: 'Helpi - Your personal AI-based assistant. Register your account.',
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
