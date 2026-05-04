import { NextResponse } from "next/server";

const EXECUTE_URL =
  "https://www.zohoapis.ca/crm/v7/functions/harjotportfoliocontactform/actions/execute?auth_type=apikey&zapikey=1003.74c5a11d6de5761042faccf239c7ee41.41b55642165a17caf2b44cf6b98e22e4";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!json || typeof json !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const { firstName, lastName, email, message } = json as Record<string, unknown>;

  const fn = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const f = fn(firstName);
  const l = fn(lastName);
  const em = fn(email);
  const msg = fn(message);

  if (!f || !l || !em) {
    return NextResponse.json(
      { error: "First name, last name, and email are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const zohoBody = JSON.stringify({
    arguments: JSON.stringify({
      First_Name: f,
      Last_Name: l,
      Email: em,
      Description: msg,
    }),
  });

  let zohoRes: Response;
  try {
    zohoRes = await fetch(EXECUTE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: zohoBody,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the contact service." },
      { status: 502 },
    );
  }

  const text = await zohoRes.text();
  let zohoJson: unknown;
  try {
    zohoJson = JSON.parse(text);
  } catch {
    zohoJson = { raw: text };
  }

  if (!zohoRes.ok) {
    return NextResponse.json(
      { error: "The contact service returned an error.", details: zohoJson },
      { status: 502 },
    );
  }

  const obj = zohoJson as { code?: string; message?: string };
  if (obj?.code && obj.code !== "success") {
    return NextResponse.json(
      { error: obj.message ?? "Submission was not accepted.", details: zohoJson },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, data: zohoJson });
}
