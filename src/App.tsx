import { lazy, Suspense, useRef, useState } from 'react'
import TopBar from './components/TopBar'
import StickyDock from './components/StickyDock'
import Hero from './sections/Hero'
import Destinations from './sections/Destinations'
import Reservation, { type ReservationFields } from './sections/Reservation'
import type { Destination } from './data/taxi'

// Above-the-fold (TopBar, Hero, Destinations, Reservation) eager.
// Below-the-fold lazy-loaded → smaller initial JS bundle, faster TTI.
const Services = lazy(() => import('./sections/Services'))
const Tarifs = lazy(() => import('./sections/Tarifs'))
const Fleet = lazy(() => import('./sections/Fleet'))
const Gallery = lazy(() => import('./sections/Gallery'))
const Zone = lazy(() => import('./sections/Zone'))
const Reviews = lazy(() => import('./sections/Reviews'))
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

  return (
    <>
      <TopBar/>
      <main>
        <Hero/>
        <Destinations onPick={pickDestination}/>
        <Reservation prefill={prefill} setPrefill={setPrefill} formRef={formRef} dateRef={dateRef}/>
        <Suspense fallback={<SectionFallback/>}><Services/></Suspense>
        <Suspense fallback={<SectionFallback/>}><Tarifs/></Suspense>
        <Suspense fallback={<SectionFallback/>}><Fleet/></Suspense>
        <Suspense fallback={<SectionFallback/>}><Gallery/></Suspense>
        <Suspense fallback={<SectionFallback/>}><Zone/></Suspense>
        <Suspense fallback={<SectionFallback/>}><Reviews/></Suspense>
        <Suspense fallback={<SectionFallback/>}><FAQ/></Suspense>
        <Suspense fallback={<SectionFallback/>}><Contact/></Suspense>
      </main>
      <Suspense fallback={null}><Footer/></Suspense>
      <StickyDock/>
    </>
  )
}
