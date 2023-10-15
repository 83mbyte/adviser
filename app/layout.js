
import './globals.css';

export const metadata = {
  title: 'Helpi',
  description: 'Helpi - Your personal AI-based assistant.',
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
