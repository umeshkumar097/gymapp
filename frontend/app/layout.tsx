import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ScrollAuthModal } from "@/components/ui/ScrollAuthModal";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PassFit - Premium Fitness Memberships",
  description: "Discover and book the best gym memberships and day passes near you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased selection:bg-indigo-500 selection:text-white`}>
        {children}
        <ScrollAuthModal />
      </body>
    </html>
  );
}
