// Workspace SMTP (design section 5): smtp.gmail.com:465 with SMTP_USER and an App Password in SMTP_PASS.
// Node runtime only (raw sockets). Callers bound the send with their own timeout; the transport's own
// timeouts stop a hung connection from outliving the function.
import nodemailer from 'nodemailer';
import { env } from './env';
import type { Mail } from './inquiry';

let transport: ReturnType<typeof nodemailer.createTransport> | null = null;

/** Sends one plain-text message from `ZINC Website <SMTP_USER>`. Throws nodemailer's error (with its code) on failure. */
export async function sendMail(mail: Mail): Promise<void> {
  const { user, pass } = env.smtp();
  if (!user || !pass) throw Object.assign(new Error('SMTP is not configured'), { code: 'EAUTH' });
  transport ??= nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass },
    connectionTimeout: 7000, greetingTimeout: 7000, socketTimeout: 7000,
  });
  await transport.sendMail({ from: { name: 'ZINC Website', address: user }, to: mail.to, replyTo: mail.replyTo, subject: mail.subject, text: mail.text });
}
