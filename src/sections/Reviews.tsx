import { m } from 'motion/react'
import { testimonials } from '../data/taxi'
import { StarIcon } from '../components/Icons'

export default function Reviews() {
  return (
    <section id="avis" className="py-20 sm:py-28 bg-[var(--color-ink)]" aria-labelledby="avis-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--color-silver-deep)]">— Avis clients</p>
          <h2 id="avis-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-3 text-balance tracking-tight">
            Cinq sur cinq.
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 text-[var(--color-silver-2)]">
            <span className="flex items-center gap-0.5 text-[var(--color-cream)]" aria-label="5 sur 5 étoiles">
              <StarIcon className="w-4 h-4"/>
              <StarIcon className="w-4 h-4"/>
              <StarIcon className="w-4 h-4"/>
              <StarIcon className="w-4 h-4"/>
              <StarIcon className="w-4 h-4"/>
            </span>
            <span className="font-semibold">5,0/5</span>
            <span className="text-[var(--color-mute)]">· {testimonials.length} avis vérifiés</span>
          </div>
        </m.div>

        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {testimonials.map((t, i) => (
            <m.li
              key={t.author}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl bg-[var(--color-graphite)] hairline p-6 hover:bg-[var(--color-charcoal)] transition"
            >
              <div className="flex items-center gap-0.5 text-[var(--color-cream)]" aria-label="5 étoiles">
                {Array.from({ length: t.rating }).map((_, k) => <StarIcon key={k} className="w-3.5 h-3.5"/>)}
              </div>
              <p className="mt-4 text-[var(--color-silver-2)] text-[14.5px] leading-relaxed text-pretty">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-5 pt-4 border-t border-white/[0.05]">
                <div className="font-display font-semibold text-[var(--color-cream)] text-[14px] tracking-tight">{t.author}</div>
                <div className="text-[12px] text-[var(--color-mute)] mt-0.5">{t.context}</div>
              </div>
            </m.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
