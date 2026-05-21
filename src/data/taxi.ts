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
