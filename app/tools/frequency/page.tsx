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
import { BarChart2, Copy, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { toolTheme } from "../theme-utils";
import ToolWrapper from "@/components/ToolWrapper";

interface FrequencyData {
  char: string;
  count: number;
  percentage: number;
}

const FrequencyAnalysisTool = () => {
  const [input, setInput] = useState("");
  const [charFrequency, setCharFrequency] = useState<FrequencyData[]>([]);
  const [totalChars, setTotalChars] = useState(0);
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [ignoreSpaces, setIgnoreSpaces] = useState(false);
  const [ignorePunctuation, setIgnorePunctuation] = useState(true);

  useEffect(() => {
    if (input) {
      analyzeText(input);
    } else {
      setCharFrequency([]);
      setTotalChars(0);
    }
  }, [input, ignoreCase, ignoreSpaces, ignorePunctuation]);

  const analyzeText = (text: string) => {
    let processedText = text;

    // Apply text processing based on options
    if (ignoreCase) {
      processedText = processedText.toLowerCase();
    }

    if (ignorePunctuation) {
      processedText = processedText.replace(/[^\w\s]/g, "");
    }

    if (ignoreSpaces) {
      processedText = processedText.replace(/\s/g, "");
    }

    // Count character frequencies
    const frequencyMap: { [key: string]: number } = {};
    const chars = processedText.split("");

    chars.forEach((char) => {
      if (frequencyMap[char]) {
        frequencyMap[char]++;
      } else {
        frequencyMap[char] = 1;
      }
    });

    // Convert to array and calculate percentages
    const total = chars.length;
    setTotalChars(total);

    const frequencyArray: FrequencyData[] = Object.entries(frequencyMap).map(
      ([char, count]) => ({
        char,
        count,
        percentage: (count / total) * 100,
      })
    );

    // Sort by frequency (descending)
    frequencyArray.sort((a, b) => b.count - a.count);

    setCharFrequency(frequencyArray);
  };

  const clearInput = () => {
    setInput("");
  };

  const copyResults = () => {
    if (charFrequency.length === 0) return;

    const resultText = charFrequency
      .map(
        (item) => `${item.char}: ${item.count} (${item.percentage.toFixed(2)}%)`
      )
      .join("\n");

    navigator.clipboard
      .writeText(resultText)
      .then(() => {
        toast.success("Results copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  const downloadResults = () => {
    if (charFrequency.length === 0) return;

    const resultText = charFrequency
      .map(
        (item) => `${item.char}: ${item.count} (${item.percentage.toFixed(2)}%)`
      )
      .join("\n");

    // Create blob and download link
    const blob = new Blob([resultText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "frequency-analysis.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Results downloaded!");
  };

  // Calculate the maximum bar width based on the highest frequency
  const maxPercentage =
    charFrequency.length > 0
      ? Math.max(...charFrequency.map((item) => item.percentage))
      : 0;

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
            <BarChart2 className={`h-8 w-8 ${toolTheme.primaryIcon}`} />
            <h1 className={`text-3xl font-bold ${toolTheme.headingText}`}>
              Frequency Analysis
            </h1>
          </div>

          <p className={`${toolTheme.bodyText} mb-8`}>
            Analyze the frequency of characters in text. This tool is useful for
            cryptanalysis of substitution ciphers and other encoded text.
          </p>

          <div className="grid gap-6">
            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-xl ${toolTheme.headingText}`}>
                  Input Text
                </CardTitle>
                <CardDescription className={toolTheme.bodyText}>
                  Enter the text you want to analyze
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

                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="flex flex-wrap gap-4 mb-2 sm:mb-0">
                      <label
                        className={`flex items-center gap-2 text-sm ${toolTheme.headingText}`}
                      >
                        <input
                          type="checkbox"
                          checked={ignoreCase}
                          onChange={() => setIgnoreCase(!ignoreCase)}
                          className="rounded border-primary/30 text-primary"
                        />
                        Ignore case
                      </label>
                      <label
                        className={`flex items-center gap-2 text-sm ${toolTheme.headingText}`}
                      >
                        <input
                          type="checkbox"
                          checked={ignoreSpaces}
                          onChange={() => setIgnoreSpaces(!ignoreSpaces)}
                          className="rounded border-primary/30 text-primary"
                        />
                        Ignore spaces
                      </label>
                      <label
                        className={`flex items-center gap-2 text-sm ${toolTheme.headingText}`}
                      >
                        <input
                          type="checkbox"
                          checked={ignorePunctuation}
                          onChange={() =>
                            setIgnorePunctuation(!ignorePunctuation)
                          }
                          className="rounded border-primary/30 text-primary"
                        />
                        Ignore punctuation
                      </label>
                    </div>

                    <Button
                      variant="outline"
                      onClick={clearInput}
                      className={`text-sm ${toolTheme.actionButtonClasses}`}
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
                  <span>Frequency Analysis Results</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyResults}
                      disabled={charFrequency.length === 0}
                      className={toolTheme.iconButtonClasses}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={downloadResults}
                      disabled={charFrequency.length === 0}
                      className={toolTheme.iconButtonClasses}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription className={toolTheme.bodyText}>
                  {totalChars > 0
                    ? `Analysis of ${totalChars} characters`
                    : "Character frequency will appear here"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {charFrequency.length > 0 ? (
                    <div
                      className={`${toolTheme.inputBg} ${toolTheme.cardBorder} rounded-md p-4 ${toolTheme.headingText}`}
                    >
                      <div className="grid gap-2">
                        {charFrequency.map((item) => (
                          <div key={item.char} className="flex items-center">
                            <div className="w-8 font-mono text-center">
                              {item.char === " " ? "␣" : item.char}
                            </div>
                            <div className="w-16 text-right font-mono pr-2">
                              {item.count}
                            </div>
                            <div className="w-16 text-right font-mono pr-3">
                              {item.percentage.toFixed(2)}%
                            </div>
                            <div className="flex-grow bg-[#1a1c25] h-5 rounded overflow-hidden">
                              <div
                                className="h-full bg-primary/40"
                                style={{
                                  width: `${
                                    (item.percentage / maxPercentage) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`text-center ${toolTheme.placeholderText} py-8`}
                    >
                      Enter text to see character frequency analysis
                    </div>
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

export default FrequencyAnalysisTool;
