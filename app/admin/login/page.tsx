"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage(){
  const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [error,setError]=useState("");const [loading,setLoading]=useState(false);
  async function submit(e:React.FormEvent){e.preventDefault();setLoading(true);setError("");try{const supabase=createClient();const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;window.location.href="/admin";}catch(err){setError(err instanceof Error?err.message:"Não foi possível iniciar sessão.");}finally{setLoading(false);}}
  return <main className="form-wrap"><div style={{maxWidth:480,margin:"auto"}}><Link href="/" className="brand">ALINVEST<span>.</span></Link><div className="form-card"><div className="eyebrow" style={{color:"var(--green)"}}>ÁREA RESERVADA</div><h1>Acesso ao CRM</h1><p>Entre com as credenciais da sua conta administrativa.</p><form onSubmit={submit}><div className="field"><label htmlFor="email">E-mail</label><input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username"/></div><div className="field"><label htmlFor="password">Palavra-passe</label><input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></div>{error&&<div className="error">{error}</div>}<div className="form-actions"><Link className="btn secondary" href="/">Página pública</Link><button className="btn" disabled={loading}>{loading?"A entrar...":"Entrar"}</button></div></form></div></div></main>;
}
