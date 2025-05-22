"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type SidebarContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // Start with sidebar closed by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const hasInitialized = useRef(false);

  // Initialize sidebar state based on path and screen width
  useEffect(() => {
    if (!hasInitialized.current) {
      // Only run this effect once on initial component mount
      hasInitialized.current = true;
      
      // Default states based on path and device
      if (pathname?.startsWith("/tools/") && pathname !== "/tools") {
        if (window.innerWidth >= 1024) {
          // On desktop, show sidebar for tool pages
          setIsSidebarOpen(true);
        } else {
          // On mobile, keep it closed
          setIsSidebarOpen(false);
        }
      } else {
        // For other pages, keep sidebar closed
        setIsSidebarOpen(false);
      }
    }
  }, [pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (window.innerWidth < 1024) {
        const sidebar = document.getElementById("main-sidebar");
        const toggleButton = document.getElementById("sidebar-toggle");
        
        if (
          sidebar &&
          !sidebar.contains(e.target as Node) &&
          toggleButton &&
          !toggleButton.contains(e.target as Node) &&
          isSidebarOpen
        ) {
          setIsSidebarOpen(false);
        }
      }
    };
    
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    console.log("Toggling sidebar, current state:", isSidebarOpen);
    setIsSidebarOpen(prev => !prev);
  };
  
  const closeSidebar = () => setIsSidebarOpen(false);
  const openSidebar = () => setIsSidebarOpen(true);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebar, openSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}