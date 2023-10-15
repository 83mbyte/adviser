import { NecessaryProviders } from "@/src/context/providers"

export const metadata = {
  title: 'Helpi - SignIn page',
  description: 'Helpi - Your personal AI-based assistant.',
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
