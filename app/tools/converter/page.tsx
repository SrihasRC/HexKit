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
import { Binary, Copy, ArrowDownUp, DownloadCloud, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { toolTheme } from "../theme-utils";
import ToolWrapper from "@/components/ToolWrapper";

type FormatType = "text" | "hex" | "binary" | "decimal" | "base64";

const ConverterTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [inputFormat, setInputFormat] = useState<FormatType>("text");
  const [outputFormat, setOutputFormat] = useState<FormatType>("hex");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (input) {
      convert();
    }
  }, [input, inputFormat, outputFormat]);

  const convert = () => {
    try {
      setError(null);
      if (!input.trim()) {
        setOutput("");
        return;
      }

      // First convert input to raw bytes
      let bytes: number[];

      switch (inputFormat) {
        case "text":
          bytes = Array.from(input).map((c) => c.charCodeAt(0));
          break;
        case "hex":
          // Validate hex input
          const hexInput = input.replace(/\s+/g, "");
          if (!/^[0-9A-Fa-f]+$/.test(hexInput)) {
            throw new Error("Invalid hexadecimal input");
          }
          if (hexInput.length % 2 !== 0) {
            throw new Error("Hex string must have an even number of digits");
          }
          bytes = [];
          for (let i = 0; i < hexInput.length; i += 2) {
            bytes.push(parseInt(hexInput.substring(i, i + 2), 16));
          }
          break;
        case "binary":
          // Validate binary input
          const binInput = input.replace(/\s+/g, "");
          if (!/^[01]+$/.test(binInput)) {
            throw new Error("Invalid binary input");
          }
          bytes = [];
          for (let i = 0; i < binInput.length; i += 8) {
            // Pad with zeros if needed for the last byte
            const byte = binInput.substring(i, i + 8).padEnd(8, "0");
            bytes.push(parseInt(byte, 2));
          }
          break;
        case "decimal":
          // Validate decimal input (comma or space separated)
          const decInput = input
            .trim()
            .replace(/,\s*/g, " ")
            .replace(/\s+/g, " ");
          const decValues = decInput.split(" ");
          bytes = [];
          for (const val of decValues) {
            if (!/^\d+$/.test(val)) {
              throw new Error("Invalid decimal input");
            }
            const num = parseInt(val, 10);
            if (num > 255 || num < 0) {
              throw new Error("Decimal values must be between 0 and 255");
            }
            bytes.push(num);
          }
          break;
        case "base64":
          try {
            const decoded = atob(input.trim());
            bytes = Array.from(decoded).map((c) => c.charCodeAt(0));
          } catch (e) {
            throw new Error("Invalid Base64 input");
          }
          break;
        default:
          throw new Error("Invalid input format");
      }

      // Then convert bytes to the output format
      let result: string;
      switch (outputFormat) {
        case "text":
          result = bytes.map((b) => String.fromCharCode(b)).join("");
          break;
        case "hex":
          result = bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
          break;
        case "binary":
          result = bytes.map((b) => b.toString(2).padStart(8, "0")).join(" ");
          break;
        case "decimal":
          result = bytes.map((b) => b.toString(10)).join(" ");
          break;
        case "base64":
          const byteString = bytes.map((b) => String.fromCharCode(b)).join("");
          result = btoa(byteString);
          break;
        default:
          throw new Error("Invalid output format");
      }

      setOutput(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Conversion error");
      setOutput("");
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

  const downloadOutput = () => {
    if (!output) return;

    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted-${outputFormat}-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Output downloaded!");
  };

  const clearInputs = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const swapFormats = () => {
    setInputFormat(outputFormat);
    setOutputFormat(inputFormat);
    setInput(output);
    setOutput("");
  };

  const formatOptions: { label: string; value: FormatType }[] = [
    { label: "Text (ASCII)", value: "text" },
    { label: "Hexadecimal", value: "hex" },
    { label: "Binary", value: "binary" },
    { label: "Decimal", value: "decimal" },
    { label: "Base64", value: "base64" },
  ];

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
            <Binary className={`h-8 w-8 ${toolTheme.primaryIcon}`} />
            <h1 className={`text-3xl font-bold ${toolTheme.headingText}`}>
              Format Converter
            </h1>
          </div>

          <p className={`${toolTheme.bodyText} mb-8`}>
            Convert between multiple data formats including ASCII text,
            hexadecimal, binary, decimal, and Base64. Perfect for CTF challenges
            that involve data encoding and manipulation.
          </p>

          <div className="grid gap-6">
            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-xl ${toolTheme.headingText}`}>
                  Select Input Format
                </CardTitle>
                <CardDescription className={toolTheme.bodyText}>
                  Choose the format of your input data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {formatOptions.map((format) => (
                    <Button
                      key={format.value}
                      variant={
                        inputFormat === format.value ? "default" : "outline"
                      }
                      onClick={() => setInputFormat(format.value)}
                      className={
                        inputFormat === format.value
                          ? "bg-primary text-[#0F1117]"
                          : `${toolTheme.actionButtonClasses}`
                      }
                    >
                      {format.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-xl ${toolTheme.headingText}`}>
                  Input
                </CardTitle>
                <CardDescription className={toolTheme.bodyText}>
                  Enter{" "}
                  {inputFormat === "text"
                    ? "text"
                    : inputFormat === "hex"
                    ? "hexadecimal data"
                    : inputFormat === "binary"
                    ? "binary data"
                    : inputFormat === "decimal"
                    ? "decimal bytes (0-255)"
                    : "Base64 data"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea
                    className={toolTheme.textareaClasses + " h-36"}
                    placeholder={
                      inputFormat === "text"
                        ? "Enter text..."
                        : inputFormat === "hex"
                        ? "Enter hex (e.g. 48656c6c6f)..."
                        : inputFormat === "binary"
                        ? "Enter binary (e.g. 01001000 01100101 01101100 01101100 01101111)..."
                        : inputFormat === "decimal"
                        ? "Enter decimal bytes (e.g. 72 101 108 108 111)..."
                        : "Enter Base64 data..."
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button
                onClick={swapFormats}
                className={`flex items-center gap-2 ${toolTheme.actionButtonClasses}`}
                variant="outline"
              >
                <ArrowDownUp className="h-4 w-4" /> Swap Formats
              </Button>
              <Button
                onClick={clearInputs}
                variant="outline"
                className={`flex items-center gap-2 ${toolTheme.actionButtonClasses}`}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Clear All
              </Button>
            </div>

            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-xl ${toolTheme.headingText}`}>
                  Select Output Format
                </CardTitle>
                <CardDescription className={toolTheme.bodyText}>
                  Choose the format to convert your data to
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {formatOptions.map((format) => (
                    <Button
                      key={format.value}
                      variant={
                        outputFormat === format.value ? "default" : "outline"
                      }
                      onClick={() => setOutputFormat(format.value)}
                      className={
                        outputFormat === format.value
                          ? "bg-primary text-[#0F1117]"
                          : `${toolTheme.actionButtonClasses}`
                      }
                      disabled={format.value === inputFormat}
                    >
                      {format.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle
                  className={`text-xl flex items-center justify-between ${toolTheme.headingText}`}
                >
                  <span>Output</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyToClipboard}
                      disabled={!output}
                      className={toolTheme.iconButtonClasses}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={downloadOutput}
                      disabled={!output}
                      className={toolTheme.iconButtonClasses}
                    >
                      <DownloadCloud className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription className={toolTheme.bodyText}>
                  Converted{" "}
                  {outputFormat === "text"
                    ? "text"
                    : outputFormat === "hex"
                    ? "hexadecimal"
                    : outputFormat === "binary"
                    ? "binary"
                    : outputFormat === "decimal"
                    ? "decimal bytes"
                    : "Base64"}{" "}
                  result
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={toolTheme.resultContainerClasses}>
                    {output || (
                      <span className={toolTheme.placeholderText}>
                        Converted result will appear here...
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={toolTheme.cardBorder}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-xl ${toolTheme.headingText}`}>
                  Format Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-sm space-y-3 ${toolTheme.headingText}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Text (ASCII)</h3>
                      <p>
                        Human-readable text using the ASCII character set. Each
                        character is represented by a byte value from 0-127.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Hexadecimal</h3>
                      <p>
                        Base-16 representation where each byte is represented by
                        two hex digits (00-FF). Commonly used in programming and
                        CTF challenges.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Binary</h3>
                      <p>
                        Base-2 representation using only 0s and 1s. Each byte is
                        represented as 8 bits.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Decimal</h3>
                      <p>
                        Base-10 representation where each byte is a number from
                        0-255.
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="font-medium mb-2">Base64</h3>
                      <p>
                        Encoding scheme that represents binary data using a set
                        of 64 printable ASCII characters. Commonly used for
                        transferring binary data over text-based protocols.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </ToolWrapper>
  );
};

export default ConverterTool;
