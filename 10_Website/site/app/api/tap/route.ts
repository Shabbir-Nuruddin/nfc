// Tap counter for validation: each tag open posts one line here.
// It is written to the server log only. Point it at a real store
// (a sheet, a database) before reading numbers off it.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const entry = {
      at: new Date().toISOString(),
      slug: String(body.slug ?? "").slice(0, 64),
      tag: String(body.tag ?? "").slice(0, 64),
      visit: Number(body.visit) || 0,
      ua: (req.headers.get("user-agent") ?? "").slice(0, 160),
    };
    console.log("[tap]", JSON.stringify(entry));
  } catch {
    // A malformed beacon is not worth an error page.
  }
  return new Response(null, { status: 204 });
}
