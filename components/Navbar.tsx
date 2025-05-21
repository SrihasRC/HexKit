"use client";

import Link from "next/link";
import { Code2, Menu, X, PanelLeft, ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "./sidebar-provider";
import { usePathname } from "next/navigation";

// Tool categories for mobile view
const toolCategories = [
  {
    name: "Crypto & Encoding",
    items: [
      { name: "Base64", href: "/tools/base64" },
      { name: "ROT13/Caesar", href: "/tools/rot13" },
      { name: "XOR Encoder", href: "/tools/xor" },
      { name: "Hash Generator", href: "/tools/hash" },
    ],
  },
  {
    name: "Text Manipulation",
    items: [
      { name: "Reverse String", href: "/tools/reverse" },
      { name: "Regex Tester", href: "/tools/regex" },
      { name: "Frequency Analysis", href: "/tools/frequency" },
      { name: "Text Diff Viewer", href: "/tools/diff" },
    ],
  },
  {
    name: "Misc Utilities",
    items: [
      { name: "URL Encode/Decode", href: "/tools/url" },
      { name: "HTML Encode/Decode", href: "/tools/html" },
      { name: "ASCII/Hex/Binary", href: "/tools/converter" },
      { name: "QR Code Generator", href: "/tools/qrcode" },
    ],
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2a2c37] bg-[#0F1117]/90 backdrop-blur supports-[backdrop-filter]:bg-[#0F1117]/80">
      <div className="flex h-16 items-center justify-between px-6 md:px-4">
        <div className="flex items-center gap-4">
          {!isHomePage && (
            <Button
              id="sidebar-toggle"
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="mr-1 text-white/90 hover:text-white"
              aria-label="Toggle sidebar"
            >
              <PanelLeft
                className="h-5 w-5 transition-transform"
                style={{
                  transform: isSidebarOpen ? "rotate(180deg)" : "none",
                }}
              />
            </Button>
          )}
          <Link href="/" className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="font-mono text-lg font-bold">CTF Toolkit</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors px-3 py-2 rounded-md",
              pathname === "/"
                ? "bg-primary/10 text-primary"
                : "text-white/90 hover:text-white hover:bg-[#1a1c25]"
            )}
          >
            Home
          </Link>

          {/* Single Tools Link (replacing horizontal scroll) */}
          <Link
            href="/tools"
            className={cn(
              "text-sm font-medium transition-colors px-3 py-2 rounded-md",
              pathname === "/tools" || pathname.startsWith("/tools/")
                ? "bg-primary/10 text-primary"
                : "text-white/90 hover:text-white hover:bg-[#1a1c25]"
            )}
          >
            Tools
          </Link>

          <Link
            href="https://github.com/SrihasRC/HexKit"
            target="_blank"
            className="text-sm font-medium text-white/90 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-[#1a1c25]"
          >
            GitHub
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-primary" />
            ) : (
              <Menu className="h-5 w-5 text-primary" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#2a2c37]"
          >
            <div className="py-4 flex flex-col gap-4 px-6">
              <Link
                href="/"
                className={cn(
                  "text-sm font-medium px-3 py-2 rounded-md",
                  pathname === "/"
                    ? "bg-primary/10 text-primary"
                    : "text-white/90 hover:text-white"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {/* Link to All Tools page */}
              <Link
                href="/tools"
                className={cn(
                  "text-sm font-medium px-3 py-2 rounded-md",
                  pathname === "/tools"
                    ? "bg-primary/10 text-primary"
                    : "text-white/90 hover:text-white"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                All Tools
              </Link>

              {/* Mobile Tools List */}
              <div className="space-y-3">
                <div className="flex items-center px-3">
                  <span className="text-sm font-semibold text-primary">
                    Tool Categories
                  </span>
                </div>

                <div className="space-y-4">
                  {toolCategories.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <h4 className="text-xs font-semibold text-primary/90 tracking-wider uppercase px-3">
                        {category.name}
                      </h4>
                      <div className="space-y-1">
                        {category.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "block text-sm px-3 py-2 rounded-md",
                              pathname === item.href
                                ? "bg-primary text-[#0F1117]"
                                : "text-white/90 hover:text-white hover:bg-[#1a1c25]"
                            )}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="https://github.com/SrihasRC/HexKit"
                target="_blank"
                className="text-sm font-medium text-white/90 hover:text-white px-3 py-2 rounded-md hover:bg-[#1a1c25]"
                onClick={() => setIsMenuOpen(false)}
              >
                GitHub
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
