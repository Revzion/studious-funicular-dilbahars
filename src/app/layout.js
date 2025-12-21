import "./globals.css";
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

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const comicNeue = Comic_Neue({
  variable: "--font-comic-neue",
  weight: ["400"], // You can also add "700" if needed
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // you can add more if needed
  variable: "--font-roboto",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Add weights as needed
  display: "swap",
});

export const metadata = {
  title: "Dilbahar's",
  description: "Dilbahar's",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > */}
      <body className={`${comicNeue.variable} ${inter.variable} antialiased`}>
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
