import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { fleet } from '../data/taxi'
import { CheckIcon } from '../components/Icons'
import Pic from '../components/Pic'

export default function Fleet() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30])
  const v = fleet[0]

  return (
    <section id="flotte" className="py-20 sm:py-28 bg-[var(--color-ink)] overflow-hidden" aria-labelledby="fleet-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--color-silver-deep)]">— Notre flotte</p>
          <h2 id="fleet-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-3 text-balance tracking-tight">
            Mercedes Classe V.
          </h2>
          <p className="mt-4 text-[var(--color-silver-deep)] max-w-xl mx-auto text-[15px] sm:text-base">
            Un véhicule unique. Spacieux, soigné, pensé pour les familles, les groupes et les voyageurs d'affaires.
          </p>
        </motion.div>

        <div ref={ref} className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden hairline aspect-[5/4] sm:aspect-[16/10]"
          >
            <motion.div style={{ y }} className="absolute -inset-y-8 inset-x-0">
              <Pic
                src={v.image}
                srcSm={v.imageSm}
                alt={`${v.model} — flotte ${v.seats} passagers Taxi Julien`}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/40 via-transparent to-transparent"/>

            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[var(--color-ink)]/85 backdrop-blur-md text-[10px] font-bold text-[var(--color-cream)] uppercase tracking-[0.18em] hairline-strong">
              {v.model}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="grid grid-cols-3 gap-3 mb-7">
              <div className="rounded-2xl bg-[var(--color-graphite)] hairline p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">Pax max</div>
                <div className="font-display font-semibold text-3xl text-[var(--color-cream)] mt-1 tabular-nums">{v.seats}</div>
              </div>
              <div className="rounded-2xl bg-[var(--color-graphite)] hairline p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">Bagages</div>
                <div className="font-display font-semibold text-3xl text-[var(--color-cream)] mt-1">XL</div>
              </div>
              <div className="rounded-2xl bg-[var(--color-graphite)] hairline p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">Service</div>
                <div className="font-display font-semibold text-3xl text-[var(--color-cream)] mt-1">24/7</div>
              </div>
            </div>

            <h3 className="font-display font-semibold text-2xl text-[var(--color-cream)] tracking-tight">Équipements à bord</h3>
            <ul className="mt-4 grid sm:grid-cols-2 gap-x-4 gap-y-2.5">
              {v.features.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                  className="flex items-start gap-2.5 text-[14px] text-[var(--color-silver-2)]"
                >
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-white text-[var(--color-ink)] shrink-0 mt-0.5">
                    <CheckIcon className="w-3 h-3"/>
                  </span>
                  {f}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
