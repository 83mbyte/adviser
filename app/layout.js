
import './globals.css';

export const metadata = {
  title: 'Helpi - Your AI Assistant | Streamline Tasks',
  description: 'Helpi is an AI-powered assistant that streamlines your tasks effortlessly. Customize your chat experience.',
  manifest: './icons/site.webmanifest',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
