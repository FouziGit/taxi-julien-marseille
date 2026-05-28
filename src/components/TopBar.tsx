import { useEffect, useState } from 'react'
import { contact, business } from '../data/taxi'
import { PhoneIcon } from './Icons'

/**
 * TopBar — replaces the previous Motion-driven version.
 *
 * Why we ditched Motion + useScroll/useTransform here:
 * - On mobile, the per-frame re-render of three inline-style values
 *   (backdrop-filter, background, border) plus a dynamic backdrop-filter
 *   blur was one of the most expensive things on the page. backdrop-filter
 *   in particular often forces a software paint path on mobile GPUs.
 * - The end state is a single bool ("scrolled past 80px") — Motion was
 *   overkill for a binary state.
 *
 * The new pattern: an IntersectionObserver-lite via scroll listener that
 * toggles a class. CSS handles the transition. Zero JS work per frame.
 */
export default function TopBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Passive listener — never blocks scroll. We only ever read scrollY,
    // never write, so no layout thrash.
    function onScroll() {
      setScrolled(window.scrollY > 80)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        scrolled
          ? 'bg-[var(--color-ink)]/85 backdrop-blur-md border-b border-white/[0.06]'
          : 'bg-transparent border-b border-transparent'
      }`}
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
    </header>
  )
}
