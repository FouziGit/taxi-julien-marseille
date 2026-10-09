// Routage des anciennes URLs Jalis vers la page la plus pertinente du nouveau
// site. Module sans dépendance Deno pour être testable sous Node
// (tests/legacy-routing.test.ts) et importé par l'edge function legacy-redirects.ts.
//
// Principe : on normalise le chemin en mots, puis la PREMIÈRE règle qui
// correspond gagne. L'ordre encode les priorités d'intention :
//   anglais → médical → hôtels → arrondissement → événements → gares →
//   aéroports Nice/Toulon → port → villes → ski → aéroport Marseille →
//   van/groupes → génériques → accueil.
//
// Hors de netlify/edge-functions/ : Netlify y traite chaque fichier comme une
// fonction (export default obligatoire) et refuse ce module utilitaire.

const D = (slug: string) => `/destinations/${slug}/`
const MEDICAL = '/transport-medical-conventionne/'
const HOTELS = '/hotels/'
const VAN = '/van-7-places-groupes/'
const EVENTS = '/evenements/'
const EN_AIRPORT = '/en/marseille-airport-taxi/'
const EN_CRUISE = '/en/marseille-cruise-port-taxi/'
const EN_STATION = '/en/marseille-train-station-taxi/'

export const RULES: [string, string][] = [
  // Anglais
  ['cruise', EN_CRUISE], ['train station', EN_STATION],
  ['airport', EN_AIRPORT], ['call taxi', EN_AIRPORT], ['transfer', EN_AIRPORT], ['transfers', EN_AIRPORT],
  // Médical
  ['conventionne', MEDICAL], ['cpam', MEDICAL], ['vsl', MEDICAL], ['medical', MEDICAL], ['medicale', MEDICAL],
  ['medicalise', MEDICAL], ['clinique', MEDICAL], ['hopital', MEDICAL], ['ipc', MEDICAL], ['timone', MEDICAL],
  ['assurance maladie', MEDICAL], ['securite sociale', MEDICAL],
  // Hôtels
  ['hotel', HOTELS], ['hotels', HOTELS], ['residhotel', HOTELS], ['appart hotel', HOTELS],
  // Événements
  ['velodrome', EVENTS], ['parc chanot', EVENTS], ['palais des congres', EVENTS], ['pharo', EVENTS], ['congres', EVENTS], ['seminaire', EVENTS], ['salon professionnel', EVENTS],
  // Gares
  ['gare aix tgv', D('gare-aix-tgv')], ['aix tgv', D('gare-aix-tgv')],
  ['gare avignon tgv', D('gare-avignon-tgv')], ['avignon tgv', D('gare-avignon-tgv')],
  ['gare saint charles', D('gare-saint-charles')], ['saint charles', D('gare-saint-charles')], ['st charles', D('gare-saint-charles')],
  // Aéroports de Nice et Toulon (avant les villes homonymes)
  ['aeroport nice', D('aeroport-nice')], ['aeroport toulon', D('aeroport-toulon-hyeres')], ['toulon hyeres', D('aeroport-toulon-hyeres')],
  // Port de croisière
  ['port de croisiere', D('port-croisiere-marseille')], ['terminal de croisiere', D('port-croisiere-marseille')], ['terminal croisiere', D('port-croisiere-marseille')],
  ['croisiere', D('port-croisiere-marseille')], ['port maritime', D('port-croisiere-marseille')],
  // Bouches-du-Rhône et Var
  ['calanques de cassis', D('cassis')], ['cassis', D('cassis')], ['la ciotat', D('la-ciotat')], ['saint cyr', D('saint-cyr')],
  ['bandol', D('bandol')], ['sanary', D('sanary')], ['embiez', D('embiez')], ['six fours', D('six-fours')], ['la seyne', D('la-seyne')],
  ['hyeres', D('hyeres')], ['toulon', D('toulon')],
  ['brignoles', D('brignoles')], ['le luc', D('le-luc')], ['vidauban', D('vidauban')], ['cuers', D('cuers')], ['gemenos', D('gemenos')],
  ['carnoux', D('carnoux')], ['pertuis', D('pertuis')], ['saint maximin', D('saint-maximin')], ['le beausset', D('le-beausset')],
  ['ollioules', D('ollioules')], ['la valette', D('la-valette')], ['le pradet', D('le-pradet')], ['carqueiranne', D('carqueiranne')],
  // Ski
  ['pra loup', D('ski-pra-loup')], ['risoul', D('ski-risoul')], ['vars', D('ski-vars')], ['orres', D('ski-orres')],
  // Golfe de Saint-Tropez et Maures
  ['saint tropez', D('saint-tropez')], ['sainte maxime', D('sainte-maxime')], ['ramatuelle', D('ramatuelle')], ['gassin', D('gassin')],
  ['cogolin', D('cogolin')], ['cavalaire', D('cavalaire')], ['la croix valmer', D('la-croix-valmer')], ['rayol', D('rayol-canadel')],
  ['lavandou', D('le-lavandou')], ['bormes', D('bormes-les-mimosas')], ['la londe', D('la-londe')],
  // Côte d'Azur
  ['saint raphael', D('saint-raphael')], ['st raphael', D('saint-raphael')], ['frejus', D('frejus')], ['mandelieu', D('mandelieu')],
  ['cannes', D('cannes')], ['antibes', D('antibes')], ['cagnes', D('cagnes-sur-mer')], ['nice', D('nice-ville')],
  // Aix / Aubagne / Avignon / Arles
  ['aix en provence', D('aix-en-provence')], ['aix', D('aix-en-provence')], ['aubagne', D('aubagne')], ['avignon', D('avignon')], ['arles', D('arles')],
  // Aéroport Marseille Provence (après les villes : « aéroport → Cassis » va à Cassis)
  ['aeroport marseille', D('aeroport-marseille-provence')], ['marseille provence', D('aeroport-marseille-provence')], ['marignane', D('aeroport-marseille-provence')],
  // Van / groupes (après les villes : une ville dans l'URL prime)
  ['7 places', VAN], ['6 places', VAN], ['6 personnes', VAN], ['7 personnes', VAN], ['groupe', VAN], ['minibus', VAN],
  ['siege bebe', VAN], ['siege auto', VAN], ['rehausseur', VAN], ['famille', VAN], ['grand van', VAN],
  // Génériques
  ['aeroport', D('aeroport-marseille-provence')], ['gare', D('gare-saint-charles')],
]

// Chemins nus exposés par l'ancien CMS.
export const EXACT: Record<string, string> = { '/accueil': '/', '/tarifs': '/', '/contact': '/' }

// Une URL Jalis : « + » pour les espaces, suffixe -z##/-y#/-w#, .html, ou
// préfixe connu. Les nouvelles URLs ne correspondent à aucun de ces motifs.
export function isLegacy(pathname: string): boolean {
  return (
    pathname.includes('+') ||
    /-[zyw]\d+(\.html)?$/i.test(pathname) ||
    /\.html$/i.test(pathname) ||
    /^\/(details|activites|archives|lien|transport-prive|nos-activites|toutes-nos-prestations|guide-local|faq-w|avis-clients|visites-touristiques)/i.test(pathname)
  )
}

function normalize(pathname: string): string {
  return ' ' + decodeURIComponent(pathname).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() + ' '
}

// Code postal 130XX ou « 8eme arrondissement » → page aéroport de l'arrondissement.
function arrondissementOf(norm: string): string | null {
  const cp = norm.match(/ 130(0[1-9]|1[0-6]) /)
  if (cp) return `/aeroport/130${cp[1]}/`
  const ord = norm.match(/ (\d{1,2}) ?(?:er|e|eme|ieme) arrondissement /)
  if (ord) {
    const n = Number(ord[1])
    if (n >= 1 && n <= 16) return `/aeroport/130${String(n).padStart(2, '0')}/`
  }
  const glued = norm.match(/ marseille (\d{1,2})(?:er|e|eme) /)
  if (glued) {
    const n = Number(glued[1])
    if (n >= 1 && n <= 16) return `/aeroport/130${String(n).padStart(2, '0')}/`
  }
  return null
}

export function targetFor(pathname: string): string {
  const norm = normalize(pathname)
  // L'anglais, le médical et les hôtels passent avant l'arrondissement.
  for (const [needle, target] of RULES.slice(0, RULES.findIndex(r => r[1] === EVENTS))) {
    if (norm.includes(' ' + needle + ' ')) return target
  }
  const arr = arrondissementOf(norm)
  if (arr) return arr
  for (const [needle, target] of RULES) {
    if (norm.includes(' ' + needle + ' ')) return target
  }
  return '/'
}

export function resolveLegacy(pathname: string): string | null {
  const exact = EXACT[pathname]
  if (exact) return exact
  return isLegacy(pathname) ? targetFor(pathname) : null
}
