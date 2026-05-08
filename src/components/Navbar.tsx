"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCompareStore } from "@/store/compareStore";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Search,
  GitCompare,
  Bookmark,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const compareList = useCompareStore((state) => state.compareList);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">
              CollegeFinder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/colleges"
              className="flex items-center space-x-1 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Colleges</span>
            </Link>

              <Link
              href="/compare"
              className="flex items-center space-x-1 text-slate-600 hover:text-blue-600 transition-colors relative"
            >
              <GitCompare className="h-4 w-4" />
              <span>Compare</span>
              {compareList.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Link>

            {session ? (
              <>
                <Link
                  href="/saved"
                  className="flex items-center space-x-1 text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <Bookmark className="h-4 w-4" />
                  <span>Saved</span>
                </Link>

                <div className="flex items-center space-x-3 pl-4 border-l">
                  <span className="text-sm text-slate-600">
                    {session.user?.name || session.user?.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 pl-4 border-l">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                href="/colleges"
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="h-4 w-4" />
                <span>Colleges</span>
              </Link>

              <Link
                href="/compare"
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <GitCompare className="h-4 w-4" />
                <span>Compare</span>
                {compareList.length > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {compareList.length}
                  </span>
                )}
              </Link>

              {session ? (
                <>
                  <Link
                    href="/saved"
                    className="flex items-center space-x-2 text-slate-600 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>Saved</span>
                  </Link>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-slate-600 mb-2">
                      {session.user?.name || session.user?.email}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t flex flex-col space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full"
                  >
                    <Button size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}