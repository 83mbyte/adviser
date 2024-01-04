import { NecessaryProviders } from "@/src/context/providers"

export const metadata = {
    title: 'Helpi - Contact Us',
    description: 'Helpi - Your personal AI-based assistant. Use our contact form in order to get in touch with our staff.',
    manifest: './icons/site.webmanifest',
}

export default function ContactLayout({ children }) {
    return (
        <>
            <NecessaryProviders>
                {children}
            </NecessaryProviders>

        </>
    )
}
