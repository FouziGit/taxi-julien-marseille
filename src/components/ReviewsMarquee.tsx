import { useState } from 'react'
import type { Testimonial } from '../data/taxi'
import { StarIcon } from './Icons'

// 5★ row used everywhere a card needs the rating. role='img' + aria-label
// satisfies axe (aria-label on a bare span is prohibited without a role).
// `tone='gold'` is used on the white CTA — cream stars on a white button
// were invisible. Gold matches Google's review-star colour anyway.
export function Stars({ count, size = 'sm', tone = 'cream' }: { count: number; size?: 'sm' | 'lg'; tone?: 'cream' | 'gold' }) {
  const sizeCls = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'
  const toneCls = tone === 'gold' ? 'text-amber-400' : 'text-[var(--color-cream)]'
  const n = Math.max(1, Math.min(5, Math.round(count)))
  return (
    <span className={`inline-flex items-center gap-0.5 ${toneCls}`} role="img" aria-label={`${n} sur 5 étoiles`}>
      {Array.from({ length: n }).map((_, k) => <StarIcon key={k} className={sizeCls} />)}
    </span>
  )
}

// Bandeau d'avis qui défile (CSS .reviews-marquee), pause au survol ou au clic.
// `compact` : cartes plus petites, sans légende, pour le bloc sous le formulaire.
export default function ReviewsMarquee({ items, compact = false }: { items: Testimonial[]; compact?: boolean }) {
  const [paused, setPaused] = useState(false)
  // Duplicate the items so the CSS marquee can translateX(-50%) and appear
  // seamless (the second half is rendered identical to the first).
  const loop = [...items, ...items]
  const card = compact ? 'w-[240px] sm:w-[280px] p-4' : 'w-[280px] sm:w-[340px] p-5 sm:p-6'
  const text = compact ? 'text-[13px] line-clamp-3' : 'text-[14px] line-clamp-5'

  return (
    <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 [mask-image:linear-gradient(to_right,transparent_0%,#000_6%,#000_94%,transparent_100%)]">
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
          <li key={`${t.author}-${i}`} className={`shrink-0 rounded-2xl bg-[var(--color-graphite)] hairline ${card}`}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <Stars count={t.rating} />
              <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[var(--color-mute)]" aria-hidden>
                Google
              </span>
            </div>
            <p className={`text-[var(--color-silver-2)] leading-relaxed text-pretty ${text}`}>&ldquo;{t.text}&rdquo;</p>
            <div className="mt-4 pt-3 border-t border-white/[0.05]">
              <div className="font-display font-semibold text-[var(--color-cream)] text-[14px] tracking-tight">{t.author}</div>
              <div className="text-[12px] text-[var(--color-mute)] mt-0.5 truncate">{t.context}</div>
            </div>
          </li>
        ))}
      </ul>

      {!compact && (
        <p className="absolute bottom-[-28px] left-1/2 -translate-x-1/2 text-[11px] text-[var(--color-mute)] uppercase tracking-[0.18em] font-medium pointer-events-none">
          {paused ? '⏸ Mise en pause — cliquez pour reprendre' : '▶ Cliquez pour mettre en pause'}
        </p>
      )}
    </div>
  )
}
