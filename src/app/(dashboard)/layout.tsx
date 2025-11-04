import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/sidebar";
import { PageTransition } from "@/components/layout/page-transition";

export const metadata: Metadata = {
  title: {
    default: "Sistema de Gestión Inmobiliaria",
    template: "%s | Gestión Inmobiliaria"
  },
  description: "Plataforma completa para la gestión de propiedades inmobiliarias, edificios, departamentos, contratos y clientes",
  keywords: ["inmobiliaria", "gestión", "propiedades", "edificios", "departamentos", "contratos", "alquileres"],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Sin fondo, solo texto */}
        <Sidebar />
        
        {/* Main Content - Con fondo glass effect */}
        <main className="flex-1 overflow-y-auto glass-scrollbar pt-16 lg:pt-0">
          <div className="h-full p-4 lg:p-8">
            <div className="h-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-4 lg:p-8 overflow-y-auto glass-scrollbar">
              <PageTransition>
                {children}
              </PageTransition>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
