"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import InterestForm from "./InterestForm";

function GeneralInterestForm() {
  const params = useSearchParams();
  return <InterestForm initialSegment={params.get("segmento") ?? ""} />;
}

export default function InterestPage() {
  return <Suspense fallback={<main className="form-wrap">A carregar formulário...</main>}><GeneralInterestForm /></Suspense>;
}
