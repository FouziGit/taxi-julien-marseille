import { type FormEvent } from 'react'
import { m } from 'motion/react'
import { contact } from '../data/taxi'
import { WhatsAppIcon, PhoneIcon } from '../components/Icons'

export type ReservationFields = {
  from: string
  to: string
}

type Props = {
  prefill: ReservationFields
  setPrefill: (f: ReservationFields) => void
  formRef: React.RefObject<HTMLFormElement | null>
  dateRef: React.RefObject<HTMLInputElement | null>
}

export default function Reservation({ prefill, setPrefill, formRef, dateRef }: Props) {
  function getData(form: HTMLFormElement) {
    const fd = new FormData(form)
    return {
      name: String(fd.get('name') || ''),
      phone: String(fd.get('phone') || ''),
      email: String(fd.get('email') || ''),
      date: String(fd.get('date') || ''),
      time: String(fd.get('time') || ''),
      from: String(fd.get('from') || ''),
      to: String(fd.get('to') || ''),
      passengers: String(fd.get('passengers') || '1'),
      luggage: String(fd.get('luggage') || '0'),
      message: String(fd.get('message') || ''),
    }
  }

  // The form submits straight to WhatsApp — no email path. Validate the
  // required fields first (native HTML5), build a pre-filled message, open
  // wa.me. On mobile this opens the WhatsApp app, on desktop web.whatsapp.com.
  function onSubmitWhatsApp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity()
      return
    }
    const data = getData(e.currentTarget)
    const text =
      `${contact.whatsappBaseText}\n\n` +
      `Date : ${data.date || '—'} à ${data.time || '—'}\n` +
      `Départ : ${data.from || '—'}\n` +
      `Arrivée : ${data.to || '—'}\n` +
      `${data.passengers || '1'} passager(s) · ${data.luggage || '0'} bagage(s)\n` +
      (data.name ? `\nNom : ${data.name}\n` : '') +
      (data.phone ? `Téléphone : ${data.phone}\n` : '') +
      (data.email ? `Email : ${data.email}\n` : '') +
      (data.message ? `\nMessage : ${data.message}` : '')
    const url = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener')
  }

  const inputCls =
    "w-full h-12 px-4 rounded-xl bg-[var(--color-ink)] hairline text-[var(--color-cream)] placeholder:text-[var(--color-mute)] focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-[var(--color-graphite)] transition"

  return (
    <section id="reservation" className="py-20 sm:py-28 bg-[var(--color-graphite)]" aria-labelledby="resa-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--color-silver-deep)]">— Réservation</p>
          <h2 id="resa-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-3 text-balance tracking-tight">
            30 secondes. C'est tout.
          </h2>
          <p className="mt-4 text-[var(--color-silver-deep)] text-[15px] sm:text-base">
            Réponse confirmée en quelques minutes par WhatsApp ou téléphone.
          </p>
        </m.div>

        <form
          ref={formRef}
          onSubmit={onSubmitWhatsApp}
          className="rounded-3xl bg-[var(--color-charcoal)] hairline p-5 sm:p-7 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-silver-2)]">Nom complet *</span>
              <input required name="name" type="text" autoComplete="name" placeholder="Jean Dupont" className={inputCls}/>
            </label>
            <label className="block">
              <span className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-silver-2)]">Téléphone *</span>
              <input required name="phone" type="tel" autoComplete="tel" placeholder="06 12 34 56 78" pattern="[0-9 +()]{8,}" className={inputCls}/>
            </label>
          </div>

          <label className="block">
            <span className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-silver-2)]">Email <span className="text-[var(--color-mute)] normal-case font-normal">(optionnel)</span></span>
            <input name="email" type="email" autoComplete="email" placeholder="vous@email.com" className={inputCls}/>
          </label>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-silver-2)]">Date *</span>
              <input ref={dateRef} required name="date" type="date" className={inputCls}/>
            </label>
            <label className="block">
              <span className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-silver-2)]">Heure *</span>
              <input required name="time" type="time" className={inputCls}/>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-silver-2)]">Départ *</span>
              <input
                required
                name="from"
                type="text"
                placeholder="9 rue Paradis, Marseille"
                className={inputCls}
                value={prefill.from}
                onChange={(e) => setPrefill({ ...prefill, from: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-silver-2)]">Arrivée *</span>
              <input
                required
                name="to"
                type="text"
                placeholder="Aéroport Marseille Provence"
                className={inputCls}
                value={prefill.to}
                onChange={(e) => setPrefill({ ...prefill, to: e.target.value })}
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-silver-2)]">Passagers *</span>
              <select required name="passengers" defaultValue="2" className={inputCls}>
                {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n} passager{n>1?'s':''}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-silver-2)]">Bagages</span>
              <select name="luggage" defaultValue="1" className={inputCls}>
                <option value="0">Aucun</option>
                <option value="1">1 bagage</option>
                <option value="2">2 bagages</option>
                <option value="3">3 bagages</option>
                <option value="4+">4 bagages ou +</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-silver-2)]">Message <span className="text-[var(--color-mute)] normal-case font-normal">(siège enfant, animal, vol…)</span></span>
            <textarea name="message" rows={3} placeholder="Précisions utiles" className={`${inputCls} h-auto py-3`}></textarea>
          </label>

          {/* Single action — WhatsApp only */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 h-14 rounded-xl bg-[var(--color-whatsapp)] text-[var(--color-ink)] font-semibold text-base mag-btn mt-2"
          >
            <WhatsAppIcon className="w-5 h-5"/>
            Envoyer sur WhatsApp
          </button>

          {/* Secondary — call directly */}
          <a
            href={`tel:${contact.phoneTel}`}
            className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl hairline text-[var(--color-cream)] font-semibold text-[15px] hover:bg-white/[0.04] transition"
          >
            <PhoneIcon className="w-4 h-4"/>
            ou appeler le {contact.phoneDisplay}
          </a>

          <p className="text-[12px] text-[var(--color-mute)] pt-1">
            En envoyant ce formulaire, vous êtes recontacté par WhatsApp ou au {contact.phoneDisplay}. Aucun paiement en ligne, aucune donnée stockée sur ce site.
          </p>
        </form>
      </div>
    </section>
  )
}
