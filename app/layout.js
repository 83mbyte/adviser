
import './globals.css';
export const metadata = {
  title: 'Adviser AI App',
  description: 'Your personal AI-based consultant.',
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
