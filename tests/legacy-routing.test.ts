// Routage des anciennes URLs Jalis (edge function). Lancer : npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveLegacy } from '../netlify/lib/legacy-routing.ts'

const cases: [string, string | null][] = [
  // Anglais avant tout
  ['/details-taxi+1+to+5+6+7+places+from+marseille+airport-298.html', '/en/marseille-airport-taxi/'],
  ['/details-call+taxi+to+airport-268.html', '/en/marseille-airport-taxi/'],
  ['/details-marseille+airport+transfers-264.html', '/en/marseille-airport-taxi/'],
  // Médical avant les villes
  ['/taxi+conventionne+pour+urgence+medicale+toulon+dans+le+var-z40', '/transport-medical-conventionne/'],
  ['/details-taxi+medicalise+vsl+aeroport+marseille+transport+conventionne-471.html', '/transport-medical-conventionne/'],
  ['/tarif+taxi+conventionne+par+l+assurance+maladie+gare+aix+tgv-z75', '/transport-medical-conventionne/'],
  // Hôtels avant les villes (« petit nice » ne doit pas aller à Nice)
  ['/lien-hotel+le+petit+nice+passedat-151.html', '/hotels/'],
  ['/details-hotel+mama+shelter+marseille-148.html', '/hotels/'],
  // Arrondissement avant l'aéroport
  ['/details-tarif+taxi+van+de+1+a+5+6+7+personnes+de+marseille+13007+vers+l+aeroport+marseille+provence+marignane-176.html', '/aeroport/13007/'],
  ['/activites-taxi+marseille+aeroport+pour+6+personnes+avec+7+bagages+au+depart+de+marseille+8eme-65.html', '/aeroport/13008/'],
  // Événements
  ['/activites-stade+orange+velodrome+marseille-47.html', '/evenements/'],
  ['/details-taxi+aeroport+de+marseille+provence+vers+palais+des+congres+parc+chanot+marseille+13008-211.html', '/aeroport/13008/'],
  // Villes et hubs (inchangé)
  ['/saint+tropez+sur+la+cote+d+azur-y9', '/destinations/saint-tropez/'],
  ['/transport-prive-transfert-port-maritime-w1.html', '/destinations/port-croisiere-marseille/'],
  ['/reserver+un+taxi+ponctuel+pour+se+rendre+a+aeroport+nice+cote+d+azur-z122', '/destinations/aeroport-nice/'],
  // Ville avant van : « van 7 places sanary » va à Sanary
  ['/details-taxi+van+7+places+sanary-sur-mer+vers+marseille+aeroport-449.html', '/destinations/sanary/'],
  // Van sans ville
  ['/details-reserver+taxi+van+marseille+pour+1+a+7+personnes-307.html', '/van-7-places-groupes/'],
  ['/details-peut-on+reserver+un+taxi+van+a+marseille+avec+siege+bebe+ou+equipements+pour+enfants-445.html', '/van-7-places-groupes/'],
  // Villes secondaires (tâche 11)
  ['/details-tarif+taxi+van+de+1+a+5+6+7+personnes+de+l+aeroport+marseille+provence+marignane+vers+brignoles+dans+le+var+83170-135.html', '/destinations/brignoles/'],
  // Génériques et exacts
  ['/transport-prive-transfert-aeroport-w9.html', '/destinations/aeroport-marseille-provence/'],
  ['/tarifs', '/'],
  ['/-w1.html', '/'],
  // Pas legacy
  ['/', null],
  ['/destinations/cassis/', null],
  ['/mentions-legales/', null],
]

for (const [input, expected] of cases) {
  test(`${input} → ${expected}`, () => {
    assert.equal(resolveLegacy(input), expected)
  })
}
