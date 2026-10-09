import type { DestContent } from '../taxi'

// Page service : van 7 places, groupes et familles. Suppléments réglementés
// repris de pricing.surcharges (4 € par passager dès le 5e, 2 € par bagage dès le 4e).
export const vanPages: DestContent[] = [
  {
    id: 'van-7-places-groupes',
    kind: 'service',
    path: '/van-7-places-groupes/',
    destName: 'Taxi van 7 places',
    destCategory: 'Site',
    destPhoto: '/photos/v11.jpg',
    destPhotoSm: '/photos/v11-sm.jpg',
    distanceKm: 0,
    durationReal: '—',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.2965, lng: 5.3698 },
    seoTitle: 'Taxi van 7 places Marseille — groupes, familles | Taxi Julien',
    seoDescription: "Taxi van Mercedes Classe V à Marseille : jusqu'à 7 passagers et leurs bagages, siège bébé sur demande. Aéroport, gare, port, séminaires, mariages. Prix fixe à la réservation.",
    h1: 'Taxi van 7 places à Marseille',
    kicker: '— Groupes & familles · Mercedes Classe V',
    heroSubtitle: '7 passagers · Grand coffre · Siège bébé sur demande · 24h/24',
    lead: "Un seul véhicule pour toute la famille ou l'équipe : la Mercedes Classe V accueille jusqu'à 7 passagers avec leurs valises, poussettes et équipements. Un prix fixe annoncé à la réservation, quel que soit le nombre de personnes, souvent moins cher que deux taxis. Aéroport, gare Saint-Charles, port de croisière, séminaires, mariages, journées en Provence.",
    fareLabel: 'Prix fixe à la réservation',
    fareNote: 'Supplément réglementé : 4 € par passager à partir du 5e, 2 € par bagage à partir du 4e. Forfaits aéroport 70 – 110 €.',
    ctaTitle: "Besoin d'un van pour votre groupe ?",
    whatsappText: 'Bonjour, je souhaite réserver un taxi van 7 places.',
    spotsTitle: 'Ce que le van permet',
    spotsSub: 'Capacité réelle du véhicule, sans surprise à la prise en charge.',
    spots: [
      { name: '7 passagers assis', blurb: 'Trois rangées, sièges individuels, climatisation arrière.', type: 'other' },
      { name: 'Grand volume de bagages', blurb: "Jusqu'à 7 valises cabine et soute, poussette ou sacs de golf.", type: 'other' },
      { name: 'Siège bébé, siège auto, rehausseur', blurb: 'Fournis sur demande à la réservation, sans supplément.', type: 'other' },
      { name: 'Portes coulissantes', blurb: 'Montée et descente faciles pour les enfants et les personnes âgées.', type: 'other' },
      { name: 'Équipements de ski', blurb: 'Transport vers les stations des Hautes-Alpes avec le matériel.', type: 'sport' },
      { name: 'Chauffeur anglophone', blurb: "Accueil des visiteurs étrangers, pancarte nominative à l'aéroport.", type: 'other' },
    ],
    useCases: [
      "Famille nombreuse vers l'aéroport ou le port de croisière, sans fractionner le groupe",
      'Équipe en séminaire ou salon (Parc Chanot, Palais du Pharo) : navettes hôtel ↔ site',
      'Mariage : transport des invités ou des mariés, véhicule discret',
      "Groupe d'amis pour une journée Cassis, Aix ou Côte d'Azur",
    ],
    faq: [
      { q: 'Combien de passagers et de bagages ?', a: "Jusqu'à 7 passagers et environ 7 valises selon leur taille. Dites-nous le nombre exact de personnes et de bagages à la réservation : nous confirmons que tout tient." },
      { q: 'Le prix dépend-il du nombre de passagers ?', a: 'Les forfaits (aéroport 70 – 110 €) sont annoncés en fonction du véhicule et du nombre de passagers. Au compteur, le tarif réglementé ajoute 4 € par passager à partir du 5e et 2 € par bagage à partir du 4e.' },
      { q: 'Avez-vous un siège bébé ?', a: 'Oui : siège bébé, siège auto ou rehausseur, fournis sur demande à la réservation, sans supplément.' },
      { q: 'Peut-on réserver plusieurs navettes pour un événement ?', a: "Oui. Pour un mariage, un séminaire ou un salon, nous organisons les rotations à l'avance et envoyons un devis écrit." },
    ],
    related: ['aeroport-marseille-provence', 'port-croisiere-marseille', 'gare-saint-charles', 'cassis'],
  },
]
