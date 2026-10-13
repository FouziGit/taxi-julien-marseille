import { useEffect, useState } from 'react'
import { testimonials, type Testimonial } from '../data/taxi'
import { mergeReviews, type LivePayload } from './reviews'

// Un seul appel réseau par page, partagé entre les bandeaux (accueil + formulaire).
// Même origine (/.netlify/functions/…) : rien à ouvrir dans la CSP.
let pending: Promise<LivePayload | null> | null = null
function fetchLive(): Promise<LivePayload | null> {
  pending ??= fetch('/.netlify/functions/google-reviews')
    .then(r => (r.ok ? (r.json() as Promise<LivePayload>) : null))
    .catch(() => null)
  return pending
}

// Avis Google en direct après hydratation ; le HTML prérendu garde les avis
// embarqués, donc rien ne change si la fonction ne répond pas.
export function useGoogleReviews(): { live: LivePayload | null; items: Testimonial[] } {
  const [live, setLive] = useState<LivePayload | null>(null)
  useEffect(() => {
    let active = true
    fetchLive().then(p => {
      if (active && p && p.reviews.length > 0) setLive(p)
    })
    return () => {
      active = false
    }
  }, [])
  return { live, items: live ? mergeReviews(live.reviews, testimonials) : testimonials }
}
