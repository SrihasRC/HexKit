"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Hash, Copy, RefreshCw, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ToolWrapper from "@/components/ToolWrapper";

// Hash algorithms
type HashAlgorithm = "sha1" | "sha256" | "sha512";

const HashTool = () => {
  const [input, setInput] = useState("");
  const [hashResults, setHashResults] = useState<Record<HashAlgorithm, string>>(
    {
      sha1: "",
      sha256: "",
      sha512: "",
    }
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (input) {
      generateHashes();
    } else {
      clearHashResults();
    }
  }, [input]);

  const generateHashes = async () => {
    if (!input) return;
    setLoading(true);

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      const results: Record<HashAlgorithm, string> = {
        sha1: "",
        sha256: "",
        sha512: "",
      };

      // Compute SHA-1 hash
      const sha1Buffer = await crypto.subtle.digest("SHA-1", data);
      results.sha1 = bufferToHex(sha1Buffer);

      // Compute SHA-256 hash
      const sha256Buffer = await crypto.subtle.digest("SHA-256", data);
      results.sha256 = bufferToHex(sha256Buffer);

      // Compute SHA-512 hash
      const sha512Buffer = await crypto.subtle.digest("SHA-512", data);
      results.sha512 = bufferToHex(sha512Buffer);

      setHashResults(results);
    } catch (error) {
      console.error("Error generating hashes:", error);
      toast.error("Failed to generate some hashes");
    } finally {
      setLoading(false);
    }
  };

  const bufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const copyToClipboard = (text: string, hashName: string) => {
    if (!text) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${hashName} copied to clipboard!`);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  const copyAllHashes = () => {
    const hashString = Object.entries(hashResults)
      .map(([algorithm, hash]) => `${algorithm.toUpperCase()}: ${hash}`)
      .join("\n");

    if (hashString.trim()) {
      navigator.clipboard
        .writeText(hashString)
        .then(() => {
          toast.success("All hashes copied to clipboard!");
        })
        .catch(() => {
          toast.error("Failed to copy to clipboard");
        });
    }
  };

  const downloadHashes = () => {
    const hashString = Object.entries(hashResults)
      .map(([algorithm, hash]) => `${algorithm.toUpperCase()}: ${hash}`)
      .join("\n");

    if (hashString.trim()) {
      const blob = new Blob([hashString], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hash-results.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Hash results downloaded!");
    }
  };

  const clearInput = () => {
    setInput("");
    clearHashResults();
  };

  const clearHashResults = () => {
    setHashResults({
      sha1: "",
      sha256: "",
      sha512: "",
    });
  };

  return (
    <ToolWrapper>
      <div className="container max-w-full px-4 md:px-6 py-8 mx-auto overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <Hash className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-white">Hash Generator</h1>
          </div>

          <p className="text-white/70 mb-8">
            Generate cryptographic hashes of text inputs. Useful for verifying
            data integrity, comparing hash values, and solving hash-related CTF
            challenges.
          </p>

          <div className="grid gap-6">
            <Card className="border-[#2a2c37]">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-white">Input</CardTitle>
                <CardDescription className="text-white/70">
                  Enter text to hash
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea
                    className="w-full h-36 p-3 bg-[#0F1117] border border-[#2a2c37] rounded-md focus:border-primary/50 focus:ring-0 focus:outline-none resize-none font-mono text-white"
                    placeholder="Enter text here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />

                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateHashes}
                        disabled={!input || loading}
                        className="flex items-center gap-1 border-[#2a2c37] text-white/90 hover:bg-[#1a1c25] hover:text-white"
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                        />
                        {loading ? "Generating..." : "Regenerate"}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearInput}
                      className="text-sm border-[#2a2c37] text-white/90 hover:bg-[#1a1c25] hover:text-white"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2a2c37]">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center justify-between text-white">
                  <span>Hash Results</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyAllHashes}
                      disabled={!input}
                      title="Copy all hashes"
                      className="hover:bg-[#1a1c25] text-primary disabled:text-white/30"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={downloadHashes}
                      disabled={!input}
                      title="Download hashes as text file"
                      className="hover:bg-[#1a1c25] text-primary disabled:text-white/30"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription className="text-white/70">
                  Output of various hash algorithms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {Object.entries(hashResults).map(([algorithm, hash]) => (
                    <div
                      key={algorithm}
                      className="p-3 bg-[#0F1117] border border-[#2a2c37] rounded-md"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-mono uppercase text-white">
                          {algorithm}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            copyToClipboard(hash, algorithm.toUpperCase())
                          }
                          disabled={!hash}
                          className="h-6 w-6 hover:bg-[#1a1c25] text-primary disabled:text-white/30"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="font-mono text-sm break-all text-white">
                        {hash || (
                          <span className="text-white/50">
                            Hash will appear here...
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </ToolWrapper>
  );
}

export default HashTool;