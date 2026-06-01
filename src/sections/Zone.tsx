import { m, AnimatePresence } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  transportHubs,
  varCorridor,
  provenceArea,
  hospitals,
  findFareForCity,
  buildRouteMapUrl,
  destinations,
  type Destination,
} from '../data/taxi'
import {
  PlaneIcon,
  TrainIcon,
  ShipIcon,
  MountainIcon,
  MedicalIcon,
  PinIcon,
  RoadIcon,
  ChevronIcon,
  ClockIcon,
} from '../components/Icons'

type HubKey = 'airports' | 'stations' | 'ski' | 'ports' | 'hospitals'

const hubs: { key: HubKey; label: string; Icon: typeof PlaneIcon; items: readonly string[]; sub: string }[] = [
  { key: 'airports', label: 'Aéroports', Icon: PlaneIcon, items: transportHubs.airports, sub: 'Forfait fixe · suivi du vol' },
  { key: 'stations', label: 'Gares', Icon: TrainIcon, items: transportHubs.stations, sub: 'Accueil sur le quai' },
  { key: 'ports', label: 'Ports', Icon: ShipIcon, items: transportHubs.ports, sub: 'Costa, MSC · bagages XL' },
  { key: 'ski', label: 'Stations de ski', Icon: MountainIcon, items: transportHubs.ski, sub: 'Longue distance — sur devis' },
  { key: 'hospitals', label: 'Hôpitaux', Icon: MedicalIcon, items: hospitals, sub: 'Conventionné CPAM — VSL' },
]

// Default map (no city selected) — wide bbox over the whole service area.
const DEFAULT_MAP_SRC = 'https://www.openstreetmap.org/export/embed.html?bbox=4.50%2C42.85%2C7.20%2C44.30&layer=mapnik&marker=43.2722%2C5.3956'

type Props = {
  onPickDestination?: (d: Destination) => void
}

export default function Zone({ onPickDestination }: Props) {
  const [activeHub, setActiveHub] = useState<HubKey>('airports')
  const active = hubs.find(h => h.key === activeHub)!

  // Interactive route picker — set when a city chip is clicked.
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const mapSrc = useMemo(() => {
    if (!selectedCity) return DEFAULT_MAP_SRC
    return buildRouteMapUrl(selectedCity) ?? DEFAULT_MAP_SRC
  }, [selectedCity])

  const fare = useMemo(() => (selectedCity ? findFareForCity(selectedCity) : null), [selectedCity])

  // Match the clicked city back to a known Destination so the reservation form
  // can prefill cleanly. Falls back to a minimal stub if not found.
  function reserveTrip() {
    if (!selectedCity || !onPickDestination) return
    const known = destinations.find(d => d.name === selectedCity || d.shortName === selectedCity)
    if (known) {
      onPickDestination(known)
    } else {
      onPickDestination({
        id: `zone-${selectedCity.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: selectedCity,
        category: 'Ville',
      })
    }
  }

  // Defer the OpenStreetMap iframe until the map is near the viewport.
  // Saves ~150 KB JS + DNS lookup + map tile fetches during initial page load.
  const mapWrapRef = useRef<HTMLDivElement | null>(null)
  const [mapVisible, setMapVisible] = useState(false)
  useEffect(() => {
    if (!mapWrapRef.current || mapVisible) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some(e => e.isIntersecting)) {
          setMapVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    io.observe(mapWrapRef.current)
    return () => io.disconnect()
  }, [mapVisible])

  return (
    <section id="zone" className="py-20 sm:py-28 bg-[var(--color-graphite)]" aria-labelledby="zone-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
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
          <p className="mt-2 text-[12px] text-[var(--color-mute)] max-w-xl mx-auto">
            Cliquez sur une ville pour voir le trajet et le tarif depuis Marseille.
          </p>
        </m.div>

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
                aria-current={isActive ? 'true' : undefined}
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
        <m.div
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
        </m.div>

        {/* Map + Provence */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-3">
          <m.div
            ref={mapWrapRef}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden hairline bg-[var(--color-charcoal)] aspect-[4/3] sm:aspect-[16/10]"
          >
            {mapVisible ? (
              <iframe
                title={selectedCity
                  ? `Trajet Marseille → ${selectedCity} sur OpenStreetMap`
                  : "Zone d'intervention Taxi Julien — Marseille, Provence et Côte d'Azur"}
                src={mapSrc}
                key={mapSrc /* force reload when src changes */}
                loading="lazy"
                className="w-full h-full border-0 grayscale-[20%] contrast-[0.95] transition-opacity"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div
                className="w-full h-full grid place-items-center bg-gradient-to-br from-[var(--color-graphite)] via-[var(--color-charcoal)] to-[var(--color-ink)]"
                aria-hidden="true"
              >
                <div className="text-[var(--color-silver-deep)] flex flex-col items-center gap-2">
                  <PinIcon className="w-8 h-8"/>
                  <span className="text-[12px] uppercase tracking-[0.2em] font-bold">Carte en cours de chargement…</span>
                </div>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-[var(--color-ink)]/10"/>

            {/* Map caption — adapts to the current selection */}
            <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-lg bg-[var(--color-ink)]/85 backdrop-blur hairline-strong text-[12.5px] sm:text-sm text-[var(--color-cream)] flex items-center gap-2">
              <PinIcon className="w-4 h-4 shrink-0"/>
              {selectedCity ? (
                <span>
                  <span className="text-[var(--color-silver-deep)]">Marseille →</span>{' '}
                  <strong className="font-semibold">{selectedCity}</strong>
                </span>
              ) : (
                <span>Marseille → Saint-Tropez · Provence · Stations de ski</span>
              )}
            </div>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-3xl bg-[var(--color-charcoal)] hairline p-6 sm:p-7"
          >
            <h3 className="font-display font-semibold text-[16px] text-[var(--color-cream)] tracking-tight">Provence — intérieure</h3>
            <p className="text-[12px] text-[var(--color-mute)] mt-1">Aix, Avignon, Arles & alentours · cliquez pour voir le trajet</p>
            <ul className="mt-4 grid grid-cols-2 gap-y-1.5 gap-x-2 text-[13.5px]">
              {provenceArea.map(c => {
                const isSelected = selectedCity === c
                return (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => setSelectedCity(isSelected ? null : c)}
                      aria-current={isSelected ? 'true' : undefined}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition ${
                        isSelected
                          ? 'bg-white text-[var(--color-ink)] font-semibold'
                          : 'text-[var(--color-silver-2)] hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isSelected ? 'bg-[var(--color-ink)]' : 'bg-[var(--color-silver-deep)]'
                      }`}/>
                      {c}
                    </button>
                  </li>
                )
              })}
            </ul>
          </m.div>
        </div>

        {/* Var corridor — clickable chips */}
        <m.div
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
            La côte du Var, c'est notre terrain de jeu. <span className="text-[var(--color-cream)]">Cliquez sur une ville</span> pour voir le trajet et le tarif.
          </p>

          {/* Clickable city chips */}
          <div className="relative">
            <ul className="relative flex flex-wrap gap-x-2 gap-y-2.5 items-center">
              {varCorridor.map((city, i) => {
                const isSelected = selectedCity === city
                return (
                  <m.li
                    key={city}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.02, 0.5) }}
                    className="flex items-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedCity(isSelected ? null : city)}
                      aria-current={isSelected ? 'true' : undefined}
                      className={`inline-flex items-center gap-2 px-3 h-8 rounded-full text-[12.5px] transition cursor-pointer ${
                        isSelected
                          ? 'bg-white text-[var(--color-ink)] font-semibold shadow-md'
                          : 'hairline bg-[var(--color-ink)]/40 text-[var(--color-silver-2)] hover:bg-white/[0.08] hover:text-[var(--color-cream)]'
                      }`}
                    >
                      <span className={`text-[10px] font-bold tabular-nums ${isSelected ? 'opacity-80' : 'opacity-60'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {city}
                    </button>
                    {i < varCorridor.length - 1 && (
                      <span className="text-[var(--color-line)] select-none" aria-hidden>—</span>
                    )}
                  </m.li>
                )
              })}
            </ul>
          </div>
        </m.div>

        {/* Selected-city fare card — slides up when a city is picked */}
        <AnimatePresence>
          {selectedCity && (
            <m.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              key={selectedCity + '-fare'}
              className="mt-3 rounded-3xl bg-white text-[var(--color-ink)] p-5 sm:p-6 sm:flex sm:items-center sm:justify-between gap-4"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start sm:items-center gap-4 mb-4 sm:mb-0">
                <div className="grid place-items-center w-12 h-12 rounded-2xl bg-[var(--color-ink)] text-white shrink-0">
                  <PinIcon className="w-5 h-5"/>
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-600">Trajet</div>
                  <div className="font-display font-semibold text-lg sm:text-xl tracking-tight leading-tight">
                    Marseille → {selectedCity}
                  </div>
                  {fare && (
                    <div className="text-[12px] text-gray-600 mt-0.5">{fare.table}</div>
                  )}
                </div>
              </div>

              <div className="flex items-stretch gap-2 sm:gap-3 sm:flex-wrap">
                {fare ? (
                  <>
                    {fare.day && (
                      <div className="flex flex-col items-center sm:items-end px-3 sm:px-4 py-2 rounded-xl bg-gray-100">
                        <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-gray-600">Jour</span>
                        <span className="font-display font-semibold text-lg tabular-nums whitespace-nowrap">{fare.day}</span>
                      </div>
                    )}
                    {fare.night && (
                      <div className="flex flex-col items-center sm:items-end px-3 sm:px-4 py-2 rounded-xl bg-gray-100">
                        <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-gray-600">Nuit</span>
                        <span className="font-display font-semibold text-lg tabular-nums whitespace-nowrap">{fare.night}</span>
                      </div>
                    )}
                    {fare.from && (
                      <div className="flex flex-col items-center sm:items-end px-3 sm:px-4 py-2 rounded-xl bg-gray-100">
                        <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-gray-600">À partir de</span>
                        <span className="font-display font-semibold text-lg tabular-nums whitespace-nowrap">{fare.from}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-[13px]">
                    <ClockIcon className="w-4 h-4"/>
                    Tarif sur devis — proche de Marseille
                  </div>
                )}

                <button
                  type="button"
                  onClick={reserveTrip}
                  className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-xl bg-[var(--color-ink)] text-white font-semibold text-[14px] mag-btn whitespace-nowrap"
                >
                  Réserver ce trajet
                  <ChevronIcon className="w-4 h-4 -rotate-90"/>
                </button>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
