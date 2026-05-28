import { m } from 'motion/react'
import { useState } from 'react'
import { gallery } from '../data/taxi'
import Pic from '../components/Pic'

export default function Gallery() {
  const [active, setActive] = useState<string>('Toutes')
  const filters = ['Toutes', ...Array.from(new Set(gallery.map(g => g.context)))]
  const items = active === 'Toutes' ? gallery : gallery.filter(g => g.context === active)

  return (
    <section id="galerie" className="py-20 sm:py-28 bg-[var(--color-graphite)] overflow-hidden" aria-labelledby="gal-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between flex-wrap gap-4 mb-8"
        >
          <div>
            <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--color-silver-deep)]">— En situation</p>
            <h2 id="gal-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-3 text-balance tracking-tight">
              Le véhicule. En vrai.
            </h2>
          </div>
          <p className="text-[var(--color-silver-deep)] max-w-md text-[15px]">
            Photos réelles de notre Mercedes Classe V — aéroport, port de croisière, montagne, hôtel, ville.
          </p>
        </m.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={`px-4 h-9 rounded-full text-[13px] font-medium transition ${
                active === f
                  ? 'bg-white text-[var(--color-ink)]'
                  : 'hairline text-[var(--color-silver-2)] hover:bg-white/[0.04]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((p, i) => {
            // Vary aspect ratios for a magazine feel
            const isTall = i % 5 === 0 || i % 7 === 3
            const isWide = i % 6 === 1
            const span = isWide
              ? 'col-span-2 aspect-[16/10]'
              : isTall
              ? 'aspect-[4/5] sm:row-span-2'
              : 'aspect-square'

            return (
              <m.figure
                key={p.src}
                layout
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.45, delay: (i % 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative overflow-hidden rounded-2xl hairline bg-[var(--color-charcoal)] ${span}`}
              >
                <Pic
                  src={p.src}
                  srcSm={p.srcSm}
                  alt={p.alt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/80 via-transparent to-transparent opacity-90"/>
                <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex items-end justify-between gap-2">
                  <div className="text-[12px] sm:text-[13px] font-medium text-[var(--color-cream)] tracking-tight leading-snug">
                    {p.caption}
                  </div>
                  <span className="shrink-0 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-bold px-2 py-1 rounded-full bg-[var(--color-ink)]/70 backdrop-blur text-[var(--color-silver-2)] hairline-strong">
                    {p.context}
                  </span>
                </figcaption>
              </m.figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
