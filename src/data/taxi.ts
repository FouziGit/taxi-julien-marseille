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

// ============================================================
// Enriched destination content — per-page SEO data for the
// dedicated /destinations/[id]/ landing pages. Optional and
// keyed by Destination.id so existing UI sections that consume
// `destinations[]` keep working unchanged.
// EVERY non-optional field must be a verified fact (Maps / OSM
// / official sites). When unsure, leave undefined — the page
// template renders gracefully without it.
// ============================================================

export type DestSpot = {
  /** Display name of the place (real, verifiable). */
  name: string
  /** One-line description (60-120 chars). */
  blurb: string
  /** Category emoji + label, used to colour the icon in the page. */
  type: 'beach' | 'monument' | 'museum' | 'viewpoint' | 'restaurant' | 'wine' | 'market' | 'sport' | 'hike' | 'shopping' | 'church' | 'other'
}

export type DestFAQ = { q: string; a: string }

export type DestContent = {
  /** Match the existing Destination.id in destinations[]. */
  id: string
  /** Driving distance from Marseille (km), Google Maps / ViaMichelin verified. */
  distanceKm: number
  /** Real off-peak driving time, e.g. "~35 min" or "2h–2h30". */
  durationReal: string
  /** INSEE département code (e.g. '13', '83', '06'). */
  deptCode: string
  deptName: string
  /** GPS coords (decimal degrees, WGS-84), commune centroid. */
  geo: { lat: number; lng: number }
  /** SEO title (< 60 chars including ' | Taxi Julien'). */
  seoTitle: string
  /** Meta description (< 155 chars). */
  seoDescription: string
  /** Page H1 (full, with prefix 'Taxi Marseille → …'). */
  h1: string
  /** Hero subtitle: distance + duration in user-facing format. */
  heroSubtitle: string
  /** Lead paragraph (2-4 sentences) for the page intro. */
  lead: string
  /** Optional details on the trip itself (route, pick-up notes). */
  tripNotes?: string
  /** 4-8 real POIs / spots to visit at the destination. */
  spots: DestSpot[]
  /** Specific use cases (cruise transfer, airport, event…). */
  useCases?: string[]
  /** 3-5 destination-specific FAQ items. */
  faq: DestFAQ[]
  /** IDs of 3-4 nearby destinations for internal linking. */
  related: string[]
}

export const destContent: DestContent[] = [
  {
    id: 'cassis',
    distanceKm: 30,
    durationReal: '~35 min',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.2151, lng: 5.5365 },
    seoTitle: 'Taxi Marseille → Cassis : forfait calanques | Taxi Julien',
    seoDescription: 'Transfert taxi Marseille → Cassis (30 km, 35 min). Forfait 130 € jour / 160 € nuit. Mercedes Classe V 7 pax. Dépose port, calanques, vignobles. 24h/24.',
    h1: 'Taxi Marseille → Cassis',
    heroSubtitle: 'Port de pêche · Calanques · 30 km · ~35 min',
    lead: 'Cassis, c\'est 22 km à vol d\'oiseau de Marseille mais une bulle à part : port de pêche provençal niché entre le Cap Canaille (le plus haut cap maritime de France, 394 m) et les calanques classées Parc national. Notre Mercedes Classe V vous y dépose en 35 min en heure creuse — directement au Vieux Port, au départ du sentier des calanques, ou à votre domaine viticole.',
    tripNotes: 'Trajet par l\'A50 et la D559 panoramique. En été (juillet–août), la Route des Crêtes est fermée aux voitures particulières — autant prendre un taxi qui vous attend au port pendant que vous randonnez ou déjeunez. Le stationnement à Cassis est très limité (zone bleue stricte autour du port).',
    spots: [
      { name: 'Calanque de Port-Miou', blurb: 'La plus longue calanque de Cassis, ancien port d\'exploitation de la pierre. Accessible à pied depuis le port en 25 min.', type: 'viewpoint' },
      { name: 'Calanque de Port-Pin', blurb: 'Petite plage de galets bordée de pins parasol, entre Port-Miou et En-Vau. 45 min de marche depuis le port.', type: 'beach' },
      { name: 'Calanque d\'En-Vau', blurb: 'La plus emblématique : falaises blanches de 100 m, eau turquoise, accès par sentier (1h30 aller-retour) ou en bateau.', type: 'beach' },
      { name: 'Cap Canaille', blurb: 'Plus haut cap maritime de France métropolitaine (394 m). Route des Crêtes panoramique entre Cassis et La Ciotat.', type: 'viewpoint' },
      { name: 'Vieux Port de Cassis', blurb: 'Port de pêche traditionnel avec ses pointus colorés, restaurants face à la mer et terrasses au pied du château.', type: 'restaurant' },
      { name: 'Clos Sainte-Magdeleine', blurb: 'Plus ancien domaine viticole AOC Cassis en activité (XIXe siècle). Visite + dégustation sur rendez-vous.', type: 'wine' },
      { name: 'Plage de la Grande Mer', blurb: 'Plage municipale au cœur du port, accessible aux familles. Eau peu profonde, vue sur les falaises.', type: 'beach' },
      { name: 'Château de Cassis', blurb: 'Forteresse médiévale (XIIIe siècle) perchée au-dessus du port. Aujourd\'hui hôtel et restaurant gastronomique.', type: 'monument' },
    ],
    useCases: [
      'Aller-retour journée pour randonner les calanques (dépose port + retour fin d\'après-midi)',
      'Dégustation dans les 12 domaines AOC Cassis (Clos Sainte-Magdeleine, Château de Fontblanche…)',
      'Transfert pour un mariage ou repas dans un domaine viticole',
      'Dépose à un départ de bateau touristique (visite calanques par la mer)',
    ],
    faq: [
      {
        q: 'Combien coûte un taxi Marseille → Cassis ?',
        a: 'Forfait fixe 130 € en journée (7h–19h) et 160 € la nuit, le dimanche ou les jours fériés. Prix annoncé à la réservation, valable jusqu\'à 7 passagers en Mercedes Classe V, bagages inclus.',
      },
      {
        q: 'Combien de temps dure le trajet Marseille → Cassis ?',
        a: 'Environ 35 minutes en heure creuse via l\'A50. En été (juillet-août) ou les vendredis de retour de week-end, prévoir 50 min à 1h selon le trafic.',
      },
      {
        q: 'Le taxi peut-il m\'attendre pendant ma visite des calanques ?',
        a: 'Oui. Soit nous restons sur place avec attente facturée selon le tarif réglementé (34,60 €/h), soit nous revenons à l\'heure de votre choix — vous nous appelez quand vous voulez repartir.',
      },
      {
        q: 'Pouvez-vous déposer au départ du sentier des calanques (Port-Miou) ?',
        a: 'Oui. Le parking du Domaine d\'Arène (Port-Miou) est accessible aux taxis. C\'est le point de départ classique pour rejoindre Port-Pin et En-Vau à pied.',
      },
      {
        q: 'Le retour de Cassis vers Marseille de nuit est-il possible ?',
        a: 'Oui, 24h/24. Le tarif nuit (19h–7h) s\'applique : forfait fixe 160 € retour ou aller-retour selon votre programme.',
      },
    ],
    related: ['la-ciotat', 'aix-en-provence', 'aeroport-marseille-provence', 'port-croisiere-marseille'],
  },
  {
    id: 'aix-en-provence',
    distanceKm: 32,
    durationReal: '~30 min',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.5297, lng: 5.4474 },
    seoTitle: 'Taxi Marseille → Aix-en-Provence | Taxi Julien',
    seoDescription: 'Transfert taxi Marseille → Aix-en-Provence (32 km, 30 min). Mercedes Classe V 7 pax. Dépose Cours Mirabeau, gare TGV, Cézanne. 24h/24 · 06 35 58 24 72.',
    h1: 'Taxi Marseille → Aix-en-Provence',
    heroSubtitle: 'Cours Mirabeau · Cézanne · 32 km · ~30 min',
    lead: 'Aix-en-Provence est à 32 km de Marseille par l\'A51, soit 30 min de trajet en heure creuse. Cité universitaire et patrimoniale (2 100 ans d\'histoire, 100 fontaines), c\'est la sortie d\'une journée idéale au départ de Marseille — à condition d\'éviter le parking impossible du centre. Notre Mercedes Classe V vous dépose Place de la Rotonde ou directement au pied du Cours Mirabeau.',
    tripNotes: 'Trajet par l\'A51 (péage gratuit Marseille → Aix). Évite les bouchons quotidiens de la D8N. Le centre d\'Aix est en zone piétonne élargie — votre taxi dépose en bordure (Rotonde, Cours Sextius, Cours Mirabeau).',
    spots: [
      { name: 'Cours Mirabeau', blurb: 'Avenue emblématique XVIIe siècle, 440 m bordés de platanes centenaires, cafés (Deux Garçons, façade classée) et hôtels particuliers.', type: 'monument' },
      { name: 'Atelier Cézanne', blurb: 'Atelier de Paul Cézanne (avenue Paul Cézanne), conservé en l\'état depuis sa mort en 1906. Pinceaux, palette et nature morte d\'origine.', type: 'museum' },
      { name: 'Cathédrale Saint-Sauveur', blurb: 'Cathédrale romano-gothique (Ve-XVIIIe siècle) abritant un baptistère paléochrétien rare et le triptyque du Buisson ardent (Nicolas Froment).', type: 'church' },
      { name: 'Fontaine de la Rotonde', blurb: 'Fontaine monumentale (1860, 32 m de diamètre) à l\'entrée du Cours Mirabeau. Trois statues : Justice, Agriculture, Beaux-Arts.', type: 'monument' },
      { name: 'Hôtel de Caumont', blurb: 'Hôtel particulier XVIIIe transformé en centre d\'art. Expositions temporaires d\'envergure internationale (Sisley, Turner, Monet récemment).', type: 'museum' },
      { name: 'Marché Place Richelme', blurb: 'Marché de producteurs locaux mardi, jeudi et samedi matin. Fromages AOC, fruits et légumes de Provence, miel, huile d\'olive.', type: 'market' },
      { name: 'Carrières de Bibémus', blurb: 'Carrières d\'ocre (8 km du centre) où Cézanne a peint plusieurs séries. Site protégé, visite guidée par l\'Office de Tourisme.', type: 'viewpoint' },
      { name: 'Place des Cardeurs', blurb: 'Grande place piétonne avec terrasses de restaurants. Idéal pour déjeuner en terrasse à midi.', type: 'restaurant' },
    ],
    useCases: [
      'Sortie journée culture (musée Granet, Atelier Cézanne, déjeuner)',
      'Transfert gare Aix TGV ↔ centre-ville Aix (~10 min en taxi)',
      'Aller-retour pour un dîner Place des Cardeurs ou Cours Mirabeau',
      'Visite Carrières de Bibémus + dégustation domaines viticoles environnants',
    ],
    faq: [
      {
        q: 'Combien coûte un taxi Marseille → Aix-en-Provence ?',
        a: 'Forfait à partir de 90 € en journée. Le tarif exact dépend de votre adresse de prise en charge à Marseille et du nombre de passagers. Annoncé fermement à la réservation.',
      },
      {
        q: 'Combien de temps pour aller de Marseille à Aix ?',
        a: 'Environ 30 minutes en heure creuse par l\'A51. Aux heures de pointe (7h30–9h30 et 17h–19h en semaine), prévoir 45 min à 1h.',
      },
      {
        q: 'Pouvez-vous m\'amener à la gare Aix TGV ?',
        a: 'Oui. La gare Aix TGV est à environ 15 km du centre d\'Aix et à 25 km de Marseille. Forfait spécifique sur devis selon votre adresse de prise en charge.',
      },
      {
        q: 'Le taxi peut-il attendre pendant ma journée à Aix ?',
        a: 'Plus économique : nous vous déposons, vous nous appelez à l\'heure du retour. Tarif aller-retour annoncé à la réservation. Si vous préférez nous garder sur place, attente à 34,60 €/h.',
      },
      {
        q: 'Y a-t-il un parking proche du Cours Mirabeau ?',
        a: 'Les parkings souterrains (Mignet, Cardeurs, Carnot) sont saturés en haute saison et coûtent ~3 €/h. D\'où l\'intérêt du taxi qui dépose en bordure de centre sans souci de stationnement.',
      },
    ],
    related: ['avignon', 'arles', 'cassis', 'gare-aix-tgv'],
  },
  {
    id: 'saint-tropez',
    distanceKm: 135,
    durationReal: '~2h–2h30',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.2727, lng: 6.6406 },
    seoTitle: 'Taxi Marseille → Saint-Tropez : forfait 335 € | Taxi Julien',
    seoDescription: 'Transfert privé Marseille → Saint-Tropez (135 km, 2h). Forfait fixe 335 € jour / 386 € nuit. Mercedes Classe V 7 pax. Dépose Vieux Port, Pampelonne, hôtel.',
    h1: 'Taxi Marseille → Saint-Tropez',
    heroSubtitle: 'Vieux Port · Pampelonne · 135 km · ~2h–2h30',
    lead: 'Saint-Tropez est à 135 km de Marseille par l\'A50/A57/A570 puis la D98, soit 2h de trajet hors-saison et jusqu\'à 4h en plein été. Le forfait taxi privé à 335 € (journée) ou 386 € (nuit) revient souvent moins cher qu\'une location de voiture + parking 3 jours (90 €/min) — sans le stress des bouchons et de la circulation interdite au centre. Notre Mercedes Classe V vous dépose au Vieux Port, sur Pampelonne, ou directement à votre hôtel.',
    tripNotes: 'Trajet par l\'A50 (péages ~8,40 €) puis l\'A57 et l\'A570 jusqu\'au Cannet-des-Maures, puis la D98 finale. Étapes possibles en route : Bandol (déjeuner port), Cap Sicié, Bormes-les-Mimosas (entre janvier et mars). Pampelonne accessible directement.',
    spots: [
      { name: 'Vieux Port de Saint-Tropez', blurb: 'Port emblématique avec ses yachts, terrasses (Sénéquier) et façades ocres. Marché tous les jours sur le quai au coucher du soleil.', type: 'monument' },
      { name: 'Plage de Pampelonne', blurb: '5 km de plage de sable entre Ramatuelle et Saint-Tropez. Plages privées légendaires : Club 55, Nikki Beach, Tahiti Beach.', type: 'beach' },
      { name: 'Place des Lices', blurb: 'Cœur du village, lieu de la pétanque tropézienne et marché en plein air mardi et samedi matin (produits provençaux).', type: 'market' },
      { name: 'Citadelle de Saint-Tropez', blurb: 'Forteresse XVIe-XVIIe perchée. Musée d\'histoire maritime, panorama 360° sur le golfe et la presqu\'île.', type: 'museum' },
      { name: 'Musée de l\'Annonciade', blurb: 'Musée de peinture du XXe siècle (Signac, Matisse, Bonnard, Derain). Bâti dans une ancienne chapelle XVIe.', type: 'museum' },
      { name: 'Quartier de la Ponche', blurb: 'Ancien quartier des pêcheurs, ruelles pavées et façades colorées. Plage de la Ponche au cœur même du village.', type: 'beach' },
      { name: 'Sentier du Littoral', blurb: 'Chemin de douaniers : 15 km de sentier côtier de Saint-Tropez à la Plage de l\'Escalet. Vues sur le Cap Camarat (3e plus haut phare français).', type: 'hike' },
      { name: 'Église Notre-Dame-de-l\'Assomption', blurb: 'Église baroque XVIIIe siècle, clocher emblématique de Saint-Tropez (jaune et ocre), abrite le buste de Saint-Tropez.', type: 'church' },
    ],
    useCases: [
      'Week-end à deux ou en famille (aller vendredi, retour dimanche soir)',
      'Transfert directement à un hôtel ou villa privée',
      'Course directe pour un dîner sur le port ou une soirée',
      'Mariage à Ramatuelle, Gassin ou dans la presqu\'île',
    ],
    faq: [
      {
        q: 'Combien coûte un taxi Marseille → Saint-Tropez ?',
        a: 'Forfait fixe annoncé à la réservation : 335 € en journée (7h–19h) et 386 € la nuit / dimanche / jours fériés. Jusqu\'à 7 passagers en Mercedes Classe V, bagages inclus.',
      },
      {
        q: 'Combien de temps prend le trajet Marseille → Saint-Tropez ?',
        a: 'Environ 2h en heure creuse. En juillet-août ou les vendredis soir, prévoir 2h30 à 4h selon le trafic. Nous suivons l\'évolution du trafic en temps réel pour ajuster.',
      },
      {
        q: 'Le taxi peut-il me déposer à Pampelonne ou au Club 55 ?',
        a: 'Oui. Dépose directement à Pampelonne, au Club 55, Nikki Beach, Tahiti, ou à votre hôtel à Ramatuelle. La D93 est accessible aux taxis hors saison ; en juillet-août, les accès plages sont régulés.',
      },
      {
        q: 'Pouvez-vous gérer un week-end aller-retour ?',
        a: 'Oui. Aller le vendredi, retour le dimanche (ou autre jour). Tarif aller-retour annoncé à la réservation, séjour intermédiaire à votre charge. Service 24h/24 si vol/retour tardif.',
      },
      {
        q: 'Acceptez-vous les paiements CB pour ce forfait ?',
        a: 'Oui. CB et Visa acceptés à bord. Espèces aussi. Facturation entreprise sur demande (déductible pour déplacement professionnel).',
      },
    ],
    related: ['sainte-maxime', 'cannes', 'cogolin', 'aeroport-toulon-hyeres'],
  },
]

// Fast lookup helper used by both the React UI and the prerender script.
export function getDestContent(id: string): DestContent | undefined {
  return destContent.find(c => c.id === id)
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



// ============================================================
// City coordinates — used by the interactive Zone map to draw
// "Marseille → city" routes and look up fares on click.
// All values are decimal degrees (WGS-84). Centroids of each
// commune chosen on OpenStreetMap.
// ============================================================

export const MARSEILLE_COORDS = { lat: 43.2965, lng: 5.3698 } as const

export const cityCoords: Record<string, { lat: number; lng: number }> = {
  Marseille: { lat: 43.2965, lng: 5.3698 },

  // Var corridor — Marseille → Saint-Tropez
  'La Penne-sur-Huveaune': { lat: 43.2870, lng: 5.5398 },
  Aubagne: { lat: 43.2935, lng: 5.5703 },
  'Carnoux-en-Provence': { lat: 43.2667, lng: 5.5645 },
  'Roquefort-la-Bédoule': { lat: 43.2433, lng: 5.6011 },
  Cassis: { lat: 43.2151, lng: 5.5365 },
  'La Ciotat': { lat: 43.1747, lng: 5.6053 },
  'Saint-Cyr-sur-Mer': { lat: 43.1797, lng: 5.7053 },
  "La Cadière-d'Azur": { lat: 43.1881, lng: 5.7561 },
  'Le Castellet': { lat: 43.2050, lng: 5.7782 },
  Bandol: { lat: 43.1373, lng: 5.7530 },
  'Sanary-sur-Mer': { lat: 43.1186, lng: 5.8014 },
  'Six-Fours-les-Plages': { lat: 43.0967, lng: 5.8333 },
  'La Seyne-sur-Mer': { lat: 43.1003, lng: 5.8800 },
  Ollioules: { lat: 43.1392, lng: 5.8472 },
  Toulon: { lat: 43.1242, lng: 5.9280 },
  'La Valette-du-Var': { lat: 43.1414, lng: 5.9606 },
  'La Garde': { lat: 43.1242, lng: 6.0086 },
  'La Crau': { lat: 43.1517, lng: 6.0739 },
  Hyères: { lat: 43.1206, lng: 6.1286 },
  'La Londe-les-Maures': { lat: 43.1419, lng: 6.2336 },
  'Bormes-les-Mimosas': { lat: 43.1517, lng: 6.3414 },
  'Le Lavandou': { lat: 43.1378, lng: 6.3678 },
  'Cavalaire-sur-Mer': { lat: 43.1717, lng: 6.5378 },
  'La Croix-Valmer': { lat: 43.2089, lng: 6.5694 },
  Gassin: { lat: 43.2278, lng: 6.5839 },
  Cogolin: { lat: 43.2533, lng: 6.5311 },
  Grimaud: { lat: 43.2722, lng: 6.5217 },
  'Saint-Tropez': { lat: 43.2727, lng: 6.6406 },

  // Provence intérieure
  'Aix-en-Provence': { lat: 43.5297, lng: 5.4474 },
  Avignon: { lat: 43.9493, lng: 4.8055 },
  Arles: { lat: 43.6766, lng: 4.6303 },
  Allauch: { lat: 43.3417, lng: 5.4806 },
  'Plan-de-Cuques': { lat: 43.3392, lng: 5.4683 },
  Marignane: { lat: 43.4156, lng: 5.2153 },
  Vitrolles: { lat: 43.4622, lng: 5.2528 },
  'Salon-de-Provence': { lat: 43.6403, lng: 5.0972 },
}

/**
 * Look up the price for a Marseille→city trip across all fareTables.
 * Returns null for cities that aren't priced as a fixed-fare destination
 * (typical for very nearby cities billed by meter).
 */
export function findFareForCity(city: string): { day?: string; night?: string; from?: string; table: string } | null {
  for (const t of fareTables) {
    const row = t.rows.find(r => r.dest === city)
    if (row) return { day: row.day, night: row.night, from: row.from, table: t.title }
  }
  return null
}

/**
 * Build an OpenStreetMap embed URL that frames both Marseille and the chosen
 * city with a small padding around the bbox. A marker is placed on the city.
 * Returns null if we don't have coords for the city.
 */
export function buildRouteMapUrl(city: string): string | null {
  const c = cityCoords[city]
  if (!c) return null
  // pad scales with the route length so short trips zoom in tight, long trips fit.
  const dLng = Math.abs(c.lng - MARSEILLE_COORDS.lng)
  const dLat = Math.abs(c.lat - MARSEILLE_COORDS.lat)
  const pad = Math.max(0.05, Math.max(dLng, dLat) * 0.15)
  const w = Math.min(MARSEILLE_COORDS.lng, c.lng) - pad
  const s = Math.min(MARSEILLE_COORDS.lat, c.lat) - pad
  const e = Math.max(MARSEILLE_COORDS.lng, c.lng) + pad
  const n = Math.max(MARSEILLE_COORDS.lat, c.lat) + pad
  return `https://www.openstreetmap.org/export/embed.html?bbox=${w}%2C${s}%2C${e}%2C${n}&layer=mapnik&marker=${c.lat}%2C${c.lng}`
}
