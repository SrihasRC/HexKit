"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { DiffIcon, ArrowDownUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { toolTheme } from "../theme-utils";
import ToolWrapper from "@/components/ToolWrapper";

const DiffTool = () => {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diffResult, setDiffResult] = useState<React.ReactNode[]>([]);

  const compareTexts = () => {
    if (!textA || !textB) {
      toast.error("Please provide both input texts");
      return;
    }

    const result: React.ReactNode[] = [];

    // Split by lines
    const linesA = textA.split("\n");
    const linesB = textB.split("\n");

    // Find the maximum line count
    const maxLines = Math.max(linesA.length, linesB.length);

    for (let i = 0; i < maxLines; i++) {
      const lineA = linesA[i] || "";
      const lineB = linesB[i] || "";

      // This line exists in both texts
      if (i < linesA.length && i < linesB.length) {
        if (lineA === lineB) {
          // Lines are identical
          result.push(
            <div key={`line-${i}`} className="flex">
              <div className="w-8 text-right pr-2 opacity-50 font-mono text-sm">
                {i + 1}
              </div>
              <div className="flex-grow font-mono break-all whitespace-pre-wrap">
                {lineA}
              </div>
            </div>
          );
        } else {
          // Lines differ - highlight characters that are different
          const diffElements = highlightDifferences(lineA, lineB);

          result.push(
            <div key={`line-${i}-a`} className="flex">
              <div className="w-8 text-right pr-2 opacity-50 font-mono text-sm">
                {i + 1}
              </div>
              <div className="flex-grow font-mono break-all whitespace-pre-wrap bg-red-900/20 text-red-400">
                {diffElements.a}
              </div>
            </div>
          );
          result.push(
            <div key={`line-${i}-b`} className="flex">
              <div className="w-8 text-right pr-2 opacity-50 font-mono text-sm">
                {i + 1}
              </div>
              <div className="flex-grow font-mono break-all whitespace-pre-wrap bg-green-900/20 text-green-400">
                {diffElements.b}
              </div>
            </div>
          );
        }
      } else if (i < linesA.length) {
        // Line only exists in text A
        result.push(
          <div key={`line-${i}-a-only`} className="flex">
            <div className="w-8 text-right pr-2 opacity-50 font-mono text-sm">
              {i + 1}
            </div>
            <div className="flex-grow font-mono break-all whitespace-pre-wrap bg-red-900/20 text-red-400">
              {lineA}
            </div>
          </div>
        );
      } else {
        // Line only exists in text B
        result.push(
          <div key={`line-${i}-b-only`} className="flex">
            <div className="w-8 text-right pr-2 opacity-50 font-mono text-sm">
              {i + 1}
            </div>
            <div className="flex-grow font-mono break-all whitespace-pre-wrap bg-green-900/20 text-green-400">
              {lineB}
            </div>
          </div>
        );
      }
    }

    setDiffResult(result);
  };

  const highlightDifferences = (textA: string, textB: string) => {
    const resultA: React.ReactNode[] = [];
    const resultB: React.ReactNode[] = [];

    // Find the longest common subsequence using dynamic programming
    // This is a simplified version that just identifies matching and different parts
    let i = 0;
    let j = 0;

    while (i < textA.length || j < textB.length) {
      if (i < textA.length && j < textB.length && textA[i] === textB[j]) {
        // Characters match
        resultA.push(<span key={`a-${i}`}>{textA[i]}</span>);
        resultB.push(<span key={`b-${j}`}>{textB[j]}</span>);
        i++;
        j++;
      } else {
        // Find the next matching point
        let nextMatch = -1;
        let matchI = -1;
        let matchJ = -1;

        for (let k = i; k < textA.length; k++) {
          for (let l = j; l < textB.length; l++) {
            if (textA[k] === textB[l]) {
              // Found a match
              nextMatch = k;
              matchI = k;
              matchJ = l;
              break;
            }
          }
          if (nextMatch !== -1) break;
        }

        if (nextMatch !== -1) {
          // Add all different characters before the next match
          for (let k = i; k < matchI; k++) {
            resultA.push(
              <span key={`a-${k}`} className="font-bold bg-red-500/30">
                {textA[k]}
              </span>
            );
          }
          for (let l = j; l < matchJ; l++) {
            resultB.push(
              <span key={`b-${l}`} className="font-bold bg-green-500/30">
                {textB[l]}
              </span>
            );
          }

          i = matchI;
          j = matchJ;
        } else {
          // No more matches, add the rest as different
          for (let k = i; k < textA.length; k++) {
            resultA.push(
              <span key={`a-${k}`} className="font-bold bg-red-500/30">
                {textA[k]}
              </span>
            );
          }
          for (let l = j; l < textB.length; l++) {
            resultB.push(
              <span key={`b-${l}`} className="font-bold bg-green-500/30">
                {textB[l]}
              </span>
            );
          }

          break;
        }
      }
    }

    return { a: resultA, b: resultB };
  };

  const swapTexts = () => {
    const tempA = textA;
    setTextA(textB);
    setTextB(tempA);
    setDiffResult([]);
  };

  const clearTexts = () => {
    setTextA("");
    setTextB("");
    setDiffResult([]);
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
            <DiffIcon className={`h-8 w-8 ${toolTheme.primaryIcon}`} />
            <h1 className={`text-3xl font-bold ${toolTheme.headingText}`}>
              Text Diff Viewer
            </h1>
          </div>

          <p className={`${toolTheme.bodyText} mb-8`}>
            Compare two texts and highlight the differences between them. Useful
            for identifying subtle changes in CTF challenges.
          </p>

          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={toolTheme.cardBorder}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-xl ${toolTheme.headingText}`}>
                    Text A
                  </CardTitle>
                  <CardDescription className={toolTheme.bodyText}>
                    First text for comparison
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    className={toolTheme.textareaClasses + " h-36"}
                    placeholder="Enter first text here..."
                    value={textA}
                    onChange={(e) => setTextA(e.target.value)}
                  />
                </CardContent>
              </Card>

              <Card className={toolTheme.cardBorder}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-xl ${toolTheme.headingText}`}>
                    Text B
                  </CardTitle>
                  <CardDescription className={toolTheme.bodyText}>
                    Second text for comparison
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    className={toolTheme.textareaClasses + " h-36"}
                    placeholder="Enter second text here..."
                    value={textB}
                    onChange={(e) => setTextB(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={compareTexts}
                className="bg-primary text-[#0F1117]"
              >
                Compare Texts
              </Button>
              <Button
                variant="outline"
                onClick={swapTexts}
                className={`text-sm ${toolTheme.actionButtonClasses} flex items-center`}
              >
                <ArrowDownUp className="h-4 w-4 mr-2" />
                Swap Texts
              </Button>
              <Button
                variant="outline"
                onClick={clearTexts}
                className={`text-sm ${toolTheme.actionButtonClasses} flex items-center`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>

            {diffResult.length > 0 && (
              <Card className={toolTheme.cardBorder}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-xl ${toolTheme.headingText}`}>
                    Differences
                  </CardTitle>
                  <CardDescription className={toolTheme.bodyText}>
                    Lines in red were removed or changed, lines in green were
                    added or changed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`${toolTheme.inputBg} ${toolTheme.cardBorder} rounded-md p-4 overflow-x-auto text-white`}
                  >
                    <div className="space-y-1">{diffResult}</div>
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

export default DiffTool;
