import { contact } from '../data/taxi'
import { PhoneIcon, WhatsAppIcon } from './Icons'

const waUrl = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
  contact.whatsappBaseText + ' Pouvez-vous me confirmer la disponibilité ?',
)}`

export default function StickyDock() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] md:hidden grid grid-cols-2 gap-2 p-2 pb-[calc(env(safe-area-inset-bottom)+8px)] bg-[var(--color-ink)]/90 backdrop-blur-md border-t border-white/[0.06]"
      role="navigation"
      aria-label="Actions rapides"
    >
      <a
        href={`tel:${contact.phoneTel}`}
        className="flex items-center justify-center gap-2 h-14 rounded-xl bg-white text-[var(--color-ink)] font-bold text-base active:scale-95 transition-transform"
        aria-label={`Appeler le ${contact.phoneDisplay}`}
      >
        <PhoneIcon className="w-5 h-5"/>
        <span>Appeler</span>
      </a>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener"
        className="flex items-center justify-center gap-2 h-14 rounded-xl bg-[var(--color-whatsapp)] text-[var(--color-ink)] font-bold text-base active:scale-95 transition-transform"
        aria-label="Contacter sur WhatsApp"
      >
        <WhatsAppIcon className="w-5 h-5"/>
        <span>WhatsApp</span>
      </a>
    </div>
  )
}
