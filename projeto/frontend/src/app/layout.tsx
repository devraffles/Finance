import type { Metadata } from "next";
import type { Viewport } from "next";
import { Toaster } from "sonner";

import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource-variable/sora/wght.css";
import "./globals.css";

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
    <html className="h-full antialiased" lang="pt-BR">
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster position="bottom-right" richColors theme="dark" />
      </body>
    </html>
  );
}
