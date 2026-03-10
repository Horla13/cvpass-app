import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 300; // 5 min cache

export async function GET() {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BREVO_LIST_ID = process.env.BREVO_LIST_ID ?? "3";

  if (!BREVO_API_KEY) {
    return NextResponse.json({ count: 0 });
  }

  try {
    const response = await fetch(
      `https://api.brevo.com/v3/contacts/lists/${BREVO_LIST_ID}`,
      {
        headers: {
          Accept: "application/json",
          "api-key": BREVO_API_KEY,
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ count: 0 });
    }

    const data = await response.json();
    return NextResponse.json(
      { count: data.totalSubscribers ?? 0 },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
