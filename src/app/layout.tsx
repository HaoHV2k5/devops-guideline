import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lộ trình DevOps cho Java Backend – 12 Tuần | Miro Board",
  description:
    "Lộ trình 12 tuần học DevOps cho kỹ sư Java Backend: từ làm được sang hiểu vì sao, phương pháp cố tình làm hỏng & debug, luyện phỏng vấn và cheat sheet thực chiến.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fafbfc] text-[#1c1c1e]">
        {children}
      </body>
    </html>
  );
}
