import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precios y Planes",
  description: "Elige el plan perfecto para tu negocio inmobiliario. Desde planes gratuitos hasta soluciones enterprise con IA.",
  keywords: ["precios", "planes", "inmobiliaria", "suscripción", "premium", "enterprise"],
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
