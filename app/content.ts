import {
  BarChart2,
  Binary,
  Code,
  Cpu,
  DiffIcon,
  FileCode,
  Fingerprint,
  FlaskConical,
  Globe,
  Hash,
  KeyRound,
  Lock,
  RefreshCw,
  Regex,
  Scan,
  Wrench,
  LucideIcon,
} from "lucide-react";

export interface Tool {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export interface ToolCategory {
  name: string;
  description: string;
  icon: LucideIcon;
  tools: {
    title: string;
    href: string;
    description: string;
  }[];
}

export interface CTFChallenge {
  title: string;
  description: string;
  icon: LucideIcon;
  tools: string[];
}

// --- tools array ---
export const tools: Tool[] = [
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
    description: "Generate MD5, SHA1, SHA256 and other hashes from text input.",
    icon: Hash,
    href: "/tools/hash",
  },
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
];

// --- toolCategories array ---
export const toolCategories: ToolCategory[] = [
  {
    name: "Crypto & Encoding",
    description: "Encrypt, decrypt, and encode data with various algorithms",
    icon: Fingerprint,
    tools: [
      {
        title: "Base64 Encoder/Decoder",
        href: "/tools/base64",
        description: "Convert text to and from Base64 encoding.",
      },
      {
        title: "ROT13/Caesar Cipher",
        href: "/tools/rot13",
        description:
          "Encrypt and decrypt using the Caesar cipher with custom rotation.",
      },
      {
        title: "XOR Encoder/Decoder",
        href: "/tools/xor",
        description:
          "Apply XOR operations with custom keys to encrypt and decrypt data.",
      },
      {
        title: "Hash Generator",
        href: "/tools/hash",
        description:
          "Generate MD5, SHA1, SHA256 and other hashes from text input.",
      },
    ],
  },
  {
    name: "Text Manipulation",
    description: "Analyze and manipulate text for cryptanalysis",
    icon: FlaskConical,
    tools: [
      {
        title: "Reverse String",
        href: "/tools/reverse",
        description:
          "Reverse text, words, or lines with additional transformations.",
      },
      {
        title: "Regex Tester",
        href: "/tools/regex",
        description:
          "Test regular expressions with live highlighting and matching.",
      },
      {
        title: "Frequency Analysis",
        href: "/tools/frequency",
        description:
          "Analyze character and word frequency in text for cryptanalysis.",
      },
      {
        title: "Text Diff Viewer",
        href: "/tools/diff",
        description:
          "Compare two texts and highlight the differences between them.",
      },
    ],
  },
  {
    name: "Misc Utilities",
    description: "Additional utilities for various CTF tasks",
    icon: Wrench,
    tools: [
      {
        title: "URL Encode/Decode",
        href: "/tools/url",
        description: "Encode and decode URL components with proper escaping.",
      },
      {
        title: "HTML Encode/Decode",
        href: "/tools/html",
        description: "Convert special characters to HTML entities and back.",
      },
      {
        title: "ASCII/Hex/Binary Converter",
        href: "/tools/converter",
        description:
          "Convert between ASCII, hexadecimal, binary and Unicode formats.",
      },
      {
        title: "QR Code Generator",
        href: "/tools/qrcode",
        description: "Generate QR codes from text, URLs, or custom data.",
      },
    ],
  },
];

// --- ctfChallenges array ---
export const ctfChallenges: CTFChallenge[] = [
  {
    title: "Web Exploitation",
    description:
      "Explore vulnerabilities in web applications like SQL injection, XSS, CSRF attacks",
    icon: Globe,
    tools: ["URL Encoder", "HTML Encoder", "Hash Generator"],
  },
  {
    title: "Cryptography",
    description: "Decode encrypted messages, break ciphers, analyze patterns",
    icon: Lock,
    tools: ["ROT13/Caesar", "Base64", "XOR", "Frequency Analysis"],
  },
  {
    title: "Forensics",
    description:
      "Examine files, network captures, memory dumps to find hidden data",
    icon: Scan,
    tools: ["Hex/Binary Converter", "Hash Generator"],
  },
  {
    title: "Reverse Engineering",
    description: "Analyze compiled binaries to understand their functionality",
    icon: Cpu,
    tools: ["Hex/Binary Converter", "Text Diff Viewer"],
  },
];

