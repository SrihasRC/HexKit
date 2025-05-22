"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";

export function ThemeProvider({ children, ...props }: any) {
  // Force dark mode and disable theme switching
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <NextThemesProvider {...props} forcedTheme="dark" disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}