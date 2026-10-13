import { m } from 'motion/react'
import ReviewsMarquee, { Stars } from '../components/ReviewsMarquee'
import { useGoogleReviews } from '../lib/useGoogleReviews'

// Google reviews — direct deep-link into the Local POI reviews panel for
// "Taxi van Julien". Clicking it opens Google's review UI with the existing
// 5★ rating and a "Écrire un avis" button. The Place ID embedded in the URL
// (rldimm=…) is what makes the deep-link land directly on the reviews tab.
const GOOGLE_REVIEWS_URL =
  'https://www.google.com/search?q=Taxi+van+julien+1+%C3%A0+5%2C6%2C7+personnes+A%C3%A9roport+Marseille+Provence+Marignane+et+gare+st+Charles+Marseille+Avis&rldimm=8333227896447063096&hl=fr-FR&sa=X#lkt=LocalPoiReviews'

// Valeurs prérendues tant que Google n'a pas répondu (relevées sur la fiche).
const FALLBACK_SCORE = 5
const FALLBACK_COUNT = 333

const fr = (n: number) => n.toFixed(1).replace('.', ',')

export default function Reviews() {
  const { live, items } = useGoogleReviews()
  const score = live?.score ?? FALLBACK_SCORE
  const count = live?.count ?? FALLBACK_COUNT

  return (
    <section id="avis" className="py-20 sm:py-28 bg-[var(--color-ink)] overflow-hidden" aria-labelledby="avis-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--color-silver-deep)]">— Avis clients</p>
          <h2 id="avis-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-3 text-balance tracking-tight">
            {Number.isInteger(score) ? score : fr(score)} sur 5.
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 text-[var(--color-silver-2)]">
            <Stars count={score} size="lg" />
            <span className="font-semibold">{fr(score)}/5</span>
            <span className="text-[var(--color-mute)]">· {count} avis vérifiés sur Google</span>
          </div>

          {/* Action buttons — read all reviews + write one */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white text-[var(--color-ink)] font-semibold text-[13.5px] mag-btn"
            >
              <Stars count={5} tone="gold" />
              Voir tous les avis Google
            </a>
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full hairline-strong bg-[var(--color-charcoal)] text-[var(--color-cream)] font-semibold text-[13.5px] hover:bg-[var(--color-line-soft)] transition"
            >
              ✍️ Laisser un avis
            </a>
          </div>
        </m.div>

        {/* Auto-scrolling marquee — pauses on hover OR on click anywhere on the row */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
        >
          <ReviewsMarquee items={items} />
        </m.div>
      </div>
    </section>
  )
}
