import { motion } from 'motion/react'
import { services } from '../data/taxi'
import { ServiceIcon } from '../components/Icons'

export default function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 bg-[var(--color-ink)]" aria-labelledby="serv-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between flex-wrap gap-4 mb-10"
        >
          <div>
            <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--color-silver-deep)]">— Prestations</p>
            <h2 id="serv-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-3 text-balance tracking-tight">
              Un service par usage.
            </h2>
          </div>
          <p className="text-[var(--color-silver-deep)] max-w-md text-[15px]">
            Aéroport, gare, port, médical, événementiel, longue distance — toute la région PACA, 24h/24.
          </p>
        </motion.div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {services.map((s, i) => (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-2xl bg-[var(--color-graphite)] hairline p-6 hover:bg-[var(--color-charcoal)] transition-all hover:-translate-y-1"
            >
              <div className="grid place-items-center w-11 h-11 rounded-xl bg-white/[0.06] text-[var(--color-cream)] group-hover:bg-white group-hover:text-[var(--color-ink)] transition">
                <ServiceIcon name={s.icon} className="w-6 h-6"/>
              </div>
              <h3 className="font-display font-semibold text-[17px] mt-5 text-[var(--color-cream)] tracking-tight">{s.title}</h3>
              <p className="mt-2 text-[14px] text-[var(--color-silver-deep)] leading-relaxed">{s.description}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
