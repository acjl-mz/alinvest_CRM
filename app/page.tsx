import Link from "next/link";

const segments = [
  { number: "01", title: "Normas ISO", description: "Desenvolva competências em sistemas de gestão, implementação, auditoria e melhoria contínua.", slug: "normas-iso" },
  { number: "02", title: "HSEE", description: "Aprofunde conhecimentos em Higiene, Segurança, Saúde e Ambiente para contextos profissionais.", slug: "hsee" },
  { number: "03", title: "Negócios / Gestão", description: "Prepare-se para gerir organizações, liderar equipas e transformar oportunidades em resultados.", slug: "negocios-gestao" },
];

export default function HomePage() {
  return <main>
    <header className="site-header"><Link href="/" className="brand">ALINVEST<span>.</span></Link><nav className="nav-links"><a href="#formacao">Áreas de formação</a><a href="#sobre">Sobre</a><a href="#contacto">Contactos</a></nav><Link className="nav-cta" href="/interesse">Tenho interesse</Link></header>
    <section className="hero"><div className="hero-inner"><div><div className="eyebrow">FORMAÇÃO · COMPETÊNCIAS · FUTURO</div><h1>O próximo passo da sua carreira começa com conhecimento.</h1><p>Encontre oportunidades de aprendizagem para desenvolver competências, fortalecer o seu perfil profissional e preparar-se para novos desafios.</p><Link className="btn" href="/interesse">Explore as formações <span>→</span></Link></div><div className="hero-art"><div className="art-top">ALINVEST · DESENVOLVIMENTO PROFISSIONAL</div><div className="art-big">Aprender hoje. Transformar amanhã.</div><div className="art-tags"><span>Normas ISO</span><span>HSEE</span><span>Negócios & Gestão</span></div></div></div></section>
    <section className="section" id="formacao"><div className="section-head"><div className="eyebrow" style={{color:"var(--green)"}}>ÁREAS DE FORMAÇÃO</div><h2>Conhecimento aplicado às exigências do mercado.</h2><p>Explore os nossos segmentos de formação e manifeste o seu interesse. A nossa equipa poderá ajudá-lo a identificar a opção mais adequada aos seus objectivos.</p></div><div className="segments">{segments.map(s=><article className="segment-card" key={s.slug}><div className="segment-index">{s.number} / ALINVEST</div><h3>{s.title}</h3><p>{s.description}</p><Link href={`/interesse?segmento=${s.slug}`}>Tenho interesse nesta área →</Link></article>)}</div></section>
    <section className="cta-band" id="sobre"><div className="cta-inner"><div><h2>Invista nas suas competências.</h2><p>Partilhe connosco os seus interesses e receba informações sobre próximas formações.</p></div><Link className="btn" href="/interesse">Manifestar interesse</Link></div></section>
    <footer className="footer" id="contacto"><div className="footer-inner"><strong>ALINVEST · Formação e Desenvolvimento</strong><span>Normas ISO · HSEE · Negócios / Gestão</span><span>© {new Date().getFullYear()} ALINVEST</span></div></footer>
  </main>;
}
