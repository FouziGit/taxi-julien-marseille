import { m } from 'motion/react'
import { contact, business } from '../data/taxi'
import { PhoneIcon, WhatsAppIcon, MailIcon, ClockIcon, PinIcon } from '../components/Icons'

const waUrl = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
  contact.whatsappBaseText + ' Pouvez-vous me confirmer la disponibilité ?',
)}`

export default function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-28 bg-[var(--color-ink)]" aria-labelledby="contact-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-[var(--color-graphite)] hairline-strong p-7 sm:p-12"
        >
          <div className="text-center mb-9">
            <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--color-silver-deep)]">— Contact</p>
            <h2 id="contact-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-3 text-balance tracking-tight">
              Une question. Un trajet.
            </h2>
            <p className="mt-4 text-[var(--color-silver-deep)] text-[15px] sm:text-base">
              Le plus rapide reste l'appel ou WhatsApp. Réponse en quelques minutes, 24h/24.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            <a
              href={`tel:${contact.phoneTel}`}
              className="flex items-center justify-center gap-3 h-16 rounded-2xl bg-white text-[var(--color-ink)] font-semibold text-lg mag-btn sheen"
              aria-label={`Appeler ${contact.phoneDisplay}`}
            >
              <PhoneIcon className="w-5 h-5"/>
              <span className="flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">Appeler</span>
                <span className="text-xl mt-1 tracking-tight">{contact.phoneDisplay}</span>
              </span>
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-center gap-3 h-16 rounded-2xl bg-[var(--color-whatsapp)] text-[var(--color-ink)] font-semibold text-lg mag-btn"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5"/>
              <span className="flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase tracking-[0.18em] opacity-80 font-bold">WhatsApp</span>
                <span className="text-base mt-1">Réponse en quelques min</span>
              </span>
            </a>
          </div>

          <div className="mt-9 grid sm:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-[var(--color-charcoal)] hairline p-5">
              <ClockIcon className="w-5 h-5 text-[var(--color-cream)]"/>
              <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">Horaires</div>
              <div className="font-display font-semibold text-[var(--color-cream)] mt-1 tracking-tight">{business.hours}</div>
              <div className="text-[12px] text-[var(--color-mute)] mt-0.5">Jours fériés inclus</div>
            </div>
            <div className="rounded-2xl bg-[var(--color-charcoal)] hairline p-5">
              <PinIcon className="w-5 h-5 text-[var(--color-cream)]"/>
              <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">Adresse</div>
              <div className="font-display font-semibold text-[var(--color-cream)] mt-1 tracking-tight">{business.city} {business.postalCode}</div>
              <div className="text-[12px] text-[var(--color-mute)] mt-0.5">Bouches-du-Rhône, France</div>
            </div>
            <div className="rounded-2xl bg-[var(--color-charcoal)] hairline p-5">
              <MailIcon className="w-5 h-5 text-[var(--color-cream)]"/>
              <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[var(--color-mute)] font-bold">Email</div>
              <a href={`mailto:${contact.email}`} className="font-display font-semibold text-[var(--color-cream)] hover:opacity-80 transition mt-1 inline-block break-all tracking-tight">
                {contact.email}
              </a>
              <div className="text-[11px] text-[var(--color-mute)] mt-0.5 italic">a little english 😉</div>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  )
}
