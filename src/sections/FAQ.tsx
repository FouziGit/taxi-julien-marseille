import { useState } from 'react'
import { m, AnimatePresence } from 'motion/react'
import { faq } from '../data/taxi'
import { ChevronIcon } from '../components/Icons'

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[var(--color-graphite)]" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--color-silver-deep)]">— FAQ</p>
          <h2 id="faq-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-3 text-balance tracking-tight">
            Questions fréquentes.
          </h2>
        </m.div>

        <ul className="space-y-2">
          {faq.map((item, i) => {
            const isOpen = open === i
            return (
              <li key={i} className="rounded-2xl hairline overflow-hidden bg-[var(--color-charcoal)]">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5 text-left hover:bg-white/[0.02] transition"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                >
                  <span className="font-display font-medium text-[var(--color-cream)] text-[15px] sm:text-[16px] pr-2 tracking-tight">
                    {item.q}
                  </span>
                  <span className={`shrink-0 grid place-items-center w-8 h-8 rounded-full hairline transition-transform ${isOpen ? 'rotate-180 bg-white/10' : ''}`}>
                    <ChevronIcon className="w-4 h-4 text-[var(--color-cream)]"/>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 sm:px-6 sm:pb-6 text-[var(--color-silver-2)] text-[14.5px] sm:text-[15px] leading-relaxed">
                        {item.a}
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
