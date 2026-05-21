import { motion, AnimatePresence } from 'motion/react'
import { useMemo, useState } from 'react'
import { destinations, departures, type Destination } from '../data/taxi'
import { ChevronIcon, PinIcon, ClockIcon, CardIcon } from '../components/Icons'
import Pic from '../components/Pic'

type Props = {
  onPick: (d: Destination, fromValue: string) => void
}

const groupOrder: Destination['category'][] = ['Aéroport', 'Gare', 'Port', 'Site', 'Ville']
const groupLabel: Record<Destination['category'], string> = {
  'Aéroport': 'Aéroports',
  'Gare': 'Gares',
  'Port': 'Ports',
  'Site': 'Sites & stations de ski',
  'Ville': 'Villes — Var, Provence & Côte d’Azur',
  'Hôpital': 'Hôpitaux',
}

export default function Destinations({ onPick }: Props) {
  const [fromId, setFromId] = useState<string>('aeroport-mp')
  const [toId, setToId] = useState<string>('cassis')

  const grouped = useMemo(() => {
    const out: Record<string, Destination[]> = {}
    destinations.forEach(d => {
      const isSki = d.id.startsWith('ski-')
      const key = isSki ? 'Site-ski' : d.category
      if (!out[key]) out[key] = []
      out[key].push(d)
    })
    return out
  }, [])

  const dest = destinations.find(d => d.id === toId) ?? destinations[0]
  const from = departures.find(p => p.id === fromId) ?? departures[16] // aéroport par défaut
  const priceLabel = dest.priceFrom && dest.priceTo
    ? `${dest.priceFrom}–${dest.priceTo} €`
    : (dest.note ?? 'Sur devis')

  function handleReserve() {
    onPick(dest, from.value)
  }

  const selectCls =
    'w-full h-14 px-4 pr-10 rounded-2xl bg-[var(--color-charcoal)] hairline text-[var(--color-cream)] font-display font-semibold text-[15px] tracking-tight appearance-none focus:outline-none focus:ring-2 focus:ring-white/25 transition cursor-pointer'

  return (
    <section id="destinations" className="py-20 sm:py-28 bg-[var(--color-ink)]" aria-labelledby="dest-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--color-silver-deep)]">— Construisez votre trajet</p>
          <h2 id="dest-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-3 text-balance tracking-tight">
            D'où. Vers où.
          </h2>
          <p className="mt-4 text-[var(--color-silver-deep)] text-[15px] sm:text-base max-w-xl mx-auto">
            Sélectionnez un départ et une destination — on s'occupe du reste.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-4 lg:gap-6">
          {/* LEFT: selectors + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            className="rounded-3xl bg-[var(--color-graphite)] hairline p-5 sm:p-7 flex flex-col gap-4"
          >
            <div>
              <label htmlFor="dep" className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-silver-deep)] flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-live"/>
                Départ
              </label>
              <div className="relative">
                <select id="dep" value={fromId} onChange={e => setFromId(e.target.value)} className={selectCls} aria-label="Lieu de départ">
                  <optgroup label="Marseille — 1er à 16e arrondissement">
                    {departures.filter(d => d.group === 'Marseille').map(d => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Hubs Marseille">
                    {departures.filter(d => d.group === 'Hubs').map(d => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </optgroup>
                </select>
                <ChevronIcon className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-silver-deep)] pointer-events-none"/>
              </div>
            </div>

            <div className="relative flex items-center justify-center -my-1">
              <div className="absolute inset-x-0 h-px bg-white/[0.05]"/>
              <div className="relative grid place-items-center w-9 h-9 rounded-full bg-[var(--color-charcoal)] hairline text-[var(--color-cream)]">
                <ChevronIcon className="w-4 h-4"/>
              </div>
            </div>

            <div>
              <label htmlFor="arr" className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-silver-deep)] flex items-center gap-1.5 mb-2">
                <PinIcon className="w-3 h-3"/>
                Arrivée
              </label>
              <div className="relative">
                <select id="arr" value={toId} onChange={e => setToId(e.target.value)} className={selectCls} aria-label="Destination">
                  {groupOrder.map(cat => {
                    if (cat === 'Site') {
                      const sites = grouped['Site'] ?? []
                      const ski = grouped['Site-ski'] ?? []
                      return (
                        <>
                          {sites.length > 0 && (
                            <optgroup key="sites" label="Sites & calanques">
                              {sites.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </optgroup>
                          )}
                          {ski.length > 0 && (
                            <optgroup key="ski" label="Stations de ski">
                              {ski.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </optgroup>
                          )}
                        </>
                      )
                    }
                    const list = grouped[cat] ?? []
                    if (!list.length) return null
                    return (
                      <optgroup key={cat} label={groupLabel[cat]}>
                        {list.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </optgroup>
                    )
                  })}
                </select>
                <ChevronIcon className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-silver-deep)] pointer-events-none"/>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-1 text-[13px] text-[var(--color-silver-2)]">
              {dest.duration && (
                <span className="flex items-center gap-1.5">
                  <ClockIcon className="w-4 h-4 text-[var(--color-silver-deep)]"/>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={dest.id + '-d'}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {dest.duration}
                    </motion.span>
                  </AnimatePresence>
                </span>
              )}
              <span className="flex items-center gap-1.5 ml-auto">
                <CardIcon className="w-4 h-4 text-[var(--color-silver-deep)]"/>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={dest.id + '-p'}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="font-display font-semibold text-[var(--color-cream)] tabular-nums"
                  >
                    {priceLabel}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>

            <button
              type="button"
              onClick={handleReserve}
              className="mt-2 inline-flex items-center justify-center gap-2 h-14 rounded-2xl bg-white text-[var(--color-ink)] font-semibold text-[15px] mag-btn sheen tracking-tight"
            >
              Réserver ce trajet
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          </motion.div>

          {/* RIGHT: photo preview */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden hairline bg-[var(--color-charcoal)] aspect-[5/4] sm:aspect-[16/11] lg:aspect-auto lg:min-h-[420px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                {dest.photo ? (
                  <Pic
                    src={dest.photo}
                    srcSm={dest.photoSm}
                    alt={`Taxi Julien — destination ${dest.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const t = e.currentTarget as HTMLImageElement
                      t.parentElement!.style.display = 'none'
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,12,0.6)_100%)]"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/95 via-[var(--color-ink)]/30 to-transparent"/>
              </motion.div>
            </AnimatePresence>

            {/* Texts */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={dest.id + '-text'}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-[var(--color-silver-2)] mb-2">
                    {dest.id.startsWith('ski-') ? 'Station de ski' : dest.category}
                  </div>
                  <h3 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-[var(--color-cream)] tracking-tight text-balance">
                    {dest.name}
                  </h3>
                  {dest.tagline && (
                    <p className="mt-2 text-[var(--color-silver-2)] text-[14px] sm:text-[15px]">{dest.tagline}</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Top-right badge */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[var(--color-ink)]/85 backdrop-blur-md hairline-strong text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-cream)] flex items-center gap-1.5">
              <PinIcon className="w-3 h-3"/>
              {dest.shortName ?? dest.name}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
