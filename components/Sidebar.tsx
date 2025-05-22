"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Code, Hash, Binary, RefreshCw, Regex, BarChart2, 
  DiffIcon, Globe, FileCode, Scan, Lock, KeyRound
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "./sidebar-provider";
import { useRef } from "react";

// Tool categories and their respective tools
const toolCategories = [
  {
    name: "Crypto & Encoding",
    items: [
      { name: "Base64", href: "/tools/base64", icon: Code },
      { name: "ROT13/Caesar", href: "/tools/rot13", icon: KeyRound },
      { name: "XOR Encoder", href: "/tools/xor", icon: Lock },
      { name: "Hash Generator", href: "/tools/hash", icon: Hash },
    ],
  },
  {
    name: "Text Manipulation",
    items: [
      { name: "Reverse String", href: "/tools/reverse", icon: RefreshCw },
      { name: "Regex Tester", href: "/tools/regex", icon: Regex },
      { name: "Frequency Analysis", href: "/tools/frequency", icon: BarChart2 },
      { name: "Text Diff Viewer", href: "/tools/diff", icon: DiffIcon },
    ],
  },
  {
    name: "Misc Utilities",
    items: [
      { name: "URL Encode/Decode", href: "/tools/url", icon: Globe },
      { name: "HTML Encode/Decode", href: "/tools/html", icon: FileCode },
      { name: "ASCII/Hex/Binary", href: "/tools/converter", icon: Binary },
      { name: "QR Code Generator", href: "/tools/qrcode", icon: Scan },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen } = useSidebar();
  
  // Don't show sidebar on the home page
  if (pathname === "/") {
    return null;
  }

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          id="main-sidebar"
          initial={{ width: 0, x: -256, opacity: 0 }}
          animate={{ width: 256, x: 0, opacity: 1 }}
          exit={{ width: 0, x: -256, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 bg-[#0F1117] border-r border-[#2a2c37] overflow-hidden w-64"
        >
          <div className="h-full w-64 overflow-y-auto pb-20">
            <nav className="h-full px-3 py-4">
              <div className="space-y-6">
                {toolCategories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <h3 className="text-xs font-semibold text-primary tracking-wider uppercase">
                      {category.name}
                    </h3>
                    <div className="space-y-1">
                      {category.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors font-medium",
                            pathname === item.href
                              ? "bg-primary text-[#0F1117]"
                              : "hover:bg-[#1a1c25] text-white/90 hover:text-white"
                          )}
                        >
                          <item.icon className={cn(
                            "h-4 w-4",
                            pathname === item.href
                              ? "text-[#0F1117]"
                              : "text-primary/90"
                          )} />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}