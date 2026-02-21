import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shelf Shuffler | Premium Board Game Catalogs",
  description: "Transform your BoardGameGeek library into a high-art tactile catalog deck.",
};

import { I18nProvider } from "@/lib/i18n";
import { ToastProvider } from "@/lib/contexts/toast-context";
import { LibraryProvider } from "@/lib/contexts/library-context";
import { PrintProvider } from "@/lib/contexts/print-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          <ToastProvider>
            <LibraryProvider>
              <PrintProvider>
                {children}
              </PrintProvider>
            </LibraryProvider>
          </ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
