import { NextResponse } from "next/server";
import { getServerSupabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ dogs: [] });
  }

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("dog_profiles")
      .select("id, breed, color, size, photo_url, location_text, created_at")
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      console.error("List dogs error:", error);
      return NextResponse.json({ dogs: [] });
    }

    return NextResponse.json({ dogs: data || [] });
  } catch (error) {
    console.error("List dogs error:", error);
    return NextResponse.json({ dogs: [] });
  }
}
