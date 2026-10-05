import { NextResponse } from 'next/server';
import { profile } from '@/lib/data';

export const runtime = 'nodejs';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const htmlEscapes: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => htmlEscapes[char]);
const requests = new Map<string, { start: number; count: number }>();

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return NextResponse.json({ error: 'sendFailed' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'sendFailed' }, { status: 403 });
    }
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 8000) return NextResponse.json({ error: 'invalidInput' }, { status: 413 });

  const address = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const bucket = requests.get(address);
  if (bucket && now - bucket.start < 10 * 60 * 1000 && bucket.count >= 5) {
    return NextResponse.json({ error: 'sendFailed' }, { status: 429 });
  }
  if (!bucket || now - bucket.start >= 10 * 60 * 1000) requests.set(address, { start: now, count: 1 });
  else requests.set(address, { ...bucket, count: bucket.count + 1 });
  if (requests.size > 1000) {
    requests.forEach((value, key) => { if (now - value.start >= 10 * 60 * 1000) requests.delete(key); });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalidInput' }, { status: 400 });
  }

  // Quietly accept bot submissions caught by the hidden honeypot.
  if (typeof body.website === 'string' && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (name.length < 2 || name.length > 120 || !emailPattern.test(email) || email.length > 254 || message.length < 10 || message.length > 5000) {
    return NextResponse.json({ error: 'invalidInput' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    return NextResponse.json({ error: 'notConfigured' }, { status: 503 });
  }

  const to = process.env.CONTACT_TO_EMAIL || profile.email;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>');

  try {
    const result = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<p><strong>Name:</strong> ${safeName}<br><strong>Email:</strong> ${safeEmail}</p><p>${safeMessage}</p>`,
      }),
      cache: 'no-store',
    });
    if (!result.ok) return NextResponse.json({ error: 'sendFailed' }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'sendFailed' }, { status: 502 });
  }
}
