import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CollegeFinder - Discover Your Perfect College",
  description: "Find and compare the best engineering colleges in India. Make informed decisions about your education with detailed college information, reviews, and placement statistics.",
  keywords: ["college", "engineering", "India", "IIT", "NIT", "IIIT", "admission", "comparison"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <footer className="bg-slate-900 text-white py-8 mt-16">
            <div className="container mx-auto px-4 text-center">
              <p className="text-slate-400">
                © 2024 CollegeFinder. Built for students, by students.
              </p>
            </div>
          </footer>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}