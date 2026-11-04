import { notFound } from "next/navigation";
import type { Metadata } from "next";
import InterestForm from "../InterestForm";

const segments: Record<string, { name: string; description: string }> = {
  "normas-iso": { name: "Normas ISO", description: "Manifeste o seu interesse nas formações de Normas ISO da ALINVEST." },
  "hsee": { name: "HSEE", description: "Manifeste o seu interesse nas formações de Higiene, Segurança, Saúde e Ambiente da ALINVEST." },
  "negocios-gestao": { name: "Negócios / Gestão", description: "Manifeste o seu interesse nas formações de Negócios e Gestão da ALINVEST." },
};

export async function generateMetadata({ params }: { params: Promise<{ segmento: string }> }): Promise<Metadata> {
  const { segmento } = await params;
  const item = segments[segmento];
  if (!item) return { title: "Formação | ALINVEST" };
  return { title: `Interesse em ${item.name} | ALINVEST`, description: item.description };
}

export default async function SegmentInterestPage({ params }: { params: Promise<{ segmento: string }> }) {
  const { segmento } = await params;
  if (!segments[segmento]) notFound();
  return <InterestForm initialSegment={segmento} />;
}
