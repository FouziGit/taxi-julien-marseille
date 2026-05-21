import { motion } from 'motion/react'
import { pricing, paymentMethods } from '../data/taxi'
import { CardIcon, CheckIcon } from '../components/Icons'

export default function Tarifs() {
  return (
    <section id="tarifs" className="py-20 sm:py-28 bg-[var(--color-graphite)]" aria-labelledby="tarifs-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--color-silver-deep)]">— Tarifs</p>
          <h2 id="tarifs-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-3 text-balance tracking-tight">
            Tarifs réglementés. Affichés.
          </h2>
          <p className="mt-4 text-[var(--color-silver-deep)] text-[15px] sm:text-base max-w-xl mx-auto">
            Tarifs taxi officiels Marseille — conformes à l'arrêté préfectoral.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-3 sm:gap-4">
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

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="mt-3 sm:mt-4 rounded-3xl bg-white text-[var(--color-ink)] p-6 sm:p-8"
        >
          <div className="flex items-baseline justify-between">
            <h3 className="font-display font-semibold text-[18px] tracking-tight">Forfaits aller simple</h3>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">Prix fixe</span>
          </div>
          <ul className="mt-5 divide-y divide-black/10">
            {pricing.packages.map(p => (
              <li key={p.route} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <div className="font-display font-semibold text-[var(--color-ink)] text-[16px] tracking-tight">{p.route}</div>
                  <div className="text-[12.5px] text-[var(--color-mute)]">{p.note}</div>
                </div>
                <div className="font-display font-semibold text-2xl whitespace-nowrap tabular-nums">{p.price}</div>
              </li>
            ))}
          </ul>
        </motion.div>

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
