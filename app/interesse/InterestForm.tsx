"use client";

import Link from "next/link";
import { useState } from "react";

const segments = [
  { slug: "normas-iso", name: "Normas ISO", detail: "Sistemas de gestão, auditoria e certificação" },
  { slug: "hsee", name: "HSEE", detail: "Higiene, Segurança, Saúde e Ambiente" },
  { slug: "negocios-gestao", name: "Negócios / Gestão", detail: "Gestão empresarial, liderança e administração" },
];
const statuses = ["Estudante", "Trabalhador por conta de outrem", "Trabalhador por conta própria", "Empresário / Gestor", "À procura de emprego", "Outro"];

export default function InterestForm({ initialSegment = "" }: { initialSegment?: string }) {
  const campaignSegment = segments.some(s => s.slug === initialSegment) ? initialSegment : "";
  const visibleSegments = campaignSegment ? segments.filter(s => s.slug === campaignSegment) : segments;
  const [selected, setSelected] = useState<string[]>(campaignSegment ? [campaignSegment] : []);
  const [values, setValues] = useState({full_name:"",email:"",phone:"",city:"",education_level:"",professional_status:"",organization:"",preferred_mode:"",preferred_schedule:""});
  const [consent,setConsent] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [done,setDone] = useState(false);
  function update(e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) { setValues(v=>({...v,[e.target.name]:e.target.value})); }
  function toggle(slug:string) { if (campaignSegment) return; setSelected(old=>old.includes(slug)?old.filter(x=>x!==slug):[...old,slug]); }
  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    if (!selected.length) { setError("Seleccione pelo menos uma área de interesse."); return; }
    if (!consent) { setError("É necessário autorizar o tratamento dos dados para podermos responder ao seu pedido."); return; }
    setLoading(true);
    try {
      const response=await fetch("/api/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...values,segments:selected,campaign_segment:campaignSegment || undefined,consent,source:"landing_page"})});
      const data=await response.json();
      if(!response.ok) throw new Error(data.error || "Não foi possível registar o seu interesse.");
      setDone(true);
    } catch(err) { setError(err instanceof Error?err.message:"Ocorreu um erro. Tente novamente."); }
    finally { setLoading(false); }
  }
  return <main className="form-wrap">
    <div className="form-topbar"><div className="form-topbar-inner">
      <Link href="/" className="brand">ALINVEST<span>.</span></Link>
      <span className="form-topbar-note">Formação profissional · Manifestação de interesse</span>
    </div></div>
    <section className="form-hero"><div className="form-hero-inner">
      <div className="eyebrow">ALINVEST · FORMAÇÃO E DESENVOLVIMENTO</div>
      <h1>O próximo passo da sua evolução começa aqui.</h1>
      <p>Partilhe connosco os seus interesses e objectivos. A nossa equipa irá apresentar-lhe informações sobre as formações mais relevantes para o seu percurso.</p>
    </div></section>
    <div className="form-layout">
      <aside className="form-aside">
        <div className="eyebrow">Antes de começar</div>
        <h2>Uma manifestação de interesse, sem compromisso.</h2>
        <p>Este formulário permite-nos compreender o que procura e entrar em contacto com informação adequada.</p>
        <div className="form-aside-list">
          <div className="form-aside-item"><span className="form-aside-number">1</span><span><strong>Indique as áreas</strong><br/>Escolha uma ou mais áreas de formação.</span></div>
          <div className="form-aside-item"><span className="form-aside-number">2</span><span><strong>Partilhe os seus contactos</strong><br/>Para podermos responder ao seu pedido.</span></div>
          <div className="form-aside-item"><span className="form-aside-number">3</span><span><strong>Receba informação</strong><br/>A equipa ALINVEST dará seguimento.</span></div>
        </div>
      </aside>
      <section className="form-card">
        {done ? <div className="success">
          <div className="success-mark">✓</div><div className="eyebrow">PEDIDO RECEBIDO</div>
          <h1>Obrigado pelo seu interesse!</h1>
          <p>A sua manifestação foi enviada à equipa ALINVEST. Poderemos entrar em contacto para partilhar informações sobre as formações seleccionadas.</p>
          <Link className="btn" href="/">Voltar à página inicial</Link>
        </div> : <>
          <div className="eyebrow">FORMULÁRIO DE INTERESSE</div>
          <h1>Vamos conhecer os seus objectivos.</h1>
          <p>Preencha os campos abaixo. Os campos assinalados com * são obrigatórios.</p>
          <form onSubmit={submit}>
            <div className="form-section-title"><span>01</span><h3>Áreas de formação</h3></div>
            <p className="muted">{campaignSegment ? "Área de formação seleccionada nesta campanha:" : "Em que áreas gostaria de desenvolver competências?"}</p>
            <div className="choice-grid">{visibleSegments.map(s=><button type="button" key={s.slug} onClick={()=>toggle(s.slug)} aria-pressed={selected.includes(s.slug)} className={`choice ${selected.includes(s.slug)?"active":""}`}>
              <strong>{s.name} {s.slug===campaignSegment?"· Campanha":selected.includes(s.slug)?"✓":""}</strong><small>{s.detail}</small>
            </button>)}</div>

            <div className="form-section-title"><span>02</span><h3>Os seus contactos</h3></div>
            <div className="field"><label htmlFor="full_name">Nome completo *</label><input id="full_name" name="full_name" value={values.full_name} onChange={update} required minLength={3} autoComplete="name" placeholder="O seu nome e apelido"/></div>
            <div className="form-grid-two">
              <div className="field"><label htmlFor="phone">Telefone / WhatsApp *</label><input id="phone" name="phone" value={values.phone} onChange={update} required autoComplete="tel" placeholder="+258 ..."/></div>
              <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" value={values.email} onChange={update} autoComplete="email" placeholder="nome@exemplo.com"/></div>
            </div>
            <div className="field"><label htmlFor="city">Cidade / Província</label><input id="city" name="city" value={values.city} onChange={update} placeholder="Ex.: Maputo"/></div>

            <div className="form-section-title"><span>03</span><h3>O seu perfil e disponibilidade</h3></div>
            <div className="form-grid-two">
              <div className="field"><label htmlFor="education_level">Nível de formação</label><select id="education_level" name="education_level" value={values.education_level} onChange={update}><option value="">Seleccione</option>{["Ensino básico","Ensino secundário","Técnico-profissional","Licenciatura","Pós-graduação / Mestrado","Doutoramento","Outro"].map(x=><option key={x}>{x}</option>)}</select></div>
              <div className="field"><label htmlFor="professional_status">Situação profissional</label><select id="professional_status" name="professional_status" value={values.professional_status} onChange={update}><option value="">Seleccione</option>{statuses.map(x=><option key={x}>{x}</option>)}</select></div>
            </div>
            <div className="field"><label htmlFor="organization">Empresa / Organização (opcional)</label><input id="organization" name="organization" value={values.organization} onChange={update} placeholder="Nome da organização"/></div>
            <div className="form-grid-two">
              <div className="field"><label htmlFor="preferred_mode">Modalidade preferida</label><select id="preferred_mode" name="preferred_mode" value={values.preferred_mode} onChange={update}><option value="">Sem preferência definida</option><option>Presencial</option><option>Online</option><option>Híbrida</option></select></div>
              <div className="field"><label htmlFor="preferred_schedule">Disponibilidade</label><select id="preferred_schedule" name="preferred_schedule" value={values.preferred_schedule} onChange={update}><option value="">A definir</option><option>Durante a semana</option><option>Fins de semana</option><option>Período laboral</option><option>Período pós-laboral</option><option>Flexível</option></select></div>
            </div>
            <label className="consent-label"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> <span>Autorizo a ALINVEST a utilizar os dados fornecidos para responder ao meu pedido e enviar informações relacionadas com as formações do meu interesse. *</span></label>
            {error&&<div className="error" role="alert">{error}</div>}
            <div className="form-actions"><Link href="/" className="btn secondary">Voltar</Link><button className="btn" type="submit" disabled={loading}>{loading?"A enviar...":"Enviar manifestação de interesse"}</button></div>
          </form>
          <p className="form-footnote">Os seus dados serão utilizados apenas para o seguimento deste pedido, nos termos da autorização prestada.</p>
        </>}
      </section>
    </div>
  </main>;
}
