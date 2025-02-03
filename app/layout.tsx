
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Modals } from "@/components/modals";
import { DialogProvider } from "./contexts/DialogContext";
import HeaderWrapper from "@/components/HeaderWrapper";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "./contexts/UserContext";
import { SocketProvider } from "./contexts/SocketContext";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "IT Job",
  description: "Find your dream job",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100`}
      > <UserProvider>
        <SocketProvider>
          <DialogProvider>
            <HeaderWrapper />
            <Modals />
            <Toaster />
            {children}
          </DialogProvider>
        </SocketProvider>
      </UserProvider>
      </body>
    </html>
  );
}
