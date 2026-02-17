import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  // TODO: save to DB / send to email provider
  console.log("Notify email:", email);

  return NextResponse.json({ ok: true });
}
