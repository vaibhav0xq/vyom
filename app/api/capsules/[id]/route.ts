import { NextResponse } from "next/server";
import { getRemoteCapsuleById, hasSupabaseServerConfig } from "@/lib/supabase-capsules";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!hasSupabaseServerConfig()) {
    return NextResponse.json(
      { code: "SUPABASE_NOT_CONFIGURED", error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  const { id } = await params;
  try {
    const capsule = await getRemoteCapsuleById(id);
    if (!capsule) {
      return NextResponse.json({ error: "Capsule not found." }, { status: 404 });
    }

    return NextResponse.json(capsule);
  } catch {
    return NextResponse.json({ error: "Capsule could not be loaded." }, { status: 500 });
  }
}
