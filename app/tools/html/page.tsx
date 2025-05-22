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
import { FileCode, Copy, ArrowDownUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { toolTheme } from "../theme-utils";
import ToolWrapper from "@/components/ToolWrapper";
import BackButton from "@/components/BackButton";

const HTMLTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (input) {
      try {
        if (mode === "encode") {
          setOutput(encodeHTML(input));
        } else {
          setOutput(decodeHTML(input));
        }

        if (mode === "encode") {
          setPreviewHtml(input);
        } else {
          setPreviewHtml(decodeHTML(input));
        }
      } catch (error) {
        console.error("Error processing HTML:", error);
        toast.error("Failed to process HTML");
      }
    } else {
      setOutput("");
      setPreviewHtml("");
    }
  }, [input, mode]);

  const encodeHTML = (text: string): string => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const decodeHTML = (text: string): string => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
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
    setPreviewHtml("");
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
            <FileCode className={`h-8 w-8 ${toolTheme.primaryIcon}`} />
            <h1 className={`text-3xl font-bold ${toolTheme.headingText}`}>
              HTML Encode/Decode
            </h1>
          </div>

          <p className={`${toolTheme.bodyText} mb-8`}>
            Convert text to and from HTML entities. Essential for web-based CTF
            challenges and sanitizing user inputs.
          </p>

          <div className="grid gap-6">
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
                Encode HTML
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
                Decode HTML
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
                    ? "HTML to encode"
                    : "encoded HTML to decode"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea
                    className={toolTheme.textareaClasses + " h-36"}
                    placeholder={`Enter ${
                      mode === "encode" ? "HTML" : "encoded HTML"
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
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className={
                  showPreview
                    ? "bg-primary/20 text-white"
                    : `${toolTheme.actionButtonClasses}`
                }
                disabled={!previewHtml}
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
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
                  {mode === "encode" ? "Encoded HTML entities" : "Decoded HTML"}
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

            {showPreview && (
              <Card className={toolTheme.cardBorder}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-xl ${toolTheme.headingText}`}>
                    HTML Preview
                  </CardTitle>
                  <CardDescription className={toolTheme.bodyText}>
                    How the HTML renders in the browser
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-white text-black border border-[#2a2c37] rounded-md min-h-36 overflow-auto">
                    {previewHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    ) : (
                      <div className="text-gray-500">
                        Preview will appear here...
                      </div>
                    )}
                  </div>
                  <div className={`mt-3 text-xs ${toolTheme.bodyText}`}>
                    <strong>Note:</strong> This preview has limited protections.
                    Avoid pasting untrusted HTML.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </ToolWrapper>
  );
};

export default HTMLTool;
