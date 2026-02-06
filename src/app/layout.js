import "./globals.css";
import Script from "next/script";
import {
  Geist,
  Geist_Mono,
  Patrick_Hand,
  Comic_Neue,
  Roboto,
  Inter,
} from "next/font/google";
import { ReduxProvider } from "../redux/provider";
import AppInitializer from "./AppInitializer";
import ToastContainer from "@/components/Toast/Toast";
import ProtectedRoute from "@/components/protectedroutes/ProtectedRouteB2C";

const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const comicNeue = Comic_Neue({
  variable: "--font-comic-neue",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Dilbahar's",
  description: "Dilbahar's",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MLBFWNF');
          `}
        </Script>
        {/* End Google Tag Manager */}
      </head>

      <body className={`${comicNeue.variable} ${inter.variable} antialiased`}>
      <script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
      <df-messenger
          intent="WELCOME"
          chat-title="Dilbahar&#x27;s"
          agent-id="8c28cdbc-5a02-49e4-94aa-7c3fa18235b0"
          language-code="en"
      ></df-messenger>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MLBFWNF"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <ReduxProvider>
          <AppInitializer>
            <ProtectedRoute>{children}</ProtectedRoute>
          </AppInitializer>
        </ReduxProvider>

        <ToastContainer />
      </body>
    </html>
  );
}
