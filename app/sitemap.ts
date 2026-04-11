import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags, tagToSlug } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cvpass.fr";
  const posts = getAllPosts();
  const tags = getAllTags();

  const blogEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const tagEntries = tags.map((tag) => ({
    url: `${baseUrl}/blog/tag/${tagToSlug(tag)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/affiliate/join`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/a-propos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/comparaison`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/challenge`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    ...blogEntries,
    ...tagEntries,
  ];
}
