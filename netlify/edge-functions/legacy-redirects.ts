// 301 des anciennes URLs Jalis vers la page la plus pertinente. La logique
// de routage vit dans legacy-routing.ts (testée sous Node). Les edge
// functions s'exécutent avant les [[redirects]] de netlify.toml.
import { resolveLegacy } from "./legacy-routing.ts";

export default async (request: Request) => {
  const url = new URL(request.url);
  const dest = resolveLegacy(url.pathname);
  if (dest === null) return; // pas une URL legacy : pipeline normal
  return new Response(null, {
    status: 301,
    headers: { Location: url.origin + dest, "Cache-Control": "public, max-age=3600" },
  });
};

export const config = {
  path: "/*",
  excludedPath: [
    "/assets/*", "/photos/*", "/fonts/*", "/destinations/*", "/mentions-legales/*",
    "/transport-medical-conventionne/*", "/aeroport/*", "/hotels/*", "/van-7-places-groupes/*", "/en/*", "/evenements/*",
    "/og*", "/favicon.svg", "/*.txt", "/*.xml", "/*.webmanifest", "/*.md", "/*.json",
  ],
};
