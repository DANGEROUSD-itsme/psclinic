import { NextResponse } from "next/server";

import { clinic } from "@/lib/site";

/**
 * Enquiry handler.
 *
 * Enquiries carry health information, so this route deliberately does the
 * minimum: validate, forward to the clinic inbox, and keep nothing. Nothing
 * is logged to disk and nothing is stored.
 *
 * Delivery runs through Resend's REST API when RESEND_API_KEY and
 * ENQUIRY_TO_EMAIL are configured. If they are not, the route reports that
 * plainly rather than accepting a form it cannot deliver — a contact form
 * that silently discards a patient enquiry is worse than no form at all.
 */

export const runtime = "nodejs";

type Payload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  area?: unknown;
  preference?: unknown;
  referral?: unknown;
  message?: unknown;
  /** Honeypot — real people leave this empty. */
  company?: unknown;
};

const AREAS = ["hands", "underarms", "face", "multiple", "unsure"];
const PREFERENCES = ["in-person", "phone", "video"];

function asString(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Silently accept honeypot hits so bots get no signal to adapt to.
  if (asString(payload.company, 100).length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = asString(payload.name, 120);
  const email = asString(payload.email, 160);
  const phone = asString(payload.phone, 40);
  const area = asString(payload.area, 20);
  const preference = asString(payload.preference, 20);
  const referral = asString(payload.referral, 10);
  const message = asString(payload.message, 2000);

  const errors: string[] = [];
  if (name.length < 2) errors.push("Please provide your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Please provide a valid email address.");
  }
  if (area && !AREAS.includes(area)) errors.push("Unrecognised area.");
  if (preference && !PREFERENCES.includes(preference)) {
    errors.push("Unrecognised consultation preference.");
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0] }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return NextResponse.json(
      {
        error: `Online enquiries are not set up yet. Please call the clinic on ${clinic.phone}.`,
        unconfigured: true,
      },
      { status: 503 },
    );
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "Not provided"],
    ["Area affected", area || "Not specified"],
    ["Consultation preference", preference || "Not specified"],
    ["Has GP referral", referral === "yes" ? "Yes" : referral === "no" ? "No" : "Not specified"],
  ];

  const html = `
    <h2>New enquiry — ${escapeHtml(clinic.name)}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="color:#7a8b91">${escapeHtml(label)}</td><td><strong>${escapeHtml(value)}</strong></td></tr>`,
        )
        .join("")}
    </table>
    ${message ? `<h3>Message</h3><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>` : ""}
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Enquiry from ${name}`,
        html,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `We could not send that just now. Please call the clinic on ${clinic.phone}.`,
        },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      {
        error: `We could not send that just now. Please call the clinic on ${clinic.phone}.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
