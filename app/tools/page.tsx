"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/sidebar-provider";
import {
  Code,
  Hash,
  Binary,
  RefreshCw,
  Regex,
  BarChart2,
  DiffIcon,
  Globe,
  FileCode,
  Scan,
  Lock,
  KeyRound,
  Search,
} from "lucide-react";

const toolCategories = [
  {
    name: "Crypto & Encoding",
    tools: [
      {
        title: "Base64 Encoder/Decoder",
        description: "Convert text to and from Base64 encoding.",
        icon: Code,
        href: "/tools/base64",
      },
      {
        title: "ROT13/Caesar Cipher",
        description:
          "Encrypt and decrypt using the Caesar cipher with custom rotation.",
        icon: KeyRound,
        href: "/tools/rot13",
      },
      {
        title: "XOR Encoder/Decoder",
        description:
          "Apply XOR operations with custom keys to encrypt and decrypt data.",
        icon: Lock,
        href: "/tools/xor",
      },
      {
        title: "Hash Generator",
        description:
          "Generate MD5, SHA1, SHA256 and other hashes from text input.",
        icon: Hash,
        href: "/tools/hash",
      },
    ],
  },
  {
    name: "Text Manipulation",
    tools: [
      {
        title: "Reverse String",
        description:
          "Reverse text, words, or lines with additional transformations.",
        icon: RefreshCw,
        href: "/tools/reverse",
      },
      {
        title: "Regex Tester",
        description:
          "Test regular expressions with live highlighting and matching.",
        icon: Regex,
        href: "/tools/regex",
      },
      {
        title: "Frequency Analysis",
        description:
          "Analyze character and word frequency in text for cryptanalysis.",
        icon: BarChart2,
        href: "/tools/frequency",
      },
      {
        title: "Text Diff Viewer",
        description:
          "Compare two texts and highlight the differences between them.",
        icon: DiffIcon,
        href: "/tools/diff",
      },
    ],
  },
  {
    name: "Misc Utilities",
    tools: [
      {
        title: "URL Encode/Decode",
        description: "Encode and decode URL components with proper escaping.",
        icon: Globe,
        href: "/tools/url",
      },
      {
        title: "HTML Encode/Decode",
        description: "Convert special characters to HTML entities and back.",
        icon: FileCode,
        href: "/tools/html",
      },
      {
        title: "ASCII/Hex/Binary Converter",
        description:
          "Convert between ASCII, hexadecimal, binary and Unicode formats.",
        icon: Binary,
        href: "/tools/converter",
      },
      {
        title: "QR Code Generator",
        description: "Generate QR codes from text, URLs, or custom data.",
        icon: Scan,
        href: "/tools/qrcode",
      },
    ],
  },
];

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { closeSidebar } = useSidebar();

  // Hide sidebar on main tools page
  useEffect(() => {
    closeSidebar();
  }, [closeSidebar]);

  // Filter tools based on search query
  const filteredCategories = toolCategories
    .map((category) => ({
      ...category,
      tools: category.tools.filter(
        (tool) =>
          tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.tools.length > 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4 text-white">All Tools</h1>
        <p className="text-white/70 max-w-2xl mb-6">
          A comprehensive collection of tools to help you conquer any Capture
          The Flag challenge with ease and precision.
        </p>

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            type="text"
            placeholder="Search tools..."
            className="pl-10 bg-[#1a1c25] border-[#2a2c37] text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-10">
        {filteredCategories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-primary border-b border-[#2a2c37] pb-2">
              {category.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex items-center space-x-3 p-3 rounded-md bg-[#1a1c25] hover:bg-[#2a2c37] transition-colors"
                  >
                    <div className="flex-shrink-0 p-2 rounded-md bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{tool.title}</h3>
                      <p className="text-sm text-white/60 line-clamp-1">
                        {tool.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-10">
            <p className="text-white/70">
              No tools match your search. Try a different query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
