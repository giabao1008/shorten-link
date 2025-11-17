import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://makeshorten.online";
const BRAND = "MakeShorten";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "MakeShorten | Rút gọn link chuyên nghiệp",
    template: "%s | MakeShorten",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  description:
    "MakeShorten giúp bạn rút gọn URL, theo dõi analytics, tạo QR code và quản lý chiến dịch trong một dashboard hiện đại.",
  keywords: [
    "rút gọn link",
    "url shortener",
    "analytics",
    "qr code",
    "makeshorten",
  ],
  authors: [{ name: BRAND }],
  creator: BRAND,
  publisher: BRAND,
  openGraph: {
    title: "MakeShorten | Rút gọn link chuyên nghiệp",
    description:
      "Tạo link ngắn, theo dõi thời gian thực, QR code và dashboard quản trị trong một nền tảng.",
    url: APP_URL,
    siteName: BRAND,
    images: [
      {
        url: `${APP_URL}/og-preview.png`,
        width: 1200,
        height: 630,
        alt: "NovaLink preview",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MakeShorten | Rút gọn link chuyên nghiệp",
    description:
      "Trang rút gọn link với analytics, QR code và dashboard quản trị trực quan.",
    images: [`${APP_URL}/og-preview.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("min-h-screen bg-background antialiased", inter.variable)}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <div className="relative flex min-h-screen flex-col">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-grid opacity-40" />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
