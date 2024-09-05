
import './globals.css';
import { GoogleTagManager } from '@next/third-parties/google';


const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
const APP_DEFAULT_TITLE = `${process.env.NEXT_PUBLIC_APP_NAME} - Your AI Assistant | Streamline Tasks`;
const APP_TITLE_TEMPLATE = `%s - ${process.env.NEXT_PUBLIC_APP_NAME} AI`;
const APP_DESCRIPTION = "Best AI-powered assistant that streamlines your tasks effortlessly.";

// export const metadata = {
//   title: `${process.env.NEXT_PUBLIC_APP_NAME} - Your AI Assistant | Streamline Tasks`,
//   description: `${process.env.NEXT_PUBLIC_APP_NAME} is an AI-powered assistant that streamlines your tasks effortlessly. Customize your chat experience. Image generator. Summarize video.`,
//   manifest: './icons/site.webmanifest',
// }


export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

// export const viewport = {
//   themeColor: "#FFFFFF",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_GTM} />
      <body>
        {children}
      </body>

    </html>
  )
}
