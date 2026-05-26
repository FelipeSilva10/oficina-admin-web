// src/app/layout.tsx — root layout
// Deve conter apenas <html> e <body> + providers globais.
// A navegação do painel fica em src/app/(dashboard)/layout.tsx,
// que só é aplicada às rotas dentro do route group (dashboard).

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "SAG — Sistema de Aulas e Gestão",
  description: "Plataforma de gestão escolar — Oficina do Amanhã",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { fontSize: "13px", borderRadius: "10px" },
            success: { duration: 3000 },
            error:   { duration: 4000 },
          }}
        />
      </body>
    </html>
  );
}