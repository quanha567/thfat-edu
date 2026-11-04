import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";
import "katex/dist/katex.min.css";
import "katex/contrib/mhchem";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TH FAT EDU - Nền Tảng Học Hóa Học Trực Tuyến",
  description: "Hệ thống học tập, luyện thi trắc nghiệm và tra cứu công thức hóa học hiện đại.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png" }],
  },
};

type TRootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: TRootLayoutProps) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
