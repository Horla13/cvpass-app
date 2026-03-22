import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/results/", "/account/", "/cover-letter/", "/history/"],
      },
    ],
    sitemap: "https://cvpass.fr/sitemap.xml",
  };
}
