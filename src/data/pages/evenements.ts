import type { DestContent } from '../taxi'

// Page service : événements à Marseille (stade, congrès, concerts, réceptions).
// Tarifs réglementés repris de pricing.rates ; lieux réels uniquement.
export const evenementPages: DestContent[] = [
  {
    id: 'evenements',
    kind: 'service',
    path: '/evenements/',
    destName: 'Événements à Marseille',
    destCategory: 'Site',
    destPhoto: '/photos/v6.jpg',
    destPhotoSm: '/photos/v6-sm.jpg',
    distanceKm: 0,
    durationReal: '—',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.27, lng: 5.396 },
    seoTitle: 'Taxi Vélodrome, Parc Chanot, Pharo — événements Marseille | Taxi Julien',
    seoDescription: "Taxi pour vos événements à Marseille : matchs à l'Orange Vélodrome, salons et congrès au Parc Chanot, réceptions au Palais du Pharo, concerts au Dôme. Dépose et retour planifiés, 7 places.",
    h1: 'Taxi pour vos événements à Marseille',
    kicker: '— Événements · Stade, congrès, concerts',
    heroSubtitle: 'Orange Vélodrome · Parc Chanot · Palais du Pharo · Le Dôme · Retour planifié',
    lead: "Un match, un salon, un concert, un mariage : nous vous déposons au plus près de l'entrée et nous revenons vous chercher à l'heure convenue, sans attendre un taxi à la sortie. Pour les congrès et séminaires, nous organisons des rotations entre l'hôtel et le site, avec facture pour l'entreprise.",
    fareLabel: 'Tarif réglementé ou forfait',
    fareNote: 'Course au compteur (2,24 €/km jour, 2,88 €/km nuit) ou forfait annoncé à la réservation pour les mises à disposition et les navettes.',
    ctaTitle: 'Un taxi pour votre événement ?',
    whatsappText: 'Bonjour, je souhaite réserver un taxi pour un événement à Marseille.',
    spotsTitle: "Lieux d'événements desservis",
    spotsSub: 'Les sites où nous déposons et récupérons le plus souvent.',
    spots: [
      { name: 'Orange Vélodrome', blurb: "Marseille 8e. Matchs de l'OM, concerts : dépose aux abords, point de retour convenu à l'avance.", type: 'sport' },
      { name: 'Parc Chanot — Palais des Congrès et des Expositions', blurb: 'Marseille 8e. Salons, congrès, Foire de Marseille.', type: 'other' },
      { name: 'Palais du Pharo', blurb: 'Marseille 7e. Congrès, galas, mariages, face au Vieux-Port.', type: 'monument' },
      { name: 'Le Dôme', blurb: 'Marseille 4e. Concerts et spectacles.', type: 'other' },
      { name: 'Friche la Belle de Mai', blurb: 'Marseille 3e. Concerts, expositions, soirées.', type: 'museum' },
      { name: 'MuCEM et esplanade du J4', blurb: 'Marseille 2e. Expositions et événements en plein air.', type: 'museum' },
    ],
    useCases: [
      "Soir de match : dépose avant le coup d'envoi, retour à la sortie du stade",
      'Congrès ou salon : navettes hôtel ↔ Parc Chanot ou Pharo pour une équipe, facture entreprise',
      'Mariage ou réception : transport des mariés et des invités, véhicule discret, chauffeur en tenue',
      'Concert au Dôme ou à la Friche : retour tardif garanti, 24h/24',
    ],
    faq: [
      { q: 'Pouvez-vous revenir nous chercher après le match ?', a: "Oui. Nous fixons ensemble un point et une heure de retour à l'écart de la foule ; le chauffeur vous y attend." },
      { q: 'Comment réserver pour un congrès de plusieurs jours ?', a: "Appelez-nous avec les horaires des sessions : nous proposons un planning de navettes et un devis écrit, facturé à l'entreprise." },
      { q: 'Combien coûte une course vers le Vélodrome ?', a: 'Au tarif réglementé des taxis marseillais : 2,24 € par km en journée, 2,88 € la nuit, prise en charge 2,35 €. Pour une mise à disposition, forfait annoncé à la réservation.' },
      { q: 'Transportez-vous des groupes ?', a: "Jusqu'à 7 passagers par véhicule. Au-delà, nous organisons plusieurs rotations." },
    ],
    related: ['van-7-places-groupes', 'hotels', 'aeroport-marseille-provence', 'gare-saint-charles'],
  },
]
