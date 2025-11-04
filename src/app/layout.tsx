import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { AuthProvider } from "@/hooks/useAuth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sistema de Gestión Inmobiliaria",
    template: "%s | Gestión Inmobiliaria"
  },
  description: "Plataforma completa para la gestión de propiedades inmobiliarias, edificios, departamentos, contratos y clientes",
  keywords: ["inmobiliaria", "gestión", "propiedades", "edificios", "departamentos", "contratos", "alquileres"],
  authors: [{ name: "Sistema Inmobiliaria" }],
  creator: "Sistema Inmobiliaria",
  publisher: "Sistema Inmobiliaria",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    title: "Sistema de Gestión Inmobiliaria",
    description: "Plataforma completa para la gestión de propiedades inmobiliarias",
    siteName: "Gestión Inmobiliaria",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
