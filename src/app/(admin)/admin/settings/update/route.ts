import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const { siteName, logoUrl } = await req.json();

  const { error } = await supabaseAdmin
    .from("settings")
    .update({
      site_name: siteName,
      logo_url: logoUrl,
    })
    .eq("id", 1); // ⚠️ à adapter si multi-ligne

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ success: true });
}
