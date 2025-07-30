import { NextResponse } from 'next/server';

export async function GET() {
  const openaiConfigured = !!process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  
  return NextResponse.json({
    ok: true,
    openai: openaiConfigured,
    model: model,
    timestamp: new Date().toISOString()
  });
}