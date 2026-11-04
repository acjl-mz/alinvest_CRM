function authorizeMail() {
  MailApp.getRemainingDailyQuota();
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return respond({ok:false});
    var p = JSON.parse(e.postData.contents);
    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty("ALINVEST_WEBHOOK_SECRET");
    var recipient = props.getProperty("ALINVEST_NOTIFICATION_EMAIL");
    if (!secret || !recipient || p.secret !== secret) return respond({ok:false});
    var allowed = ["normas-iso", "hsee", "negocios-gestao"];
    if (!p.consent || p.source !== "landing_page" || !p.full_name || !p.phone ||
        (p.campaign_segment && allowed.indexOf(p.campaign_segment) < 0) ||
        !Array.isArray(p.segments) || p.segments.length < 1 || p.segments.length > 3 ||
        !p.segments.every(function(s){return allowed.indexOf(s) >= 0;})) return respond({ok:false});
    var names = {"normas-iso":"Normas ISO","hsee":"HSEE","negocios-gestao":"Negócios / Gestão"};
    var fields = [
      ["Nome completo",p.full_name],["Telefone / WhatsApp",p.phone],["E-mail",p.email],
      ["Cidade / Província",p.city],["Nível de formação",p.education_level],
      ["Situação profissional",p.professional_status],["Empresa / Organização",p.organization],
      ["Segmento de origem da campanha",p.campaign_segment ? names[p.campaign_segment] : ""],
      ["Áreas de interesse",p.segments.map(function(s){return names[s];}).join(", ")],
      ["Modalidade preferida",p.preferred_mode],["Disponibilidade",p.preferred_schedule],
      ["Recebido em",p.submitted_at]
    ];
    var esc = function(v){return String(v == null ? "" : v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");};
    var rows = fields.filter(function(f){return f[1];}).map(function(f){
      return "<tr><td style='padding:10px;border-bottom:1px solid #e5ebef;color:#687887'>"+esc(f[0])+"</td><td style='padding:10px;border-bottom:1px solid #e5ebef;font-weight:bold'>"+esc(f[1])+"</td></tr>";
    }).join("");
    var html = "<div style='font-family:Arial;background:#f4f7f8;padding:25px'><div style='max-width:650px;margin:auto;background:white;border:1px solid #e5ebef;border-radius:10px;overflow:hidden'><div style='background:#102b46;color:white;padding:24px;font-size:20px;font-weight:bold'>ALINVEST — NOVO INTERESSADO</div><div style='padding:24px'><p>Foi recebida uma nova manifestação de interesse através da página ALINVEST.</p><table style='width:100%;border-collapse:collapse'>"+rows+"</table></div></div></div>";
    var plain = fields.filter(function(f){return f[1];}).map(function(f){return f[0]+": "+f[1];}).join("\n");
    var options = {to:recipient,subject:"Novo interessado ALINVEST — "+p.full_name,body:plain,htmlBody:html,name:"ALINVEST — Captação de Formandos"};
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
