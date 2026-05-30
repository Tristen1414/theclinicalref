import type { MetadataRoute } from "next";

const BASE_URL = "https://theclinicalref.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const categories = [
    "acronyms",
    "anatomy",
    "fire",
    "hazmat",
    "medmath",
    "mnemonics",
    "pathology",
    "pharmacology",
    "prescriptions",
    "radio",
    "terminology",
    "translation",
  ];

  return [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...categories.map((slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
