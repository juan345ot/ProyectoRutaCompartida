"use client";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";


export default function ThemeWrapper({ children }) {
  const { theme } = useTheme();

  const darkStyles = {
    backgroundColor: '#0c4a6e',
    backgroundImage: `
      radial-gradient(circle at 15% 25%, rgba(249, 115, 22, 0.5) 0%, transparent 50%),
      radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.4) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%)
    `,
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    '--card-bg': '#ffffff',
    '--card-text': '#0f172a',
    '--card-text-muted': '#4b5563',
    '--card-border': 'rgba(255, 255, 255, 0.2)',
    '--page-text': '#f0f9ff',
  };

  const lightStyles = {
    backgroundColor: '#ffffff',
    backgroundImage: `
      radial-gradient(circle at 15% 25%, rgba(249, 115, 22, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.05) 0%, transparent 50%)
    `,
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    '--card-bg': '#0284c7',
    '--card-text': '#ffffff',
    '--card-text-muted': '#e0f2fe',
    '--card-border': 'rgba(14, 165, 233, 0.2)',
    '--page-text': '#0f172a',
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const currentStyles = theme === 'dark' ? darkStyles : lightStyles;
  const initialStyles = lightStyles; // Default for SSR

  return (
    <div 
      style={mounted ? currentStyles : initialStyles} 
      className="transition-colors duration-500"
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
