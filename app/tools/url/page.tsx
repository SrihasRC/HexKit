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
import { Globe, Copy, ArrowDownUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { toolTheme } from "../theme-utils";
import ToolWrapper from "@/components/ToolWrapper";
import BackButton from "@/components/BackButton";

const URLTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeComponents, setEncodeComponents] = useState(false);

  useEffect(() => {
    if (input) {
      try {
        if (mode === "encode") {
          setOutput(encodeURL(input, encodeComponents));
        } else {
          setOutput(decodeURL(input, encodeComponents));
        }
      } catch (error) {
        console.error("Error processing URL:", error);
        toast.error("Failed to process URL");
      }
    } else {
      setOutput("");
    }
  }, [input, mode, encodeComponents]);

  const encodeURL = (text: string, components: boolean): string => {
    try {
      if (components) {
        return encodeURIComponent(text);
      } else {
        return encodeURI(text);
      }
    } catch (error) {
      console.error("Encoding error:", error);
      toast.error("Invalid input for URL encoding");
      return "";
    }
  };

  const decodeURL = (text: string, components: boolean): string => {
    try {
      if (components) {
        return decodeURIComponent(text);
      } else {
        return decodeURI(text);
      }
    } catch (error) {
      console.error("Decoding error:", error);
      toast.error("Invalid input for URL decoding");
      return "";
    }
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

  const swapInputOutput = () => {
    if (!output) return;

    setInput(output);
    setMode(mode === "encode" ? "decode" : "encode");
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
            <Globe className={`h-8 w-8 ${toolTheme.primaryIcon}`} />
            <h1 className={`text-3xl font-bold ${toolTheme.headingText}`}>
              URL Encode/Decode
            </h1>
          </div>

          <p className={`${toolTheme.bodyText} mb-8`}>
            Encode and decode URLs and URL components. Essential for web-based
            CTF challenges, HTTP request manipulation, and API testing.
          </p>

          <div className="grid gap-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex gap-4 justify-center">
                <Button
                  variant={mode === "encode" ? "default" : "outline"}
                  onClick={() => setMode("encode")}
                  className={
                    mode === "encode"
                      ? "bg-primary text-[#0F1117]"
                      : `${toolTheme.actionButtonClasses}`
                  }
                >
                  Encode URL
                </Button>
                <Button
                  variant={mode === "decode" ? "default" : "outline"}
                  onClick={() => setMode("decode")}
                  className={
                    mode === "decode"
                      ? "bg-primary text-[#0F1117]"
                      : `${toolTheme.actionButtonClasses}`
                  }
                >
                  Decode URL
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => setEncodeComponents(!encodeComponents)}
                className={
                  encodeComponents
                    ? "bg-primary/20 text-white"
                    : `${toolTheme.actionButtonClasses}`
                }
              >
                {encodeComponents ? "URI Components Mode" : "Full URI Mode"}
              </Button>
            </div>

            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle
                  className={`text-xl flex items-center justify-between ${toolTheme.headingText}`}
                >
                  <span>Input</span>
                </CardTitle>
                <CardDescription className={toolTheme.bodyText}>
                  Enter{" "}
                  {mode === "encode"
                    ? "text to URL encode"
                    : "URL encoded text to decode"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea
                    className={toolTheme.textareaClasses + " h-36"}
                    placeholder={`Enter ${
                      mode === "encode" ? "text" : "encoded URL"
                    } here...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button
                onClick={swapInputOutput}
                className={`flex items-center gap-2 ${toolTheme.actionButtonClasses}`}
                variant="outline"
                disabled={!output}
              >
                <ArrowDownUp className="h-4 w-4" /> Swap Input/Output
              </Button>
              <Button
                onClick={clearInputs}
                variant="outline"
                className={`flex items-center gap-2 ${toolTheme.actionButtonClasses}`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>

            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle
                  className={`text-xl flex items-center justify-between ${toolTheme.headingText}`}
                >
                  <span>Output</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                    disabled={!output}
                    className={toolTheme.iconButtonClasses}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription className={toolTheme.bodyText}>
                  {mode === "encode" ? "URL encoded result" : "Decoded URL"}
                  {encodeComponents
                    ? " (encoding/decoding components)"
                    : " (encoding/decoding full URL)"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={toolTheme.resultContainerClasses}>
                    {output || (
                      <span className={toolTheme.placeholderText}>
                        Result will appear here...
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-xl ${toolTheme.headingText}`}>
                  About URL Encoding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-sm space-y-3 ${toolTheme.headingText}`}>
                  <p>
                    <strong>URL Encoding</strong> converts characters that are
                    not allowed in URLs to percent-encoded equivalents. This is
                    necessary because URLs can only contain a limited set of
                    ASCII characters.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Full URI Encoding</h3>
                      <p>
                        Encodes a complete URL while preserving the URL
                        structure. Characters like{" "}
                        <code className="text-primary">/</code>,{" "}
                        <code className="text-primary">:</code>,{" "}
                        <code className="text-primary">?</code>,{" "}
                        <code className="text-primary">=</code>, and{" "}
                        <code className="text-primary">&</code>
                        are NOT encoded because they have special meaning in
                        URLs.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">
                        URI Component Encoding
                      </h3>
                      <p>
                        Encodes all special characters including URL delimiters.
                        Use this when encoding individual parts of a URL like
                        query parameters or path segments.
                      </p>
                    </div>
                  </div>
                  <p className={`text-xs ${toolTheme.bodyText} mt-2`}>
                    Common encoded characters: space (→ %20), plus (→ %2B),
                    slash (→ %2F), equals (→ %3D), ampersand (→ %26)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </ToolWrapper>
  );
};

export default URLTool;
