"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowDownUp, Code, Copy, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ToolWrapper from "@/components/ToolWrapper";
import BackButton from "@/components/BackButton";

const page = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  useEffect(() => {
    if (input) {
      try {
        if (mode === "encode") {
          const encoded = btoa(input);
          setOutput(encoded);
        } else {
          const decoded = atob(input);
          setOutput(decoded);
        }
      } catch (error) {
        setOutput("Error: Invalid input for " + mode);
      }
    } else {
      setOutput("");
    }
  }, [input, mode]);

  const toggleMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput(input);
  };

  const copyToClipboard = () => {
    if (!output) return;

    navigator.clipboard
      .writeText(output)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  const clearInputs = () => {
    setInput("");
    setOutput("");
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
          <BackButton />
          <div className="flex items-center gap-3 mb-6">
            <Code className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-white">
              Base64 Encoder/Decoder
            </h1>
          </div>

          <p className="text-white/70 mb-8">
            Base64 is an encoding scheme used to represent binary data in ASCII
            format. It's commonly used in CTF challenges to obfuscate text or
            binary data.
          </p>

          <div className="grid gap-6">
            <Card className="border-[#2a2c37]">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center justify-between text-white">
                  <span>
                    {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMode}
                    className="border-[#2a2c37] text-primary hover:bg-[#1a1c25]"
                  >
                    <ArrowDownUp className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription className="text-white/70">
                  {mode === "encode"
                    ? "Enter the text you want to convert to Base64"
                    : "Enter the Base64 string you want to decode"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea
                    className="w-full h-36 p-3 bg-[#0F1117] border border-[#2a2c37] rounded-md focus:border-primary/50 focus:ring-0 focus:outline-none resize-none font-mono text-white"
                    placeholder={
                      mode === "encode"
                        ? "Enter text here..."
                        : "Enter Base64 here..."
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={clearInputs}
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
                  <span>
                    {mode === "encode" ? "Base64 Result" : "Decoded Result"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                    disabled={!output}
                    className="hover:bg-[#1a1c25] text-primary disabled:text-white/30"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription className="text-white/70">
                  {mode === "encode"
                    ? "Base64 encoded output"
                    : "Decoded text result"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-[#0F1117] border border-[#2a2c37] rounded-md min-h-36 font-mono break-all text-white">
                  {output || (
                    <span className="text-white/50">
                      Result will appear here...
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </ToolWrapper>
  );
};

export default page;
