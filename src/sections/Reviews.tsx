import { m } from 'motion/react'
import { useState } from 'react'
import { testimonials } from '../data/taxi'
import { StarIcon } from '../components/Icons'

// Google reviews — direct deep-link into the Local POI reviews panel for
// "Taxi van Julien". Clicking it opens Google's review UI with the existing
// 5★ rating and a "Écrire un avis" button. The Place ID embedded in the URL
// (rldimm=…) is what makes the deep-link land directly on the reviews tab.
const GOOGLE_REVIEWS_URL =
  'https://www.google.com/search?q=Taxi+van+julien+1+%C3%A0+5%2C6%2C7+personnes+A%C3%A9roport+Marseille+Provence+Marignane+et+gare+st+Charles+Marseille+Avis&rldimm=8333227896447063096&hl=fr-FR&sa=X#lkt=LocalPoiReviews'

// 5★ row used everywhere a card needs the rating. role='img' + aria-label
// satisfies axe (aria-label on a bare span is prohibited without a role).
// `tone='gold'` is used on the white CTA — cream stars on a white button
// were invisible. Gold matches Google's review-star colour anyway.
function Stars({
  count,
  size = 'sm',
  tone = 'cream',
}: {
  count: number
  size?: 'sm' | 'lg'
  tone?: 'cream' | 'gold'
}) {
  const sizeCls = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'
  const toneCls = tone === 'gold' ? 'text-amber-400' : 'text-[var(--color-cream)]'
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${toneCls}`}
      role="img"
      aria-label={`${count} sur 5 étoiles`}
    >
      {Array.from({ length: count }).map((_, k) => <StarIcon key={k} className={sizeCls} />)}
    </span>
  )
}

export default function Reviews() {
  const [paused, setPaused] = useState(false)
  // Duplicate the testimonials so the CSS marquee can translateX(-50%) and
  // appear seamless (the second half is rendered identical to the first).
  const loop = [...testimonials, ...testimonials]

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
            5 sur 5.
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 text-[var(--color-silver-2)]">
            <Stars count={5} size="lg" />
            <span className="font-semibold">5,0/5</span>
            <span className="text-[var(--color-mute)]">· 310 avis vérifiés sur Google</span>
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
          // Fade-out the marquee on the left/right edges so cards don't get cut
          // abruptly at the viewport boundary.
          className="relative -mx-4 sm:-mx-6 lg:-mx-8 [mask-image:linear-gradient(to_right,transparent_0%,#000_6%,#000_94%,transparent_100%)]"
        >
          <ul
            className={`reviews-marquee flex gap-3 w-max ${paused ? 'paused' : ''}`}
            onClick={() => setPaused(p => !p)}
            role="button"
            aria-label={paused ? 'Reprendre le défilement des avis' : 'Mettre en pause le défilement des avis'}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setPaused(p => !p)
              }
            }}
          >
            {loop.map((t, i) => (
              <li
                key={`${t.author}-${i}`}
                className="shrink-0 w-[280px] sm:w-[340px] rounded-2xl bg-[var(--color-graphite)] hairline p-5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <Stars count={t.rating} />
                  <span
                    className="text-[10px] uppercase tracking-[0.18em] font-bold text-[var(--color-mute)]"
                    aria-hidden
                  >
                    Google
                  </span>
                </div>
                <p className="text-[var(--color-silver-2)] text-[14px] leading-relaxed text-pretty line-clamp-5">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-4 pt-3 border-t border-white/[0.05]">
                  <div className="font-display font-semibold text-[var(--color-cream)] text-[14px] tracking-tight">{t.author}</div>
                  <div className="text-[12px] text-[var(--color-mute)] mt-0.5 truncate">{t.context}</div>
                </div>
              </li>
            ))}
          </ul>

          {/* Pause hint — tells the user the row is interactive */}
          <p className="absolute bottom-[-28px] left-1/2 -translate-x-1/2 text-[11px] text-[var(--color-mute)] uppercase tracking-[0.18em] font-medium pointer-events-none">
            {paused ? '⏸ Mise en pause — cliquez pour reprendre' : '▶ Cliquez pour mettre en pause'}
          </p>
        </m.div>
      </div>
    </section>
  )
}
