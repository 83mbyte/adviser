
import './globals.css';
export const metadata = {
  title: 'Helpi',
  description: 'Helpi AI-bot. Your personal AI-based consultant.',
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
