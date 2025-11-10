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
  title: "グッカン",
  description: "グッズやゲームを管理するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100`}
      >
        <header className="sticky top-0 z-30 border-b border-zinc-200/60 bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-black/50">
          <div className="mx-auto max-w-5xl px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-indigo-600 text-sm font-semibold text-white">
                グ
              </div>
              <span className="text-lg font-semibold tracking-tight">グッカン</span>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
