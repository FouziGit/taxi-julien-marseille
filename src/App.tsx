import { lazy, Suspense, useRef, useState } from 'react'
import TopBar from './components/TopBar'
import StickyDock from './components/StickyDock'
import Hero from './sections/Hero'
import Reviews from './sections/Reviews'
import Destinations from './sections/Destinations'
import Reservation, { type ReservationFields } from './sections/Reservation'
import { destinations, type Destination } from './data/taxi'

// Above-the-fold (TopBar, Hero, Reviews, Destinations, Reservation) eager.
// Reviews now sits right under the Hero's trust marquee — it's the first
// thing a visitor sees after the fold, social-proof gating the rest of the
// page. Loading it eagerly avoids a Suspense flash on that early scroll.
// Below-the-fold sections stay lazy-loaded → smaller initial JS bundle.
const Services = lazy(() => import('./sections/Services'))
const Tarifs = lazy(() => import('./sections/Tarifs'))
const Fleet = lazy(() => import('./sections/Fleet'))
const Gallery = lazy(() => import('./sections/Gallery'))
const Blog = lazy(() => import('./sections/Blog'))
const Zone = lazy(() => import('./sections/Zone'))
const FAQ = lazy(() => import('./sections/FAQ'))
const Contact = lazy(() => import('./sections/Contact'))
const Footer = lazy(() => import('./sections/Footer'))

// Skeleton placeholder while a section's chunk downloads — preserves layout, no CLS.
function SectionFallback() {
  return <div className="min-h-[300px] bg-[var(--color-ink)]" aria-hidden />
}

export default function App() {
  const formRef = useRef<HTMLFormElement | null>(null)
  const dateRef = useRef<HTMLInputElement | null>(null)
  const [prefill, setPrefill] = useState<ReservationFields>({ from: '', to: '' })

  function pickDestination(d: Destination, fromValue?: string) {
    const next: ReservationFields = {
      from: fromValue ?? 'Marseille — adresse à préciser',
      to: d.name,
    }
    setPrefill(next)
    requestAnimationFrame(() => {
      const target = document.getElementById('reservation')
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => dateRef.current?.focus(), 600)
    })
  }

  // Convenience for Blog → reservation: lookup destination by id
  function pickDestinationById(id: string) {
    const d = destinations.find(x => x.id === id)
    if (d) pickDestination(d)
  }

  return (
    <>
      <TopBar/>
      <main>
        <Hero/>
        <Reviews/>
        <Destinations onPick={pickDestination}/>
        <Reservation prefill={prefill} setPrefill={setPrefill} formRef={formRef} dateRef={dateRef}/>
        <Suspense fallback={<SectionFallback/>}><Services/></Suspense>
        <Suspense fallback={<SectionFallback/>}><Tarifs/></Suspense>
        <Suspense fallback={<SectionFallback/>}><Fleet/></Suspense>
        <Suspense fallback={<SectionFallback/>}><Gallery/></Suspense>
        <Suspense fallback={<SectionFallback/>}><Blog onPickDestination={pickDestinationById}/></Suspense>
        <Suspense fallback={<SectionFallback/>}><Zone onPickDestination={pickDestination}/></Suspense>
        <Suspense fallback={<SectionFallback/>}><FAQ/></Suspense>
        <Suspense fallback={<SectionFallback/>}><Contact/></Suspense>
      </main>
      <Suspense fallback={null}><Footer/></Suspense>
      <StickyDock/>
    </>
  )
}
