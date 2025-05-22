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
import { RefreshCw, Copy, ArrowDownUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { toolTheme } from "../theme-utils";
import ToolWrapper from "@/components/ToolWrapper";
import BackButton from "@/components/BackButton";

type ReverseOperation = "chars" | "words" | "lines";

const ReverseTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [operation, setOperation] = useState<ReverseOperation>("chars");
  const [caseToggle, setCaseToggle] = useState(false);

  useEffect(() => {
    if (input) {
      let result = "";

      switch (operation) {
        case "chars":
          // Reverse all characters
          result = input.split("").reverse().join("");
          break;
        case "words":
          // Reverse words but keep their order within sentences
          result = input
            .split(/\b(\s+)\b/)
            .map((item) => {
              if (/\s+/.test(item)) {
                return item; // Keep whitespace unchanged
              } else {
                return item.split("").reverse().join("");
              }
            })
            .join("");
          break;
        case "lines":
          // Reverse each line
          result = input
            .split("\n")
            .map((line) => line.split("").reverse().join(""))
            .join("\n");
          break;
      }

      // Apply case toggle if enabled
      if (caseToggle) {
        result = result
          .split("")
          .map((char) => {
            if (char.match(/[a-z]/)) {
              return char.toUpperCase();
            } else if (char.match(/[A-Z]/)) {
              return char.toLowerCase();
            }
            return char;
          })
          .join("");
      }

      setOutput(result);
    } else {
      setOutput("");
    }
  }, [input, operation, caseToggle]);

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
    const temp = input;
    setInput(output);
    setOutput(temp);
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
            <RefreshCw className={`h-8 w-8 ${toolTheme.primaryIcon}`} />
            <h1 className={`text-3xl font-bold ${toolTheme.headingText}`}>
              Reverse String
            </h1>
          </div>

          <p className={`${toolTheme.bodyText} mb-8`}>
            Reverse text by characters, words, or lines with additional
            transformations. Useful for various types of encoding and decoding
            in CTF challenges.
          </p>

          <div className="grid gap-6">
            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle
                  className={`text-xl flex items-center justify-between ${toolTheme.headingText}`}
                >
                  <span>Input Text</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={swapInputOutput}
                    disabled={!input && !output}
                    className={toolTheme.iconButtonClasses}
                  >
                    <ArrowDownUp className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription className={toolTheme.bodyText}>
                  Enter text to reverse
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

                  <div className="flex flex-wrap gap-4 justify-between">
                    <div className="space-y-2">
                      <div className={`text-sm ${toolTheme.bodyText} mb-1`}>
                        Reverse by:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={
                            operation === "chars" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setOperation("chars")}
                          className={
                            operation === "chars"
                              ? "bg-primary text-[#0F1117]"
                              : `${toolTheme.actionButtonClasses}`
                          }
                        >
                          Characters
                        </Button>
                        <Button
                          variant={
                            operation === "words" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setOperation("words")}
                          className={
                            operation === "words"
                              ? "bg-primary text-[#0F1117]"
                              : `${toolTheme.actionButtonClasses}`
                          }
                        >
                          Words
                        </Button>
                        <Button
                          variant={
                            operation === "lines" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setOperation("lines")}
                          className={
                            operation === "lines"
                              ? "bg-primary text-[#0F1117]"
                              : `${toolTheme.actionButtonClasses}`
                          }
                        >
                          Lines
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label
                        className={`flex items-center gap-2 text-sm ${toolTheme.headingText}`}
                      >
                        <input
                          type="checkbox"
                          checked={caseToggle}
                          onChange={() => setCaseToggle(!caseToggle)}
                          className="rounded border-primary/30 text-primary"
                        />
                        Toggle case
                      </label>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearInputs}
                        className={`${toolTheme.actionButtonClasses} flex items-center gap-1`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
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
                  <span>Result</span>
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
                  Reversed text result
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

export default ReverseTool;
