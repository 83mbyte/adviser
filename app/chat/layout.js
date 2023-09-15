import AuthContextProvider from "@/src/context/AuthContextProvider";
import { NecessaryProviders } from "@/src/context/providers";

export default function ChatLayout({ children }) {
    return (
        <NecessaryProviders>
            <AuthContextProvider>
                {children}
            </AuthContextProvider>
        </NecessaryProviders>


    )
}