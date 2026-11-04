"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const segments = [
  { slug: "normas-iso", name: "Normas ISO", detail: "Sistemas de gestão, auditoria e certificação" },
  { slug: "hsee", name: "HSEE", detail: "Higiene, Segurança, Saúde e Ambiente" },
  { slug: "negocios-gestao", name: "Negócios / Gestão", detail: "Gestão empresarial, liderança e administração" },
];
const statuses = ["Estudante", "Trabalhador por conta de outrem", "Trabalhador por conta própria", "Empresário / Gestor", "À procura de emprego", "Outro"];

function InterestForm() {
  const params = useSearchParams();
  const initial = params.get("segmento") ?? "";
  const [selected, setSelected] = useState<string[]>(segments.some(s=>s.slug===initial) ? [initial] : []);
  const [values, setValues] = useState({full_name:"",email:"",phone:"",city:"",education_level:"",professional_status:"",organization:"",preferred_mode:"",preferred_schedule:""});
  const [consent,setConsent] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [done,setDone] = useState(false);
  function update(e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) { setValues(v=>({...v,[e.target.name]:e.target.value})); }
  function toggle(slug:string) { setSelected(old=>old.includes(slug)?old.filter(x=>x!==slug):[...old,slug]); }
  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    if (!selected.length) { setError("Seleccione pelo menos uma área de interesse."); return; }
    if (!consent) { setError("É necessário autorizar o tratamento dos dados para podermos responder ao seu pedido."); return; }
    setLoading(true);
    try {
      const response=await fetch("/api/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...values,segments:selected,consent,source:"landing_page"})});
      const data=await response.json();
      if(!response.ok) throw new Error(data.error || "Não foi possível registar o seu interesse.");
      setDone(true);
    } catch(err) { setError(err instanceof Error?err.message:"Ocorreu um erro. Tente novamente."); }
    finally { setLoading(false); }
  }
  return <main className="form-wrap"><div style={{maxWidth:720,margin:"auto"}}><Link href="/" className="brand">ALINVEST<span>.</span></Link><div className="form-card">{done?<div className="success"><div className="success-mark">✓</div><div className="eyebrow" style={{color:"var(--green)"}}>PEDIDO RECEBIDO</div><h1>Obrigado pelo seu interesse!</h1><p>A sua manifestação foi enviada à equipa ALINVEST. Poderemos entrar em contacto para partilhar informações sobre as formações seleccionadas.</p><Link className="btn" href="/">Voltar à página inicial</Link></div>:<><div className="eyebrow" style={{color:"var(--green)"}}>ALINVEST · MANIFESTAÇÃO DE INTERESSE</div><h1>Vamos conhecer os seus objectivos.</h1><p>Preencha os seus dados e indique as áreas de formação que gostaria de explorar. Este registo não representa uma inscrição ou obrigação de pagamento.</p><form onSubmit={submit}><h3 style={{color:"var(--navy)",marginTop:28}}>Em que áreas tem interesse?</h3><div className="choice-grid">{segments.map(s=><button type="button" key={s.slug} onClick={()=>toggle(s.slug)} className={`choice ${selected.includes(s.slug)?"active":""}`}><strong>{s.name} {selected.includes(s.slug)?"✓":""}</strong><small>{s.detail}</small></button>)}</div>
    <div className="field"><label htmlFor="full_name">Nome completo *</label><input id="full_name" name="full_name" value={values.full_name} onChange={update} required minLength={3} autoComplete="name" /></div>
    <div className="field"><label htmlFor="phone">Telefone / WhatsApp *</label><input id="phone" name="phone" value={values.phone} onChange={update} required autoComplete="tel" placeholder="+258 ..." /></div>
    <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" value={values.email} onChange={update} autoComplete="email" /></div>
    <div className="field"><label htmlFor="city">Cidade / Província</label><input id="city" name="city" value={values.city} onChange={update} /></div>
    <div className="field"><label htmlFor="education_level">Nível de formação</label><select id="education_level" name="education_level" value={values.education_level} onChange={update}><option value="">Seleccione</option>{["Ensino básico","Ensino secundário","Técnico-profissional","Licenciatura","Pós-graduação / Mestrado","Doutoramento","Outro"].map(x=><option key={x}>{x}</option>)}</select></div>
    <div className="field"><label htmlFor="professional_status">Situação profissional</label><select id="professional_status" name="professional_status" value={values.professional_status} onChange={update}><option value="">Seleccione</option>{statuses.map(x=><option key={x}>{x}</option>)}</select></div>
    <div className="field"><label htmlFor="organization">Empresa / Organização (opcional)</label><input id="organization" name="organization" value={values.organization} onChange={update} /></div>
    <div className="field"><label htmlFor="preferred_mode">Modalidade preferida</label><select id="preferred_mode" name="preferred_mode" value={values.preferred_mode} onChange={update}><option value="">Sem preferência definida</option><option>Presencial</option><option>Online</option><option>Híbrida</option></select></div>
    <div className="field"><label htmlFor="preferred_schedule">Disponibilidade</label><select id="preferred_schedule" name="preferred_schedule" value={values.preferred_schedule} onChange={update}><option value="">A definir</option><option>Durante a semana</option><option>Fins de semana</option><option>Período laboral</option><option>Período pós-laboral</option><option>Flexível</option></select></div>
    <label style={{display:"flex",alignItems:"flex-start",gap:10,fontSize:12,lineHeight:1.6,color:"var(--muted)",marginTop:22}}><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} style={{marginTop:3}}/> Autorizo a ALINVEST a utilizar os dados fornecidos para responder ao meu pedido e enviar informações relacionadas com as formações do meu interesse. *</label>
    {error&&<div className="error" role="alert">{error}</div>}
    <div className="form-actions"><Link href="/" className="btn secondary">Voltar</Link><button className="btn" type="submit" disabled={loading}>{loading?"A enviar...":"Enviar manifestação de interesse"}</button></div>
  </form></>}</div></div></main>;
}
export default function InterestPage(){return <Suspense fallback={<main className="form-wrap">A carregar formulário...</main>}><InterestForm/></Suspense>}
