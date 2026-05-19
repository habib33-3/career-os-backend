import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { cn } from "@/lib/utils";

import RootProvider from "@/providers/root-provider";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Career Tracking Platform",
  description: "Track jobs, companies, and interviews efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", inter.variable, mono.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <RootProvider> {children}</RootProvider>
      </body>
    </html>
  );
}
