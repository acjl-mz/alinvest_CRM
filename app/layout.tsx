import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALINVEST | Formação e Desenvolvimento",
  description: "Descubra formações profissionais nas áreas de Normas ISO, HSEE e Negócios e Gestão.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt"><body>{children}</body></html>;
}
