import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SidebarWrapper from "@/components/SidebarWrapper";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/sidebar-provider";
import Footer from "@/components/Footer";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HexKit",
  description:
    "A collection of essential tools for solving Capture The Flag challenges including encoders, decoders, ciphers and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable} font-mono antialiased min-h-screen overflow-x-hidden bg-[#0F1117] text-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
        >
          <SidebarProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex flex-1 relative overflow-hidden">
                  <SidebarWrapper />
                  <main className="flex-1 relative w-full">{children}</main>
                </div>
                <Footer />
              </div>
              <Toaster position="bottom-right" />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}