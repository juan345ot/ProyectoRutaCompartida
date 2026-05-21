/**
 * Layout raíz de Next.js: fuentes, metadata PWA, scripts externos
 * (Google Sign-In y Maps) y envoltorio ClientLayout para toda la app.
 */
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "Ruta Compartida - Viaja y Transporta",
  description: "Conectamos tu viaje. Encuentra lugar para vos o para tus paquetes al mejor precio.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ruta Compartida",
  },
};

export const viewport = {
  themeColor: "#14b8a6",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable} font-sans flex flex-col min-h-screen`}>
        {/* SDK de login con Google */}
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
        {/* API de Google Maps con librería Places para autocompletado */}
        <Script src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`} strategy="beforeInteractive" />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

