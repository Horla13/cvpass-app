import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isSafeUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const url = body.url?.trim();
  if (!url) return NextResponse.json({ error: "URL requise" }, { status: 400 });
  if (!isSafeUrl(url)) return NextResponse.json({ error: "URL non autorisée" }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; CVpass/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return NextResponse.json({ company: "", job_title: "" });

    const html = await res.text();

    // Extract title tag
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch?.[1]
      ?.replace(/&[a-z]+;/gi, " ")
      ?.replace(/<[^>]+>/g, "")
      ?.trim() ?? "";

    // Try to extract company and job title from common patterns
    let company = "";
    let job_title = "";

    // LinkedIn pattern: "Job Title - Company | LinkedIn"
    if (url.includes("linkedin.com")) {
      const parts = title.split(" | ")[0]?.split(" - ") ?? [];
      if (parts.length >= 2) {
        job_title = parts[0]?.trim() ?? "";
        company = parts[1]?.trim() ?? "";
      }
    }
    // Indeed pattern: "Job Title - Company - Location | Indeed"
    else if (url.includes("indeed")) {
      const parts = title.split(" | ")[0]?.split(" - ") ?? [];
      if (parts.length >= 2) {
        job_title = parts[0]?.trim() ?? "";
        company = parts[1]?.trim() ?? "";
      }
    }
    // WTTJ pattern: "Job Title - Company - Welcome to the Jungle"
    else if (url.includes("welcometothejungle") || url.includes("wttj")) {
      const parts = title.split(" - ");
      if (parts.length >= 2) {
        job_title = parts[0]?.trim() ?? "";
        company = parts[1]?.trim() ?? "";
      }
    }
    // Generic: try "Job Title - Company" or "Job Title | Company"
    else {
      const sep = title.includes(" | ") ? " | " : title.includes(" - ") ? " - " : null;
      if (sep) {
        const parts = title.split(sep);
        job_title = parts[0]?.trim() ?? "";
        company = parts[1]?.trim() ?? "";
      } else {
        job_title = title.slice(0, 100);
      }
    }

    // Try meta og:site_name for company
    if (!company) {
      const siteMatch = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i);
      company = siteMatch?.[1]?.trim() ?? "";
    }

    return NextResponse.json({ company: company.slice(0, 100), job_title: job_title.slice(0, 200) });
  } catch {
    return NextResponse.json({ company: "", job_title: "" });
  }
}
