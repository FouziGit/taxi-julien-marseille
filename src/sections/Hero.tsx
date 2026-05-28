import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { contact, trustBadges } from '../data/taxi'
import { PhoneIcon, WhatsAppIcon, StarIcon } from '../components/Icons'
import Pic from '../components/Pic'

const headline = 'Une autre idée'
const headline2 = 'du transport.'

const waUrl = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
  contact.whatsappBaseText + ' Je voudrais réserver un transfert.',
)}`

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  const split = (txt: string) => txt.split(' ').map((w, i) => (
    <motion.span
      key={i}
      className="inline-block mr-[0.22em]"
      initial={{ y: '60%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {w}
    </motion.span>
  ))

  return (
    <section
      ref={ref}
      id="contenu"
      className="relative overflow-hidden bg-[var(--color-ink)]"
      aria-labelledby="hero-heading"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-12 md:pb-20">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[var(--color-silver-2)]"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-live" aria-hidden/>
            <span>Disponible maintenant</span>
          </span>
          <span className="text-[var(--color-mute)]">·</span>
          <span>Marseille — Provence — Côte d'Azur</span>
        </motion.div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-14 items-center mt-5">
          {/* LEFT */}
          <div>
            <h1
              id="hero-heading"
              className="font-display font-semibold tracking-tight text-balance text-[clamp(2.4rem,8vw,5.2rem)] leading-[1.02]"
            >
              <span className="block text-[var(--color-cream)]">{split(headline)}</span>
              <span className="block silver-text">{split(headline2)}</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mt-5 text-[var(--color-silver-2)] text-base sm:text-lg max-w-xl leading-relaxed"
            >
              Mercedes Classe V jusqu'à 7 passagers. Aéroport, gare, port, longue distance, transport médical conventionné. Réservation immédiate, 24h/24.
            </motion.p>

            {/* CTAs */}
            <div className="mt-7 grid sm:grid-cols-2 gap-3 max-w-2xl">
              <motion.a
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.45 }}
                href={`tel:${contact.phoneTel}`}
                className="group relative flex items-center justify-center gap-3 h-16 rounded-2xl bg-white text-[var(--color-ink)] font-semibold text-lg overflow-hidden mag-btn sheen"
                aria-label={`Appeler maintenant ${contact.phoneDisplay}`}
              >
                <PhoneIcon className="w-5 h-5"/>
                <span className="flex flex-col items-start leading-none">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">Appeler maintenant</span>
                  <span className="text-xl mt-1 tracking-tight">{contact.phoneDisplay}</span>
                </span>
              </motion.a>

              <motion.a
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.45 }}
                href={waUrl}
                target="_blank"
                rel="noopener"
                className="group flex items-center justify-center gap-3 h-16 rounded-2xl bg-[var(--color-whatsapp)] text-white font-semibold text-lg mag-btn"
                aria-label="Contacter sur WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5"/>
                <span className="flex flex-col items-start leading-none">
                  <span className="text-[10px] uppercase tracking-[0.18em] opacity-80 font-bold">WhatsApp</span>
                  <span className="text-base mt-1">Réponse en quelques min</span>
                </span>
              </motion.a>
            </div>

            {/* Trust micro-row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-[var(--color-silver-deep)]"
            >
              <span className="flex items-center gap-1 text-[var(--color-cream)]" aria-label="5 sur 5">
                <StarIcon className="w-3.5 h-3.5"/>
                <StarIcon className="w-3.5 h-3.5"/>
                <StarIcon className="w-3.5 h-3.5"/>
                <StarIcon className="w-3.5 h-3.5"/>
                <StarIcon className="w-3.5 h-3.5"/>
                <span className="ml-1 font-semibold">5,0</span>
              </span>
              <span>Conventionné CPAM</span>
              <span>Depuis 2009</span>
              <span className="text-[10px] text-[var(--color-mute)] italic ml-auto sm:ml-0" title="On fera de notre mieux par téléphone, l'anglais c'est pas évident — préférez WhatsApp pour écrire 😉">
                a little english 😉
              </span>
            </motion.div>
          </div>

          {/* RIGHT — real Mercedes photo with parallax + reveal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative order-first lg:order-last"
          >
            <div className="relative rounded-[28px] overflow-hidden hairline aspect-[5/4] sm:aspect-[16/11] bg-[var(--color-graphite)]">
              <motion.div
                style={{ y: photoY, scale: photoScale }}
                className="absolute inset-0"
              >
                <Pic
                  src="/photos/v8.jpg"
                  srcSm="/photos/v8-sm.jpg"
                  withAvif
                  alt="Mercedes Classe V Taxi Julien à l'aéroport Marseille Provence Terminal 1"
                  eager
                  fetchPriority="high"
                  width={1200}
                  height={900}
                  className="w-full h-full object-cover reveal"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/60 via-transparent to-transparent"/>

              {/* Compact pill on mobile, full spec card on desktop */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 max-w-[60%] sm:max-w-none"
              >
                {/* Mobile : pill compacte */}
                <div className="sm:hidden inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)]/85 backdrop-blur-md py-2 px-3 hairline-strong">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-live shrink-0" aria-hidden/>
                  <span className="text-[12px] font-display font-semibold text-[var(--color-cream)] tracking-tight whitespace-nowrap">
                    Mercedes Classe V · 7 pax
                  </span>
                </div>

                {/* Desktop : carte complète */}
                <div className="hidden sm:block rounded-xl bg-[var(--color-ink)]/85 backdrop-blur-md p-4 max-w-[280px] hairline-strong">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">Notre flotte</div>
                  <div className="font-display font-semibold text-[var(--color-cream)] text-lg mt-1 tracking-tight">Mercedes Classe V</div>
                  <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-white/[0.08]">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--color-mute)]">Pax</div>
                      <div className="font-display font-bold text-[var(--color-cream)] text-base">7</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--color-mute)]">Bagages</div>
                      <div className="font-display font-bold text-[var(--color-cream)] text-base">XL</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--color-mute)]">Service</div>
                      <div className="font-display font-bold text-[var(--color-cream)] text-base">24/7</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Marquee trust strip */}
      <div className="border-y border-white/[0.05] bg-[var(--color-graphite)] py-3 overflow-hidden">
        <div className="flex marquee whitespace-nowrap gap-10 text-[var(--color-silver-deep)] text-[13px] uppercase tracking-[0.18em]">
          {[...trustBadges, ...trustBadges].map((b, i) => (
            <span key={i} className="flex items-center gap-10">
              <span className="font-medium">{b}</span>
              <span className="text-[var(--color-line)]">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
