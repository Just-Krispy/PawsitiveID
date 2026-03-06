import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token || !isSupabaseConfigured()) {
    return new NextResponse(unsubscribePage(false, "Invalid unsubscribe link."), {
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    const supabase = getServerSupabase();
    const { error } = await supabase
      .from("alert_subscriptions")
      .update({ is_active: false })
      .eq("unsubscribe_token", token);

    if (error) {
      return new NextResponse(unsubscribePage(false, "Failed to unsubscribe. Please try again."), {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new NextResponse(unsubscribePage(true), {
      headers: { "Content-Type": "text/html" },
    });
  } catch {
    return new NextResponse(unsubscribePage(false, "Something went wrong."), {
      headers: { "Content-Type": "text/html" },
    });
  }
}

function unsubscribePage(success: boolean, errorMsg?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${success ? "Unsubscribed" : "Error"} - PawsitiveID</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f0f1a; color: #e2e8f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: rgba(255,255,255,0.05); padding: 48px; border-radius: 16px; text-align: center; max-width: 400px; border: 1px solid rgba(255,255,255,0.1); }
    h1 { color: ${success ? "#22c55e" : "#ef4444"}; margin-bottom: 8px; }
    p { color: #94a3b8; }
    a { color: #f97316; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${success ? "Unsubscribed" : "Error"}</h1>
    <p>${success ? "You've been unsubscribed from PawsitiveID alerts. You won't receive any more emails." : errorMsg}</p>
    <p style="margin-top: 16px;"><a href="/">Back to PawsitiveID</a></p>
  </div>
</body>
</html>`;
}
