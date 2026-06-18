import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = localFont({
  src: [
    { path: "../../public/fonts/geist-regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/geist-500.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/geist-600.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/geist-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: [
    { path: "../../public/fonts/geist-mono-regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Clinical SaaS — Admin",
  description: "Admin panel for multi-tenant platform management",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
