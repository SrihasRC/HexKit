"use client";
import { useSidebar } from "./sidebar-provider";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface ToolWrapperProps {
  children: React.ReactNode;
}

const ToolWrapper = ({ children }: ToolWrapperProps) => {
  const { isSidebarOpen } = useSidebar();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkScreenSize = () => {
        setIsLargeScreen(window.innerWidth >= 1024);
      };
      checkScreenSize();
      
      window.addEventListener('resize', checkScreenSize);
    
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, []);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div 
      ref={wrapperRef}
      className={`relative w-full overflow-x-hidden transition-all duration-300 ease-in-out
        ${(isSidebarOpen && isLargeScreen) ? 'lg:pl-64' : ''}`}
    >
      <motion.div 
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        layout="position"
      >
        <div className="max-w-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default ToolWrapper