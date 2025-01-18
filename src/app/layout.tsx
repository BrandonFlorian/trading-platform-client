// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "@/components/navbar/Navbar";  // Updated import path
import Footer from "@/components/footer/Footer";  // Updated import path

// Font configuration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for the application
export const metadata: Metadata = {
  title: "Trading Platform",
  description: "A comprehensive trading platform",
};

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;  // Simplified type definition
}) {
  return (
    <html lang="en" className="relative">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {/* Navigation bar */}
        <NavBar />

        {/* Main content area with padding for fixed header and footer */}
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow mt-16 mb-16 px-4">
            {children}
          </main>
        </div>

        {/* Footer */}
        <Footer />

        {/* Toast notifications */}
        <Toaster />
      </body>
    </html>
  );
}