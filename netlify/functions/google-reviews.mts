/**
 * Avis Google en direct pour les bandeaux « avis clients » (accueil et formulaire).
 *
 * Proxy côté serveur de l'API Google Places (New) : le navigateur du visiteur
 * ne parle jamais à Google (aucun tiers contacté, aucun consentement requis
 * pour afficher des avis). Réponse mise en cache par le CDN Netlify 6 h
 * (~4 appels API/jour, dans le palier gratuit). Même mécanique qu'EOTRA.
 *
 * Env attendues (Netlify, scope functions, non marquées « secret ») :
 *  - GOOGLE_PLACES_API_KEY : clé restreinte à « Places API (New) »
 *  - GOOGLE_PLACE_ID : Place ID de la fiche Google de Taxi Julien.
 *
 * État au 2026-10-13 : la fiche de Julien (« zone desservie », sans adresse)
 * n'est renvoyée par aucune recherche Places (texte, téléphone, cid) ; sans
 * GOOGLE_PLACE_ID la fonction répond 503 { error: "not_configured" } sans
 * appeler Google, et le site garde ses avis embarqués (src/data/taxi.ts).
 */

type Payload = {
  score: number | null;
  count: number | null;
  url: string | null;
  reviews: Array<{ name: string; initial: string; date: string; rating: number; text: string }>;
};

let warmCache: { at: number; body: Payload } | null = null;
const WARM_TTL_MS = 60 * 60 * 1000; // 1 h en mémoire, en plus du cache CDN

function json(body: unknown, status = 200, cacheSeconds = 0): Response {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (cacheSeconds > 0) {
    headers["Cache-Control"] = "public, max-age=300";
    headers["Netlify-CDN-Cache-Control"] = `public, s-maxage=${cacheSeconds}, stale-while-revalidate=86400`;
  }
  return new Response(JSON.stringify(body), { status, headers });
}

export default async (): Promise<Response> => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  // Charge utile vide (200, cache CDN 1 h) tant que la fiche n'est pas
  // identifiable : aucun appel Google, aucune erreur dans la console du visiteur.
  if (!key || !placeId) return json({ score: null, count: null, url: null, reviews: [] } satisfies Payload, 200, 3600);

  if (warmCache && Date.now() - warmCache.at < WARM_TTL_MS) {
    return json(warmCache.body, 200, 21600);
  }

  try {
    const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=fr`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews" },
    });
    if (!r.ok) return json({ error: "places_api_error", status: r.status }, 502);
    const place = (await r.json()) as {
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: Array<{
        rating?: number;
        text?: { text?: string };
        relativePublishTimeDescription?: string;
        authorAttribution?: { displayName?: string };
      }>;
    };

    // Fidélité : les avis tels que Google les renvoie (les 5 « plus pertinents »),
    // sans tri ni filtre maison — texte intégral, note incluse.
    const reviews = (place.reviews ?? [])
      .map((rv) => {
        const name = rv.authorAttribution?.displayName?.trim() ?? "";
        const text = rv.text?.text?.trim() ?? "";
        return {
          name,
          initial: (name[0] ?? "·").toUpperCase(),
          date: rv.relativePublishTimeDescription ?? "",
          rating: typeof rv.rating === "number" ? rv.rating : 5,
          text,
        };
      })
      .filter((rv) => rv.name && rv.text);

    const body: Payload = {
      score: typeof place.rating === "number" ? place.rating : null,
      count: typeof place.userRatingCount === "number" ? place.userRatingCount : null,
      url: place.googleMapsUri ?? null,
      reviews,
    };
    warmCache = { at: Date.now(), body };
    return json(body, 200, 21600);
  } catch {
    return json({ error: "upstream_unreachable" }, 502);
  }
};
