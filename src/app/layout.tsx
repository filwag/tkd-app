import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { PHProvider } from "./providers";
import { PostHogPageView } from "@/components/posthog-pageview";
import { SuggestFix } from "@/components/suggest-fix";
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
  title: "Taekwondo Training",
  description:
    "A free, mobile-first training companion for Taekwondo students of every belt level.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PHProvider>
          <Suspense>
            <PostHogPageView />
          </Suspense>
          {children}
          <SuggestFix />
        </PHProvider>
      </body>
    </html>
  );
}
