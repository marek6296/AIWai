// HTML wrap pre outreach email — dark theme + AIWai logo (logo sedí na čiernu).
// Email klienti (Gmail/Outlook) ignorujú niektoré CSS — inline styles + tabuľkový layout.

export function wrapEmailHtml(body: string, subject: string): string {
    const paragraphs = body
        .trim()
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);

    const bodyHtml = paragraphs
        .map((p) => {
            const isSignature = /S pozdravom,/i.test(p) && /AIWai/i.test(p);
            if (isSignature) {
                const lines = p.split(/\n/).map((l) => l.trim()).filter(Boolean);
                return `<p style="margin:32px 0 0;color:#a89868;font-size:14px;line-height:1.7;">${lines
                    .map((l, i) => {
                        // Podporujeme aj markdown link [text](url)
                        const mdLink = l.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                        if (mdLink) {
                            return `<a href="${escapeAttr(mdLink[2])}" style="color:#C9A875;text-decoration:none;border-bottom:1px solid rgba(201,168,117,0.4);">${escapeHtml(mdLink[1])}</a>`;
                        }
                        if (i === 0) return `<span style="color:#8c826a;">${escapeHtml(l)}</span><br><br>`;
                        if (/^Marek Donoval$/i.test(l))
                            return `<strong style="color:#f5edda;font-size:16px;font-weight:600;">${escapeHtml(l)}</strong><br>`;
                        if (/^AIWai$/i.test(l))
                            return `<span style="color:#C9A875;font-weight:600;letter-spacing:0.06em;font-size:14px;">${escapeHtml(l)}</span><br>`;
                        return `${escapeHtml(l)}<br>`;
                    })
                    .join("")}</p>`;
            }
            return `<p style="margin:0 0 20px;color:#f5edda;font-size:15.5px;line-height:1.7;">${renderInline(p)}</p>`;
        })
        .join("\n");

    return `<!DOCTYPE html>
<html lang="sk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#f5edda;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0a0f;">
  <tr>
    <td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background:#0e0e14;border:1px solid rgba(201,168,117,0.18);border-radius:18px;overflow:hidden;box-shadow:0 8px 40px -12px rgba(0,0,0,0.7),0 0 60px -20px rgba(201,168,117,0.15);">

        <!-- Subtle gold gradient strip -->
        <tr><td style="height:2px;background:linear-gradient(90deg,transparent,#C9A875 40%,#C9A875 60%,transparent);font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- Header s logom -->
        <tr>
          <td style="padding:32px 40px 22px;border-bottom:1px solid rgba(245,237,218,0.06);background:#0e0e14;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td valign="middle" style="vertical-align:middle;">
                  <a href="https://www.aiwai.app" style="text-decoration:none;display:inline-block;">
                    <img src="https://aiwai.app/logo-v2.png" alt="AIWai" width="96" height="42" style="display:block;border:0;height:auto;max-width:100%;object-fit:contain;">
                  </a>
                </td>
                <td valign="middle" align="right" style="vertical-align:middle;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:#a89868;">
                  Digitálna agentúra
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:34px 40px 38px;background:#0e0e14;">
            ${bodyHtml}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:22px 40px 28px;border-top:1px solid rgba(245,237,218,0.06);background:#0a0a0f;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;color:#7a7160;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <a href="https://www.aiwai.app" style="color:#C9A875;text-decoration:none;">www.aiwai.app</a>
                  <span style="color:#3c3a32;">  ·  </span>
                  <a href="mailto:marek@aiwai.app" style="color:#C9A875;text-decoration:none;">marek@aiwai.app</a>
                </td>
                <td align="right" style="color:#7a7160;letter-spacing:0.22em;text-transform:uppercase;font-size:10px;">
                  Slovensko
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin:18px 0 0;color:#5c5448;font-size:11px;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;">
        Tento e-mail bol odoslaný individuálne. Ak nechcete byť kontaktovaný/-á, jednoducho neodpovedajte.
      </p>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function renderInline(p: string): string {
    // Najprv escape, potom prelož markdown [text](url) na <a>
    let out = escapeHtml(p).replace(/\n/g, "<br>");
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) =>
        `<a href="${escapeAttr(url)}" style="color:#C9A875;text-decoration:none;border-bottom:1px solid rgba(201,168,117,0.4);">${text}</a>`);
    return out;
}

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function escapeAttr(s: string): string {
    return s.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
