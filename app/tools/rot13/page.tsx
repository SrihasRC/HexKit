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
import { KeyRound, Copy, ArrowDownUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { toolTheme } from "../theme-utils";
import ToolWrapper from "@/components/ToolWrapper";

const ROT13Tool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [rotation, setRotation] = useState(13); // Default to ROT13
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

  useEffect(() => {
    if (input) {
      try {
        const shift = mode === "encrypt" ? rotation : (26 - rotation) % 26;
        const result = applyCaesarCipher(input, shift);
        setOutput(result);
      } catch (error) {
        setOutput("Error processing input");
      }
    } else {
      setOutput("");
    }
  }, [input, rotation, mode]);

  const applyCaesarCipher = (text: string, shift: number): string => {
    return text
      .split("")
      .map((char) => {
        if (/[a-zA-Z]/.test(char)) {
          const code = char.charCodeAt(0);
          const isUpperCase = code >= 65 && code <= 90;
          const offset = isUpperCase ? 65 : 97;

          return String.fromCharCode(((code - offset + shift) % 26) + offset);
        }
        return char; // Non-alphabetic characters remain unchanged
      })
      .join("");
  };

  const toggleMode = () => {
    setMode(mode === "encrypt" ? "decrypt" : "encrypt");
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

  const handleRotationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setRotation(isNaN(value) ? 0 : Math.max(0, Math.min(25, value)));
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
            <KeyRound className={`h-8 w-8 ${toolTheme.primaryIcon}`} />
            <h1 className={`text-3xl font-bold ${toolTheme.headingText}`}>
              ROT13/Caesar Cipher
            </h1>
          </div>

          <p className={`${toolTheme.bodyText} mb-8`}>
            The Caesar cipher is a substitution cipher where each letter is
            shifted a certain number of places down the alphabet. ROT13 is a
            special case where the shift is 13 places.
          </p>

          <div className="grid gap-6">
            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle
                  className={`text-xl flex items-center justify-between ${toolTheme.headingText}`}
                >
                  <span>
                    {mode === "encrypt" ? "Text to Encrypt" : "Text to Decrypt"}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMode}
                    className={toolTheme.iconButtonClasses}
                  >
                    <ArrowDownUp className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription className={toolTheme.bodyText}>
                  {mode === "encrypt"
                    ? "Enter the text you want to encrypt"
                    : "Enter the text you want to decrypt"}
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

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex flex-col w-full sm:w-auto">
                      <span className={`text-sm ${toolTheme.bodyText} mb-1`}>
                        Rotation (0-25)
                      </span>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          min="0"
                          max="25"
                          value={rotation}
                          onChange={handleRotationChange}
                          className={`w-20 ${toolTheme.inputBg} ${toolTheme.cardBorder} text-white`}
                        />
                        <span className={`text-sm ${toolTheme.bodyText}`}>
                          {rotation === 13 ? "ROT13" : `ROT${rotation}`}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={clearInputs}
                      className={`text-sm ${toolTheme.actionButtonClasses} flex items-center`}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle
                  className={`text-xl flex items-center justify-between ${toolTheme.headingText}`}
                >
                  <span>
                    {mode === "encrypt"
                      ? "Encrypted Result"
                      : "Decrypted Result"}
                  </span>
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
                  {mode === "encrypt"
                    ? "Caesar cipher encrypted output"
                    : "Decrypted text result"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={toolTheme.resultContainerClasses}>
                  {output || (
                    <span className={toolTheme.placeholderText}>
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

export default ROT13Tool;
