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
  title: {
    default: "CareerOs",
    template: "%s | CareerOs",
  },
  description:
    "Career tracking system to manage jobs, companies, and interviews efficiently",
  keywords: ["career", "jobs", "interview", "tracker", "recruitment"],
  authors: [{ name: "CareerOs Team" }],
  metadataBase: new URL("https://career-os.app"),
  openGraph: {
    title: "CareerOs",
    description: "Track jobs and interviews efficiently",
    type: "website",
    url: "https://career-os.app",
  },
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
        <RootProvider>
          <main>{children}</main>
        </RootProvider>
      </body>
    </html>
  );
}
