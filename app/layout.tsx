import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PetCalendar.ai — AI-Powered Pet Photo Calendars",
  description:
    "Turn your pet into a work of art. Upload photos, choose a style, and get a stunning personalized calendar delivered to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quicksand.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--alabaster)]" style={{ fontFamily: 'var(--font-quicksand), Quicksand, sans-serif' }}>
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
