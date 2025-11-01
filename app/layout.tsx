import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { createClient } from '@/lib/supabase/server';
import "./globals.css";
import { redirect } from "next/navigation";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Interduo",
  description: "Simulador de entrevistas laborales",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased bg-gradient-to-br from-[#E9F1FA] to-[#FFFFFF] text-[#242E42]`}>
          {children}
      </body>
    </html>
  );
}
