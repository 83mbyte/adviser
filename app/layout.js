
import './globals.css';
import { GoogleTagManager } from '@next/third-parties/google';

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} - Your AI Assistant | Streamline Tasks`,
  description: `${process.env.NEXT_PUBLIC_APP_NAME} is an AI-powered assistant that streamlines your tasks effortlessly. Customize your chat experience.`,
  manifest: './icons/site.webmanifest',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_ADS} />
      <body>
        {children}
      </body>

    </html>
  )
}
