import { contact, business } from '../data/taxi'

export default function Footer() {
  return (
    <footer className="bg-[var(--color-ink)] border-t border-white/[0.05] pt-14 pb-28 md:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 text-[14px]">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="grid place-items-center w-9 h-9 rounded-lg bg-white text-[var(--color-ink)] font-bold text-sm font-display">TJ</span>
              <span className="font-display font-semibold text-[var(--color-cream)] text-lg tracking-tight">{business.legalName}</span>
            </div>
            <p className="text-[var(--color-silver-deep)] text-[13px] leading-relaxed">
              Taxi conventionné Marseille depuis {business.foundedYear}. Aéroport, gare, port, longue distance, médical.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold text-[var(--color-cream)] mb-3 text-[13px] uppercase tracking-[0.18em]">Contact</h3>
            <ul className="space-y-2 text-[var(--color-silver-2)]">
              <li>
                <a className="hover:text-[var(--color-cream)] transition" href={`tel:${contact.phoneTel}`}>
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a className="hover:text-[var(--color-cream)] transition break-all" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </li>
              <li className="text-[var(--color-silver-deep)]">Marseille {business.postalCode}, France</li>
              <li className="text-[var(--color-silver-deep)]">{business.hours}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-[var(--color-cream)] mb-3 text-[13px] uppercase tracking-[0.18em]">Navigation</h3>
            <ul className="space-y-2 text-[var(--color-silver-2)]">
              <li><a className="hover:text-[var(--color-cream)] transition" href="#destinations">Destinations</a></li>
              <li><a className="hover:text-[var(--color-cream)] transition" href="#reservation">Réservation</a></li>
              <li><a className="hover:text-[var(--color-cream)] transition" href="#services">Services</a></li>
              <li><a className="hover:text-[var(--color-cream)] transition" href="#tarifs">Tarifs</a></li>
              <li><a className="hover:text-[var(--color-cream)] transition" href="#flotte">Flotte</a></li>
              <li><a className="hover:text-[var(--color-cream)] transition" href="#galerie">Galerie</a></li>
              <li><a className="hover:text-[var(--color-cream)] transition" href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-[var(--color-cream)] mb-3 text-[13px] uppercase tracking-[0.18em]">Mentions légales</h3>
            <ul className="space-y-2 text-[var(--color-silver-deep)] text-[13px]">
              <li>{business.legalName}</li>
              <li>Gérant : {business.managerName}</li>
              <li>SIRET : {business.siret}</li>
              <li>Taxi conventionné Marseille</li>
              <li className="pt-1">
                <a className="hover:text-[var(--color-cream)] transition" href="https://www.taxijulien.com/mentions-legales.html" target="_blank" rel="noopener">
                  Mentions légales complètes ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[var(--color-mute)]">
          <div>© {new Date().getFullYear()} {business.legalName}. Tous droits réservés.</div>
          <div>Marseille · Provence · Côte d'Azur</div>
        </div>
      </div>
    </footer>
  )
}
