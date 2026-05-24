// HTML wrap pre outreach email — AIWai logo + profi dark styling.
// Email klienti (Gmail/Outlook) ignorujú niektoré CSS — používame inline styles a tabuľkový layout.

export function wrapEmailHtml(body: string, subject: string): string {
    const paragraphs = body
        .trim()
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);

    const bodyHtml = paragraphs
        .map((p) => {
            // Posledný blok je signature ("S pozdravom,\nMeno\nAIWai\naiwai.app") — render so spacing
            const isSignature = /S pozdravom,/i.test(p) && /AIWai/i.test(p);
            if (isSignature) {
                const lines = p.split(/\n/).map((l) => l.trim()).filter(Boolean);
                return `<p style="margin:32px 0 0;color:#4a4a4a;font-size:15px;line-height:1.6;">${lines
                    .map((l, i) => {
                        if (i === 0) return `<span style="color:#777;">${escapeHtml(l)}</span><br>`;
                        if (/^Marek Donoval$/i.test(l))
                            return `<strong style="color:#1a1a1a;font-size:16px;">${escapeHtml(l)}</strong><br>`;
                        if (/^AIWai$/i.test(l))
                            return `<span style="color:#C9A875;font-weight:600;letter-spacing:0.04em;">${escapeHtml(l)}</span><br>`;
                        if (/aiwai\.app/i.test(l))
                            return `<a href="https://aiwai.app" style="color:#8C6F3F;text-decoration:none;border-bottom:1px solid #C9A87560;">${escapeHtml(l)}</a>`;
                        return `${escapeHtml(l)}<br>`;
                    })
                    .join("")}</p>`;
            }
            return `<p style="margin:0 0 18px;color:#1a1a1a;font-size:15.5px;line-height:1.65;">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`;
        })
        .join("\n");

    return `<!DOCTYPE html>
<html lang="sk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f5f1ea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1a1a1a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f1ea;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px -8px rgba(20,20,30,0.08);">
        <!-- Header s logom -->
        <tr>
          <td style="padding:28px 36px 20px;border-bottom:1px solid #f0ebe0;background:linear-gradient(180deg,#fbf8f1 0%,#ffffff 100%);">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td valign="middle" style="vertical-align:middle;">
                  <a href="https://aiwai.app" style="text-decoration:none;display:inline-block;">
                    <img src="https://aiwai.app/logo-v2.png" alt="AIWai" width="80" height="36" style="display:block;border:0;height:auto;max-width:100%;object-fit:contain;">
                  </a>
                </td>
                <td valign="middle" align="right" style="vertical-align:middle;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.24em;text-transform:uppercase;color:#a89668;">
                  Digitálna agentúra
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 36px 36px;">
            ${bodyHtml}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 36px 28px;border-top:1px solid #f0ebe0;background:#fbf8f1;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;color:#88806a;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <a href="https://aiwai.app" style="color:#8C6F3F;text-decoration:none;">aiwai.app</a>
                  <span style="color:#d4cab0;">  ·  </span>
                  <a href="mailto:marek@aiwai.app" style="color:#8C6F3F;text-decoration:none;">marek@aiwai.app</a>
                </td>
                <td align="right" style="color:#a89668;letter-spacing:0.18em;text-transform:uppercase;font-size:10px;">
                  Slovensko
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <p style="margin:14px 0 0;color:#a89668;font-size:11px;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;">
        Tento e-mail bol odoslaný individuálne. Ak nechcete byť kontaktovaný/-á, jednoducho neodpovedajte.
      </p>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
