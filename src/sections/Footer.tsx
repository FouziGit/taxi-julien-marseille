import { contact, business, destinationGroups, destinations, destContent } from '../data/taxi'

// Libellé court d'une page destination : nom court de destinations[], sinon
// le nom de la page seule (page-only), sinon l'id.
function pageLabel(id: string): string {
  const d = destinations.find(x => x.id === id)
  if (d) return d.shortName ?? d.name
  return destContent.find(c => c.id === id)?.destName ?? id
}

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
              <li><a className="hover:text-[var(--color-cream)] transition" href="/transport-medical-conventionne/">Taxi conventionné CPAM</a></li>
              <li><a className="hover:text-[var(--color-cream)] transition" href="/van-7-places-groupes/">Van 7 places & groupes</a></li>
              <li><a className="hover:text-[var(--color-cream)] transition" href="/hotels/">Hôtels de Marseille</a></li>
              <li><a className="hover:text-[var(--color-cream)] transition" href="/evenements/">Événements</a></li>
              <li><a className="hover:text-[var(--color-cream)] transition" href="/en/marseille-airport-taxi/" hrefLang="en" lang="en">English</a></li>
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
                <a className="hover:text-[var(--color-cream)] transition" href="/mentions-legales/">
                  Mentions légales complètes ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Maillage interne : lien statique vers chaque page destination.
            Rendu dans le HTML prérendu de l'accueil → découverte au premier crawl. */}
        <nav aria-label="Toutes nos destinations" className="mt-12 pt-8 border-t border-white/[0.05]">
          <h3 className="font-display font-semibold text-[var(--color-cream)] mb-4 text-[13px] uppercase tracking-[0.18em]">Nos destinations depuis Marseille</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-[13px]">
            {destinationGroups.map(g => (
              <div key={g.title}>
                <h4 className="text-[var(--color-silver-deep)] font-semibold mb-2">{g.title}</h4>
                <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[var(--color-silver-2)]">
                  {g.ids.map(id => (
                    <li key={id}>
                      <a className="hover:text-[var(--color-cream)] transition" href={`/destinations/${id}/`}>{pageLabel(id)}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 text-[13px]">
            <h4 id="footer-arrondissements" className="text-[var(--color-silver-deep)] font-semibold mb-2">Aéroport Marseille Provence depuis votre arrondissement</h4>
            <ul aria-labelledby="footer-arrondissements" className="flex flex-wrap gap-x-3 gap-y-1 text-[var(--color-silver-2)]">
              {Array.from({ length: 16 }, (_, i) => i + 1).map(n => (
                <li key={n}>
                  <a className="hover:text-[var(--color-cream)] transition" href={`/aeroport/130${String(n).padStart(2, '0')}/`}>Marseille {n === 1 ? '1er' : `${n}e`}</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="mt-12 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[var(--color-mute)]">
          <div>© {new Date().getFullYear()} {business.legalName}. Tous droits réservés.</div>
          <div className="flex items-center gap-3">
            <span>Marseille · Provence · Côte d'Azur</span>
            <span className="text-[var(--color-line)]" aria-hidden>·</span>
            <span>
              Site par{' '}
              <a
                href="https://nouhbenzidane.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-silver-deep)] hover:text-[var(--color-cream)] transition underline underline-offset-2"
              >
                Nouh Benzidane
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
