import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plataforma Inmobiliaria con IA",
  description: "La plataforma todo-en-uno para inmobiliarias modernas. Automatiza, optimiza y crece con inteligencia artificial.",
  keywords: ["inmobiliaria", "IA", "chatbot", "gestión", "propiedades", "CRM", "automatización"],
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
