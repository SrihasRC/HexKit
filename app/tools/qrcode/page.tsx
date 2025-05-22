"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Scan, Download, Save, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { toolTheme } from "../theme-utils";
import ToolWrapper from "@/components/ToolWrapper";

const QRCodeTool = () => {
  const [input, setInput] = useState("");
  const [size, setSize] = useState(300);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<
    "L" | "M" | "Q" | "H"
  >("M");
  const [qrCodeData, setQrCodeData] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (input) {
      generateQRCode();
    } else {
      setQrCodeData("");
    }
  }, [input, size, color, bgColor, errorCorrectionLevel]);

  const generateQRCode = async () => {
    try {
      if (!input) return;

      // Generate QR code as data URL for preview
      const dataUrl = await QRCode.toDataURL(input, {
        width: size,
        margin: 1,
        color: {
          dark: color,
          light: bgColor,
        },
        errorCorrectionLevel,
      });

      setQrCodeData(dataUrl);

      // Draw to canvas for more advanced operations
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, input, {
          width: size,
          margin: 1,
          color: {
            dark: color,
            light: bgColor,
          },
          errorCorrectionLevel,
        });
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeData) return;

    const link = document.createElement("a");
    link.href = qrCodeData;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("QR code downloaded!");
  };

  const copyQRCodeToClipboard = async () => {
    if (!qrCodeData) return;

    try {
      const blob = await fetch(qrCodeData).then((r) => r.blob());
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      toast.success("QR code copied to clipboard!");
    } catch (error) {
      console.error("Error copying QR code:", error);
      toast.error("Failed to copy QR code to clipboard");
    }
  };

  const clearInput = () => {
    setInput("");
    setQrCodeData("");
  };

  const presetSizes = [100, 200, 300, 400, 500];

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
            <Scan className={`h-8 w-8 ${toolTheme.primaryIcon}`} />
            <h1 className={`text-3xl font-bold ${toolTheme.headingText}`}>
              QR Code Generator
            </h1>
          </div>

          <p className={`${toolTheme.bodyText} mb-8`}>
            Generate QR codes from text, URLs, or data. Useful for quickly
            creating scannable codes for CTF challenges.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className={toolTheme.cardBorder}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-xl ${toolTheme.headingText}`}>
                    Input
                  </CardTitle>
                  <CardDescription className={toolTheme.bodyText}>
                    Enter text, URL, or data to encode
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <textarea
                      className={toolTheme.textareaClasses + " h-36"}
                      placeholder="Enter text or URL here..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearInput}
                      className={`${toolTheme.actionButtonClasses} flex items-center gap-1`}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className={toolTheme.cardBorder}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-xl ${toolTheme.headingText}`}>
                    Options
                  </CardTitle>
                  <CardDescription className={toolTheme.bodyText}>
                    Customize your QR code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className={`text-sm ${toolTheme.bodyText} block`}>
                        Size: {size}px
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="100"
                          max="500"
                          step="10"
                          value={size}
                          onChange={(e) => setSize(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {presetSizes.map((presetSize) => (
                          <Button
                            key={presetSize}
                            variant="outline"
                            size="sm"
                            onClick={() => setSize(presetSize)}
                            className={
                              size === presetSize
                                ? "bg-primary/20 text-white"
                                : `${toolTheme.actionButtonClasses}`
                            }
                          >
                            {presetSize}px
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          className={`text-sm ${toolTheme.bodyText} block`}
                        >
                          Foreground Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="h-8 w-12 rounded border border-[#2a2c37]"
                          />
                          <input
                            type="text"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className={`p-2 ${toolTheme.inputBg} border-[#2a2c37] rounded-md focus:border-primary/50 focus:ring-0 focus:outline-none font-mono text-sm text-white`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          className={`text-sm ${toolTheme.bodyText} block`}
                        >
                          Background Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="h-8 w-12 rounded border border-[#2a2c37]"
                          />
                          <input
                            type="text"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className={`p-2 ${toolTheme.inputBg} border-[#2a2c37] rounded-md focus:border-primary/50 focus:ring-0 focus:outline-none font-mono text-sm text-white`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`text-sm ${toolTheme.bodyText} block`}>
                        Error Correction Level
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(["L", "M", "Q", "H"] as const).map((level) => (
                          <Button
                            key={level}
                            variant="outline"
                            size="sm"
                            onClick={() => setErrorCorrectionLevel(level)}
                            className={
                              errorCorrectionLevel === level
                                ? "bg-primary/20 text-white"
                                : `${toolTheme.actionButtonClasses}`
                            }
                          >
                            {level} -{" "}
                            {level === "L"
                              ? "7%"
                              : level === "M"
                              ? "15%"
                              : level === "Q"
                              ? "25%"
                              : "30%"}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className={toolTheme.cardBorder}>
                <CardHeader className="pb-3">
                  <CardTitle
                    className={`text-xl flex items-center justify-between ${toolTheme.headingText}`}
                  >
                    <span>QR Code</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyQRCodeToClipboard}
                        disabled={!qrCodeData}
                        className={toolTheme.iconButtonClasses}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={downloadQRCode}
                        disabled={!qrCodeData}
                        className={toolTheme.iconButtonClasses}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription className={toolTheme.bodyText}>
                    Scan with a QR code reader
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`flex items-center justify-center p-4 ${toolTheme.inputBg} ${toolTheme.cardBorder} rounded-md min-h-[350px]`}
                  >
                    {qrCodeData ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={qrCodeData}
                          alt="QR Code"
                          className="max-w-full"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        <div
                          className={`mt-4 text-sm ${toolTheme.bodyText} text-center`}
                        >
                          {input.length > 30
                            ? `${input.substring(0, 30)}...`
                            : input}
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`${toolTheme.placeholderText} text-center`}
                      >
                        QR code will appear here
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </ToolWrapper>
  );
}

export default QRCodeTool;
