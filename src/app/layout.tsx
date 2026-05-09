import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "CollegeFinder - Discover Your Perfect College",
  description:
    "Find and compare the best engineering colleges in India. Make informed decisions about your education with detailed college information, reviews, and placement statistics.",
  authors: [{ name: "Hritik Singh" }],
  keywords: [
    "college",
    "engineering",
    "India",
    "IIT",
    "NIT",
    "IIIT",
    "admission",
    "comparison",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="mt-10 border-t border-white/10 bg-slate-950 py-10 text-white">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:text-left">
              <div>
                <p className="text-xl font-black text-white">CollegeFinder</p>
                <p className="text-sm text-slate-400">
                  Built in 2026 by Hritik Singh.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                © 2026 CollegeFinder. Built for students, by students.
              </div>
            </div>
          </footer>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
