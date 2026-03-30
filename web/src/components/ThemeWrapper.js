"use client";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeWrapper({ children }) {
  const { theme } = useTheme();

  const darkStyles = {
    backgroundColor: '#0ea5e9',
    backgroundImage: `
      radial-gradient(circle at 15% 25%, rgba(249, 115, 22, 0.6) 0%, transparent 50%),
      radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.5) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 60%)
    `,
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    '--card-bg': '#ffffff',
    '--card-text': '#1f2937',
    '--card-text-muted': '#4b5563',
    '--card-border': 'rgba(255, 255, 255, 0.2)',
    '--page-text': '#0c4a6e',
  };

  const lightStyles = {
    backgroundColor: '#ffffff',
    backgroundImage: `
      radial-gradient(circle at 15% 25%, rgba(249, 115, 22, 0.2) 0%, transparent 40%),
      radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.05) 0%, transparent 50%)
    `,
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    '--card-bg': '#0ea5e9',
    '--card-text': '#ffffff',
    '--card-text-muted': '#f0f9ff',
    '--card-border': 'rgba(14, 165, 233, 0.1)',
    '--page-text': '#0f172a',
  };

  const currentStyles = theme === 'dark' ? darkStyles : lightStyles;

  return (
    <div style={currentStyles} className="transition-colors duration-500">
      {children}
    </div>
  );
}
