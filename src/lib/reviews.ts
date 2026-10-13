import type { Testimonial } from '../data/taxi'

// Forme renvoyée par netlify/functions/google-reviews.mts.
export type LiveReview = { name: string; initial: string; date: string; rating: number; text: string }
export type LivePayload = { score: number | null; count: number | null; url: string | null; reviews: LiveReview[] }

// Clé de dédoublonnage d'un auteur : sans accents, sans casse, espaces réduits.
const authorKey = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim()

// Avis Google en direct d'abord (datés, marqués Google), puis les avis embarqués
// dont l'auteur n'est pas déjà dans les avis en direct. Sans avis en direct, les
// embarqués sont rendus tels quels.
export function mergeReviews(live: LiveReview[], embedded: Testimonial[]): Testimonial[] {
  const fresh: Testimonial[] = live
    .filter(r => r.name && r.text)
    .map(r => ({ author: r.name, text: r.text, context: `${r.date} · Google`, rating: r.rating }))
  if (fresh.length === 0) return embedded
  const seen = new Set(fresh.map(r => authorKey(r.author)))
  return [...fresh, ...embedded.filter(t => !seen.has(authorKey(t.author)))]
}
