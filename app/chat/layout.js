import { NecessaryProviders } from "@/src/context/providers";

export default function ChatLayout({ children }) {
    return (
        <NecessaryProviders>
            {children}
        </NecessaryProviders>

    )
}