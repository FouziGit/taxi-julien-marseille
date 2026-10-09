// Nom de l'événement Plausible pour un lien cliqué, ou null si le lien n'est
// pas une conversion. Utilisé par le listener délégué de l'accueil (App.tsx).
// Les pages statiques embarquent la même règle en ligne (build-destinations.ts)
// car elles n'importent aucun module.
export type ConversionEvent = 'Appel' | 'WhatsApp'

export function eventForHref(href: string): ConversionEvent | null {
  if (href.startsWith('tel:')) return 'Appel'
  if (href.includes('wa.me')) return 'WhatsApp'
  return null
}
