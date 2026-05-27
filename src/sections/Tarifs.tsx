import { motion } from 'motion/react'
import { useState } from 'react'
import { pricing, paymentMethods, fareTables, contact } from '../data/taxi'
import { CardIcon, CheckIcon, PinIcon, WhatsAppIcon } from '../components/Icons'

const TABLE_KEYS = ['airport', 'marseille', 'ski'] as const
type TableKey = (typeof TABLE_KEYS)[number]

const tabLabel: Record<TableKey, string> = {
  airport: 'Aéroport',
  marseille: 'Marseille → Côte / Provence',
  ski: 'Stations de ski',
}

export default function Tarifs() {
  const [active, setActive] = useState<TableKey>('marseille')
  const current = fareTables.find(t => t.key === active)!

  return (
    <section id="tarifs" className="py-20 sm:py-28 bg-[var(--color-graphite)]" aria-labelledby="tarifs-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--color-silver-deep)]">— Tarifs</p>
          <h2 id="tarifs-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-3 text-balance tracking-tight">
            Forfaits affichés. Sans surprise.
          </h2>
          <p className="mt-4 text-[var(--color-silver-deep)] text-[15px] sm:text-base max-w-2xl mx-auto">
            Tarifs taxi réglementés Marseille + forfaits longue distance fixes,
            communiqués à la réservation. <strong className="text-[var(--color-cream)] font-semibold">Tarif Jour</strong> 7h–19h.
            <strong className="text-[var(--color-cream)] font-semibold"> Tarif Nuit</strong> 19h–7h, dimanches et jours fériés.
          </p>
        </motion.div>

        {/* TAB BAR */}
        <div className="flex flex-wrap gap-2 justify-center mb-5">
          {TABLE_KEYS.map(k => {
            const isActive = k === active
            return (
              <button
                key={k}
                type="button"
                onClick={() => setActive(k)}
                className={`px-4 sm:px-5 h-11 rounded-full text-[13px] sm:text-[14px] font-display font-semibold tracking-tight transition mag-btn ${
                  isActive
                    ? 'bg-white text-[var(--color-ink)]'
                    : 'bg-[var(--color-charcoal)] hairline text-[var(--color-cream)] hover:bg-white/[0.06]'
                }`}
                aria-pressed={isActive}
              >
                {tabLabel[k]}
              </button>
            )
          })}
        </div>

        {/* ACTIVE TABLE */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl bg-[var(--color-charcoal)] hairline overflow-hidden"
        >
          <div className="p-5 sm:p-7 flex items-baseline justify-between gap-3 flex-wrap border-b border-white/[0.05]">
            <div>
              <h3 className="font-display font-semibold text-[18px] sm:text-[20px] text-[var(--color-cream)] tracking-tight flex items-center gap-2">
                <PinIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
                {current.title}
              </h3>
              <p className="text-[12.5px] text-[var(--color-mute)] mt-1">{current.subtitle}</p>
            </div>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">
              {current.rows.length} destinations
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px] sm:text-[14px]">
              <thead className="bg-[var(--color-ink)]/40">
                <tr>
                  <th scope="col" className="text-left py-3 px-4 sm:px-6 text-[10px] uppercase tracking-[0.18em] text-[var(--color-silver-deep)] font-bold">
                    Destination
                  </th>
                  {current.hasNight ? (
                    <>
                      <th scope="col" className="text-right py-3 px-3 sm:px-6 text-[10px] uppercase tracking-[0.18em] text-[var(--color-silver-deep)] font-bold whitespace-nowrap">
                        Tarif Jour
                      </th>
                      <th scope="col" className="text-right py-3 px-3 sm:px-6 text-[10px] uppercase tracking-[0.18em] text-[var(--color-silver-deep)] font-bold whitespace-nowrap">
                        Tarif Nuit
                      </th>
                    </>
                  ) : (
                    <th scope="col" className="text-right py-3 px-3 sm:px-6 text-[10px] uppercase tracking-[0.18em] text-[var(--color-silver-deep)] font-bold whitespace-nowrap">
                      À partir de
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {current.rows.map((row, i) => (
                  <tr
                    key={row.dest}
                    className={`border-t border-white/[0.04] ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]'} hover:bg-white/[0.04] transition-colors`}
                  >
                    <th scope="row" className="text-left py-3 px-4 sm:px-6 text-[var(--color-silver-2)] font-normal">
                      {row.dest}
                    </th>
                    {current.hasNight ? (
                      <>
                        <td className="py-3 px-3 sm:px-6 text-right font-display font-semibold text-[var(--color-cream)] tabular-nums whitespace-nowrap">
                          {row.day}
                        </td>
                        <td className="py-3 px-3 sm:px-6 text-right font-display font-semibold text-[var(--color-silver-2)] tabular-nums whitespace-nowrap">
                          {row.night}
                        </td>
                      </>
                    ) : (
                      <td className="py-3 px-3 sm:px-6 text-right font-display font-semibold text-[var(--color-cream)] tabular-nums whitespace-nowrap">
                        {row.from}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer CTA */}
          <div className="p-5 sm:p-6 border-t border-white/[0.05] bg-[var(--color-ink)]/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-[13px] text-[var(--color-silver-deep)] leading-relaxed">
              Une destination absente du tableau ?
              <span className="text-[var(--color-cream)]"> Devis personnalisé en 5 min</span> — par WhatsApp ou téléphone.
            </p>
            <a
              href={`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(contact.whatsappBaseText + ' Je voudrais un devis personnalisé.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-[var(--color-whatsapp)] text-white font-semibold text-[13.5px] mag-btn shrink-0"
            >
              <WhatsAppIcon className="w-4 h-4"/>
              Demander un devis
            </a>
          </div>
        </motion.div>

        {/* Detailed compteur + suppléments */}
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-[var(--color-charcoal)] hairline p-6 sm:p-7"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="font-display font-semibold text-[18px] text-[var(--color-cream)] tracking-tight">Au compteur</h3>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">Réglementé</span>
            </div>
            <table className="mt-5 w-full text-[14px]">
              <tbody>
                {pricing.rates.map(r => (
                  <tr key={r.label} className="border-b border-white/[0.05] last:border-0">
                    <th scope="row" className="text-left py-3 pr-3 text-[var(--color-silver-2)] font-normal">{r.label}</th>
                    <td className="py-3 text-right font-display font-semibold text-[var(--color-cream)] tabular-nums">{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-3xl bg-[var(--color-charcoal)] hairline p-6 sm:p-7"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="font-display font-semibold text-[18px] text-[var(--color-cream)] tracking-tight">Suppléments</h3>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">Sur option</span>
            </div>
            <table className="mt-5 w-full text-[14px]">
              <tbody>
                {pricing.surcharges.map(r => (
                  <tr key={r.label} className="border-b border-white/[0.05] last:border-0">
                    <th scope="row" className="text-left py-3 pr-3 text-[var(--color-silver-2)] font-normal">{r.label}</th>
                    <td className="py-3 text-right font-display font-semibold text-[var(--color-cream)] tabular-nums">{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>

        <div className="mt-3 sm:mt-4 grid sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-3xl bg-[var(--color-charcoal)] hairline p-6">
            <h3 className="font-display font-semibold text-[15px] text-[var(--color-cream)] flex items-center gap-2 tracking-tight">
              <CardIcon className="w-4 h-4"/>
              Moyens de paiement
            </h3>
            <ul className="mt-4 space-y-2 text-[14px]">
              {paymentMethods.map(m => (
                <li key={m} className="flex items-start gap-2 text-[var(--color-silver-2)]">
                  <CheckIcon className="w-4 h-4 text-[var(--color-cream)] shrink-0 mt-0.5"/>
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-[var(--color-charcoal)] hairline p-6">
            <h3 className="font-display font-semibold text-[15px] text-[var(--color-cream)] tracking-tight">Bon à savoir</h3>
            <p className="mt-4 text-[14px] text-[var(--color-silver-2)] leading-relaxed">{pricing.invoiceNote}</p>
            <p className="mt-3 text-[12px] text-[var(--color-mute)]">{pricing.legalNote}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
