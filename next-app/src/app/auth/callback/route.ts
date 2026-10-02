import { NextResponse, type NextRequest } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  // Custom email templates land here without depending on a PKCE verifier
  // in the browser that originally requested the email.
  if (params.has("token_hash")) {
    const target = new URL("/auth/confirm", request.url);
    target.searchParams.set("token_hash", params.get("token_hash")!);
    target.searchParams.set("type", params.get("type") || "email");
    const response = NextResponse.redirect(target);
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  }
  const code = params.get("code");
  try {
    const supabase = await serverSupabase();
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL("/", request.url));
    } else {
      const { data } = await supabase.auth.getUser();
      if (data.user) return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    // Never expose auth credentials or provider errors in the redirect URL.
  }
  return NextResponse.redirect(
    new URL("/signin?error=confirmation", request.url),
  );
}
