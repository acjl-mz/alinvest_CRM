import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  full_name: z.string().trim().min(3).max(160),
  phone: z.string().trim().min(6).max(40),
  email: z.union([z.string().trim().email().max(254), z.literal("")]).optional(),
  city: z.string().trim().max(120).optional(),
  education_level: z.string().max(100).optional(),
  professional_status: z.string().max(100).optional(),
  organization: z.string().max(160).optional(),
  segments: z.array(z.enum(["normas-iso", "hsee", "negocios-gestao"])).min(1).max(3),
  campaign_segment: z.enum(["normas-iso", "hsee", "negocios-gestao"]).optional(),
  preferred_mode: z.string().max(60).optional(),
  preferred_schedule: z.string().max(80).optional(),
  consent: z.literal(true),
  source: z.literal("landing_page"),
  website: z.string().max(0).optional(),
}).superRefine((data, ctx) => {
  if (data.campaign_segment && (data.segments.length !== 1 || data.segments[0] !== data.campaign_segment)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["segments"], message: "A campanha só pode registar o segmento de origem." });
  }
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Verifique os campos obrigatórios e tente novamente." }, { status: 400 });
    const data = parsed.data;
    if (data.website) return NextResponse.json({ ok: true });
    const webhookUrl = process.env.ALINVEST_EMAIL_WEBHOOK_URL;
    const webhookSecret = process.env.ALINVEST_WEBHOOK_SECRET;
    if (!webhookUrl || !webhookSecret) return NextResponse.json({ error: "O serviço de recepção ainda não está configurado." }, { status: 503 });

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({ ...data, secret: webhookSecret, submitted_at: new Date().toISOString() }),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.ok !== true) {
      console.error("ALINVEST email webhook failed", response.status);
      return NextResponse.json({ error: "Não foi possível enviar o seu pedido. Tente novamente mais tarde." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ALINVEST notification error", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Ocorreu um problema no envio. Tente novamente." }, { status: 502 });
  }
}
