"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCompareStore } from "@/store/compareStore";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import {
  Bookmark,
  GitCompare,
  GraduationCap,
  LogOut,
  Menu,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/colleges", label: "Colleges", icon: Search },
  { href: "/compare", label: "Compare", icon: GitCompare },
];

export default function Navbar() {
  const { data: session } = useSession();
  const compareList = useCompareStore((state) => state.compareList);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/75 shadow-sm shadow-indigo-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/75">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-400 text-white shadow-lg shadow-indigo-500/25">
              <GraduationCap className="h-7 w-7" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xl font-black tracking-tight text-slate-950 dark:text-white">
                CollegeFinder
              </span>
              <span className="hidden text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-cyan-300 sm:block">
                by Hritik Singh
              </span>
            </span>
          </Link>

          <div className="hidden max-w-sm flex-1 lg:block">
            <Link
              href="/colleges"
              className="flex h-12 items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 text-sm font-semibold text-slate-500 shadow-sm shadow-indigo-950/5 transition hover:-translate-y-0.5 hover:text-indigo-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-300"
            >
              <Search className="h-4 w-4 text-indigo-500" />
              Search colleges, rankings, placements...
            </Link>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-indigo-700 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.href === "/compare" && compareList.length > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-pink-500 text-xs text-white">
                    {compareList.length}
                  </span>
                )}
              </Link>
            ))}

            {session && (
              <Link
                href="/saved"
                className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-indigo-700 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <Bookmark className="h-4 w-4" />
                Saved
              </Link>
            )}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            {session ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="max-w-44 gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="truncate">{session.user?.name || "Sign out"}</span>
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className="grid h-11 w-11 place-items-center rounded-2xl border border-white/70 bg-white/75 text-slate-800 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-5 md:hidden"
          >
            <div className="grid gap-2 rounded-2xl border border-white/70 bg-white/85 p-3 shadow-xl shadow-indigo-950/10 dark:border-white/10 dark:bg-slate-900/90">
              <Link
                href="/colleges"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 font-bold text-slate-700 hover:bg-indigo-50 dark:text-slate-100 dark:hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="h-4 w-4 text-indigo-500" />
                Search Colleges
              </Link>
              {[...navLinks, ...(session ? [{ href: "/saved", label: "Saved", icon: Bookmark }] : [])].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl px-4 py-3 font-bold text-slate-700 hover:bg-indigo-50 dark:text-slate-100 dark:hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {item.href === "/compare" && compareList.length > 0 && (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-pink-500 text-xs text-white">
                      {compareList.length}
                    </span>
                  )}
                </Link>
              ))}
              <div className="grid gap-2 border-t border-slate-200 pt-3 dark:border-white/10">
                {session ? (
                  <Button variant="outline" onClick={() => signOut()} className="w-full gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
