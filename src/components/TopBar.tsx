import { m, useScroll, useTransform } from 'motion/react'
import { contact, business } from '../data/taxi'
import { PhoneIcon } from './Icons'

export default function TopBar() {
  const { scrollY } = useScroll()
  const blur = useTransform(scrollY, [0, 80], [0, 14])
  const bg = useTransform(scrollY, [0, 80], ['rgba(10,10,12,0)', 'rgba(10,10,12,0.85)'])
  const border = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.06)'])

  return (
    <m.header
      style={{ backdropFilter: useTransform(blur, b => `blur(${b}px)`), background: bg, borderBottom: '1px solid', borderColor: border }}
      className="sticky top-0 z-50"
    >
      {/* DESKTOP layout — left brand block + right phone CTA */}
      <div className="hidden sm:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 items-center justify-between">
        <a href="#contenu" className="flex items-center gap-2.5 group" aria-label="Taxi Julien — accueil">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-white text-[var(--color-ink)] font-bold text-sm font-display">
            TJ
          </span>
          <div className="leading-tight">
            <div className="font-display font-semibold text-[var(--color-cream)] text-[15px] tracking-tight">
              {business.legalName}
            </div>
            <div className="text-[11px] text-[var(--color-mute)] -mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-live" aria-hidden/>
              <span>Disponible · Marseille</span>
            </div>
          </div>
        </a>

        <a
          href={`tel:${contact.phoneTel}`}
          className="flex items-center gap-2 px-4 h-10 rounded-full bg-white text-[var(--color-ink)] font-semibold text-sm hover:bg-[var(--color-silver)] transition mag-btn"
          aria-label={`Appeler ${contact.phoneDisplay}`}
        >
          <PhoneIcon className="w-4 h-4"/>
          {contact.phoneDisplay}
        </a>
      </div>

      {/* MOBILE layout — big centered brand, TJ chip left, phone right */}
      <div className="sm:hidden max-w-7xl mx-auto px-3 h-16 flex items-center gap-2">
        <a href="#contenu" aria-label="Accueil" className="shrink-0">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-white text-[var(--color-ink)] font-bold text-[13px] font-display tracking-tight">
            TJ
          </span>
        </a>

        <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center px-1">
          <div className="font-display font-bold text-[20px] leading-none text-[var(--color-cream)] tracking-tight uppercase">
            {business.legalName}
          </div>
          <div className="text-[10px] text-[var(--color-mute)] flex items-center gap-1.5 mt-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-live" aria-hidden/>
            <span>Disponible · Marseille</span>
          </div>
        </div>

        <a
          href={`tel:${contact.phoneTel}`}
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white text-[var(--color-ink)]"
          aria-label={`Appeler ${contact.phoneDisplay}`}
        >
          <PhoneIcon className="w-[18px] h-[18px]"/>
        </a>
      </div>
    </m.header>
  )
}
