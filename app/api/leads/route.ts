import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const schema = z.object({
  full_name: z.string().trim().min(3).max(160),
  phone: z.string().trim().min(6).max(40),
  email: z.union([z.string().trim().email().max(254), z.literal("")]).optional(),
  city: z.string().trim().max(120).optional(),
  education_level: z.string().max(100).optional(),
  professional_status: z.string().max(100).optional(),
  organization: z.string().max(160).optional(),
  segments: z.array(z.enum(["normas-iso","hsee","negocios-gestao"])).min(1).max(3),
  preferred_mode: z.string().max(60).optional(),
  preferred_schedule: z.string().max(80).optional(),
  consent: z.literal(true),
  source: z.literal("landing_page"),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({error:"Verifique os campos obrigatórios e tente novamente."},{status:400});
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if(!url||!key) return NextResponse.json({error:"O serviço de registo ainda não está configurado."},{status:503});
    const supabase=createClient(url,key,{auth:{persistSession:false}});
    const data=parsed.data;
    const {error}=await supabase.from("leads").insert({
      full_name:data.full_name,phone:data.phone,email:data.email||null,city:data.city||null,
      education_level:data.education_level||null,professional_status:data.professional_status||null,
      organization:data.organization||null,source:"landing_page",consent:true,status:"new",
      selected_segment_slugs:data.segments
    });
    if(error) {
      console.error("Lead insert failed",error.message);
      return NextResponse.json({error:"Não foi possível guardar o registo. Tente novamente mais tarde."},{status:500});
    }
    return NextResponse.json({ok:true},{status:201});
  } catch {
    return NextResponse.json({error:"Pedido inválido."},{status:400});
  }
}
