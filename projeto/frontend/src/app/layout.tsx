import type { Metadata } from "next";
import type { Viewport } from "next";
import { DM_Sans, Sora } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kwak Finance",
  description: "Gestao financeira integrada para PF, PJ e investimentos.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster position="bottom-right" richColors theme="dark" />
      </body>
    </html>
  );
}
