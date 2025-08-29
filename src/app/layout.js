import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Toast from "@/components/admin/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "IC WET-WAR 2025",
  description: "Conference Meeting",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="google-site-verification" content="jEIUGXXdXQGNyUb-HqOMz2Ndd_l4ucj7IxcSTDtRM2E" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toast />
        {children}
      </body>
    </html>
  );
}
