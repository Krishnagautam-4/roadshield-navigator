import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// TODO: replace with the project URL once a project name or custom domain is set.
const BASE_URL = "";

const STATE_SLUGS = [
  "andaman-and-nicobar", "andhra-pradesh", "arunachal-pradesh", "assam", "bihar", "chandigarh",
  "chhattisgarh", "dadra-and-nagar-haveli", "daman-and-diu", "delhi", "goa", "gujarat", "haryana",
  "himachal-pradesh", "jammu-and-kashmir", "jharkhand", "karnataka", "kerala", "lakshadweep",
  "madhya-pradesh", "maharashtra", "manipur", "meghalaya", "mizoram", "nagaland", "odisha",
  "puducherry", "punjab", "rajasthan", "sikkim", "tamil-nadu", "tripura", "uttar-pradesh",
  "uttarakhand", "west-bengal",
];

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/map", changefreq: "weekly", priority: "0.9" },
          { path: "/dashboard", changefreq: "weekly", priority: "0.9" },
          { path: "/safety", changefreq: "monthly", priority: "0.7" },
          { path: "/about", changefreq: "monthly", priority: "0.6" },
          ...STATE_SLUGS.map((slug) => ({
            path: `/states/${slug}`,
            changefreq: "monthly" as const,
            priority: "0.8",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
