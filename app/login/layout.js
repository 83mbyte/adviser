import { NecessaryProviders } from "@/src/context/providers"

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} - SignIn page`,
  description: `${process.env.NEXT_PUBLIC_APP_NAME} - Your personal AI-based assistant.`,
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
