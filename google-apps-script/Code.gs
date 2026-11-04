function authorizeMail() {
  MailApp.getRemainingDailyQuota();
  UrlFetchApp.fetch("https://raw.githubusercontent.com/acjl-mz/alinvest_CRM/main/public/brand/alinvest-logo.png");
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return respond({ok:false});
    var p = JSON.parse(e.postData.contents);
    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty("ALINVEST_WEBHOOK_SECRET");
    var recipient = "alinvest.corporate@gmail.com";
    if (!secret || p.secret !== secret) return respond({ok:false});
    var allowed = ["normas-iso", "hsee", "negocios-gestao"];
    if (!p.consent || p.source !== "landing_page" || !p.full_name || !p.phone ||
        (p.campaign_segment && allowed.indexOf(p.campaign_segment) < 0) ||
        !Array.isArray(p.segments) || p.segments.length < 1 || p.segments.length > 3 ||
        !p.segments.every(function(s){return allowed.indexOf(s) >= 0;}) ||
        (p.campaign_segment && (p.segments.length !== 1 || p.segments[0] !== p.campaign_segment))) return respond({ok:false});

    var names = {"normas-iso":"Normas ISO","hsee":"HSEE","negocios-gestao":"Negócios / Gestão"};
    var segment = p.campaign_segment || p.segments[0];
    var segmentName = names[segment] || "Interesse geral";
    var esc = function(v){return String(v == null ? "" : v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");};
    var fields = [
      ["Nome completo",p.full_name],["Telefone / WhatsApp",p.phone],["E-mail",p.email],
      ["Cidade / Província",p.city],["Situação profissional",p.professional_status],["Empresa / Organização",p.organization],
      ["Modalidade preferida",p.preferred_mode],["Disponibilidade",p.preferred_schedule]
    ];
    var contactRows = fields.slice(0,3).filter(function(f){return f[1];}).map(function(f){
      return "<tr><td style='padding:11px 13px;border-bottom:1px solid #e8edf1;color:#64717e;font-size:12px;width:38%'>"+esc(f[0])+"</td><td style='padding:11px 13px;border-bottom:1px solid #e8edf1;color:#182431;font-size:13px;font-weight:600'>"+esc(f[1])+"</td></tr>";
    }).join("");
    var detailRows = fields.slice(3).filter(function(f){return f[1];}).map(function(f){
      return "<tr><td style='padding:10px 13px;border-bottom:1px solid #e8edf1;color:#64717e;font-size:12px;width:38%'>"+esc(f[0])+"</td><td style='padding:10px 13px;border-bottom:1px solid #e8edf1;color:#182431;font-size:13px'>"+esc(f[1])+"</td></tr>";
    }).join("");
    var logoUrl = "https://raw.githubusercontent.com/acjl-mz/alinvest_CRM/main/public/brand/alinvest-logo.png";
    var logoBlob = UrlFetchApp.fetch(logoUrl).getBlob().setName("alinvest-logo.png");
    var html = "<div style='margin:0;padding:28px 12px;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#182431'><div style='max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dfe4e8;border-radius:12px;overflow:hidden'>"+
      "<div style='padding:22px 28px;border-bottom:3px solid #b9923d;background:#ffffff'><img src='cid:alinvestlogo' alt='ALINVEST' width='265' style='display:block;width:265px;max-width:100%;height:auto'></div>"+
      "<div style='padding:26px 28px 18px;background:#001533;color:#ffffff'><div style='font-size:10px;letter-spacing:2px;color:#d7bd80;font-weight:bold;text-transform:uppercase'>CAPTAÇÃO DE FORMANDOS</div><div style='font-size:25px;line-height:1.25;font-weight:bold;margin-top:9px'>Nova manifestação de interesse</div><div style='font-size:14px;color:#d7e0e8;margin-top:8px'>"+esc(segmentName)+"</div></div>"+
      "<div style='padding:26px 28px'><p style='font-size:14px;line-height:1.6;margin:0 0 18px'>Foi recebida uma nova manifestação de interesse através do website da ALINVEST.</p>"+
      "<div style='margin-bottom:22px;padding:16px 18px;background:#f4f6f8;border-left:4px solid #b9923d;border-radius:5px'><div style='font-size:10px;letter-spacing:1.3px;color:#64717e;text-transform:uppercase;font-weight:bold'>SEGMENTO DA CAMPANHA</div><div style='font-size:19px;font-weight:bold;color:#003b63;margin-top:5px'>"+esc(segmentName)+"</div></div>"+
      "<div style='font-size:12px;font-weight:bold;color:#003b63;letter-spacing:1px;text-transform:uppercase;margin:0 0 8px'>Identificação e contacto</div><table role='presentation' style='width:100%;border-collapse:collapse;border:1px solid #e8edf1'>"+contactRows+"</table>"+
      (detailRows ? "<div style='font-size:12px;font-weight:bold;color:#003b63;letter-spacing:1px;text-transform:uppercase;margin:23px 0 8px'>Perfil e disponibilidade</div><table role='presentation' style='width:100%;border-collapse:collapse;border:1px solid #e8edf1'>"+detailRows+"</table>" : "")+
      "<div style='margin-top:22px;padding:14px 16px;background:#fbf8f0;border-radius:6px;font-size:12px;color:#64717e'>Recebido em: <strong style='color:#182431'>"+esc(p.submitted_at || new Date().toISOString())+"</strong></div>"+
      (p.email ? "<p style='margin:22px 0 0'><a href='mailto:"+esc(p.email)+"?subject="+encodeURIComponent("ALINVEST — seguimento do seu interesse em "+segmentName)+"' style='display:inline-block;padding:12px 18px;background:#004a7c;color:#ffffff;text-decoration:none;border-radius:6px;font-size:13px;font-weight:bold'>Responder ao interessado</a></p>" : "")+
      "</div><div style='padding:17px 28px;background:#001533;color:#c5d0da;font-size:11px;line-height:1.6'>ALINVEST · Formação e Desenvolvimento<br>Notificação automática do formulário de manifestação de interesse.</div></div></div>";
    var plain = "Nova manifestação de interesse — ALINVEST\nSegmento: "+segmentName+"\n\n"+fields.filter(function(f){return f[1];}).map(function(f){return f[0]+": "+f[1];}).join("\n")+"\n\nRecebido em: "+(p.submitted_at || "");
    var options = {to:recipient,subject:"Novo interessado | "+segmentName+" | "+p.full_name,body:plain,htmlBody:html,name:"ALINVEST | Captação de Formandos",inlineImages:{alinvestlogo:logoBlob}};
    if (p.email) options.replyTo = p.email;
    MailApp.sendEmail(options);
    return respond({ok:true});
  } catch (err) {
    console.error(err);
    return respond({ok:false});
  }
}

function respond(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
