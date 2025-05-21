import { Code } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-[#2a2c37] py-6 bg-[#0F1117]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Code className="h-5 w-5 text-primary" />
            <span className="font-mono text-base font-bold text-white">
              CTF Toolkit
            </span>
          </div>
          <div className="text-sm text-white/50">
            © {new Date().getFullYear()} CTF Toolkit. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
