// Données factuelles scrappées depuis https://www.taxijulien.com/
// Aucune donnée inventée. Là où l'info manque sur le site, on indique "sur demande".

export const business = {
  legalName: 'Taxi Julien',
  managerName: 'Julien BRACHT',
  slogan: 'Une autre idée du transport',
  shortPitch: 'Taxi Marseille premium · 24/7 · Mercedes Classe V',
  longDescription:
    "Depuis 2009, Taxi Julien assure vos déplacements à Marseille et dans toute la région PACA — transferts aéroport, gare, port de croisière, longue distance, transport médical conventionné, événementiel.",
  foundedYear: 2009,
  city: 'Marseille',
  region: "Provence-Alpes-Côte d'Azur",
  country: 'France',
  postalCode: '13008',
  streetAddress: 'Marseille 13008',
  geo: { lat: 43.2722, lng: 5.3956 },
  hours: '24h/24 · 7j/7',
  languages: ['Français', 'English'],
  siret: '51029137000037',
} as const

export const contact = {
  phoneDisplay: '06 35 58 24 72',
  phoneTel: '+33635582472',
  whatsappNumber: '33635582472',
  email: 'taxijulien13@gmail.com',
  whatsappBaseText: "Bonjour, je souhaite réserver un taxi avec Taxi Julien.",
} as const

export const social = {
  website: 'https://www.taxijulien.com',
}

export type Destination = {
  id: string
  name: string
  shortName?: string
  category: 'Aéroport' | 'Gare' | 'Port' | 'Ville' | 'Site' | 'Hôpital'
  priceFrom?: number
  priceTo?: number
  duration?: string
  note?: string
  photo?: string
  photoSm?: string
  tagline?: string
}

// Points de départ : Marseille (1er → 16e arr.) + hubs principaux
export type Departure = { id: string; label: string; value: string; group: 'Marseille' | 'Hubs' }
export const departures: Departure[] = [
  ...Array.from({ length: 16 }, (_, i) => {
    const n = i + 1
    const ord = n === 1 ? '1er' : `${n}e`
    return { id: `msl-${n}`, label: `Marseille — ${ord} arrondissement`, value: `Marseille ${ord} arrondissement`, group: 'Marseille' as const }
  }),
  { id: 'gare-saint-charles', label: 'Gare Saint-Charles', value: 'Gare Saint-Charles, Marseille', group: 'Hubs' },
  { id: 'aeroport-mp', label: 'Aéroport Marseille Provence', value: 'Aéroport Marseille Provence (Marignane)', group: 'Hubs' },
]

export const destinations: Destination[] = [
  // Aéroports
  { id: 'aeroport-marseille-provence', name: 'Aéroport Marseille Provence', shortName: 'Marseille Provence', category: 'Aéroport', priceFrom: 70, priceTo: 110, duration: '~30 min', tagline: 'Forfait fixe · suivi du vol', photo: '/photos/v8.jpg', photoSm: '/photos/v8-sm.jpg' },
  { id: 'aeroport-nice', name: "Aéroport Nice Côte d'Azur", shortName: 'Nice', category: 'Aéroport', duration: '~2h', note: 'Sur devis', tagline: 'Direct par autoroute', photo: '/photos/dest-nice.jpg', photoSm: '/photos/dest-nice-sm.jpg' },
  { id: 'aeroport-toulon-hyeres', name: 'Aéroport Toulon-Hyères', shortName: 'Toulon-Hyères', category: 'Aéroport', duration: '~1h', note: 'Sur devis', tagline: 'Côte varoise', photo: '/photos/v3.jpg', photoSm: '/photos/v3-sm.jpg' },

  // Gares
  { id: 'gare-saint-charles', name: 'Gare Saint-Charles', shortName: 'Saint-Charles', category: 'Gare', note: 'Sur devis', tagline: 'Accueil sur le quai', photo: '/photos/dest-gare.jpg', photoSm: '/photos/dest-gare-sm.jpg' },
  { id: 'gare-aix-tgv', name: 'Gare Aix TGV', shortName: 'Aix TGV', category: 'Gare', note: 'Sur devis', tagline: 'Aix-en-Provence', photo: '/photos/dest-gare-aix.jpg', photoSm: '/photos/dest-gare-aix-sm.jpg' },
  { id: 'gare-avignon-tgv', name: "Gare TGV d'Avignon", shortName: 'Avignon TGV', category: 'Gare', note: 'Sur devis', tagline: 'Provence — terre des papes', photo: '/photos/dest-gare.jpg', photoSm: '/photos/dest-gare-sm.jpg' },

  // Ports — photo réelle : Taxi Julien devant MSC
  { id: 'port-croisiere-marseille', name: 'Port de croisière Marseille', shortName: 'Croisière Marseille', category: 'Port', note: 'Sur devis', tagline: 'Costa · MSC · bagages XL', photo: '/photos/v5.jpg', photoSm: '/photos/v5-sm.jpg' },

  // Côte & calanques
  { id: 'cassis', name: 'Cassis & Calanques', shortName: 'Cassis', category: 'Site', duration: '~45 min', note: 'Sur devis', tagline: 'Falaises blanches · eau turquoise', photo: '/photos/dest-cassis.jpg', photoSm: '/photos/dest-cassis-sm.jpg' },
  { id: 'la-ciotat', name: 'La Ciotat', shortName: 'La Ciotat', category: 'Ville', duration: '~50 min', note: 'Sur devis', tagline: 'Calanques de Figuerolles', photo: '/photos/dest-laciotat.jpg', photoSm: '/photos/dest-laciotat-sm.jpg' },
  { id: 'saint-cyr', name: 'Saint-Cyr-sur-Mer', shortName: 'Saint-Cyr', category: 'Ville', duration: '~55 min', tagline: 'Plage des Lecques', photo: '/photos/dest-saintcyr.jpg', photoSm: '/photos/dest-saintcyr-sm.jpg' },
  { id: 'bandol', name: 'Bandol', shortName: 'Bandol', category: 'Ville', duration: '~1h', tagline: 'Vignobles & port', photo: '/photos/dest-bandol.jpg', photoSm: '/photos/dest-bandol-sm.jpg' },
  { id: 'sanary', name: 'Sanary-sur-Mer', shortName: 'Sanary-sur-Mer', category: 'Ville', duration: '~1h', tagline: 'Pointus colorés', photo: '/photos/dest-sanary.jpg', photoSm: '/photos/dest-sanary-sm.jpg' },
  { id: 'embiez', name: 'Embarcadère du Brusc / Les Embiez', shortName: 'Les Embiez', category: 'Site', priceFrom: 160, priceTo: 210, duration: '~1h15', tagline: 'Île du Brusc', photo: '/photos/dest-embiez.jpg', photoSm: '/photos/dest-embiez-sm.jpg' },
  { id: 'toulon', name: 'Toulon', shortName: 'Toulon', category: 'Ville', duration: '~1h', note: 'Sur devis', tagline: 'Mont Faron · rade militaire', photo: '/photos/dest-toulon.jpg', photoSm: '/photos/dest-toulon-sm.jpg' },
  { id: 'hyeres', name: 'Hyères', shortName: 'Hyères', category: 'Ville', duration: '~1h15', note: 'Sur devis', tagline: "Palmiers & îles d'Or", photo: '/photos/dest-hyeres.jpg', photoSm: '/photos/dest-hyeres-sm.jpg' },
  { id: 'saint-tropez', name: 'Saint-Tropez', shortName: 'Saint-Tropez', category: 'Ville', duration: '~2h30', note: 'Longue distance', tagline: 'Le port mythique', photo: '/photos/dest-sainttropez.jpg', photoSm: '/photos/dest-sainttropez-sm.jpg' },

  // Provence intérieure
  { id: 'aix-en-provence', name: 'Aix-en-Provence', shortName: 'Aix-en-Provence', category: 'Ville', duration: '~30 min', note: 'Sur devis', tagline: 'Cours Mirabeau · fontaines', photo: '/photos/dest-aix.jpg', photoSm: '/photos/dest-aix-sm.jpg' },
  { id: 'avignon', name: 'Avignon', shortName: 'Avignon', category: 'Ville', duration: '~1h15', note: 'Provence — sur devis', tagline: 'Palais des Papes', photo: '/photos/dest-avignon.jpg', photoSm: '/photos/dest-avignon-sm.jpg' },
  { id: 'arles', name: 'Arles', shortName: 'Arles', category: 'Ville', duration: '~1h', note: 'Provence — sur devis', tagline: 'Arènes romaines · Camargue', photo: '/photos/dest-arles.jpg', photoSm: '/photos/dest-arles-sm.jpg' },

  // Stations de ski — photos réelles depuis Wikimedia Commons
  { id: 'ski-arcs', name: 'Les Arcs', shortName: 'Les Arcs', category: 'Site', note: 'Station ski — longue distance', tagline: 'Paradiski', photo: '/photos/dest-ski-arcs.jpg', photoSm: '/photos/dest-ski-arcs-sm.jpg' },
  { id: 'ski-orres', name: 'Les Orres', shortName: 'Les Orres', category: 'Site', note: 'Station ski — longue distance', tagline: 'Hautes-Alpes', photo: '/photos/dest-ski-orres.jpg', photoSm: '/photos/dest-ski-orres-sm.jpg' },
  { id: 'ski-risoul', name: 'Risoul', shortName: 'Risoul', category: 'Site', note: 'Station ski — longue distance', tagline: 'Forêt Blanche', photo: '/photos/dest-ski-risoul.jpg', photoSm: '/photos/dest-ski-risoul-sm.jpg' },
  { id: 'ski-vars', name: 'Vars', shortName: 'Vars', category: 'Site', note: 'Station ski — longue distance', tagline: 'Forêt Blanche', photo: '/photos/dest-ski-vars.jpg', photoSm: '/photos/dest-ski-vars-sm.jpg' },
  { id: 'ski-pra-loup', name: 'Pra Loup', shortName: 'Pra Loup', category: 'Site', note: 'Station ski — longue distance', tagline: 'Espace Lumière', photo: '/photos/dest-ski-praloup.jpg', photoSm: '/photos/dest-ski-praloup-sm.jpg' },
]

export type Service = {
  id: string
  title: string
  description: string
  icon: 'plane' | 'train' | 'ship' | 'medical' | 'briefcase' | 'wedding' | 'tour' | 'long'
}

export const services: Service[] = [
  { id: 'aeroport', title: 'Transferts aéroport', description: "Marseille Provence, Nice Côte d'Azur. Forfait fixe, suivi du vol, accueil bagages.", icon: 'plane' },
  { id: 'gare', title: 'Transferts gare', description: "Saint-Charles, Aix TGV. Prise en charge sur le quai, ponctualité même tard le soir.", icon: 'train' },
  { id: 'croisiere', title: 'Port de croisière', description: "Embarquement Costa, MSC. Espace bagages important, retour réservable à l'avance.", icon: 'ship' },
  { id: 'medical', title: 'Transport médical conventionné', description: "VSL conventionné CPAM. Hôpitaux Paoli-Calmettes, Timone, Conception, Nord. Sans avance de frais.", icon: 'medical' },
  { id: 'pro', title: 'Transport entreprise', description: "Compte pro, facturation, navettes salariés, déplacements clients. Anglais parlé.", icon: 'briefcase' },
  { id: 'evenement', title: 'Mariages & événements', description: "Mariage, soirée, gala, séminaire. Véhicule discret, chauffeur en tenue, devis personnalisé.", icon: 'wedding' },
  { id: 'tourisme', title: 'Visites touristiques', description: "Calanques, Aix, Côte d'Azur. Circuits sur mesure avec chauffeur connaissant la région.", icon: 'tour' },
  { id: 'longue-distance', title: 'Longue distance', description: "Toulon, Saint-Tropez, Pra Loup, toute la Provence. Tarif transparent à la réservation.", icon: 'long' },
]

export const pricing = {
  legalNote: "Tarifs réglementés Marseille — affichés sur taxijulien.com/tarifs.html",
  rates: [
    { label: 'Prise en charge', value: '2,35 €' },
    { label: 'Tarif jour (7h–19h)', value: '2,22 € / km' },
    { label: 'Tarif nuit (19h–7h)', value: '2,88 € / km' },
    { label: 'Dimanches & jours fériés', value: '2,88 € / km' },
    { label: 'Attente / marche lente', value: '34,60 € / h' },
    { label: 'Course minimum', value: '8,00 €' },
  ],
  surcharges: [
    { label: 'Bagages à main', value: 'Gratuit' },
    { label: '4ᵉ bagage et au-delà', value: '2,00 € / bagage' },
    { label: '5ᵉ passager et au-delà', value: '4,00 € / personne' },
    { label: 'Péages autoroute', value: 'En sus' },
  ],
  packages: [
    { route: 'Marseille ↔ Aéroport Marseille Provence', price: '70 – 110 €', note: 'Forfait fixe selon véhicule et nombre de passagers' },
    { route: 'Marseille ↔ Embarcadère du Brusc / Les Embiez', price: '160 – 210 €', note: 'Tarif aller simple' },
    { route: 'Cassis · Aix · Toulon · Saint-Tropez …', price: 'Sur devis', note: 'Forfait fixe communiqué à la réservation' },
  ],
  invoiceNote: 'Facture obligatoire dès 25 € TTC (disponible sur demande pour toute course).',
}

// ============================================================
// Forfaits détaillés — tarifs réels Taxi Julien
// Tarif Jour : 7h–19h · Tarif Nuit : 19h–7h, dimanches, jours fériés
// ============================================================

export type FareRow = { dest: string; day?: string; night?: string; from?: string }

export type FareTable = {
  key: string
  title: string
  subtitle: string
  hasNight: boolean
  rows: FareRow[]
}

export const fareTables: FareTable[] = [
  {
    key: 'airport',
    title: 'Départ Aéroport Marseille Provence',
    subtitle: 'Forfaits depuis l\'aéroport vers la côte',
    hasNight: true,
    rows: [
      { dest: 'La Penne-sur-Huveaune', day: '95–100 €', night: '125 €' },
      { dest: 'Aubagne', day: '115 €', night: '173 €' },
      { dest: 'Carnoux-en-Provence', day: '125 €', night: '145 €' },
      { dest: 'Roquefort-la-Bédoule', day: '135 €', night: '150 €' },
      { dest: 'Cassis', day: '130 €', night: '160 €' },
      { dest: 'La Ciotat', day: '140 €', night: '180 €' },
    ],
  },
  {
    key: 'marseille',
    title: 'Départ Marseille — Var, Provence & Côte d\'Azur',
    subtitle: 'Forfaits aller simple depuis Marseille',
    hasNight: true,
    rows: [
      { dest: 'Saint-Cyr-sur-Mer', day: '150 €', night: '190 €' },
      { dest: 'Bandol', day: '175 €', night: '225 €' },
      { dest: 'Sanary-sur-Mer', day: '180 €', night: '235 €' },
      { dest: 'Six-Fours-les-Plages', day: '200 €', night: '250 €' },
      { dest: 'La Seyne-sur-Mer', day: '200 €', night: '255 €' },
      { dest: 'Ollioules', day: '190 €', night: '245 €' },
      { dest: 'Toulon', day: '200 €', night: '200 €' },
      { dest: 'La Valette-du-Var', day: '220 €', night: '280 €' },
      { dest: 'Le Pradet', day: '225 €', night: '285 €' },
      { dest: 'Carqueiranne', day: '250 €', night: '320 €' },
      { dest: 'Hyères', day: '245 €', night: '315 €' },
      { dest: 'La Londe-les-Maures', day: '265 €', night: '340 €' },
      { dest: 'Bormes-les-Mimosas', day: '290 €', night: '370 €' },
      { dest: 'Le Lavandou', day: '290 €', night: '375 €' },
      { dest: 'Rayol-Canadel-sur-Mer', day: '440 €', night: '560 €' },
      { dest: 'Cavalaire-sur-Mer', day: '350 €', night: '445 €' },
      { dest: 'La Croix-Valmer', day: '225 €', night: '425 €' },
      { dest: 'Cogolin', day: '315 €', night: '400 €' },
      { dest: 'Gassin', day: '335 €', night: '435 €' },
      { dest: 'Ramatuelle', day: '340 €', night: '420 €' },
      { dest: 'Saint-Tropez', day: '335 €', night: '386 €' },
      { dest: 'Sainte-Maxime', day: '335 €', night: '430 €' },
      { dest: 'Fréjus', day: '325 €', night: '415 €' },
      { dest: 'Saint-Raphaël', day: '335 €', night: '425 €' },
      { dest: 'Mandelieu-la-Napoule', day: '385 €', night: '490 €' },
      { dest: 'Cannes', day: '310 €', night: '520 €' },
      { dest: 'Antibes', day: '430 €', night: '540 €' },
      { dest: 'Cagnes-sur-Mer', day: '450 €', night: '565 €' },
      { dest: 'Nice', day: '470 €', night: '595 €' },
      { dest: 'Arles', day: '190 €', night: '235 €' },
      { dest: 'Avignon', day: '210 €', night: '265 €' },
      { dest: 'Montpellier', day: '340 €', night: '400 €' },
      { dest: 'Toulouse', day: '915 €', night: '1165 €' },
      { dest: 'Lyon', day: '710 €', night: '895 €' },
    ],
  },
  {
    key: 'ski',
    title: 'Stations de ski — Départ Marseille',
    subtitle: 'Longue distance, tarif aller simple à partir de',
    hasNight: false,
    rows: [
      { dest: 'Superdévoluy', from: '520 €' },
      { dest: 'Orcières Merlette', from: '520 €' },
      { dest: 'Les Orres', from: '520 €' },
      { dest: 'Pra Loup', from: '550 €' },
      { dest: 'Vars', from: '580 €' },
      { dest: 'Risoul', from: '560 €' },
      { dest: 'Serre Chevalier', from: '640 €' },
      { dest: 'Montgenèvre', from: '650 €' },
    ],
  },
]

export type Vehicle = {
  model: string
  seats: number
  features: string[]
  image: string
  imageSm: string
}

export const fleet: Vehicle[] = [
  {
    model: 'Mercedes Classe V',
    seats: 7,
    image: '/photos/v0.jpg',
    imageSm: '/photos/v0-sm.jpg',
    features: [
      'Van extra-long avec grand coffre',
      'Sièges enfant et rehausseurs',
      'Chargeur téléphone à bord',
      'Eau plate & pétillante offerte',
      'Climatisation indépendante arrière',
      'Espace de travail confortable',
    ],
  },
]

// Vraies photos du Mercedes Classe V de Taxi Julien — chacune dans un contexte d'usage.
export type GalleryPhoto = {
  src: string
  srcSm: string
  alt: string
  caption: string
  context: 'Aéroport' | 'Port' | 'Gare' | 'Longue distance' | 'Marseille' | 'Hôtel'
}

export const gallery: GalleryPhoto[] = [
  {
    src: '/photos/v8.jpg',
    srcSm: '/photos/v8-sm.jpg',
    alt: 'Mercedes Classe V Taxi Julien devant le Terminal 1 de nuit',
    caption: 'Terminal 1 — accueil de nuit',
    context: 'Aéroport',
  },
  {
    src: '/photos/v3.jpg',
    srcSm: '/photos/v3-sm.jpg',
    alt: "Mercedes Classe V Taxi Julien à l'aéroport Terminal 1 de jour",
    caption: 'Aéroport Marseille Provence',
    context: 'Aéroport',
  },
  {
    src: '/photos/v1.jpg',
    srcSm: '/photos/v1-sm.jpg',
    alt: 'Mercedes Classe V Taxi Julien devant un hôtel avec bagages',
    caption: 'Bagages XL — chargement hôtel',
    context: 'Hôtel',
  },
  {
    src: '/photos/v7.jpg',
    srcSm: '/photos/v7-sm.jpg',
    alt: 'Mercedes Classe V Taxi Julien devant le paquebot Costa Diadema',
    caption: 'Port de croisière — Costa Diadema',
    context: 'Port',
  },
  {
    src: '/photos/v5.jpg',
    srcSm: '/photos/v5-sm.jpg',
    alt: 'Mercedes Classe V Taxi Julien devant un navire MSC',
    caption: 'Port de croisière — MSC',
    context: 'Port',
  },
  {
    src: '/photos/v4.jpg',
    srcSm: '/photos/v4-sm.jpg',
    alt: 'Mercedes Classe V Taxi Julien en montagne, neige et sommets',
    caption: 'Longue distance — montagne & ski',
    context: 'Longue distance',
  },
  {
    src: '/photos/v2.jpg',
    srcSm: '/photos/v2-sm.jpg',
    alt: 'Mercedes Classe V Taxi Julien sur une zone taxi à Marseille',
    caption: 'Zone taxi — Marseille',
    context: 'Marseille',
  },
  {
    src: '/photos/v6.jpg',
    srcSm: '/photos/v6-sm.jpg',
    alt: 'Mercedes Classe V Taxi Julien en ville arborée',
    caption: 'En ville — accueil clients',
    context: 'Marseille',
  },
  {
    src: '/photos/v0.jpg',
    srcSm: '/photos/v0-sm.jpg',
    alt: 'Mercedes Classe V Taxi Julien plein cadre',
    caption: "Mercedes Classe V — vue d'ensemble",
    context: 'Marseille',
  },
]

export const paymentMethods = [
  'Carte bancaire (CB / Visa)',
  'Espèces',
  'Tiers payant CPAM (transport médical)',
  'Facturation entreprise (sur demande)',
]

export type Testimonial = {
  author: string
  text: string
  context: string
  rating: 5
}

export const testimonials: Testimonial[] = [
  { author: 'Bernadette T.', context: 'Transport groupe vers le port de croisière', rating: 5, text: "Chauffeur ponctuel, courtois, véhicule impeccable. Idéal pour un groupe avec bagages." },
  { author: 'Jeremy L.', context: 'Transfert aéroport Marseille Provence', rating: 5, text: "Très professionnel, à l'heure, communication parfaite avant la course. Confort top dans la Mercedes Classe V." },
  { author: 'Christian M.', context: 'Saint-Charles → terminal croisière', rating: 5, text: "Service nickel, prise en charge rapide, dépose juste devant le terminal. Très bon rapport qualité-prix." },
  { author: 'Laurie P.', context: 'Course 6 personnes', rating: 5, text: "Parfait pour notre groupe de 6. Le van est spacieux, les enfants ont eu des sièges adaptés." },
  { author: 'Christelle H.', context: 'Trajets multiples', rating: 5, text: "J'ai pris Taxi Julien plusieurs fois, toujours fiable et ponctuel. Mon taxi attitré sur Marseille." },
]

export type FAQItem = { q: string; a: string }

export const faq: FAQItem[] = [
  { q: 'Comment réserver rapidement ?', a: "Le plus rapide : appeler le 06 35 58 24 72 ou envoyer un message WhatsApp. Vous pouvez aussi remplir le formulaire ci-dessus, nous répondons en quelques minutes 24h/24." },
  { q: 'Quels moyens de paiement ?', a: "Carte bancaire (CB et Visa), espèces, et tiers payant CPAM pour le transport médical conventionné. Facturation entreprise sur demande." },
  { q: 'Êtes-vous disponibles 24h/24 ?', a: "Oui. Taxi Julien fonctionne 24h/24, 7j/7, dimanches et jours fériés inclus. Tarif nuit (19h-7h) et dimanche/férié à 2,88 €/km." },
  { q: 'Quelle est la capacité du véhicule ?', a: "Mercedes Classe V — 1 à 7 passagers avec leurs bagages. Sièges enfant et rehausseurs disponibles à la demande, sans supplément." },
  { q: 'Faites-vous le transport médical ?', a: "Oui, nous sommes conventionnés CPAM (VSL). Transferts vers Paoli-Calmettes, Sainte-Marguerite, La Timone, La Conception, Hôpital Nord. Sans avance de frais." },
  { q: 'Combien coûte un transfert aéroport ?', a: "Le forfait fixe Marseille ↔ Aéroport Marseille Provence est compris entre 70 € et 110 € selon le nombre de passagers et la zone de prise en charge." },
  { q: 'Allez-vous au-delà de Marseille ?', a: "Oui : Aix-en-Provence, Cassis, La Ciotat, Toulon, Bandol, Saint-Tropez, Pra Loup, Nice et toute la région PACA. Forfait longue distance sur devis." },
  { q: 'Et si mon vol ou train est en retard ?', a: "Pas d'inquiétude : nous suivons votre vol ou train et adaptons l'heure de prise en charge. Aucun frais d'attente facturé pour un retard de transporteur." },
]

export const hospitals = [
  'Institut Paoli-Calmettes',
  'Hôpital Sainte-Marguerite',
  'Hôpital de la Timone',
  'Hôpital de la Conception',
  'Hôpital Nord',
]

// Hubs de transport
export const transportHubs = {
  airports: [
    'Marseille Provence (Marignane)',
    "Nice Côte d'Azur",
    'Toulon-Hyères',
  ],
  stations: [
    'Gare Saint-Charles (Marseille)',
    'Gare Aix TGV',
    'Gare de Toulon',
    "Gare TGV d'Avignon",
  ],
  ports: [
    'Port de croisière Marseille',
    'Embarcadère du Brusc / Les Embiez',
  ],
  ski: [
    'Les Arcs',
    'Les Orres',
    'Risoul',
    'Vars',
    'Pra Loup',
  ],
}

// Corridor Var & côte — 29 villes desservies, ordonnées de Marseille à Saint-Tropez
export const varCorridor = [
  'Marseille',
  'La Penne-sur-Huveaune',
  'Aubagne',
  'Carnoux-en-Provence',
  'Roquefort-la-Bédoule',
  'Cassis',
  'La Ciotat',
  'Saint-Cyr-sur-Mer',
  "La Cadière-d'Azur",
  'Le Castellet',
  'Bandol',
  'Sanary-sur-Mer',
  'Six-Fours-les-Plages',
  'La Seyne-sur-Mer',
  'Ollioules',
  'Toulon',
  'La Valette-du-Var',
  'La Garde',
  'La Crau',
  'Hyères',
  'La Londe-les-Maures',
  'Bormes-les-Mimosas',
  'Le Lavandou',
  'Cavalaire-sur-Mer',
  'La Croix-Valmer',
  'Gassin',
  'Cogolin',
  'Grimaud',
  'Saint-Tropez',
]

// Provence intérieure
export const provenceArea = [
  'Aix-en-Provence',
  'Avignon',
  'Arles',
  'Aubagne',
  'Allauch',
  'Plan-de-Cuques',
  'Marignane',
  'Vitrolles',
  'Salon-de-Provence',
]

// Liste plate (pour SEO + Schema)
export const serviceArea = [
  ...varCorridor,
  ...provenceArea.filter(p => !varCorridor.includes(p)),
  ...transportHubs.ski,
  'Bouches-du-Rhône', 'Var', 'Alpes-Maritimes', 'Vaucluse', 'Hautes-Alpes', 'Savoie',
]

// Trust marquee strip
export const trustBadges = [
  'Conventionné CPAM',
  'Anglais parlé',
  'CB · Visa · Espèces',
  'Mercedes Classe V',
  'Sièges enfant inclus',
  'Suivi de vol',
  '24h/24 · 7j/7',
  'Depuis 2009',
]

// ============================================================
// Articles de blog — SEO + intérêt visiteurs
// Sujets choisis pour ranker sur Google et convertir en réservations.
// ============================================================

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'cta'; label: string; destinationId?: string }

export type Article = {
  slug: string
  title: string
  subtitle: string
  excerpt: string
  hero: string
  heroSm: string
  date: string
  season: 'Hiver' | 'Printemps' | 'Été' | 'Automne' | 'Toute l\'année'
  readTime: string
  tags: string[]
  body: ArticleBlock[]
  ctaDestinationId?: string
}

export const articles: Article[] = [
  {
    slug: 'cassis-hiver-calanques',
    title: 'Cassis en hiver : les Calanques sans la foule',
    subtitle: 'Le secret de novembre à mars',
    excerpt: "De novembre à mars, le port de Cassis retrouve son calme et les Calanques s'offrent à vous. Lumière dorée, sentiers vides, tables locales — la meilleure période de l'année.",
    hero: '/photos/dest-cassis.jpg',
    heroSm: '/photos/dest-cassis-sm.jpg',
    date: '2026-01-12',
    season: 'Hiver',
    readTime: '4 min',
    tags: ['Cassis', 'Calanques', 'Hiver', 'Randonnée'],
    body: [
      { type: 'p', text: "L'été, Cassis se transforme : 8 000 visiteurs par jour sur le port, des parkings saturés dès 9h, et la route des crêtes fermée aux voitures particulières. L'hiver, tout change. Le port redevient un vrai village de pêcheurs et les calanques de Port-Miou, Port-Pin et En-Vau se découvrent dans une lumière incomparable." },
      { type: 'h3', text: 'Pourquoi y aller hors saison' },
      { type: 'ul', items: [
        "Sentiers libres : la randonnée jusqu'à la calanque d'En-Vau (1h30 aller depuis Cassis) se fait dans le calme absolu.",
        "Lumière unique : le mistral chasse les nuages, les falaises blanches éclatent contre la mer bleu nuit.",
        "Tables locales accessibles : Chez Gilbert, La Villa Madie — réservations possibles le jour même.",
        "Vins de Cassis AOC : les 12 domaines sont en pleine taille et ouverts à la dégustation (Clos Sainte-Magdeleine, Château de Fontblanche).",
        "Tarif transport doux : forfait Marseille → Cassis à partir de 65 €, parfait pour une journée à deux.",
      ]},
      { type: 'h3', text: 'Comment s\'y rendre depuis Marseille' },
      { type: 'p', text: "En voiture, la route est sinueuse et le stationnement à Cassis très limité (zone bleue stricte). Le train depuis Marseille Saint-Charles vous dépose à 4 km du port, sans navette systématique en hiver. La solution la plus simple : un taxi qui vous dépose au pied du port, attend ou repart à votre convenance, et vous récupère où vous voulez — départ de randonnée, restaurant, domaine viticole." },
      { type: 'quote', text: "On vous dépose au port à 10h, vous nous appelez à 16h depuis le sentier, on est là 25 minutes après. Pas de stress, pas de parking.", author: 'Julien' },
      { type: 'cta', label: 'Réserver mon aller-retour Marseille ↔ Cassis', destinationId: 'cassis' },
    ],
    ctaDestinationId: 'cassis',
  },
  {
    slug: 'saint-tropez-depuis-marseille',
    title: 'Saint-Tropez depuis Marseille : le bon plan',
    subtitle: 'Pourquoi le taxi bat la voiture de location',
    excerpt: "2h30 de route, un parking impossible à 80 €/jour, et l'A50 en bouchon dès juin. Voici pourquoi un taxi privé revient parfois moins cher qu'une location + parking.",
    hero: '/photos/dest-sainttropez.jpg',
    heroSm: '/photos/dest-sainttropez-sm.jpg',
    date: '2026-04-08',
    season: 'Été',
    readTime: '5 min',
    tags: ['Saint-Tropez', 'Côte d\'Azur', 'Été', 'Couple'],
    body: [
      { type: 'p', text: "Saint-Tropez attire 100 000 visiteurs en juillet-août. Le revers : la D559 devient un long bouchon, les parkings du centre sont à 8 €/h avec une attente de 45 minutes, et la zone piétonne s'étend chaque été. Beaucoup partent en voiture de location pensant économiser ; ils repartent stressés et avec une facture salée." },
      { type: 'h3', text: 'Le vrai calcul du week-end' },
      { type: 'ul', items: [
        "Location voiture 3 jours : ~180 € (catégorie compacte, juillet)",
        "Carburant Marseille ↔ Saint-Tropez aller-retour : ~70 €",
        "Péages A50/A57 : ~24 €",
        "Parking 3 jours à Saint-Tropez : 90 € minimum",
        "Total : ~365 € + le stress du parking",
      ]},
      { type: 'p', text: "Notre forfait Marseille → Saint-Tropez : 335 € en journée, 386 € de nuit. Aller simple, Mercedes Classe V, jusqu'à 7 passagers avec leurs bagages. Le retour peut se faire le lendemain ou plus tard selon votre programme. Sur un aller-retour week-end à deux, vous y êtes." },
      { type: 'h3', text: 'Les étapes possibles en route' },
      { type: 'ul', items: [
        "Bandol pour un déjeuner port + dégustation du Domaine Tempier",
        "Cap Sicié pour une pause photo des calanques varoises",
        "Bormes-les-Mimosas si vous voyagez entre janvier et mars (mimosa en fleurs)",
        "Saint-Tropez avec dépose au Vieux Port, à Pampelonne ou directement à votre hôtel",
      ]},
      { type: 'cta', label: 'Demander un devis Marseille → Saint-Tropez', destinationId: 'saint-tropez' },
    ],
    ctaDestinationId: 'saint-tropez',
  },
  {
    slug: 'ski-depuis-marseille',
    title: 'Skier depuis Marseille : les 8 meilleures stations en 3h',
    subtitle: 'Pra Loup, Risoul, Vars, Les Orres — le ski sans les chaînes',
    excerpt: "Les Marseillais ont une chance que peu de Français connaissent : 8 grandes stations de ski sont accessibles en moins de 3h30. Voici lesquelles, et pourquoi y aller en taxi change tout.",
    hero: '/photos/dest-ski-praloup.jpg',
    heroSm: '/photos/dest-ski-praloup-sm.jpg',
    date: '2026-01-05',
    season: 'Hiver',
    readTime: '6 min',
    tags: ['Ski', 'Hautes-Alpes', 'Hiver', 'Famille'],
    body: [
      { type: 'p', text: "Depuis Marseille, les Hautes-Alpes sont à portée de week-end. Pra Loup à 2h45, Les Orres à 2h50, Vars à 3h, Serre Chevalier à 3h30. Mais entre les chaînes obligatoires de décembre à mars, la fatigue du retour le dimanche soir, et le ski rack à monter, beaucoup hésitent. Un taxi privé Mercedes Classe V change la donne." },
      { type: 'h3', text: 'Les 8 stations accessibles en moins de 3h30' },
      { type: 'ul', items: [
        "Superdévoluy — 2h30 — domaine relié au Dévoluy, 100 km de pistes",
        "Orcières Merlette — 2h40 — face sud, neige garantie",
        "Pra Loup — 2h45 — relié à La Foux d'Allos, Espace Lumière 180 km",
        "Les Orres — 2h50 — 100 km de pistes, vue sur Serre-Ponçon",
        "Risoul — 3h — Forêt Blanche reliée à Vars, 185 km de pistes",
        "Vars — 3h — Forêt Blanche, idéal famille",
        "Serre Chevalier — 3h30 — 250 km de pistes, Briançon à 5 km",
        "Montgenèvre — 3h30 — Voie Lactée transfrontalière, 400 km",
      ]},
      { type: 'h3', text: 'Pourquoi le taxi plutôt que la voiture' },
      { type: 'p', text: "Le col de Vars (2 110 m) impose les chaînes 4 mois sur 12. La route de Briançon par le Champsaur est régulièrement fermée par la neige. Notre Mercedes Classe V est équipée en hiver de pneus neige + chaînes à demeure. Vous chargez vos skis, vous dormez à l'aller, vous récupérez à l'arrivée. Tarif à partir de 520 € l'aller (départ Marseille)." },
      { type: 'cta', label: 'Réserver mon transfert station de ski', destinationId: 'ski-pra-loup' },
    ],
    ctaDestinationId: 'ski-pra-loup',
  },
  {
    slug: 'aeroport-marseille-provence-taxi',
    title: 'Aéroport Marseille Provence : taxi, navette, VTC — vrai comparatif',
    subtitle: 'Combien ça coûte vraiment d\'arriver au terminal',
    excerpt: "Aéroport à 30 min du centre, parking longue durée à 12 €/jour, navette à 9 € mais 35 min de trajet… On démêle les options pour ne pas se tromper.",
    hero: '/photos/v8.jpg',
    heroSm: '/photos/v8-sm.jpg',
    date: '2026-03-02',
    season: 'Toute l\'année',
    readTime: '4 min',
    tags: ['Aéroport', 'Transfert', 'Marseille', 'Vol'],
    body: [
      { type: 'p', text: "L'Aéroport Marseille Provence (MRS) est à Marignane, 30 km du centre. Avec 10 millions de passagers par an, c'est le 4e aéroport de France. Plusieurs options pour s'y rendre, chacune avec ses pièges." },
      { type: 'h3', text: 'Comparatif honnête' },
      { type: 'ul', items: [
        "Navette aéroport (ligne 91) : 9 € · 35-50 min · départ uniquement de Saint-Charles · pas de bagages XL · arrêts intermédiaires.",
        "Train + navette : 11 € · 40 min · changement à Vitrolles-Aéroport · cher en duo, infernal en famille.",
        "VTC application : 35-55 € · disponibilité incertaine entre 23h et 5h · surge prices vols dimanche soir.",
        "Voiture + parking longue durée : 12 €/jour soit 84 € sur 7 jours · 15 min de navette depuis P5 · vol pris au retour.",
        "Taxi forfait fixe : 70-110 € selon votre arrondissement · pas de surprise · suivi du vol inclus.",
      ]},
      { type: 'h3', text: 'Pour qui le taxi vaut le coup' },
      { type: 'p', text: "Si vous partez à 2 ou plus, le taxi devient compétitif dès le premier passager supplémentaire. Avec valises et un vol tôt le matin (avant 6h), c'est la seule option sereine : on vous prend chez vous, on suit votre vol au retour pour ajuster l'heure, on vous accueille en zone arrivée. Forfait fixe annoncé à la réservation, paiement CB ou espèces." },
      { type: 'cta', label: 'Réserver mon transfert Marseille → Aéroport', destinationId: 'aeroport-marseille-provence' },
    ],
    ctaDestinationId: 'aeroport-marseille-provence',
  },
  {
    slug: 'croisiere-marseille-port',
    title: 'Croisière Marseille : ne ratez plus votre embarquement',
    subtitle: 'Le J16 et la Cap Janet expliqués',
    excerpt: "Costa, MSC, Royal Caribbean — Marseille est le 2e port de croisière de Méditerranée. Mais entre J4 et Cap Janet, les passagers se perdent. Voici les bons réflexes.",
    hero: '/photos/v5.jpg',
    heroSm: '/photos/v5-sm.jpg',
    date: '2026-03-18',
    season: 'Printemps',
    readTime: '3 min',
    tags: ['Croisière', 'Port', 'MSC', 'Costa'],
    body: [
      { type: 'p', text: "Marseille reçoit 1,6 million de croisiéristes par an. Les bateaux accostent dans deux zones distinctes : Môle Léon Gourret (terminaux internationaux J4, MPCT, Cap Janet) pour les grosses unités, et le môle Pinède pour les ferrys. Confondre les deux peut vous coûter votre départ." },
      { type: 'h3', text: 'Les terminaux de croisière' },
      { type: 'ul', items: [
        "MPCT (Marseille Provence Cruise Terminal) — Costa, principal opérateur",
        "Cap Janet — MSC, Royal Caribbean, Norwegian",
        "Terminal J4 — embarquements occasionnels, navires plus petits",
        "Tous accessibles depuis le Vieux-Port en 10-15 min selon le trafic",
      ]},
      { type: 'h3', text: 'Le bon timing' },
      { type: 'p', text: "Les compagnies demandent un check-in 2h à 3h avant l'appareillage. En haute saison (juillet-août), prévoyez 30 min de battement supplémentaire car les files s'allongent et le contrôle des bagages prend plus de temps. Notre service inclut le suivi du trafic en temps réel : si l'A55 ou le tunnel Prado-Carénage bouchonnent, on vous prend plus tôt sans frais." },
      { type: 'cta', label: 'Réserver mon transfert vers le port', destinationId: 'port-croisiere-marseille' },
    ],
    ctaDestinationId: 'port-croisiere-marseille',
  },
  {
    slug: 'aix-en-provence-une-journee',
    title: 'Aix-en-Provence : la journée parfaite',
    subtitle: 'Cours Mirabeau, Cézanne, marchés — en 8 heures',
    excerpt: "À 30 km de Marseille, Aix offre l'expérience Provence ultime. Voici le programme pour une journée sans rien rater — et sans se garer.",
    hero: '/photos/dest-aix.jpg',
    heroSm: '/photos/dest-aix-sm.jpg',
    date: '2026-05-05',
    season: 'Printemps',
    readTime: '5 min',
    tags: ['Aix-en-Provence', 'Cézanne', 'Provence', 'Culture'],
    body: [
      { type: 'p', text: "Aix-en-Provence, c'est 2 100 ans d'histoire, 600 ans d'université, le pays de Cézanne et 100 fontaines. À 30 km de Marseille, c'est la sortie d'une journée idéale — à condition d'éviter le piège du parking." },
      { type: 'h3', text: 'Le programme idéal' },
      { type: 'ul', items: [
        "9h00 — Marché de la Place Richelme (mardi, jeudi, samedi) : producteurs locaux, fromages AOC",
        "10h30 — Cours Mirabeau, café aux Deux Garçons (façade XVIIIᵉ classée)",
        "11h00 — Cathédrale Saint-Sauveur, vitraux et clocher",
        "12h30 — Déjeuner Place des Cardeurs ou Place de l'Hôtel-de-Ville",
        "14h30 — Atelier Cézanne (avenue Paul Cézanne) : son atelier intact",
        "16h30 — Carrières de Bibémus (visite guidée OT, 8 km du centre)",
        "18h00 — Apéritif Place d'Albertas, retour vers Marseille",
      ]},
      { type: 'p', text: "Tarif aller-retour Marseille ↔ Aix-en-Provence : à partir de 90 € en journée. On vous dépose Place de la Rotonde, on revient vous chercher à l'heure de votre choix. Pas de parking à 20 € sur le Cours Sextius, pas de stress." },
      { type: 'cta', label: 'Réserver mon aller-retour Aix-en-Provence', destinationId: 'aix-en-provence' },
    ],
    ctaDestinationId: 'aix-en-provence',
  },
  {
    slug: 'avignon-festival-juillet',
    title: 'Festival d\'Avignon : monter depuis Marseille en juillet',
    subtitle: 'Le seul mois où la ville triple de population',
    excerpt: "Du 5 au 26 juillet, 130 000 spectateurs envahissent Avignon. Le train est saturé, les hôtels affichent +200%, et la voiture devient un enfer. Notre approche.",
    hero: '/photos/dest-avignon.jpg',
    heroSm: '/photos/dest-avignon-sm.jpg',
    date: '2026-06-20',
    season: 'Été',
    readTime: '4 min',
    tags: ['Avignon', 'Festival', 'Été', 'Culture'],
    body: [
      { type: 'p', text: "Le Festival d'Avignon, c'est 1 700 spectacles répartis entre le IN (officiel, dans la Cour d'honneur du Palais des Papes) et le OFF (1 600 spectacles dans 130 salles). C'est la rencontre culturelle française la plus dense — et la plus tendue logistiquement." },
      { type: 'h3', text: 'Les défis de juillet à Avignon' },
      { type: 'ul', items: [
        "Hôtels remplis dès février, prix x2 à x3 par rapport au reste de l'année",
        "Parking intra-muros impossible (ville fortifiée, voitures interdites)",
        "TGV Marseille → Avignon souvent complet en fin de semaine",
        "Soirée tardive : pas de retour train après 22h30",
      ]},
      { type: 'h3', text: 'L\'option taxi pour une soirée festival' },
      { type: 'p', text: "Une formule courante : on vous prend à Marseille en fin d'après-midi, on vous dépose Porte Saint-Michel (15 min à pied du Palais des Papes), vous voyez votre spectacle, dînez en ville, et on vous ramène après. Tarif Marseille → Avignon : 210 € jour, 265 € nuit. Pour 4 personnes, c'est 50-70 € chacun, et vous gardez votre lit à Marseille." },
      { type: 'cta', label: 'Réserver mon trajet Festival d\'Avignon', destinationId: 'avignon' },
    ],
    ctaDestinationId: 'avignon',
  },
  {
    slug: 'mariages-provence-navette',
    title: 'Mariage en Provence : la logistique invités',
    subtitle: 'Bastides, mas, châteaux — comment faire venir tout le monde',
    excerpt: "Vous vous mariez dans un mas du Luberon ou un château varois ? Voici comment organiser le transport des invités sans transformer le jour J en cauchemar.",
    hero: '/photos/v6.jpg',
    heroSm: '/photos/v6-sm.jpg',
    date: '2026-05-15',
    season: 'Printemps',
    readTime: '4 min',
    tags: ['Mariage', 'Événement', 'Provence', 'VIP'],
    body: [
      { type: 'p', text: "Un mariage en Provence, c'est souvent un domaine isolé, des invités venus de toute la France et d'ailleurs, une cérémonie laïque à 17h, un dîner sous les platanes, et une fête qui dure jusqu'à 4h du matin. Trois problèmes logistiques classiques : le transport aéroport/gare, la navette invités, et les retours nocturnes." },
      { type: 'h3', text: 'Nos formules mariage' },
      { type: 'ul', items: [
        "Accueil aéroport / gare TGV personnalisé pour les invités VIP (parents, témoins)",
        "Navette domaine pour les groupes : 7 places en Mercedes Classe V, rotations possibles",
        "Voiture des mariés : Mercedes Classe V soignée, chauffeur en tenue, fleurs facultatives",
        "Retours nocturnes coordonnés : tour de table à 1h, 2h, 3h, 4h, jamais d'invité oublié",
        "Devis sur mesure selon nombre d'invités et distance",
      ]},
      { type: 'p', text: "On a couvert des mariages au Domaine de Manville (Baux-de-Provence), Mas de la Rose (Orgon), Château La Coste (Le Puy-Sainte-Réparade), Bastide du Calalou (Var). Devis transparent par email, pas de surprise le matin du jour J." },
      { type: 'cta', label: 'Demander un devis mariage' },
    ],
  },
]

