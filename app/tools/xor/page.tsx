"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Lock, Copy, ArrowDownUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { toolTheme } from "../theme-utils";
import ToolWrapper from "@/components/ToolWrapper";
import BackButton from "@/components/BackButton";

const XORTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [key, setKey] = useState("");
  const [keyFormat, setKeyFormat] = useState<"text" | "hex">("text");
  const [outputFormat, setOutputFormat] = useState<"text" | "hex">("hex");

  useEffect(() => {
    if (input && key) {
      try {
        const result = applyXOR(input, key, keyFormat, outputFormat);
        setOutput(result);
      } catch (error) {
        setOutput("Error: Invalid input or key");
      }
    } else {
      setOutput("");
    }
  }, [input, key, keyFormat, outputFormat]);

  const applyXOR = (
    text: string,
    key: string,
    keyFormat: string,
    outputFormat: string
  ): string => {
    const inputBytes = new TextEncoder().encode(text);

    let keyBytes: Uint8Array;
    if (keyFormat === "hex") {
      const hexString = key.replace(/[^0-9A-Fa-f]/g, "");
      keyBytes = new Uint8Array(
        hexString.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
      );
    } else {
      keyBytes = new TextEncoder().encode(key);
    }

    if (keyBytes.length === 0) {
      throw new Error("Invalid key");
    }

    const resultBytes = new Uint8Array(inputBytes.length);
    for (let i = 0; i < inputBytes.length; i++) {
      resultBytes[i] = inputBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    if (outputFormat === "hex") {
      return Array.from(resultBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } else {
      try {
        return new TextDecoder().decode(resultBytes);
      } catch {
        return Array.from(resultBytes)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      }
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
    setKey("");
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
            <Lock className={`h-8 w-8 ${toolTheme.primaryIcon}`} />
            <h1 className={`text-3xl font-bold ${toolTheme.headingText}`}>
              XOR Encoder/Decoder
            </h1>
          </div>

          <p className={`${toolTheme.bodyText} mb-8`}>
            XOR (Exclusive OR) is a bitwise operator widely used in
            cryptography. It can be used for basic encryption by combining each
            byte of the plaintext with a key.
          </p>

          <div className="grid gap-6">
            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-xl ${toolTheme.headingText}`}>
                  Input Text
                </CardTitle>
                <CardDescription className={toolTheme.bodyText}>
                  Enter the text you want to XOR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea
                    className={toolTheme.textareaClasses + " h-36"}
                    placeholder="Enter text here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-xl ${toolTheme.headingText}`}>
                  XOR Key
                </CardTitle>
                <CardDescription className={toolTheme.bodyText}>
                  Enter the key to use for XOR operation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        className={`w-full ${toolTheme.inputBg} ${toolTheme.cardBorder} font-mono text-white`}
                        placeholder="Enter key here..."
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="keyText"
                          className="text-primary"
                          checked={keyFormat === "text"}
                          onChange={() => setKeyFormat("text")}
                        />
                        <label
                          htmlFor="keyText"
                          className={`text-sm ${toolTheme.headingText}`}
                        >
                          Text
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="keyHex"
                          className="text-primary"
                          checked={keyFormat === "hex"}
                          onChange={() => setKeyFormat("hex")}
                        />
                        <label
                          htmlFor="keyHex"
                          className={`text-sm ${toolTheme.headingText}`}
                        >
                          Hex
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle
                  className={`text-xl flex items-center justify-between ${toolTheme.headingText}`}
                >
                  <span>XOR Result</span>
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
                  Result of XOR operation
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

                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <span className={`text-sm ${toolTheme.bodyText}`}>
                        Output Format:
                      </span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="outputText"
                          className="text-primary"
                          checked={outputFormat === "text"}
                          onChange={() => setOutputFormat("text")}
                        />
                        <label
                          htmlFor="outputText"
                          className={`text-sm ${toolTheme.headingText}`}
                        >
                          Text
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="outputHex"
                          className="text-primary"
                          checked={outputFormat === "hex"}
                          onChange={() => setOutputFormat("hex")}
                        />
                        <label
                          htmlFor="outputHex"
                          className={`text-sm ${toolTheme.headingText}`}
                        >
                          Hex
                        </label>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={clearInputs}
                      className={`text-sm ${toolTheme.actionButtonClasses} flex items-center`}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </ToolWrapper>
  );
}

export default XORTool;