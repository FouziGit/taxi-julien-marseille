// 301-redirect the old Jalis-built URLs to the most relevant new
// /destinations/<slug>/ page (or the homepage as a fallback).
//
// Why an edge function and not netlify.toml [[redirects]]:
//   The legacy URLs are auto-generated keyword slugs:
//     reserver+un+taxi+...+aeroport+nice...-z122
//     saint+tropez+sur+la+cote+d+azur-y9
//     details-taxi+marseille+aix+en+provence-281.html
//   Netlify's static redirects only match path prefixes/splats, so the
//   "-z##"/"-y#" URLs (no clean prefix) slipped through to the SPA fallback
//   and returned HTTP 200 with the homepage content = soft-404 / duplicate
//   (Google Search Console: "Explorée, actuellement non indexée", 345 pages).
//   This function reads the full slug, extracts the destination keyword and
//   issues ONE clean 301 to the matching new page — recovering crawl budget
//   and link equity instead of collapsing everything onto "/".
//
// Edge functions run BEFORE the netlify.toml redirects/rewrites, so this owns
// all legacy-URL handling; netlify.toml only keeps the destination
// trailing-slash 301 and the SPA fallback.

import type { Context } from "https://edge.netlify.com";

// Ordered: FIRST match wins. More specific phrases MUST come before generic
// ones (e.g. "gare aix tgv" before "aix", "aeroport nice" before "nice").
// Right-hand side = existing /destinations/<slug>/ id.
const RULES: [string, string][] = [
  // Gares
  ["gare aix tgv", "gare-aix-tgv"],
  ["aix tgv", "gare-aix-tgv"],
  ["gare avignon tgv", "gare-avignon-tgv"],
  ["avignon tgv", "gare-avignon-tgv"],
  ["gare saint charles", "gare-saint-charles"],
  ["saint charles", "gare-saint-charles"],
  ["st charles", "gare-saint-charles"],
  // Aéroports (avant les villes homonymes)
  ["aeroport nice", "aeroport-nice"],
  ["aeroport toulon", "aeroport-toulon-hyeres"],
  ["toulon hyeres", "aeroport-toulon-hyeres"],
  ["aeroport marseille", "aeroport-marseille-provence"],
  ["marseille provence", "aeroport-marseille-provence"],
  ["marignane", "aeroport-marseille-provence"],
  // Port de croisière
  ["port de croisiere", "port-croisiere-marseille"],
  ["terminal de croisiere", "port-croisiere-marseille"],
  ["terminal croisiere", "port-croisiere-marseille"],
  ["croisiere", "port-croisiere-marseille"],
  // Bouches-du-Rhône & côte proche
  ["calanques de cassis", "cassis"],
  ["cassis", "cassis"],
  ["la ciotat", "la-ciotat"],
  ["saint cyr", "saint-cyr"],
  ["bandol", "bandol"],
  ["sanary", "sanary"],
  ["embiez", "embiez"],
  ["six fours", "six-fours"],
  ["la seyne", "la-seyne"],
  ["hyeres", "hyeres"],
  ["toulon", "toulon"],
  // Stations de ski
  ["pra loup", "ski-pra-loup"],
  ["risoul", "ski-risoul"],
  ["vars", "ski-vars"],
  ["orres", "ski-orres"],
  // Golfe de Saint-Tropez & Maures
  ["saint tropez", "saint-tropez"],
  ["sainte maxime", "sainte-maxime"],
  ["ramatuelle", "ramatuelle"],
  ["gassin", "gassin"],
  ["cogolin", "cogolin"],
  ["cavalaire", "cavalaire"],
  ["la croix valmer", "la-croix-valmer"],
  ["rayol", "rayol-canadel"],
  ["lavandou", "le-lavandou"],
  ["bormes", "bormes-les-mimosas"],
  ["la londe", "la-londe"],
  // Côte d'Azur
  ["saint raphael", "saint-raphael"],
  ["st raphael", "saint-raphael"],
  ["frejus", "frejus"],
  ["mandelieu", "mandelieu"],
  ["cannes", "cannes"],
  ["antibes", "antibes"],
  ["cagnes", "cagnes-sur-mer"],
  ["nice", "nice-ville"],
  // Aix / Aubagne / Avignon / Arles
  ["aix en provence", "aix-en-provence"],
  ["aix", "aix-en-provence"],
  ["aubagne", "aubagne"],
  ["avignon", "avignon"],
  ["arles", "arles"],
  // Catch-all génériques (en dernier)
  ["aeroport", "aeroport-marseille-provence"],
  ["gare", "gare-saint-charles"],
];

// Bare legacy paths (no "+", no "-z/-y", not .html) that the old CMS exposed.
const EXACT: Record<string, string> = {
  "/accueil": "/",
  "/tarifs": "/",
  "/contact": "/",
};

// A legacy URL: Jalis slugs use "+" for spaces, end in -z##/-y#/-w#, carry the
// old .html, or start with a known legacy prefix. New URLs ("/",
// "/destinations/x/", "/mentions-legales/") match none of these.
function isLegacy(pathname: string): boolean {
  return (
    pathname.includes("+") ||
    /-[zyw]\d+(\.html)?$/i.test(pathname) ||
    /\.html$/i.test(pathname) ||
    /^\/(details|activites|archives|lien|transport-prive|nos-activites|toutes-nos-prestations|guide-local|faq-w|avis-clients|visites-touristiques)/i.test(
      pathname,
    )
  );
}

function targetFor(pathname: string): string {
  // Normalise to space-separated lowercase tokens, padded so we can match whole
  // words/phrases only (avoids e.g. "charles" matching "arles").
  const norm =
    " " +
    decodeURIComponent(pathname)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim() +
    " ";
  for (const [needle, slug] of RULES) {
    if (norm.includes(" " + needle + " ")) return `/destinations/${slug}/`;
  }
  return "/";
}

export default async (request: Request, _context: Context) => {
  const url = new URL(request.url);
  const exact = EXACT[url.pathname];
  const dest = exact ?? (isLegacy(url.pathname) ? targetFor(url.pathname) : null);
  if (dest === null) return; // not legacy → continue normal pipeline
  return new Response(null, {
    status: 301,
    headers: {
      Location: url.origin + dest,
      "Cache-Control": "public, max-age=3600",
    },
  });
};

export const config = {
  path: "/*",
  excludedPath: [
    "/assets/*",
    "/photos/*",
    "/fonts/*",
    "/destinations/*",
    "/mentions-legales/*",
    "/og*",
    "/favicon.svg",
    "/*.txt",
    "/*.xml",
    "/*.webmanifest",
    "/*.md",
    "/*.json",
  ],
};
