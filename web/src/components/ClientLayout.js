"use client";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import ThemeWrapper from "@/components/ThemeWrapper";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemeWrapper>
          <Navbar />
          <Toaster 
            position="top-right" 
            toastOptions={{
               style: {
                 background: 'var(--card-bg)',
                 color: 'var(--card-text)',
                 borderRadius: '16px',
                 border: '1px solid var(--border-color)',
                 boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
               },
            }}
          />
          <main className="grow pt-16">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
          <Footer />
        </ThemeWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}
