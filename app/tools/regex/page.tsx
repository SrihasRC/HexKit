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
import { Regex, Copy, Download, Info, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { toolTheme } from "../theme-utils";
import ToolWrapper from "@/components/ToolWrapper";
import BackButton from "@/components/BackButton";

interface MatchResult {
  match: string;
  index: number;
  groups: Record<string, string> | null;
}

const RegexTool = () => {
  const [pattern, setPattern] = useState("");
  const [input, setInput] = useState("");
  const [flags, setFlags] = useState("g");
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [error, setError] = useState("");
  const [highlighted, setHighlighted] = useState<React.ReactNode>("");

  useEffect(() => {
    if (pattern && input) {
      try {
        // Create the regex object with the pattern and flags
        const regex = new RegExp(pattern, flags);
        setError("");

        // Find all matches
        const results: MatchResult[] = [];

        if (flags.includes("g")) {
          let match;
          while ((match = regex.exec(input)) !== null) {
            results.push({
              match: match[0],
              index: match.index,
              groups: match.groups || null,
            });

            // Prevent infinite loops for zero-length matches
            if (match.index === regex.lastIndex) {
              regex.lastIndex++;
            }
          }
        } else {
          const match = regex.exec(input);
          if (match) {
            results.push({
              match: match[0],
              index: match.index,
              groups: match.groups || null,
            });
          }
        }

        setMatches(results);

        // Create highlighted text
        highlightMatches(input, results);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Invalid regular expression");
        }
        setMatches([]);
        setHighlighted(input);
      }
    } else {
      setMatches([]);
      setHighlighted(input);
      setError("");
    }
  }, [pattern, input, flags]);

  const highlightMatches = (text: string, matchResults: MatchResult[]) => {
    if (matchResults.length === 0) {
      setHighlighted(text);
      return;
    }

    // Sort matches by their index
    const sortedMatches = [...matchResults].sort((a, b) => a.index - b.index);

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedMatches.forEach((match, i) => {
      // Add the text before the match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${i}`}>
            {text.substring(lastIndex, match.index)}
          </span>
        );
      }

      // Add the highlighted match
      parts.push(
        <span
          key={`match-${i}`}
          className="bg-accent/30 text-accent-foreground px-0.5 rounded"
          title={
            match.groups
              ? `Groups: ${JSON.stringify(match.groups, null, 2)}`
              : undefined
          }
        >
          {text.substring(match.index, match.index + match.match.length)}
        </span>
      );

      lastIndex = match.index + match.match.length;
    });

    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.substring(lastIndex)}</span>);
    }

    setHighlighted(<>{parts}</>);
  };

  const handleFlagChange = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ""));
    } else {
      setFlags(flags + flag);
    }
  };

  const copyMatches = () => {
    if (matches.length === 0) return;

    const matchesText = matches.map((m) => m.match).join("\n");
    navigator.clipboard
      .writeText(matchesText)
      .then(() => {
        toast.success("Matches copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  const downloadMatches = () => {
    if (matches.length === 0) return;

    const matchesText = matches.map((m) => m.match).join("\n");
    const blob = new Blob([matchesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "regex-matches.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Matches downloaded!");
  };

  const clearAll = () => {
    setPattern("");
    setInput("");
    setMatches([]);
    setError("");
    setHighlighted("");
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
            <Regex className={`h-8 w-8 ${toolTheme.primaryIcon}`} />
            <h1 className={`text-3xl font-bold ${toolTheme.headingText}`}>
              Regex Tester
            </h1>
          </div>

          <p className={`${toolTheme.bodyText} mb-8`}>
            Test and debug regular expressions with live highlighting of
            matches. Essential for CTF challenges that involve pattern matching.
          </p>

          <div className="grid gap-6">
            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-xl ${toolTheme.headingText}`}>
                  Regular Expression
                </CardTitle>
                <CardDescription className={toolTheme.bodyText}>
                  Enter your regular expression pattern and select flags
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        className={`w-full p-3 ${toolTheme.inputBg} ${toolTheme.cardBorder} rounded-md focus:border-primary/50 focus:ring-0 focus:outline-none font-mono text-white`}
                        placeholder="Enter regex pattern..."
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <label
                        className={`flex items-center gap-2 text-sm ${toolTheme.headingText}`}
                      >
                        <input
                          type="checkbox"
                          checked={flags.includes("g")}
                          onChange={() => handleFlagChange("g")}
                          className="rounded border-primary/30 text-primary"
                        />
                        Global (g)
                      </label>
                      <label
                        className={`flex items-center gap-2 text-sm ${toolTheme.headingText}`}
                      >
                        <input
                          type="checkbox"
                          checked={flags.includes("i")}
                          onChange={() => handleFlagChange("i")}
                          className="rounded border-primary/30 text-primary"
                        />
                        Case-insensitive (i)
                      </label>
                      <label
                        className={`flex items-center gap-2 text-sm ${toolTheme.headingText}`}
                      >
                        <input
                          type="checkbox"
                          checked={flags.includes("m")}
                          onChange={() => handleFlagChange("m")}
                          className="rounded border-primary/30 text-primary"
                        />
                        Multiline (m)
                      </label>
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-xl ${toolTheme.headingText}`}>
                  Test Text
                </CardTitle>
                <CardDescription className={toolTheme.bodyText}>
                  Enter the text you want to test against the regex
                </CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  className={toolTheme.textareaClasses + " h-36"}
                  placeholder="Enter text to match..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </CardContent>
            </Card>

            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle
                  className={`text-xl flex items-center justify-between ${toolTheme.headingText}`}
                >
                  <span>Highlighted Matches</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                    className={`${toolTheme.actionButtonClasses}`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </CardTitle>
                <CardDescription className={toolTheme.bodyText}>
                  {matches.length > 0
                    ? `Found ${matches.length} match${
                        matches.length !== 1 ? "es" : ""
                      }`
                    : "Matches will be highlighted here"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`p-3 ${toolTheme.inputBg} ${toolTheme.cardBorder} rounded-md min-h-36 font-mono break-all whitespace-pre-wrap text-white`}
                >
                  {highlighted || (
                    <span className={toolTheme.placeholderText}>
                      Enter text and a valid regex pattern to see matches
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {matches.length > 0 && (
              <Card className={toolTheme.cardBorder}>
                <CardHeader className="pb-3">
                  <CardTitle
                    className={`text-xl flex items-center justify-between ${toolTheme.headingText}`}
                  >
                    <span>Extracted Matches</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyMatches}
                        className={toolTheme.iconButtonClasses}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={downloadMatches}
                        className={toolTheme.iconButtonClasses}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription className={toolTheme.bodyText}>
                    List of all regex matches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`${toolTheme.inputBg} ${toolTheme.cardBorder} rounded-md overflow-hidden`}
                  >
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-primary/10">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-white">
                              #
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-white">
                              Match
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-white">
                              Position
                            </th>
                            {matches.some((m) => m.groups) && (
                              <th className="px-4 py-2 text-left text-xs font-medium text-white">
                                Groups
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/10">
                          {matches.map((match, index) => (
                            <tr key={index} className="hover:bg-primary/5">
                              <td className="px-4 py-2 text-sm font-mono text-white">
                                {index + 1}
                              </td>
                              <td className="px-4 py-2 text-sm font-mono text-white">
                                {match.match}
                              </td>
                              <td className="px-4 py-2 text-sm font-mono text-white">
                                {match.index}
                              </td>
                              {matches.some((m) => m.groups) && (
                                <td className="px-4 py-2 text-sm font-mono text-white">
                                  {match.groups
                                    ? JSON.stringify(match.groups)
                                    : ""}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </ToolWrapper>
  );
}

export default RegexTool;
