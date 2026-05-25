import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flitrhub — Servicios para adultos",
  description: "Plataforma de servicios para adultos en Bogotá",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
