// Pošle email cez Zoho SMTP. Vždy odošle plain text + HTML (multipart) — klienti si vyberú.

import "server-only";
import nodemailer from "nodemailer";
import { wrapEmailHtml } from "./email-template";

export type SendArgs = {
    to: string;
    subject: string;
    body: string;        // plain text
    html?: string;       // voliteľný HTML override; default → wrap z body
};

export type SendResult =
    | { ok: true; messageId: string }
    | { ok: false; error: string };

function transport() {
    const host = process.env.ZOHO_SMTP_HOST;
    const port = Number(process.env.ZOHO_SMTP_PORT || 465);
    const user = process.env.ZOHO_SMTP_USER;
    const pass = process.env.ZOHO_SMTP_PASS;
    if (!host || !user || !pass) {
        throw new Error("Zoho SMTP env vars missing");
    }
    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
}

export async function sendOutreach(args: SendArgs): Promise<SendResult> {
    const fromName = process.env.ZOHO_FROM_NAME || "Marek Donoval";
    const fromUser = process.env.ZOHO_SMTP_USER!;
    const html = args.html || wrapEmailHtml(args.body, args.subject);
    try {
        const info = await transport().sendMail({
            from: `"${fromName}" <${fromUser}>`,
            to: args.to,
            subject: args.subject,
            text: args.body,
            html,
        });
        return { ok: true, messageId: info.messageId };
    } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
}
