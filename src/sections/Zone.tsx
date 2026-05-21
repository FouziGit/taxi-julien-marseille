import { motion } from 'motion/react'
import { useState } from 'react'
import { transportHubs, varCorridor, provenceArea, hospitals } from '../data/taxi'
import {
  PlaneIcon,
  TrainIcon,
  ShipIcon,
  MountainIcon,
  MedicalIcon,
  PinIcon,
  RoadIcon,
} from '../components/Icons'

type HubKey = 'airports' | 'stations' | 'ski' | 'ports' | 'hospitals'

const hubs: { key: HubKey; label: string; Icon: typeof PlaneIcon; items: readonly string[]; sub: string }[] = [
  { key: 'airports', label: 'Aéroports', Icon: PlaneIcon, items: transportHubs.airports, sub: 'Forfait fixe · suivi du vol' },
  { key: 'stations', label: 'Gares', Icon: TrainIcon, items: transportHubs.stations, sub: 'Accueil sur le quai' },
  { key: 'ports', label: 'Ports', Icon: ShipIcon, items: transportHubs.ports, sub: 'Costa, MSC · bagages XL' },
  { key: 'ski', label: 'Stations de ski', Icon: MountainIcon, items: transportHubs.ski, sub: 'Longue distance — sur devis' },
  { key: 'hospitals', label: 'Hôpitaux', Icon: MedicalIcon, items: hospitals, sub: 'Conventionné CPAM — VSL' },
]

export default function Zone() {
  const [activeHub, setActiveHub] = useState<HubKey>('airports')
  const active = hubs.find(h => h.key === activeHub)!

  return (
    <section id="zone" className="py-20 sm:py-28 bg-[var(--color-graphite)]" aria-labelledby="zone-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--color-silver-deep)]">— Zone d'intervention</p>
          <h2 id="zone-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-3 text-balance tracking-tight">
            Marseille. Et au-delà.
          </h2>
          <p className="mt-4 text-[var(--color-silver-deep)] max-w-xl mx-auto text-[15px] sm:text-base">
            Aéroports, gares, ports, stations de ski, et l'intégralité de la côte de Marseille à Saint-Tropez.
          </p>
        </motion.div>

        {/* HUB tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-3">
          {hubs.map(h => {
            const isActive = h.key === activeHub
            return (
              <button
                key={h.key}
                type="button"
                onClick={() => setActiveHub(h.key)}
                className={`flex items-center gap-2.5 p-4 rounded-2xl text-left transition mag-btn ${
                  isActive
                    ? 'bg-white text-[var(--color-ink)]'
                    : 'bg-[var(--color-charcoal)] hairline text-[var(--color-cream)] hover:bg-[var(--color-line-soft)]'
                }`}
                aria-pressed={isActive}
              >
                <h.Icon className="w-5 h-5 shrink-0"/>
                <div className="min-w-0">
                  <div className="font-display font-semibold text-[14px] tracking-tight truncate">{h.label}</div>
                  <div className={`text-[11px] mt-0.5 ${isActive ? 'text-[var(--color-mute)]' : 'text-[var(--color-silver-deep)]'} truncate`}>
                    {h.items.length} {h.key === 'hospitals' ? 'établissements' : h.key === 'ski' ? 'stations' : 'lieux'}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Active hub content */}
        <motion.div
          key={activeHub}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl bg-[var(--color-charcoal)] hairline p-5 sm:p-7 mb-3"
        >
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="font-display font-semibold text-[18px] text-[var(--color-cream)] tracking-tight flex items-center gap-2">
              <active.Icon className="w-5 h-5"/>
              {active.label}
            </h3>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">{active.sub}</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2.5 text-[14px]">
            {active.items.map(item => (
              <li key={item} className="flex items-start gap-2 text-[var(--color-silver-2)]">
                <span className="text-[var(--color-cream)] shrink-0 mt-0.5" aria-hidden>›</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Map + Provence */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden hairline bg-[var(--color-charcoal)] aspect-[4/3] sm:aspect-[16/10]"
          >
            <iframe
              title="Zone d'intervention Taxi Julien à Marseille"
              src="https://www.openstreetmap.org/export/embed.html?bbox=4.50%2C42.85%2C7.20%2C44.30&layer=mapnik&marker=43.2722%2C5.3956"
              loading="lazy"
              className="w-full h-full border-0 grayscale-[20%] contrast-[0.95]"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="pointer-events-none absolute inset-0 bg-[var(--color-ink)]/10"/>
            <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-lg bg-[var(--color-ink)]/85 backdrop-blur hairline-strong text-[12.5px] sm:text-sm text-[var(--color-cream)] flex items-center gap-2">
              <PinIcon className="w-4 h-4"/>
              Marseille → Saint-Tropez · Provence · Stations de ski
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-3xl bg-[var(--color-charcoal)] hairline p-6 sm:p-7"
          >
            <h3 className="font-display font-semibold text-[16px] text-[var(--color-cream)] tracking-tight">Provence — intérieure</h3>
            <p className="text-[12px] text-[var(--color-mute)] mt-1">Aix, Avignon, Arles & alentours</p>
            <ul className="mt-4 grid grid-cols-2 gap-y-2 gap-x-3 text-[13.5px]">
              {provenceArea.map(c => (
                <li key={c} className="flex items-center gap-2 text-[var(--color-silver-2)]">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-silver-deep)] shrink-0"/>
                  {c}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Var corridor — visual route */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="mt-3 rounded-3xl bg-[var(--color-charcoal)] hairline p-6 sm:p-8 overflow-hidden"
        >
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-2">
            <h3 className="font-display font-semibold text-[18px] text-[var(--color-cream)] tracking-tight flex items-center gap-2">
              <RoadIcon className="w-5 h-5"/>
              Le corridor — Marseille → Saint-Tropez
            </h3>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">{varCorridor.length} villes desservies</span>
          </div>
          <p className="text-[13.5px] text-[var(--color-silver-deep)] mb-5">
            La côte du Var, c'est notre terrain de jeu. De Marseille à Saint-Tropez, sans détour.
          </p>

          {/* Connected chips */}
          <div className="relative">
            <ul className="relative flex flex-wrap gap-x-2 gap-y-2.5 items-center">
              {varCorridor.map((city, i) => (
                <motion.li
                  key={city}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.02, 0.5) }}
                  className="flex items-center gap-2"
                >
                  <span className="inline-flex items-center gap-2 px-3 h-8 rounded-full hairline bg-[var(--color-ink)]/40 text-[12.5px] text-[var(--color-silver-2)] hover:bg-white hover:text-[var(--color-ink)] transition cursor-default">
                    <span className="text-[10px] font-bold tabular-nums opacity-60 group-hover:opacity-100">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {city}
                  </span>
                  {i < varCorridor.length - 1 && (
                    <span className="text-[var(--color-line)] select-none" aria-hidden>—</span>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
