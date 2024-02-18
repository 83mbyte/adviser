import { NecessaryProviders } from "@/src/context/providers"

export const metadata = {
    title: `${process.env.NEXT_PUBLIC_APP_NAME} - Contact Us`,
    description: `${process.env.NEXT_PUBLIC_APP_NAME} - Your personal AI-based assistant. Use our contact form in order to get in touch with our staff. Contact us for any inquiries or assistance you may need while your work with our Helpi AI bot. Our dedicated customer support team is ready to provide prompt and reliable solutions to your questions.`,
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
