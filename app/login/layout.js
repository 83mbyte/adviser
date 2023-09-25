import { NecessaryProviders } from "@/src/context/providers";

export default function LoginLayout({ children }) {
    return (
        <NecessaryProviders>
            {children}
        </NecessaryProviders>
    )
}