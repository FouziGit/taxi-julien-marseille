// Données factuelles scrappées depuis https://www.taxijulien.com/
// Aucune donnée inventée. Là où l'info manque sur le site, on indique "sur demande".

// Le blog est alimenté par src/data/articles.json — fichier édité à la main ET
// par l'automatisation IA (scripts/article-gen/). On l'importe ici pour garder
// une seule source de vérité côté app : tout le site lit `articles` depuis taxi.ts.
import articlesData from './articles.json'

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
  /** Match the existing Destination.id in destinations[], OR define a brand
   *  new destination page that lives only here (page-only, doesn't show up
   *  in the SPA UI). When using as page-only, set destName/destCategory below. */
  id: string
  /** Used by the prerender when no destinations[] entry exists (page-only). */
  destName?: string
  destCategory?: Destination['category']
  destPhoto?: string
  destPhotoSm?: string
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
    seoDescription: 'Transfert taxi Marseille → Cassis (30 km, 35 min). Forfait 75 € jour / 95 € nuit. Mercedes Classe V 7 pax. Dépose port, calanques, vignobles. 24h/24.',
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
        a: 'Forfait fixe 75 € en journée (7h–19h) et 95 € la nuit, le dimanche ou les jours fériés. Prix annoncé à la réservation, valable jusqu\'à 7 passagers en Mercedes Classe V, bagages inclus.',
      },
      {
        q: 'Combien de temps dure le trajet Marseille → Cassis ?',
        a: 'Environ 35 minutes en heure creuse via l\'A50. En été (juillet-août) ou les vendredis de retour de week-end, prévoir 50 min à 1h selon le trafic.',
      },
      {
        q: 'Le taxi peut-il m\'attendre pendant ma visite des calanques ?',
        a: 'Oui. Soit nous restons sur place avec attente facturée selon le tarif réglementé (35,60 €/h), soit nous revenons à l\'heure de votre choix — vous nous appelez quand vous voulez repartir.',
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
        a: 'Plus économique : nous vous déposons, vous nous appelez à l\'heure du retour. Tarif aller-retour annoncé à la réservation. Si vous préférez nous garder sur place, attente à 35,60 €/h.',
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
    seoDescription: 'Transfert privé Marseille → Saint-Tropez (135 km, 2h). Forfait fixe 320 € jour / 410 € nuit. Mercedes Classe V 7 pax. Dépose Vieux Port, Pampelonne, hôtel.',
    h1: 'Taxi Marseille → Saint-Tropez',
    heroSubtitle: 'Vieux Port · Pampelonne · 135 km · ~2h–2h30',
    lead: 'Saint-Tropez est à 135 km de Marseille par l\'A50/A57/A570 puis la D98, soit 2h de trajet hors-saison et jusqu\'à 4h en plein été. Le forfait taxi privé à 335 € (journée) ou 385 € (nuit) revient souvent moins cher qu\'une location de voiture + parking 3 jours (90 €/min) — sans le stress des bouchons et de la circulation interdite au centre. Notre Mercedes Classe V vous dépose au Vieux Port, sur Pampelonne, ou directement à votre hôtel.',
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
        a: 'Forfait fixe annoncé à la réservation : 320 € en journée (7h–19h) et 410 € la nuit / dimanche / jours fériés. Jusqu\'à 7 passagers en Mercedes Classe V, bagages inclus.',
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

  // ===========================================================
  // Côte (Marseille → Var → Côte d'Azur), grouped by distance
  // ===========================================================
  {
    id: 'la-ciotat',
    distanceKm: 34,
    durationReal: '~30 min',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.1747, lng: 5.6053 },
    seoTitle: 'Taxi Marseille → La Ciotat | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → La Ciotat (34 km, 30 min). Mercedes Classe V 7 pax. Dépose port, plages, Eden Théâtre. Forfait sur devis · 24h/24.',
    h1: 'Taxi Marseille → La Ciotat',
    heroSubtitle: 'Berceau du cinéma · Calanques · 34 km · ~30 min',
    lead: 'La Ciotat est à 34 km de Marseille par l\'A50, soit 30 min de trajet. Ancienne ville de chantier naval reconvertie en station balnéaire, elle abrite le plus vieux cinéma du monde encore en activité (Eden Théâtre) et les calanques de Figuerolles, méconnues mais spectaculaires.',
    spots: [
      { name: 'Eden Théâtre', blurb: 'Plus ancien cinéma du monde encore en activité (1889). C\'est ici que les frères Lumière ont projeté leurs premiers films.', type: 'museum' },
      { name: 'Calanques de Figuerolles', blurb: 'Petite calanque à 10 min à pied du port, eaux émeraude et rochers ocre. Beaucoup moins fréquentée que celles de Cassis.', type: 'beach' },
      { name: 'Vieux Port de La Ciotat', blurb: 'Port de pêche traditionnel face au Mont Bec de l\'Aigle, terrasses de restaurants et marché alimentaire le matin.', type: 'restaurant' },
      { name: 'Île Verte', blurb: 'Seule île boisée habitée de la côte provençale. Navette en 7 min depuis le port (mi-juin à fin septembre).', type: 'beach' },
      { name: 'Parc du Mugel', blurb: 'Jardin botanique de 12 hectares au pied du Bec de l\'Aigle. Plage Mugel en contrebas.', type: 'viewpoint' },
      { name: 'Plage Lumière', blurb: 'Plage de sable au centre-ville, accessible aux familles. Vue sur l\'Île Verte et le Bec de l\'Aigle.', type: 'beach' },
    ],
    faq: [
      { q: 'Combien coûte un taxi Marseille → La Ciotat ?', a: 'Forfait fixe 85 € en journée et 110 € la nuit / dimanche / jours fériés (départ aéroport). Depuis Marseille centre, sur devis selon adresse.' },
      { q: 'Combien de temps pour aller à La Ciotat ?', a: 'Environ 30 minutes par l\'A50 hors heures de pointe. Compter 45 min à 1h en été ou aux heures de pointe.' },
      { q: 'Pouvez-vous nous déposer aux Calanques de Figuerolles ?', a: 'Oui, à 10 min à pied du parking du port. Pratique car le stationnement sur place est limité.' },
      { q: 'Le ferry pour l\'Île Verte fonctionne-t-il toute l\'année ?', a: 'Non, uniquement de mi-juin à fin septembre. Hors saison, l\'île reste accessible par bateau privé sur réservation.' },
    ],
    related: ['cassis', 'saint-cyr', 'bandol', 'aeroport-marseille-provence'],
  },
  {
    id: 'saint-cyr',
    distanceKm: 43,
    durationReal: '~40 min',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.1797, lng: 5.7053 },
    seoTitle: 'Taxi Marseille → Saint-Cyr-sur-Mer | Taxi Julien',
    seoDescription: 'Transfert taxi Marseille → Saint-Cyr-sur-Mer (43 km, 40 min). Forfait fixe 110 € jour / 135 € nuit. Mercedes Classe V 7 pax. Dépose Plage des Lecques.',
    h1: 'Taxi Marseille → Saint-Cyr-sur-Mer',
    heroSubtitle: 'Plage des Lecques · Vignobles AOC Bandol · 43 km · ~40 min',
    lead: 'Saint-Cyr-sur-Mer est à 43 km de Marseille par l\'A50, à la frontière des Bouches-du-Rhône et du Var. Connue pour sa plage de sable fin des Lecques (3,5 km) et sa statue de la Liberté miniature, c\'est aussi le point de départ idéal pour les vignobles AOC Bandol.',
    spots: [
      { name: 'Plage des Lecques', blurb: 'Plage de sable fin de 3,5 km au cœur de Saint-Cyr. Eau peu profonde, parfaite pour les familles.', type: 'beach' },
      { name: 'Statue de la Liberté', blurb: 'Réplique de 2,5 m offerte par Frédéric Auguste Bartholdi en 1913. Trône face à la plage.', type: 'monument' },
      { name: 'Sentier du Littoral', blurb: 'Chemin de douaniers de 7 km vers Bandol et la Madrague. Vues sur la rade et le Bec de l\'Aigle.', type: 'hike' },
      { name: 'Musée de Tauroentum', blurb: 'Site archéologique romain (1er-3e s.) avec mosaïques, sarcophages et restes de villa maritime.', type: 'museum' },
      { name: 'Vignobles AOC Bandol', blurb: 'Plusieurs domaines AOC Bandol à Saint-Cyr et alentours (Domaine de Souviou, Château Salettes).', type: 'wine' },
    ],
    faq: [
      { q: 'Combien coûte un taxi Marseille → Saint-Cyr-sur-Mer ?', a: 'Forfait fixe 110 € en journée (7h–19h) et 135 € la nuit. Jusqu\'à 7 passagers en Mercedes Classe V.' },
      { q: 'Quelle distance en heure creuse ?', a: 'Environ 40 minutes par l\'A50. En été ou les vendredis soir, prévoir 50 min à 1h.' },
      { q: 'Peut-on faire la route des vins depuis Saint-Cyr ?', a: 'Oui. Plusieurs domaines AOC Bandol sont accessibles en 10-15 min depuis Saint-Cyr (Souviou, Salettes, Tempier).' },
    ],
    related: ['bandol', 'cassis', 'la-ciotat', 'sanary'],
  },
  {
    id: 'bandol',
    distanceKm: 50,
    durationReal: '~45 min',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.1373, lng: 5.7530 },
    seoTitle: 'Taxi Marseille → Bandol : vignobles & port | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → Bandol (50 km, 45 min). Forfait 135 € jour / 170 € nuit. Dépose port, plage Renécros, vignobles AOC Bandol. Mercedes Classe V.',
    h1: 'Taxi Marseille → Bandol',
    heroSubtitle: 'Port · Vignobles AOC · Île de Bendor · 50 km · ~45 min',
    lead: 'Bandol est à 50 km de Marseille par l\'A50, soit 45 min de trajet. Station balnéaire élégante avec sa baie face à l\'Île de Bendor (rachetée par Paul Ricard en 1958), elle est aussi la capitale de l\'appellation AOC Bandol, célèbre pour ses rouges de garde (mourvèdre).',
    spots: [
      { name: 'Port de Bandol', blurb: 'Port de plaisance et de pêche au cœur du village, avec bars et restaurants en bord de quai.', type: 'restaurant' },
      { name: 'Île de Bendor', blurb: 'Île rachetée par Paul Ricard, accessible en 7 min de bateau. Musées (vins et spiritueux), galeries d\'art, plage.', type: 'beach' },
      { name: 'Plage de Renécros', blurb: 'Plage de sable fin en forme de fer à cheval, classée parmi les plus belles du Var. Eau peu profonde.', type: 'beach' },
      { name: 'Domaine Tempier', blurb: 'Domaine AOC Bandol emblématique fondé en 1834. Mourvèdre exceptionnel, dégustation sur rendez-vous.', type: 'wine' },
      { name: 'Marché de Bandol', blurb: 'Marché provençal tous les matins (sauf lundi) sur la place de la Liberté. Produits locaux.', type: 'market' },
      { name: 'Sentier du Littoral', blurb: 'Chemin côtier panoramique vers Sanary (1h30) ou Saint-Cyr (1h). Vues sur la rade et les falaises.', type: 'hike' },
    ],
    faq: [
      { q: 'Combien coûte un taxi Marseille → Bandol ?', a: 'Forfait fixe 135 € en journée et 170 € la nuit (7h-19h / 19h-7h). Tarif annoncé à la réservation pour jusqu\'à 7 passagers.' },
      { q: 'Pouvez-vous m\'emmener faire la route des vins ?', a: 'Oui. Forfait sur devis pour journée complète vignobles (3-4 domaines visités, attente incluse).' },
      { q: 'Comment se rend-on à l\'Île de Bendor ?', a: 'Nous vous déposons au port de Bandol, la navette bateau part toutes les 30 min en saison (gratuite la journée).' },
    ],
    related: ['sanary', 'saint-cyr', 'cassis', 'toulon'],
  },
  {
    id: 'sanary',
    distanceKm: 61,
    durationReal: '~50 min',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.1186, lng: 5.8014 },
    seoTitle: 'Taxi Marseille → Sanary-sur-Mer | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → Sanary-sur-Mer (61 km, 50 min). Forfait 140 € jour / 180 € nuit. Mercedes Classe V 7 pax. Port pittoresque, marché provençal.',
    h1: 'Taxi Marseille → Sanary-sur-Mer',
    heroSubtitle: 'Port pittoresque · Marché provençal · 61 km · ~50 min',
    lead: 'Sanary-sur-Mer est à 61 km de Marseille par l\'A50, soit 50 min de trajet. Élue "plus beau marché de France" à plusieurs reprises, c\'est l\'archétype du port provençal avec ses pointus colorés, son église rose au clocher carré et ses terrasses face au port.',
    spots: [
      { name: 'Port de Sanary', blurb: 'Port emblématique avec ses pointus colorés (bateaux de pêche traditionnels). Façades pastel, terrasses, chapelle Notre-Dame-de-Pitié.', type: 'monument' },
      { name: 'Marché de Sanary', blurb: 'Marché provençal quotidien (sauf lundi) sur les allées d\'Estienne d\'Orves. Élu plus beau marché de France 2018.', type: 'market' },
      { name: 'Plage de Portissol', blurb: 'Petite plage de sable fin abritée dans une crique, à 5 min du centre. Eau calme.', type: 'beach' },
      { name: 'Tour Romane', blurb: 'Tour de défense du XIIIe siècle dominant le port. Vue panoramique sur la baie.', type: 'monument' },
      { name: 'Sentier du Littoral', blurb: 'Chemin de douaniers vers Bandol ou la Cride. Panorama sur la baie et les îles.', type: 'hike' },
    ],
    faq: [
      { q: 'Combien coûte un taxi Marseille → Sanary ?', a: 'Forfait fixe 140 € en journée et 180 € la nuit. Mercedes Classe V jusqu\'à 7 passagers.' },
      { q: 'Y a-t-il un marché tous les jours ?', a: 'Oui, sauf le lundi. Marché alimentaire et artisanal quotidien, particulièrement animé le vendredi.' },
      { q: 'Peut-on visiter l\'Île des Embiez depuis Sanary ?', a: 'Non, l\'embarcadère pour les Embiez est au Brusc (Six-Fours), à 5 min en taxi de Sanary.' },
    ],
    related: ['bandol', 'embiez', 'toulon', 'six-fours'],
  },
  {
    id: 'embiez',
    distanceKm: 65,
    durationReal: '~55 min',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.0850, lng: 5.7850 },
    seoTitle: 'Taxi Marseille → Embarcadère du Brusc (Embiez) | Taxi Julien',
    seoDescription: 'Taxi Marseille → embarcadère du Brusc (Six-Fours) pour les Embiez. 65 km, 55 min. Forfait 160-210 €. Mercedes Classe V, bagages XL, suivi navette.',
    h1: 'Taxi Marseille → Embarcadère du Brusc (Embiez)',
    heroSubtitle: 'Île privée Paul-Ricard · 65 km · ~55 min',
    lead: 'L\'archipel des Embiez (4 îles, dont l\'île principale visitable) est à 65 km de Marseille par l\'A50. Notre Mercedes Classe V vous dépose à l\'embarcadère du Brusc (Six-Fours-les-Plages) d\'où part la navette pour les Embiez (10 min de bateau). Pratique pour journée plage, golf ou observatoire océanographique.',
    spots: [
      { name: 'Île principale des Embiez', blurb: 'Île de 95 hectares rachetée par Paul Ricard en 1958. Sentiers, criques, port, golf 9 trous.', type: 'beach' },
      { name: 'Institut Océanographique Paul Ricard', blurb: 'Aquarium méditerranéen et laboratoire de recherche marine sur l\'île principale.', type: 'museum' },
      { name: 'Plages secrètes', blurb: 'Plusieurs criques accessibles à pied : plage du Liserot, du Pierredon, anse de la Cale.', type: 'beach' },
      { name: 'Port du Brusc', blurb: 'Petit port de pêche traditionnel, point de départ des navettes pour les Embiez et Bendor.', type: 'restaurant' },
      { name: 'Cap Sicié', blurb: 'À 10 min en voiture du Brusc, point de vue à 350 m sur Toulon, les îles et la côte.', type: 'viewpoint' },
    ],
    faq: [
      { q: 'Combien coûte un taxi Marseille → embarcadère du Brusc ?', a: 'Forfait fixe annoncé à la réservation : 160 à 210 € selon la zone de prise en charge à Marseille et l\'heure.' },
      { q: 'Quelle est la navette pour les Embiez ?', a: 'Navette de la SNRT toutes les 30 min en saison, 11 € adulte aller-retour, 10 min de traversée.' },
      { q: 'Peut-on faire un aller-retour journée ?', a: 'Oui. On vous dépose au Brusc, vous prenez la navette, on revient vous chercher à l\'heure de votre choix.' },
    ],
    related: ['sanary', 'bandol', 'six-fours', 'toulon'],
  },
  {
    id: 'six-fours',
    destName: 'Six-Fours-les-Plages',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-six-fours.jpg',
    destPhotoSm: '/photos/dest-six-fours-sm.jpg',
    distanceKm: 63,
    durationReal: '~55 min',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.0967, lng: 5.8333 },
    seoTitle: 'Taxi Marseille → Six-Fours-les-Plages | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → Six-Fours-les-Plages (63 km, 55 min). Forfait 155 € jour / 195 € nuit. Embarcadère du Brusc, Cap Sicié, plages.',
    h1: 'Taxi Marseille → Six-Fours-les-Plages',
    heroSubtitle: 'Cap Sicié · Le Brusc · 63 km · ~55 min',
    lead: 'Six-Fours-les-Plages est à 63 km de Marseille par l\'A50. Commune littorale étendue (de Sanary à La Seyne) regroupant le port du Brusc (départ Embiez), les plages de Bonnegrâce et le sommet du Cap Sicié.',
    spots: [
      { name: 'Cap Sicié', blurb: 'Massif côtier culminant à 358 m. Vue à 360° sur Toulon, les îles, la côte des Maures.', type: 'viewpoint' },
      { name: 'Port du Brusc', blurb: 'Port de pêche traditionnel, point de départ navette pour les Embiez et Bendor.', type: 'monument' },
      { name: 'Plage de Bonnegrâce', blurb: 'Longue plage de sable face à Bandol. Vue sur Le Castel et les vignobles.', type: 'beach' },
      { name: 'Fort de Six-Fours', blurb: 'Fort militaire XIXe siècle au sommet de la colline (210 m). Panorama exceptionnel.', type: 'monument' },
    ],
    faq: [
      { q: 'Quel est le tarif Marseille → Six-Fours ?', a: 'Forfait fixe 155 € en journée et 195 € la nuit. Mercedes Classe V jusqu\'à 7 passagers.' },
      { q: 'Combien de temps de route ?', a: '~55 min par l\'A50 en heure creuse. En été ou aux heures de pointe, jusqu\'à 1h15.' },
    ],
    related: ['embiez', 'sanary', 'bandol', 'toulon'],
  },
  {
    id: 'la-seyne',
    destName: 'La Seyne-sur-Mer',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-la-seyne.jpg',
    destPhotoSm: '/photos/dest-la-seyne-sm.jpg',
    distanceKm: 63,
    durationReal: '~55 min',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.1003, lng: 5.8800 },
    seoTitle: 'Taxi Marseille → La Seyne-sur-Mer | Taxi Julien',
    seoDescription: 'Taxi Marseille → La Seyne-sur-Mer (63 km, 55 min). Forfait 155 € jour / 195 € nuit. Plage des Sablettes, Fort Balaguier, Tamaris.',
    h1: 'Taxi Marseille → La Seyne-sur-Mer',
    heroSubtitle: 'Tamaris · Sablettes · Balaguier · 63 km · ~55 min',
    lead: 'La Seyne-sur-Mer est à 63 km de Marseille par l\'A50, en face de Toulon de l\'autre côté de la rade. Ancien grand chantier naval méditerranéen, elle abrite le quartier de Tamaris (villas Belle Époque) et la plage des Sablettes.',
    spots: [
      { name: 'Plage des Sablettes', blurb: 'Plage de sable fin de 800 m, à l\'isthme reliant La Seyne à Saint-Mandrier. Vue sur la rade.', type: 'beach' },
      { name: 'Fort Balaguier', blurb: 'Fort du XVIIe siècle abritant le Musée de la Marine et de la Reconquête de Toulon. Vue panoramique.', type: 'museum' },
      { name: 'Tamaris', blurb: 'Quartier résidentiel Belle Époque, villas mauresques, Villa Tamaris (centre d\'art).', type: 'monument' },
      { name: 'Pont Levant', blurb: 'Pont levant historique du port (1920), classé. Vestige des chantiers navals.', type: 'monument' },
    ],
    faq: [
      { q: 'Tarif Marseille → La Seyne ?', a: 'Forfait fixe 155 € en journée, 195 € la nuit. Jusqu\'à 7 passagers.' },
      { q: 'Y a-t-il une plage accessible facilement ?', a: 'Oui, la plage des Sablettes (sable fin, 800 m), accessible directement en taxi.' },
    ],
    related: ['toulon', 'six-fours', 'sanary', 'hyeres'],
  },
  {
    id: 'toulon',
    distanceKm: 67,
    durationReal: '~50 min',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.1242, lng: 5.9280 },
    seoTitle: 'Taxi Marseille → Toulon : forfait 200 € | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → Toulon (67 km, 50 min). Forfait fixe 200 €. Mercedes Classe V 7 pax. Dépose port, Mont Faron, gare, hôpitaux. 24h/24.',
    h1: 'Taxi Marseille → Toulon',
    heroSubtitle: 'Mont Faron · Rade · Port militaire · 67 km · ~50 min',
    lead: 'Toulon est à 67 km de Marseille par l\'A50, soit 50 min en heure creuse. Première rade militaire de France (port de guerre depuis Louis XIV), c\'est aussi une ville méditerranéenne avec son Vieux Toulon (cours Lafayette), son port de plaisance et le Mont Faron qui la domine.',
    spots: [
      { name: 'Mont Faron', blurb: 'Sommet à 584 m accessible par téléphérique ou route panoramique. Vue à 360° sur la rade et la côte.', type: 'viewpoint' },
      { name: 'Port de Toulon', blurb: 'Port de plaisance et de pêche, terrasses, marché provençal cours Lafayette tous les matins (sauf lundi).', type: 'monument' },
      { name: 'Vieux Toulon', blurb: 'Cœur historique : ruelles piétonnes, place Puget, cathédrale Sainte-Marie-de-la-Sed (XIe siècle).', type: 'monument' },
      { name: 'Musée National de la Marine', blurb: 'Musée maritime sur le port, retraçant l\'histoire de la marine française. Maquettes XVIIe-XVIIIe.', type: 'museum' },
      { name: 'Bateaux promenade rade', blurb: 'Tour de la rade en bateau (1h), commentaire historique. Vue sur le porte-avions Charles de Gaulle (si présent).', type: 'sport' },
      { name: 'Marché cours Lafayette', blurb: 'Grand marché quotidien (sauf lundi), produits provençaux, fruits, poissons frais.', type: 'market' },
    ],
    faq: [
      { q: 'Quel est le forfait Marseille → Toulon ?', a: 'Forfait fixe 200 € quelle que soit l\'heure (jour ou nuit). Jusqu\'à 7 passagers en Mercedes Classe V.' },
      { q: 'Combien de temps de trajet ?', a: 'Environ 50 minutes par l\'A50 en heure creuse. Aux heures de pointe ou en été, prévoir 1h15.' },
      { q: 'Pouvez-vous m\'emmener à un hôpital toulonnais ?', a: 'Oui, conventionnés CPAM pour transport médical. Hôpital Sainte-Musse, Sainte-Anne, La Garde, etc.' },
      { q: 'Possible de monter au Mont Faron en taxi ?', a: 'Oui, route accessible toute l\'année (sauf neige rare). Sinon dépose à la gare du téléphérique du Faron.' },
    ],
    related: ['aeroport-toulon-hyeres', 'hyeres', 'sanary', 'la-seyne'],
  },
  {
    id: 'hyeres',
    distanceKm: 85,
    durationReal: '~1h05',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.1206, lng: 6.1286 },
    seoTitle: 'Taxi Marseille → Hyères | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → Hyères (85 km, 1h05). Forfait 200 € jour / 255 € nuit. Dépose vieille ville, port St-Pierre, embarcadère Îles d\'Or.',
    h1: 'Taxi Marseille → Hyères',
    heroSubtitle: 'Palmiers · Îles d\'Or · Vieille ville · 85 km · ~1h05',
    lead: 'Hyères est à 85 km de Marseille par l\'A50/A57, soit 1h05 de trajet. "Reine des stations d\'hiver", c\'est la plus ancienne station balnéaire de la Côte d\'Azur, célèbre pour ses 7 000 palmiers, sa vieille ville médiévale et ses Îles d\'Or (Porquerolles, Port-Cros, Levant).',
    spots: [
      { name: 'Vieille Ville d\'Hyères', blurb: 'Cœur médiéval perché : porte Saint-Paul, collégiale Saint-Paul (XIIe-XVIe), Place Massillon, ruelles pavées.', type: 'monument' },
      { name: 'Embarcadère Tour Fondue', blurb: 'Départ ferry pour Porquerolles (15 min) et Port-Cros (1h). Parking saturé en été — dépose taxi recommandée.', type: 'beach' },
      { name: 'Villa Noailles', blurb: 'Villa moderniste de Robert Mallet-Stevens (1923-1933). Centre d\'art et de design, festival mode et photo.', type: 'museum' },
      { name: 'Plage de l\'Almanarre', blurb: 'Plage de sable de 6 km, paradis du kitesurf et windsurf. Vue sur le double tombolo de Giens.', type: 'beach' },
      { name: 'Salins d\'Hyères', blurb: 'Anciens salins reconvertis en zone Natura 2000. Flamants roses, observatoire ornithologique.', type: 'viewpoint' },
      { name: 'Plage de Capte', blurb: 'Plage de sable fin abritée, accessible aux familles. Vue sur la presqu\'île de Giens.', type: 'beach' },
    ],
    faq: [
      { q: 'Combien coûte Marseille → Hyères ?', a: 'Forfait fixe 200 € en journée et 255 € la nuit. Jusqu\'à 7 passagers.' },
      { q: 'Pouvez-vous nous déposer au ferry pour Porquerolles ?', a: 'Oui, à l\'embarcadère de la Tour Fondue (presqu\'île de Giens). Ferry toutes les 30 min en saison.' },
      { q: 'Et l\'aéroport Toulon-Hyères ?', a: 'L\'aéroport est à 5 km du centre d\'Hyères. Forfait spécifique sur devis depuis Marseille.' },
    ],
    related: ['toulon', 'aeroport-toulon-hyeres', 'la-londe', 'bormes-les-mimosas'],
  },

  // ===========================================================
  // Côte des Maures (Hyères → Saint-Tropez)
  // ===========================================================
  {
    id: 'la-londe',
    destName: 'La Londe-les-Maures',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-la-londe.jpg',
    destPhotoSm: '/photos/dest-la-londe-sm.jpg',
    distanceKm: 100,
    durationReal: '~1h15',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.1419, lng: 6.2336 },
    seoTitle: 'Taxi Marseille → La Londe-les-Maures | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → La Londe-les-Maures (100 km, 1h15). Forfait 220 € jour / 285 € nuit. Côtes-de-Provence, port Miramar, plages.',
    h1: 'Taxi Marseille → La Londe-les-Maures',
    heroSubtitle: 'Vignobles Côtes-de-Provence · Port Miramar · 100 km · ~1h15',
    lead: 'La Londe-les-Maures est à 100 km de Marseille. Capitale du vin Côtes-de-Provence La Londe (la plus jeune AOC de Provence), avec port Miramar et plage de l\'Argentière.',
    spots: [
      { name: 'Port Miramar', blurb: 'Petit port de plaisance et de pêche, embarcadère pour Porquerolles en été.', type: 'monument' },
      { name: 'Plage de l\'Argentière', blurb: 'Plage de sable bordée de pins. Snorkeling en bord de roche.', type: 'beach' },
      { name: 'Vignobles AOC La Londe', blurb: 'Sous-zone des Côtes-de-Provence (créée 2008), 12 domaines. Rosés réputés.', type: 'wine' },
      { name: 'Jardin Zoologique Tropical', blurb: 'Parc de 7 hectares : flamants roses, perroquets, plantes tropicales.', type: 'other' },
    ],
    faq: [
      { q: 'Tarif Marseille → La Londe ?', a: 'Forfait 220 € jour / 285 € nuit. Jusqu\'à 7 passagers.' },
      { q: 'Visite route des vins possible ?', a: 'Oui, devis sur mesure pour journée vignobles La Londe.' },
    ],
    related: ['hyeres', 'bormes-les-mimosas', 'le-lavandou', 'toulon'],
  },
  {
    id: 'bormes-les-mimosas',
    destName: 'Bormes-les-Mimosas',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-bormes-les-mimosas.jpg',
    destPhotoSm: '/photos/dest-bormes-les-mimosas-sm.jpg',
    distanceKm: 110,
    durationReal: '~1h20',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.1517, lng: 6.3414 },
    seoTitle: 'Taxi Marseille → Bormes-les-Mimosas | Taxi Julien',
    seoDescription: 'Taxi Marseille → Bormes-les-Mimosas (110 km, 1h20). Forfait 245 € jour / 310 € nuit. Village médiéval perché, plage Cabasson, mimosas en hiver.',
    h1: 'Taxi Marseille → Bormes-les-Mimosas',
    heroSubtitle: 'Village médiéval · Mimosa · Cabasson · 110 km · ~1h20',
    lead: 'Bormes-les-Mimosas est à 110 km de Marseille. Village médiéval perché à 150 m, célèbre pour ses 90 espèces de mimosas (floraison janvier-mars) et sa résidence présidentielle d\'été (Fort de Brégançon).',
    spots: [
      { name: 'Village Médiéval de Bormes', blurb: 'Ruelles pavées et fleuries du XIIe siècle. Château médiéval en ruines, vue à 180° sur la Méditerranée.', type: 'monument' },
      { name: 'Plage de Cabasson', blurb: 'Plage de sable face au Fort de Brégançon. Pinède, eau cristalline.', type: 'beach' },
      { name: 'Fort de Brégançon', blurb: 'Résidence présidentielle d\'été depuis 1968 (visite saisonnière partielle).', type: 'monument' },
      { name: 'Mimosaïum', blurb: 'Espace dédié au mimosa et 90 espèces référencées. Spectacle de floraison janvier-mars.', type: 'other' },
      { name: 'Plage de la Favière', blurb: 'Longue plage de sable près du port de la Favière. Activités nautiques.', type: 'beach' },
    ],
    faq: [
      { q: 'Forfait Marseille → Bormes ?', a: 'Forfait 245 € jour / 310 € nuit. Mercedes Classe V 7 pax.' },
      { q: 'Quand voir les mimosas ?', a: 'Floraison spectaculaire de mi-janvier à mi-mars. Route du Mimosa = circuit touristique sur 130 km.' },
    ],
    related: ['le-lavandou', 'la-londe', 'hyeres', 'saint-tropez'],
  },
  {
    id: 'le-lavandou',
    destName: 'Le Lavandou',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-le-lavandou.jpg',
    destPhotoSm: '/photos/dest-le-lavandou-sm.jpg',
    distanceKm: 113,
    durationReal: '~1h25',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.1378, lng: 6.3678 },
    seoTitle: 'Taxi Marseille → Le Lavandou | Taxi Julien',
    seoDescription: 'Taxi Marseille → Le Lavandou (113 km, 1h25). Forfait 245 € jour / 310 € nuit. 12 plages, Île du Levant, Port-Cros, embarcadère pour Îles d\'Or.',
    h1: 'Taxi Marseille → Le Lavandou',
    heroSubtitle: '12 plages · Embarcadère Îles d\'Or · 113 km · ~1h25',
    lead: 'Le Lavandou est à 113 km de Marseille. Station balnéaire célèbre pour ses 12 plages aux couleurs de sable variées (gris, doré, blond), ses embarcadères vers Port-Cros et Levant, et son sentier des Crêtes.',
    spots: [
      { name: 'Plage de l\'Aiguebelle', blurb: 'Plage de sable doré abritée, accessible aux familles. Restaurant les pieds dans l\'eau.', type: 'beach' },
      { name: 'Plage du Layet', blurb: 'Petite crique sauvage entre Le Lavandou et Cavalière. Eau cristalline.', type: 'beach' },
      { name: 'Embarcadère Île du Levant', blurb: 'Navette vers l\'Île du Levant (Héliopolis, village naturiste) et Port-Cros.', type: 'beach' },
      { name: 'Sentier du Littoral', blurb: 'Chemin côtier vers Saint-Clair, Aiguebelle, le Cap Nègre. Vues panoramiques.', type: 'hike' },
      { name: 'Marché du Lavandou', blurb: 'Marché provençal quotidien (sauf dimanche) sur l\'avenue Vincent Auriol.', type: 'market' },
    ],
    faq: [
      { q: 'Tarif Marseille → Le Lavandou ?', a: 'Forfait fixe 245 € jour / 310 € nuit. Mercedes Classe V 7 pax.' },
      { q: 'Peut-on aller à Port-Cros ?', a: 'Oui, dépose à l\'embarcadère du Lavandou, navette quotidienne pour Port-Cros (1h de traversée).' },
    ],
    related: ['bormes-les-mimosas', 'cavalaire', 'rayol-canadel', 'saint-tropez'],
  },
  {
    id: 'rayol-canadel',
    destName: 'Rayol-Canadel-sur-Mer',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-rayol-canadel.jpg',
    destPhotoSm: '/photos/dest-rayol-canadel-sm.jpg',
    distanceKm: 125,
    durationReal: '~1h30',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.1556, lng: 6.4789 },
    seoTitle: 'Taxi Marseille → Rayol-Canadel-sur-Mer | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → Rayol-Canadel-sur-Mer (125 km, 1h30). Forfait 270 € jour / 345 € nuit. Domaine du Rayol, plages secrètes.',
    h1: 'Taxi Marseille → Rayol-Canadel-sur-Mer',
    heroSubtitle: 'Domaine du Rayol · Plages secrètes · 125 km · ~1h30',
    lead: 'Rayol-Canadel-sur-Mer est à 125 km de Marseille. Village discret de la Côte des Maures, célèbre pour son Domaine du Rayol (jardin botanique méditerranéen exceptionnel) et ses plages préservées.',
    spots: [
      { name: 'Domaine du Rayol', blurb: 'Jardin botanique méditerranéen de 20 hectares géré par le Conservatoire du Littoral. Plantes des climats méditerranéens du monde entier.', type: 'viewpoint' },
      { name: 'Plage du Canadel', blurb: 'Plage de sable au cœur du village, face au massif des Maures. Famille-friendly.', type: 'beach' },
      { name: 'Plage du Rayol', blurb: 'Plage abritée, accessible par sentier depuis le Domaine. Eau claire, snorkeling.', type: 'beach' },
      { name: 'Sentier marin', blurb: 'Visite sous-marine guidée organisée par le Domaine du Rayol (été uniquement, sur réservation).', type: 'sport' },
    ],
    faq: [
      { q: 'Forfait Marseille → Rayol ?', a: 'Forfait 270 € jour / 345 € nuit. Tarif élevé car trajet sinueux par Le Lavandou et Cavalière.' },
      { q: 'Le Domaine du Rayol est-il payant ?', a: 'Oui, ~13 € l\'entrée. Ouvert toute l\'année. Visite ~2-3h.' },
    ],
    related: ['le-lavandou', 'cavalaire', 'la-croix-valmer', 'saint-tropez'],
  },
  {
    id: 'cavalaire',
    destName: 'Cavalaire-sur-Mer',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-cavalaire.jpg',
    destPhotoSm: '/photos/dest-cavalaire-sm.jpg',
    distanceKm: 128,
    durationReal: '~1h35',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.1717, lng: 6.5378 },
    seoTitle: 'Taxi Marseille → Cavalaire-sur-Mer | Taxi Julien',
    seoDescription: 'Taxi Marseille → Cavalaire-sur-Mer (128 km, 1h35). Forfait 290 € jour / 370 € nuit. Plus longue plage de sable du Var.',
    h1: 'Taxi Marseille → Cavalaire-sur-Mer',
    heroSubtitle: '5 km de plage de sable · Port · 128 km · ~1h35',
    lead: 'Cavalaire-sur-Mer est à 128 km de Marseille. Plus longue plage de sable fin du Var (5 km), grand port de plaisance et station balnéaire familiale aux portes du golfe de Saint-Tropez.',
    spots: [
      { name: 'Plage de Cavalaire', blurb: 'Grande plage de sable de 5 km en arc de cercle. Eau peu profonde, idéale familles.', type: 'beach' },
      { name: 'Port de Cavalaire', blurb: 'Port de plaisance de 1 200 anneaux, restaurants, terrasses face à la mer.', type: 'monument' },
      { name: 'Sentier du Littoral', blurb: 'Chemin côtier vers La Croix-Valmer ou Pardigon. Panorama sur le golfe.', type: 'hike' },
      { name: 'Cap Nègre', blurb: 'Cap rocheux entre Cavalière et Cavalaire, vue sur les îles d\'Or au coucher de soleil.', type: 'viewpoint' },
    ],
    faq: [
      { q: 'Forfait Marseille → Cavalaire ?', a: 'Forfait 290 € jour / 370 € nuit. Jusqu\'à 7 passagers.' },
      { q: 'Combien de temps pour Saint-Tropez depuis Cavalaire ?', a: 'Environ 25-30 min en taxi par la D559 ou D98a.' },
    ],
    related: ['rayol-canadel', 'la-croix-valmer', 'le-lavandou', 'saint-tropez'],
  },
  {
    id: 'la-croix-valmer',
    destName: 'La Croix-Valmer',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-la-croix-valmer.jpg',
    destPhotoSm: '/photos/dest-la-croix-valmer-sm.jpg',
    distanceKm: 132,
    durationReal: '~1h40',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.2089, lng: 6.5694 },
    seoTitle: 'Taxi Marseille → La Croix-Valmer | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → La Croix-Valmer (132 km, 1h40). Forfait 290 € jour / 370 € nuit. Plages de Gigaro, Pardigon, Cap Lardier.',
    h1: 'Taxi Marseille → La Croix-Valmer',
    heroSubtitle: 'Plage de Gigaro · Cap Lardier · 132 km · ~1h40',
    lead: 'La Croix-Valmer est à 132 km de Marseille, juste avant Saint-Tropez. Préservée, elle abrite trois superbes plages (Gigaro, Pardigon, Sylvabelle) et donne accès au Cap Lardier, sanctuaire naturel.',
    spots: [
      { name: 'Plage de Gigaro', blurb: 'Plage de sable au pied du Cap Lardier. Eau cristalline, naturelle, peu construite.', type: 'beach' },
      { name: 'Cap Lardier', blurb: 'Cap sauvage géré par le Conservatoire du Littoral. Sentier des douaniers, 3 plages secrètes.', type: 'viewpoint' },
      { name: 'Plage de Sylvabelle', blurb: 'Petite crique entre Gigaro et le Cap. Accessible par sentier, calme.', type: 'beach' },
      { name: 'Vignobles AOC Côtes-de-Provence', blurb: 'Plusieurs domaines : Domaine de la Tourraque, Château de la Croix Valmer.', type: 'wine' },
    ],
    faq: [
      { q: 'Forfait Marseille → La Croix-Valmer ?', a: 'Forfait 290 € jour / 370 € nuit. Mercedes Classe V 7 pax.' },
      { q: 'Cap Lardier accessible en voiture ?', a: 'Non, le Cap est piéton uniquement. Dépose à Gigaro, randonnée 30 min jusqu\'aux plages.' },
    ],
    related: ['cavalaire', 'gassin', 'ramatuelle', 'saint-tropez'],
  },
  {
    id: 'cogolin',
    destName: 'Cogolin',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-cogolin.jpg',
    destPhotoSm: '/photos/dest-cogolin-sm.jpg',
    distanceKm: 135,
    durationReal: '~1h45',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.2533, lng: 6.5311 },
    seoTitle: 'Taxi Marseille → Cogolin | Taxi Julien',
    seoDescription: 'Taxi Marseille → Cogolin (135 km, 1h45). Forfait 290 € jour / 370 € nuit. Pipes Courrieu, Manufacture des tapis, vins Côtes-de-Provence.',
    h1: 'Taxi Marseille → Cogolin',
    heroSubtitle: 'Pipes · Tapis · Golfe de Saint-Tropez · 135 km · ~1h45',
    lead: 'Cogolin est à 135 km de Marseille, à 7 km de Saint-Tropez. Capitale historique des pipes en bruyère et des tapis, c\'est aussi une porte d\'accès tranquille au golfe de Saint-Tropez.',
    spots: [
      { name: 'Manufacture Courrieu (pipes)', blurb: 'Dernière fabrique artisanale française de pipes en bruyère (depuis 1802). Visites guidées.', type: 'museum' },
      { name: 'Manufacture des Tapis', blurb: 'Tapis tissés à la main depuis 1925 par d\'anciens artisans arméniens. Visite atelier.', type: 'museum' },
      { name: 'Vieux Village', blurb: 'Centre historique perché : ruelles, château médiéval (XIe siècle), église Saint-Sauveur.', type: 'monument' },
      { name: 'Marina de Cogolin', blurb: 'Port de plaisance moderne, accès direct au golfe de Saint-Tropez.', type: 'monument' },
    ],
    faq: [
      { q: 'Forfait Marseille → Cogolin ?', a: 'Forfait 290 € jour / 370 € nuit.' },
      { q: 'Combien de temps pour Saint-Tropez depuis Cogolin ?', a: '~10-15 min en taxi par la D98.' },
    ],
    related: ['gassin', 'ramatuelle', 'saint-tropez', 'sainte-maxime'],
  },
  {
    id: 'gassin',
    destName: 'Gassin',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-gassin.jpg',
    destPhotoSm: '/photos/dest-gassin-sm.jpg',
    distanceKm: 138,
    durationReal: '~1h45',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.2278, lng: 6.5839 },
    seoTitle: 'Taxi Marseille → Gassin (Plus Beaux Villages) | Taxi Julien',
    seoDescription: 'Taxi Marseille → Gassin (138 km, 1h45). Forfait 310 € jour / 410 € nuit. Plus Beaux Villages de France, vue golfe de Saint-Tropez.',
    h1: 'Taxi Marseille → Gassin',
    heroSubtitle: 'Plus Beaux Villages de France · 138 km · ~1h45',
    lead: 'Gassin est à 138 km de Marseille, perché à 200 m au-dessus du golfe de Saint-Tropez. Classé Plus Beaux Villages de France, c\'est un dédale de ruelles fleuries avec une vue exceptionnelle sur la presqu\'île.',
    spots: [
      { name: 'Vieux Village Médiéval', blurb: 'Ruelles pavées, façades fleuries, l\'Androuno (ruelle la plus étroite de France, 29 cm).', type: 'monument' },
      { name: 'Église Notre-Dame-de-l\'Assomption', blurb: 'Église XVIe siècle, point culminant du village. Vue panoramique 360°.', type: 'church' },
      { name: 'Vignobles AOC Côtes-de-Provence', blurb: 'Domaines réputés : Château Minuty, Domaine Bertaud Belieu.', type: 'wine' },
      { name: 'Terrasse Place dei Barri', blurb: 'Belvédère face au golfe de Saint-Tropez. Couchers de soleil exceptionnels.', type: 'viewpoint' },
    ],
    faq: [
      { q: 'Forfait Marseille → Gassin ?', a: 'Forfait 310 € jour / 410 € nuit.' },
      { q: 'Peut-on visiter Gassin et Ramatuelle dans la même journée ?', a: 'Oui, ils sont à 5 km l\'un de l\'autre.' },
    ],
    related: ['ramatuelle', 'saint-tropez', 'cogolin', 'la-croix-valmer'],
  },
  {
    id: 'ramatuelle',
    destName: 'Ramatuelle',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-ramatuelle.jpg',
    destPhotoSm: '/photos/dest-ramatuelle-sm.jpg',
    distanceKm: 140,
    durationReal: '~1h50',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.2167, lng: 6.6111 },
    seoTitle: 'Taxi Marseille → Ramatuelle | Taxi Julien',
    seoDescription: 'Taxi Marseille → Ramatuelle (140 km, 1h50). Forfait 320 € jour / 410 € nuit. Pampelonne, village médiéval, Cap Camarat.',
    h1: 'Taxi Marseille → Ramatuelle',
    heroSubtitle: 'Plage de Pampelonne · Village perché · 140 km · ~1h50',
    lead: 'Ramatuelle est à 140 km de Marseille. Village médiéval perché qui possède la majeure partie de la plage de Pampelonne (5 km) et le Cap Camarat (3e plus haut phare de France).',
    spots: [
      { name: 'Plage de Pampelonne', blurb: '5 km de plage de sable. Plages privées : Club 55, Nikki Beach, Le Cabanon Bleu, La Voile Rouge.', type: 'beach' },
      { name: 'Cap Camarat', blurb: '3e plus haut phare de France (130 m). Point d\'observation sur le golfe et la Méditerranée.', type: 'viewpoint' },
      { name: 'Vieux Village de Ramatuelle', blurb: 'Village circulaire médiéval, ruelles concentriques. Festival de Ramatuelle (théâtre, jazz) en été.', type: 'monument' },
      { name: 'Phare du Cap Camarat', blurb: 'Phare XIXe en service, visite guidée saisonnière (panorama sommet).', type: 'monument' },
    ],
    faq: [
      { q: 'Forfait Marseille → Ramatuelle ?', a: 'Forfait 320 € jour / 410 € nuit.' },
      { q: 'Pouvez-vous me déposer au Club 55 directement ?', a: 'Oui, accès Pampelonne par la D93. Possible toute saison hors restrictions estivales.' },
    ],
    related: ['saint-tropez', 'gassin', 'la-croix-valmer', 'cogolin'],
  },

  // ===========================================================
  // Côte Est (Sainte-Maxime → Nice)
  // ===========================================================
  {
    id: 'sainte-maxime',
    destName: 'Sainte-Maxime',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-sainte-maxime.jpg',
    destPhotoSm: '/photos/dest-sainte-maxime-sm.jpg',
    distanceKm: 135,
    durationReal: '~1h45',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.3083, lng: 6.6383 },
    seoTitle: 'Taxi Marseille → Sainte-Maxime | Taxi Julien',
    seoDescription: 'Taxi Marseille → Sainte-Maxime (135 km, 1h45). Forfait 335 € jour / 430 € nuit. Promenade des Marines, plage de la Nartelle, face Saint-Tropez.',
    h1: 'Taxi Marseille → Sainte-Maxime',
    heroSubtitle: 'Plages familiales · Face à Saint-Tropez · 135 km · ~1h45',
    lead: 'Sainte-Maxime est à 135 km de Marseille, face à Saint-Tropez de l\'autre côté du golfe. Station balnéaire familiale plus calme que sa voisine, avec 11 km de plages et une promenade en bord de mer.',
    spots: [
      { name: 'Plage de la Nartelle', blurb: 'Plage de sable fin de 1,5 km, face à Saint-Tropez. Eau peu profonde, idéale familles.', type: 'beach' },
      { name: 'Promenade des Marines', blurb: 'Promenade piétonne face au port, terrasses, restaurants face au golfe.', type: 'monument' },
      { name: 'Vieille Ville', blurb: 'Ruelles fleuries autour de la Tour Carrée (XVIe siècle), place Victor Hugo, marché provençal.', type: 'monument' },
      { name: 'Sémaphore', blurb: 'Point de vue à 130 m sur le golfe, Saint-Tropez et la presqu\'île. Accès route facile.', type: 'viewpoint' },
    ],
    faq: [
      { q: 'Forfait Marseille → Sainte-Maxime ?', a: 'Forfait 335 € jour / 430 € nuit.' },
      { q: 'Combien de temps pour Saint-Tropez en bateau ?', a: '15 min par les Bateaux Verts, navette toute l\'année.' },
    ],
    related: ['saint-tropez', 'frejus', 'cogolin', 'gassin'],
  },
  {
    id: 'frejus',
    destName: 'Fréjus',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-frejus.jpg',
    destPhotoSm: '/photos/dest-frejus-sm.jpg',
    distanceKm: 150,
    durationReal: '~1h55',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.4329, lng: 6.7370 },
    seoTitle: 'Taxi Marseille → Fréjus | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → Fréjus (150 km, 1h55). Forfait 320 € jour / 410 € nuit. Cité romaine, arènes, port, plage de Saint-Aygulf.',
    h1: 'Taxi Marseille → Fréjus',
    heroSubtitle: 'Cité romaine · Arènes · 150 km · ~1h55',
    lead: 'Fréjus est à 150 km de Marseille. Ancienne cité romaine fondée par Jules César (49 av. J-C), elle conserve aréna, théâtre antique et aqueduc, à côté d\'une station balnéaire moderne.',
    spots: [
      { name: 'Arènes Romaines', blurb: 'Amphithéâtre du Ier siècle, parmi les plus anciens de Gaule. ~10 000 places à l\'époque, encore utilisées pour concerts.', type: 'monument' },
      { name: 'Cathédrale Saint-Léonce', blurb: 'Ensemble cathédral XIe-XIIIe siècle : baptistère paléochrétien (Ve s.), cloître, cathédrale gothique.', type: 'church' },
      { name: 'Port-Fréjus', blurb: 'Port moderne (1989) avec plage, promenade, restaurants. Architecture contemporaine.', type: 'monument' },
      { name: 'Plage de Saint-Aygulf', blurb: 'Longue plage de sable au sud de Fréjus. Familles, restaurants en bord de mer.', type: 'beach' },
      { name: 'Aqueduc Romain', blurb: 'Vestiges d\'un aqueduc de 41 km qui alimentait Forum Julii en eau (Mons à Fréjus).', type: 'monument' },
    ],
    faq: [
      { q: 'Forfait Marseille → Fréjus ?', a: 'Forfait 320 € jour / 410 € nuit. Mercedes Classe V 7 pax.' },
      { q: 'Les arènes sont-elles ouvertes au public ?', a: 'Oui, ouvertes toute l\'année (entrée payante). Spectacles en été.' },
    ],
    related: ['saint-raphael', 'sainte-maxime', 'mandelieu', 'cannes'],
  },
  {
    id: 'saint-raphael',
    destName: 'Saint-Raphaël',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-saint-raphael.jpg',
    destPhotoSm: '/photos/dest-saint-raphael-sm.jpg',
    distanceKm: 153,
    durationReal: '~2h',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.4253, lng: 6.7686 },
    seoTitle: 'Taxi Marseille → Saint-Raphaël | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → Saint-Raphaël (153 km, 2h). Forfait 330 € jour / 420 € nuit. Esterel, Calanques rouges, plages.',
    h1: 'Taxi Marseille → Saint-Raphaël',
    heroSubtitle: 'Massif de l\'Esterel · Calanques rouges · 153 km · ~2h',
    lead: 'Saint-Raphaël est à 153 km de Marseille. Station balnéaire au pied du massif de l\'Esterel (roche rouge), 36 km de littoral, plages de sable et calanques sauvages.',
    spots: [
      { name: 'Massif de l\'Esterel', blurb: 'Massif volcanique de roche rouge entre Saint-Raphaël et Cannes. Sentiers, panoramas, calanques.', type: 'viewpoint' },
      { name: 'Plage du Veillat', blurb: 'Plage centrale de sable, en plein centre-ville. Promenade aménagée.', type: 'beach' },
      { name: 'Église Notre-Dame-de-la-Victoire', blurb: 'Basilique néo-byzantine (1883), point d\'orgue architectural du centre.', type: 'church' },
      { name: 'Vieux Port', blurb: 'Port de pêche et plaisance, restaurants face au quai René Coty.', type: 'monument' },
      { name: 'Calanque d\'Anthéor', blurb: 'Petite crique sauvage de roche rouge dans l\'Esterel, accessible par sentier.', type: 'beach' },
    ],
    faq: [
      { q: 'Forfait Marseille → Saint-Raphaël ?', a: 'Forfait 330 € jour / 420 € nuit.' },
      { q: 'Comment visiter l\'Esterel ?', a: 'En voiture (Corniche d\'Or) ou randonnée. Sentiers GR51, GR653.' },
    ],
    related: ['frejus', 'mandelieu', 'cannes', 'sainte-maxime'],
  },
  {
    id: 'mandelieu',
    destName: 'Mandelieu-la-Napoule',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-mandelieu.jpg',
    destPhotoSm: '/photos/dest-mandelieu-sm.jpg',
    distanceKm: 158,
    durationReal: '~2h05',
    deptCode: '06',
    deptName: 'Alpes-Maritimes',
    geo: { lat: 43.5478, lng: 6.9389 },
    seoTitle: 'Taxi Marseille → Mandelieu-la-Napoule | Taxi Julien',
    seoDescription: 'Taxi Marseille → Mandelieu-la-Napoule (158 km, 2h05). Forfait 385 € jour / 490 € nuit. Château de la Napoule, golf, port.',
    h1: 'Taxi Marseille → Mandelieu-la-Napoule',
    heroSubtitle: 'Château de la Napoule · Golf · 158 km · ~2h05',
    lead: 'Mandelieu-la-Napoule est à 158 km de Marseille, juste avant Cannes. Capitale française du mimosa, station balnéaire avec port, golf de prestige et château médiéval.',
    spots: [
      { name: 'Château de la Napoule', blurb: 'Château médiéval (XIVe s.) restauré par les époux Clews (1918). Jardins remarquables, musée.', type: 'monument' },
      { name: 'Plage de la Rague', blurb: 'Plage face à l\'Esterel, à l\'extrémité ouest. Vue sur les calanques rouges.', type: 'beach' },
      { name: 'Port de la Napoule', blurb: 'Port de plaisance et de pêche, terrasses face au château.', type: 'monument' },
      { name: 'Golf Old Course Cannes-Mandelieu', blurb: 'Plus ancien golf de la Côte d\'Azur (1891), 18 trous au bord de la mer.', type: 'sport' },
    ],
    faq: [
      { q: 'Forfait Marseille → Mandelieu ?', a: 'Forfait 385 € jour / 490 € nuit.' },
      { q: 'Distance Mandelieu → Cannes ?', a: '~5 km, 10 min en taxi.' },
    ],
    related: ['cannes', 'saint-raphael', 'frejus', 'antibes'],
  },
  {
    id: 'cannes',
    destName: 'Cannes',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-cannes.jpg',
    destPhotoSm: '/photos/dest-cannes-sm.jpg',
    distanceKm: 163,
    durationReal: '~2h10',
    deptCode: '06',
    deptName: 'Alpes-Maritimes',
    geo: { lat: 43.5528, lng: 7.0174 },
    seoTitle: 'Taxi Marseille → Cannes | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → Cannes (163 km, 2h10). Forfait 385 € jour / 490 € nuit. Mercedes Classe V 7 pax. Croisette, Palais des Festivals, Îles Lérins.',
    h1: 'Taxi Marseille → Cannes',
    heroSubtitle: 'La Croisette · Palais des Festivals · 163 km · ~2h10',
    lead: 'Cannes est à 163 km de Marseille par l\'A8. Capitale mondiale du cinéma (Festival en mai), célèbre pour la Croisette (3 km de promenade), le Palais des Festivals et les Îles de Lérins (Sainte-Marguerite, Saint-Honorat).',
    spots: [
      { name: 'La Croisette', blurb: 'Boulevard emblématique de 3 km face à la baie, palaces (Carlton, Martinez), plages privées.', type: 'monument' },
      { name: 'Palais des Festivals', blurb: 'Cœur du Festival de Cannes (mai). Empreintes des stars sur le Tapis Rouge.', type: 'monument' },
      { name: 'Île Sainte-Marguerite', blurb: 'Plus grande des îles de Lérins (15 min de bateau). Fort Royal (XVIIe), cellule du Masque de Fer, sentiers.', type: 'beach' },
      { name: 'Le Suquet', blurb: 'Vieille ville perchée de Cannes, ruelles pavées, vue panoramique sur la baie depuis la Tour du Suquet.', type: 'monument' },
      { name: 'Marché Forville', blurb: 'Marché provençal couvert, ouvert tous les matins (sauf lundi). Produits locaux, poissons frais.', type: 'market' },
      { name: 'Rue d\'Antibes', blurb: 'Rue commerçante principale, boutiques de luxe et de mode parallèle à la Croisette.', type: 'shopping' },
    ],
    faq: [
      { q: 'Forfait Marseille → Cannes ?', a: 'Forfait 385 € jour / 490 € nuit (tarif nuit majoré pour ce long trajet).' },
      { q: 'Combien de temps avec trafic ?', a: '~2h10 en heure creuse, jusqu\'à 3h en juillet-août ou Festival.' },
      { q: 'Pouvez-vous nous déposer pendant le Festival ?', a: 'Oui, dépose en bordure de zone sécurisée (rues sécurisées en mai). Forfait majoré possible selon trafic.' },
      { q: 'Visite Îles Lérins ?', a: 'Embarcadère sur le port. Navette toutes les 30 min pour Sainte-Marguerite, 1h pour Saint-Honorat.' },
    ],
    related: ['antibes', 'nice-ville', 'mandelieu', 'saint-raphael'],
  },
  {
    id: 'antibes',
    destName: 'Antibes',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-antibes.jpg',
    destPhotoSm: '/photos/dest-antibes-sm.jpg',
    distanceKm: 175,
    durationReal: '~2h20',
    deptCode: '06',
    deptName: 'Alpes-Maritimes',
    geo: { lat: 43.5808, lng: 7.1239 },
    seoTitle: 'Taxi Marseille → Antibes | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → Antibes (175 km, 2h20). Forfait 430 € jour / 545 € nuit. Mercedes Classe V 7 pax. Musée Picasso, Port Vauban, Cap d\'Antibes.',
    h1: 'Taxi Marseille → Antibes',
    heroSubtitle: 'Cap d\'Antibes · Musée Picasso · Port Vauban · 175 km · ~2h20',
    lead: 'Antibes est à 175 km de Marseille par l\'A8. Cité antique fondée par les Grecs (Antipolis, Ve s. av. J-C), elle abrite le Musée Picasso au Château Grimaldi, le plus grand port de plaisance d\'Europe (Port Vauban) et le mythique Cap d\'Antibes.',
    spots: [
      { name: 'Musée Picasso', blurb: 'Château Grimaldi (XIIe s.) face à la mer, où Picasso a peint en 1946. Collection d\'œuvres données par l\'artiste.', type: 'museum' },
      { name: 'Vieille Ville Antibes', blurb: 'Remparts maritimes, cathédrale Notre-Dame de la Plate Couronne, marché provençal Cours Masséna.', type: 'monument' },
      { name: 'Port Vauban', blurb: 'Plus grand port de plaisance d\'Europe, 1 700 anneaux. Yachts XXL, ambiance internationale.', type: 'monument' },
      { name: 'Cap d\'Antibes', blurb: 'Presqu\'île chic au sud, sentier de Tirepoil, plages secrètes, villas légendaires (Eden-Roc).', type: 'viewpoint' },
      { name: 'Fort Carré', blurb: 'Fort militaire (XVIe siècle) en étoile, classé. Vue panoramique sur le port et le cap.', type: 'monument' },
      { name: 'Plage de la Garoupe', blurb: 'Plage de sable fin du Cap d\'Antibes, abritée, eau cristalline. Restaurants en bord de mer.', type: 'beach' },
    ],
    faq: [
      { q: 'Forfait Marseille → Antibes ?', a: 'Forfait 430 € jour / 545 € nuit.' },
      { q: 'Distance Antibes → Nice ?', a: '~22 km, 25 min en taxi sans trafic.' },
      { q: 'Le Musée Picasso est-il ouvert toute l\'année ?', a: 'Oui sauf lundi (fermé). Tarif ~8 €.' },
    ],
    related: ['cannes', 'nice-ville', 'cagnes-sur-mer', 'aeroport-nice'],
  },
  {
    id: 'cagnes-sur-mer',
    destName: 'Cagnes-sur-Mer',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-cagnes-sur-mer.jpg',
    destPhotoSm: '/photos/dest-cagnes-sur-mer-sm.jpg',
    distanceKm: 183,
    durationReal: '~2h25',
    deptCode: '06',
    deptName: 'Alpes-Maritimes',
    geo: { lat: 43.6633, lng: 7.1486 },
    seoTitle: 'Taxi Marseille → Cagnes-sur-Mer | Taxi Julien',
    seoDescription: 'Taxi Marseille → Cagnes-sur-Mer (183 km, 2h25). Forfait 430 € jour / 560 € nuit. Haut-de-Cagnes médiéval, Musée Renoir, hippodrome.',
    h1: 'Taxi Marseille → Cagnes-sur-Mer',
    heroSubtitle: 'Haut-de-Cagnes médiéval · Musée Renoir · 183 km · ~2h25',
    lead: 'Cagnes-sur-Mer est à 183 km de Marseille, entre Antibes et Nice. 3 quartiers : le Haut-de-Cagnes (village médiéval), Cagnes-Ville (centre moderne) et le Cros-de-Cagnes (front de mer).',
    spots: [
      { name: 'Haut-de-Cagnes', blurb: 'Village médiéval perché autour du Château Grimaldi (XIVe s.). Ruelles pavées, galeries d\'art.', type: 'monument' },
      { name: 'Musée Renoir', blurb: 'Maison où Renoir a vécu ses dernières années (1907-1919). Atelier, jardin d\'oliviers, œuvres originales.', type: 'museum' },
      { name: 'Hippodrome de la Côte d\'Azur', blurb: 'Hippodrome de plage, le seul d\'Europe à galoper face à la mer (de janvier à mars surtout).', type: 'sport' },
      { name: 'Plage du Cros-de-Cagnes', blurb: 'Plage de galets, port de pêche traditionnel, restaurants face à la mer.', type: 'beach' },
    ],
    faq: [
      { q: 'Forfait Marseille → Cagnes ?', a: 'Forfait 430 € jour / 560 € nuit.' },
      { q: 'Distance Cagnes → Nice ?', a: '~12 km, 15 min hors trafic.' },
    ],
    related: ['nice-ville', 'antibes', 'aeroport-nice', 'cannes'],
  },
  {
    id: 'nice-ville',
    destName: 'Nice',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-nice-ville.jpg',
    destPhotoSm: '/photos/dest-nice-ville-sm.jpg',
    distanceKm: 196,
    durationReal: '~2h30',
    deptCode: '06',
    deptName: 'Alpes-Maritimes',
    geo: { lat: 43.7102, lng: 7.2620 },
    seoTitle: 'Taxi Marseille → Nice : forfait 470 € | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → Nice (196 km, 2h30). Forfait 470 € jour / 590 € nuit. Mercedes Classe V 7 pax. Promenade des Anglais, Vieux Nice, MAMAC.',
    h1: 'Taxi Marseille → Nice',
    heroSubtitle: 'Promenade des Anglais · Vieux Nice · 196 km · ~2h30',
    lead: 'Nice est à 196 km de Marseille par l\'A8, soit 2h30 de trajet. Capitale de la Côte d\'Azur, classée Unesco (paysage urbain de la villégiature d\'hiver), elle abrite la Promenade des Anglais, le Vieux Nice, la Colline du Château et 7 km de plages de galets.',
    spots: [
      { name: 'Promenade des Anglais', blurb: 'Promenade emblématique de 7 km face à la Baie des Anges. Plages publiques et privées, palaces (Negresco).', type: 'monument' },
      { name: 'Vieux Nice', blurb: 'Cœur historique baroque, ruelles colorées, marché aux fleurs Cours Saleya, place Garibaldi.', type: 'monument' },
      { name: 'Colline du Château', blurb: 'Parc panoramique au-dessus du Vieux Nice (~90 m). Vue à 360° sur la baie et la ville. Accès par ascenseur gratuit.', type: 'viewpoint' },
      { name: 'MAMAC', blurb: 'Musée d\'Art Moderne et Contemporain : Yves Klein, Niki de Saint Phalle, César. Toit-terrasse panoramique.', type: 'museum' },
      { name: 'Place Masséna', blurb: 'Place centrale piétonne, fontaine du Soleil avec statue d\'Apollon, tramway, accès Cours Saleya.', type: 'monument' },
      { name: 'Marché Cours Saleya', blurb: 'Marché aux fleurs (tous les jours sauf lundi) et alimentaire. Au cœur du Vieux Nice.', type: 'market' },
    ],
    faq: [
      { q: 'Forfait Marseille → Nice ?', a: 'Forfait 470 € jour / 590 € nuit. Mercedes Classe V 7 pax.' },
      { q: 'Et l\'aéroport de Nice ?', a: 'L\'aéroport est à 7 km du centre. Forfait spécifique depuis Marseille (voir page dédiée).' },
      { q: 'Combien de temps avec trafic ?', a: '~2h30 en heure creuse. Jusqu\'à 3h30 en juillet-août.' },
    ],
    related: ['aeroport-nice', 'antibes', 'cagnes-sur-mer', 'cannes'],
  },

  // ===========================================================
  // Provence intérieure
  // ===========================================================
  {
    id: 'aubagne',
    destName: 'Aubagne',
    destCategory: 'Ville',
    destPhoto: '/photos/dest-aubagne.jpg',
    destPhotoSm: '/photos/dest-aubagne-sm.jpg',
    distanceKm: 17,
    durationReal: '~20 min',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.2935, lng: 5.5703 },
    seoTitle: 'Taxi Marseille → Aubagne | Taxi Julien',
    seoDescription: 'Taxi Marseille → Aubagne (17 km, 20 min). Patrie de Marcel Pagnol, marché provençal, terre des santons.',
    h1: 'Taxi Marseille → Aubagne',
    heroSubtitle: 'Pagnol · Santons · 17 km · ~20 min',
    lead: 'Aubagne est à 17 km de Marseille par l\'A50. Patrie de Marcel Pagnol, capitale française du santon (figurine de crèche) et porte d\'entrée du massif du Garlaban.',
    spots: [
      { name: 'Le Petit Monde de Marcel Pagnol', blurb: 'Mise en scène en santons de l\'œuvre de Pagnol, place du Cours Foch.', type: 'museum' },
      { name: 'Atelier Thérèse Neveu', blurb: 'Maison de la première santonnière professionnelle (1810). Histoire du santon.', type: 'museum' },
      { name: 'Massif du Garlaban', blurb: 'Massif des collines de Pagnol (714 m). Sentiers, source Manon (du film), grottes.', type: 'hike' },
      { name: 'Marché d\'Aubagne', blurb: 'Marché provençal mardi, jeudi, samedi, dimanche matin. Spécialités provençales.', type: 'market' },
    ],
    faq: [
      { q: 'Forfait Marseille → Aubagne ?', a: 'Forfait fixe 50 € en journée (départ aéroport). Depuis Marseille centre, ~30 € au compteur.' },
      { q: 'Peut-on faire le tour des collines de Pagnol ?', a: 'Oui, dépose au départ des sentiers ou tour sur mesure sur devis.' },
    ],
    related: ['cassis', 'aix-en-provence', 'aeroport-marseille-provence'],
  },
  {
    id: 'avignon',
    distanceKm: 100,
    durationReal: '~1h05',
    deptCode: '84',
    deptName: 'Vaucluse',
    geo: { lat: 43.9493, lng: 4.8055 },
    seoTitle: 'Taxi Marseille → Avignon | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → Avignon (100 km, 1h05). Forfait 230 € jour / 290 € nuit. Mercedes Classe V 7 pax. Dépose Palais des Papes, gare TGV, festival.',
    h1: 'Taxi Marseille → Avignon',
    heroSubtitle: 'Palais des Papes · Pont d\'Avignon · 100 km · ~1h05',
    lead: 'Avignon est à 100 km de Marseille par l\'A7, soit 1h05 de trajet. Ancienne capitale de la chrétienté (XIVe siècle), classée Unesco, elle abrite le Palais des Papes (le plus grand palais gothique d\'Europe) et le mythique Pont Saint-Bénézet.',
    spots: [
      { name: 'Palais des Papes', blurb: 'Plus grand palais gothique d\'Europe (XIVe s.), siège des papes 1309-1377. 25 salles ouvertes à la visite.', type: 'monument' },
      { name: 'Pont d\'Avignon (Saint-Bénézet)', blurb: 'Pont médiéval (XIIe s.) inachevé sur le Rhône, célèbre par la chanson. 4 arches restantes sur 22 d\'origine.', type: 'monument' },
      { name: 'Place de l\'Horloge', blurb: 'Place principale animée, terrasses, théâtre municipal, hôtel de ville.', type: 'monument' },
      { name: 'Rocher des Doms', blurb: 'Parc panoramique au-dessus du Palais. Vue sur le Rhône, le Pont, le Mont Ventoux.', type: 'viewpoint' },
      { name: 'Marché des Halles', blurb: 'Marché alimentaire couvert, ouvert tous les matins (sauf lundi). Produits provençaux.', type: 'market' },
      { name: 'Cathédrale Notre-Dame des Doms', blurb: 'Cathédrale romane (XIIe s.) accolée au Palais. Vierge dorée monumentale.', type: 'church' },
    ],
    useCases: [
      'Festival d\'Avignon (juillet) : dépose en soirée, retour tardif',
      'Aller-retour journée Palais des Papes + Pont d\'Avignon',
      'Transfert gare Avignon TGV → centre historique',
      'Visite Côtes-du-Rhône à proximité (Châteauneuf-du-Pape à 15 km)',
    ],
    faq: [
      { q: 'Forfait Marseille → Avignon ?', a: 'Forfait fixe 230 € jour / 290 € nuit. Mercedes Classe V 7 pax.' },
      { q: 'Combien de temps en heure creuse ?', a: '~1h05 par l\'A7. En juillet (Festival), prévoir 1h30 à 2h.' },
      { q: 'Pendant le Festival d\'Avignon, dépose possible ?', a: 'Oui, dépose Porte Saint-Michel (15 min à pied Palais), Porte de la République ou Hôtel.' },
      { q: 'Gare Avignon TGV ?', a: 'À 4 km du centre, navette régulière. Forfait spécifique depuis Marseille (voir page gare).' },
    ],
    related: ['arles', 'aix-en-provence', 'gare-avignon-tgv'],
  },
  {
    id: 'arles',
    distanceKm: 90,
    durationReal: '~1h',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.6766, lng: 4.6303 },
    seoTitle: 'Taxi Marseille → Arles | Taxi Julien',
    seoDescription: 'Taxi Marseille → Arles (90 km, 1h). Forfait 215 € jour / 290 € nuit. Arènes romaines, Van Gogh, Camargue. Mercedes Classe V 7 pax.',
    h1: 'Taxi Marseille → Arles',
    heroSubtitle: 'Arènes romaines · Van Gogh · Camargue · 90 km · ~1h',
    lead: 'Arles est à 90 km de Marseille par l\'A54, soit 1h de trajet. Cité romaine majeure (8 monuments Unesco), elle abrite des arènes du Ier siècle encore en activité, le théâtre antique, et fut la ville où Van Gogh peignit 200 toiles en 15 mois.',
    spots: [
      { name: 'Arènes d\'Arles', blurb: 'Amphithéâtre romain du Ier siècle (~21 000 places). Encore utilisé pour corridas et spectacles.', type: 'monument' },
      { name: 'Théâtre Antique', blurb: 'Théâtre romain Ier s. av. J-C, partiellement préservé. Festivals d\'été.', type: 'monument' },
      { name: 'Fondation Vincent Van Gogh', blurb: 'Centre d\'art contemporain dialoguant avec l\'œuvre de Van Gogh. Expositions temporaires.', type: 'museum' },
      { name: 'Café Van Gogh', blurb: 'Reconstitution de la "Terrasse du café le soir" peinte par Van Gogh en 1888 (Place du Forum).', type: 'restaurant' },
      { name: 'Cloître Saint-Trophime', blurb: 'Cloître roman XIIe s., l\'un des plus beaux de Provence. Cathédrale attenante.', type: 'church' },
      { name: 'Cryptoportiques', blurb: 'Galeries souterraines romaines (Ier s. av. J-C), sous le Forum. 50 m sous le sol actuel.', type: 'monument' },
    ],
    faq: [
      { q: 'Forfait Marseille → Arles ?', a: 'Forfait 215 € jour / 290 € nuit.' },
      { q: 'Peut-on visiter la Camargue depuis Arles ?', a: 'Oui, Camargue accessible directement. Saintes-Maries-de-la-Mer à 40 min en taxi.' },
      { q: 'Et les Rencontres de la Photographie ?', a: 'Festival international (juillet-septembre), affluence importante. Forfait identique, dépose centre.' },
    ],
    related: ['avignon', 'aix-en-provence', 'gare-avignon-tgv'],
  },

  // ===========================================================
  // Ski (Hautes-Alpes / Alpes du Sud)
  // ===========================================================
  {
    id: 'ski-pra-loup',
    distanceKm: 233,
    durationReal: '~2h50',
    deptCode: '04',
    deptName: 'Alpes-de-Haute-Provence',
    geo: { lat: 44.3633, lng: 6.5872 },
    seoTitle: 'Taxi Marseille → Pra Loup (ski) | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → Pra Loup (233 km, 2h50). Forfait à partir de 550 €. Mercedes Classe V 7 pax + skis. Pneus neige + chaînes. 24h/24.',
    h1: 'Taxi Marseille → Pra Loup',
    heroSubtitle: 'Station ski Espace Lumière · 233 km · ~2h50',
    lead: 'Pra Loup est à 233 km de Marseille par l\'A51 et la D900b. Station-village des Alpes-de-Haute-Provence, reliée à La Foux d\'Allos via l\'Espace Lumière (180 km de pistes). Trajet régulièrement enneigé décembre-mars : notre Mercedes Classe V est équipée pneus neige + chaînes à demeure.',
    spots: [
      { name: 'Domaine skiable Espace Lumière', blurb: 'Domaine relié Pra Loup + La Foux d\'Allos : 180 km de pistes, 100 remontées mécaniques.', type: 'sport' },
      { name: 'Station Village Pra Loup 1600', blurb: 'Cœur historique de la station, commerces, restaurants. Accès direct aux pistes.', type: 'monument' },
      { name: 'Lac d\'Allos (été)', blurb: 'Plus grand lac d\'altitude d\'Europe (2 230 m). Randonnée 1h30 depuis Pra Loup en été.', type: 'hike' },
      { name: 'Ubaye (vallée)', blurb: 'Vallée de l\'Ubaye à proximité, eaux vives, rafting, randonnées.', type: 'sport' },
    ],
    faq: [
      { q: 'Forfait Marseille → Pra Loup ?', a: 'À partir de 550 € l\'aller. Tarif majoré la nuit ou en haute saison hiver.' },
      { q: 'Le taxi est-il équipé pour la neige ?', a: 'Oui : pneus neige + chaînes à demeure. Possible d\'ajouter portes-skis sur demande.' },
      { q: 'Faites-vous l\'aller-retour ou seulement l\'aller ?', a: 'Les deux. Beaucoup de clients privilégient aller en taxi (déconnexion) et retour TER/bus.' },
    ],
    related: ['ski-vars', 'ski-orres', 'ski-risoul'],
  },
  {
    id: 'ski-vars',
    distanceKm: 280,
    durationReal: '~3h',
    deptCode: '05',
    deptName: 'Hautes-Alpes',
    geo: { lat: 44.5783, lng: 6.7050 },
    seoTitle: 'Taxi Marseille → Vars (ski) | Taxi Julien',
    seoDescription: 'Taxi Marseille → Vars (280 km, 3h). Forfait à partir de 580 €. Mercedes Classe V 7 pax + skis. Pneus neige + chaînes. Domaine Forêt Blanche.',
    h1: 'Taxi Marseille → Vars',
    heroSubtitle: 'Station Forêt Blanche · 280 km · ~3h',
    lead: 'Vars est à 280 km de Marseille par l\'A51 et la N94. Station familiale des Hautes-Alpes, reliée à Risoul via la Forêt Blanche (185 km de pistes), idéale familles et débutants.',
    spots: [
      { name: 'Domaine skiable Forêt Blanche', blurb: 'Domaine relié Vars + Risoul : 185 km de pistes, 51 remontées. Versant nord enneigé.', type: 'sport' },
      { name: 'Vars Sainte-Marie', blurb: 'Cœur ancien de la station, à 1 660 m. Architecture village, chapelle XIIIe siècle.', type: 'monument' },
      { name: 'Col de Vars', blurb: 'Col à 2 109 m, fermé en hiver mais accessible été. Mythique étape du Tour de France.', type: 'viewpoint' },
    ],
    faq: [
      { q: 'Forfait Marseille → Vars ?', a: 'À partir de 580 € l\'aller.' },
      { q: 'Quelle différence Vars / Risoul ?', a: 'Vars est plus orienté familles, Risoul plus jeune/festif. Même domaine skiable.' },
    ],
    related: ['ski-risoul', 'ski-orres', 'ski-pra-loup'],
  },
  {
    id: 'ski-risoul',
    distanceKm: 290,
    durationReal: '~3h05',
    deptCode: '05',
    deptName: 'Hautes-Alpes',
    geo: { lat: 44.6433, lng: 6.6500 },
    seoTitle: 'Taxi Marseille → Risoul (ski) | Taxi Julien',
    seoDescription: 'Taxi Marseille → Risoul (290 km, 3h05). Forfait à partir de 560 €. Mercedes Classe V 7 pax + skis. Forêt Blanche.',
    h1: 'Taxi Marseille → Risoul',
    heroSubtitle: 'Station Forêt Blanche · 290 km · ~3h05',
    lead: 'Risoul est à 290 km de Marseille par l\'A51 et la N94 puis la D86. Station moderne de 1 850 m d\'altitude, ambiance jeune et internationale, reliée à Vars via la Forêt Blanche.',
    spots: [
      { name: 'Domaine Forêt Blanche', blurb: 'Relié à Vars : 185 km de pistes, 100% versant nord, enneigement garanti.', type: 'sport' },
      { name: 'Front de neige Risoul 1850', blurb: 'Station-village piétonne, accès direct aux pistes, restaurants et bars d\'altitude.', type: 'monument' },
      { name: 'Snowpark', blurb: 'Snowpark renommé, le plus grand des Alpes du Sud. Kickers et halfpipe.', type: 'sport' },
    ],
    faq: [
      { q: 'Forfait Marseille → Risoul ?', a: 'À partir de 560 € l\'aller.' },
      { q: 'Y a-t-il un service navette skiable Marseille → Risoul ?', a: 'En haute saison, navettes (Risoul Liberté). Sinon taxi privé plus flexible.' },
    ],
    related: ['ski-vars', 'ski-orres', 'ski-pra-loup'],
  },
  {
    id: 'ski-orres',
    distanceKm: 270,
    durationReal: '~2h50',
    deptCode: '05',
    deptName: 'Hautes-Alpes',
    geo: { lat: 44.5083, lng: 6.5639 },
    seoTitle: 'Taxi Marseille → Les Orres (ski) | Taxi Julien',
    seoDescription: 'Taxi Marseille → Les Orres (270 km, 2h50). Forfait à partir de 520 €. Mercedes Classe V 7 pax + skis. 100 km de pistes, lac Serre-Ponçon.',
    h1: 'Taxi Marseille → Les Orres',
    heroSubtitle: 'Station 100 km de pistes · Lac Serre-Ponçon · 270 km · ~2h50',
    lead: 'Les Orres est à 270 km de Marseille par l\'A51 et la N94. Station-village des Hautes-Alpes (1 650-2 720 m), 100 km de pistes face au lac de Serre-Ponçon, exposition sud, ambiance familiale.',
    spots: [
      { name: 'Domaine skiable Les Orres', blurb: '100 km de pistes, 49 remontées, exposition sud. Vue sur le lac de Serre-Ponçon.', type: 'sport' },
      { name: 'Lac de Serre-Ponçon', blurb: 'Plus grand lac artificiel d\'Europe (28 km²). Activités nautiques l\'été.', type: 'viewpoint' },
      { name: 'Embrun', blurb: 'Ancienne capitale archiépiscopale (vallée), à 15 min des Orres. Cathédrale médiévale.', type: 'monument' },
    ],
    faq: [
      { q: 'Forfait Marseille → Les Orres ?', a: 'À partir de 520 € l\'aller.' },
      { q: 'Skier en avril sur Les Orres ?', a: 'Oui, station ouverte généralement jusqu\'à mi-avril selon enneigement.' },
    ],
    related: ['ski-vars', 'ski-risoul', 'ski-pra-loup'],
  },

  // ===========================================================
  // Transport hubs (page-only context, generic landing)
  // ===========================================================
  {
    id: 'aeroport-marseille-provence',
    distanceKm: 30,
    durationReal: '~30 min',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.4360, lng: 5.2140 },
    seoTitle: 'Taxi Aéroport Marseille Provence : forfait 70-110 € | Taxi Julien',
    seoDescription: 'Taxi Marseille → Aéroport Marseille Provence (Marignane). Forfait fixe 70-110 €. Suivi du vol inclus. Mercedes Classe V 7 pax + bagages. 24h/24.',
    h1: 'Taxi Marseille → Aéroport Marseille Provence',
    heroSubtitle: 'Marignane · Suivi du vol · 30 km · ~30 min',
    lead: 'L\'Aéroport Marseille Provence (code MRS) est à 30 km du centre de Marseille (Marignane). 4e aéroport de France avec 10 millions de passagers par an. Forfait taxi fixe annoncé à la réservation : entre 70 et 110 € selon votre arrondissement et le nombre de passagers.',
    tripNotes: 'Trajet par l\'A55 et l\'A7 (~30 min). Suivi du vol en temps réel inclus : nous adaptons l\'heure de prise en charge selon le retard ou l\'avance. Accueil zone arrivée avec pancarte au nom du passager sur demande.',
    spots: [
      { name: 'Terminal 1', blurb: 'Terminal principal : Air France, Lufthansa, KLM, Easyjet, vols nationaux et internationaux.', type: 'monument' },
      { name: 'Terminal 2 (mp²)', blurb: 'Terminal low-cost : Ryanair, Wizz Air, Volotea. Pas d\'enregistrement bagage en cabine.', type: 'monument' },
      { name: 'Parking longue durée P5', blurb: 'Parking économique (12 €/jour) avec navette gratuite vers le terminal (toutes les 5-10 min).', type: 'other' },
    ],
    useCases: [
      'Transfert tôt le matin (vol avant 6h) ou tard le soir',
      'Vol d\'affaires : pancarte à l\'arrivée + dépose en zone VIP',
      'Famille avec bagages volumineux (Mercedes Classe V, coffre XL)',
      'Vol annulé / retardé : nous restons disponibles, pas de frais d\'attente facturés pour retard transporteur',
    ],
    faq: [
      { q: 'Quel est le forfait taxi Marseille → Aéroport ?', a: 'Forfait fixe entre 70 et 110 € selon l\'adresse de prise en charge et le nombre de passagers. Annoncé fermement à la réservation.' },
      { q: 'Acceptez-vous les vols tôt le matin (avant 5h) ?', a: 'Oui, service 24h/24. Le tarif nuit (19h-7h) s\'applique automatiquement.' },
      { q: 'Et si mon vol est retardé ?', a: 'Nous suivons votre vol en temps réel et ajustons l\'heure de prise en charge. Aucun frais d\'attente facturé pour retard avion.' },
      { q: 'Pouvez-vous m\'accueillir avec une pancarte ?', a: 'Oui, en zone arrivée du Terminal 1 ou 2. Précisez à la réservation le nom à afficher.' },
      { q: 'Distance et durée ?', a: '30 km de Marseille centre, 30 min en heure creuse. Aux heures de pointe (7h30-9h30, 17h-19h), prévoir 45 min.' },
    ],
    related: ['gare-saint-charles', 'aix-en-provence', 'cassis', 'port-croisiere-marseille'],
  },
  {
    id: 'port-croisiere-marseille',
    distanceKm: 5,
    durationReal: '~15 min',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.3490, lng: 5.3375 },
    seoTitle: 'Taxi Marseille → Port de croisière | Taxi Julien',
    seoDescription: 'Taxi Marseille → port croisière (Costa, MSC, Royal Caribbean). MPCT, Cap Janet. Mercedes Classe V 7 pax, bagages XL. Suivi trafic temps réel.',
    h1: 'Taxi Marseille → Port de croisière',
    heroSubtitle: 'MPCT · Cap Janet · MSC · Costa · ~15 min',
    lead: 'Le port de croisière de Marseille accueille 1,6 million de croisiéristes par an. Deux terminaux principaux : MPCT (Marseille Provence Cruise Terminal, Costa) et Cap Janet (MSC, Royal Caribbean, Norwegian). Nous suivons en temps réel le trafic A55 et tunnel Prado-Carénage pour ajuster votre heure de prise en charge.',
    tripNotes: 'Trajet centre Marseille → terminal en 15-20 min selon trafic. Mercedes Classe V acceptant bagages XL (valises soute + cabine). Vérifiez votre terminal exact sur votre billet : MPCT et Cap Janet sont à 3 km l\'un de l\'autre.',
    spots: [
      { name: 'MPCT (Marseille Provence Cruise Terminal)', blurb: 'Principal terminal Costa et autres compagnies. Quai Léon Gourret.', type: 'monument' },
      { name: 'Terminal Cap Janet', blurb: 'Terminal MSC, Royal Caribbean, Norwegian. Quai Mirabeau.', type: 'monument' },
      { name: 'Terminal J4', blurb: 'Terminal occasionnel pour petites unités. À côté du MuCEM.', type: 'monument' },
    ],
    faq: [
      { q: 'Tarif Marseille centre → port croisière ?', a: 'Sur devis, généralement 25-40 € au compteur selon adresse. Annoncé à la réservation.' },
      { q: 'Quel terminal pour ma croisière ?', a: 'Vérifiez votre billet : Costa → MPCT, MSC/Royal Caribbean/Norwegian → Cap Janet.' },
      { q: 'Combien de temps avant l\'embarquement ?', a: 'Check-in 2-3h avant appareillage (selon compagnie). Prévoir +30 min en haute saison juillet-août.' },
      { q: 'Mercedes Classe V acceptée pour bagages soute + cabine ?', a: 'Oui, coffre XL adapté valises grosses dimensions + bagages cabine.' },
    ],
    related: ['aeroport-marseille-provence', 'gare-saint-charles', 'cassis', 'aix-en-provence'],
  },
  {
    id: 'gare-saint-charles',
    distanceKm: 1,
    durationReal: '~10 min',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.3028, lng: 5.3808 },
    seoTitle: 'Taxi Marseille → Gare Saint-Charles | Taxi Julien',
    seoDescription: 'Taxi → Gare Marseille Saint-Charles. Accueil sur le quai, bagages, 24h/24. Mercedes Classe V 7 pax. Transferts TGV, TER, Intercités.',
    h1: 'Taxi Marseille → Gare Saint-Charles',
    heroSubtitle: 'TGV · Quai accueil · ~10 min',
    lead: 'La Gare Saint-Charles est le hub ferroviaire principal de Marseille (TGV vers Paris en 3h, Lyon, Bordeaux, Italie). Nous proposons accueil sur le quai d\'arrivée avec pancarte sur demande, et dépose en zone taxi sans souci de stationnement.',
    spots: [
      { name: 'Hall principal', blurb: 'Hall historique XIXe siècle avec escalier monumental. Boutiques, restauration.', type: 'monument' },
      { name: 'Métro Saint-Charles', blurb: 'Ligne 1 et 2, accès rapide au Vieux-Port et au centre.', type: 'other' },
    ],
    faq: [
      { q: 'Pouvez-vous m\'accueillir sur le quai ?', a: 'Oui, accueil avec pancarte sur demande. Précisez voiture/place TGV à la réservation.' },
      { q: 'Dépose taxi ?', a: 'Zone taxis officielle accessible 24h/24, dépose rapide hors trafic.' },
      { q: 'Forfait depuis Saint-Charles ?', a: 'Au compteur ou forfait selon destination : aéroport, Cassis, Aix-en-Provence — voir pages dédiées.' },
    ],
    related: ['aeroport-marseille-provence', 'cassis', 'aix-en-provence', 'port-croisiere-marseille'],
  },
  {
    id: 'gare-aix-tgv',
    distanceKm: 25,
    durationReal: '~25 min',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.4548, lng: 5.3175 },
    seoTitle: 'Taxi Marseille → Gare Aix TGV | Taxi Julien',
    seoDescription: 'Taxi Marseille → Gare Aix TGV (25 km, 25 min). Mercedes Classe V 7 pax. TGV directs Paris, Bruxelles, Lille. Accueil quai.',
    h1: 'Taxi Marseille → Gare Aix TGV',
    heroSubtitle: 'TGV Provence · Méditerranée · 25 km · ~25 min',
    lead: 'La Gare d\'Aix-en-Provence TGV est à 25 km de Marseille (et 15 km du centre d\'Aix), sur la commune de Vitrolles. TGV directs Paris en 3h, Bruxelles, Lille. Forfait depuis Marseille à partir de 50 €.',
    spots: [
      { name: 'Gare TGV', blurb: 'Bâtiment moderne de Jean-Marie Duthilleul (2001). Restauration, parking, location voitures.', type: 'monument' },
      { name: 'Parking longue durée', blurb: 'Parking gardé 24h/24, ~10 €/jour. Alternative aux taxis pour trajets longs.', type: 'other' },
    ],
    faq: [
      { q: 'Distance Marseille → Aix TGV ?', a: '25 km par l\'A51 et A7, ~25 min en heure creuse.' },
      { q: 'Forfait spécifique ?', a: 'Forfait à partir de 50 €, sur devis exact selon adresse de prise en charge.' },
      { q: 'Distance Aix TGV → centre Aix ?', a: '15 km, ~15 min en taxi.' },
    ],
    related: ['aix-en-provence', 'gare-saint-charles', 'aeroport-marseille-provence'],
  },
  {
    id: 'gare-avignon-tgv',
    distanceKm: 105,
    durationReal: '~1h10',
    deptCode: '84',
    deptName: 'Vaucluse',
    geo: { lat: 43.9213, lng: 4.7836 },
    seoTitle: 'Taxi Marseille → Gare TGV Avignon | Taxi Julien',
    seoDescription: 'Taxi Marseille → Gare Avignon TGV (105 km, 1h10). Mercedes Classe V 7 pax. TGV Paris, Lille, Lyon. Forfait sur devis.',
    h1: 'Taxi Marseille → Gare TGV Avignon',
    heroSubtitle: 'TGV Provence · 105 km · ~1h10',
    lead: 'La Gare TGV d\'Avignon (Courtine) est à 105 km de Marseille (et 4 km du centre d\'Avignon). TGV vers Paris en 2h40, accès Festival d\'Avignon (juillet).',
    spots: [
      { name: 'Gare TGV Avignon', blurb: 'Architecture moderne (2001), arc en béton de 340 m. Liaison TER vers Avignon Centre.', type: 'monument' },
    ],
    faq: [
      { q: 'Forfait Marseille → Gare TGV Avignon ?', a: 'Sur devis, similaire à Marseille → Avignon (~220 €).' },
      { q: 'Combien de temps ?', a: '~1h10 par l\'A7.' },
    ],
    related: ['avignon', 'arles', 'aix-en-provence'],
  },
  {
    id: 'aeroport-nice',
    distanceKm: 200,
    durationReal: '~2h30',
    deptCode: '06',
    deptName: 'Alpes-Maritimes',
    geo: { lat: 43.6650, lng: 7.2150 },
    seoTitle: 'Taxi Marseille → Aéroport Nice Côte d\'Azur | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → Aéroport Nice Côte d\'Azur (200 km, 2h30). Mercedes Classe V 7 pax. Suivi vol. Sur devis.',
    h1: 'Taxi Marseille → Aéroport Nice Côte d\'Azur',
    heroSubtitle: '2e aéroport de France · 200 km · ~2h30',
    lead: 'L\'Aéroport Nice Côte d\'Azur (NCE) est le 2e aéroport français en trafic. À 200 km de Marseille par l\'A8, 2h30 de trajet en heure creuse. Idéal pour vols intercontinentaux non desservis depuis Marseille.',
    spots: [
      { name: 'Terminal 1', blurb: 'Vols nationaux et européens. Easyjet principal opérateur.', type: 'monument' },
      { name: 'Terminal 2', blurb: 'Vols long-courriers et internationaux. Air France, Delta, Emirates.', type: 'monument' },
    ],
    faq: [
      { q: 'Tarif Marseille → Aéroport Nice ?', a: 'Sur devis, généralement ~450-500 € selon adresse et horaire.' },
      { q: 'Pourquoi choisir Nice plutôt que Marseille ?', a: 'Pour vols long-courriers (USA, Asie) ou compagnies qui ne sont qu\'à Nice.' },
    ],
    related: ['nice-ville', 'cannes', 'antibes', 'aeroport-marseille-provence'],
  },
  {
    id: 'aeroport-toulon-hyeres',
    distanceKm: 75,
    durationReal: '~1h',
    deptCode: '83',
    deptName: 'Var',
    geo: { lat: 43.0973, lng: 6.1467 },
    seoTitle: 'Taxi Marseille → Aéroport Toulon-Hyères | Taxi Julien',
    seoDescription: 'Taxi privé Marseille → Aéroport Toulon-Hyères (75 km, 1h). Mercedes Classe V 7 pax. Air France, Air Corsica. Sur devis.',
    h1: 'Taxi Marseille → Aéroport Toulon-Hyères',
    heroSubtitle: 'Hub côte varoise · 75 km · ~1h',
    lead: 'L\'Aéroport Toulon-Hyères (TLN) est à 75 km de Marseille (A50/A57), 1h de trajet. Principalement vols domestiques (Air France vers Paris, Air Corsica, Volotea).',
    spots: [
      { name: 'Terminal unique', blurb: 'Aéroport compact, accès direct depuis le tarmac. Salons d\'attente, locations voiture.', type: 'monument' },
    ],
    faq: [
      { q: 'Tarif Marseille → Aéroport TLN ?', a: 'Sur devis, ~150-200 € selon horaire.' },
      { q: 'Et le centre d\'Hyères ?', a: 'L\'aéroport est à 5 km du centre d\'Hyères. Tarif spécifique sur demande.' },
    ],
    related: ['hyeres', 'toulon', 'la-londe', 'aeroport-marseille-provence'],
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
  { id: 'aeroport-marseille-provence', name: 'Aéroport Marseille Provence', shortName: 'Marseille Provence', category: 'Aéroport', priceFrom: 70, priceTo: 110, duration: '~30 min', tagline: 'Forfait fixe · suivi du vol', photo: '/photos/hero.jpg', photoSm: '/photos/hero-sm.jpg' },
  { id: 'aeroport-nice', name: "Aéroport Nice Côte d'Azur", shortName: 'Nice', category: 'Aéroport', duration: '~2h', note: 'Sur devis', tagline: 'Direct par autoroute', photo: '/photos/dest-nice.jpg', photoSm: '/photos/dest-nice-sm.jpg' },
  { id: 'aeroport-toulon-hyeres', name: 'Aéroport Toulon-Hyères', shortName: 'Toulon-Hyères', category: 'Aéroport', duration: '~1h', note: 'Sur devis', tagline: 'Côte varoise', photo: '/photos/v3.jpg', photoSm: '/photos/v3-sm.jpg' },

  // Gares
  { id: 'gare-saint-charles', name: 'Gare Saint-Charles', shortName: 'Saint-Charles', category: 'Gare', note: 'Sur devis', tagline: 'Accueil sur le quai', photo: '/photos/dest-gare.jpg', photoSm: '/photos/dest-gare-sm.jpg' },
  { id: 'gare-aix-tgv', name: 'Gare Aix TGV', shortName: 'Aix TGV', category: 'Gare', note: 'Sur devis', tagline: 'Aix-en-Provence', photo: '/photos/dest-gare-aix.jpg', photoSm: '/photos/dest-gare-aix-sm.jpg' },
  { id: 'gare-avignon-tgv', name: "Gare TGV d'Avignon", shortName: 'Avignon TGV', category: 'Gare', note: 'Sur devis', tagline: 'Provence — terre des papes', photo: '/photos/dest-gare.jpg', photoSm: '/photos/dest-gare-sm.jpg' },

  // Ports — photo réelle : Taxi Julien devant MSC
  { id: 'port-croisiere-marseille', name: 'Port de croisière Marseille', shortName: 'Croisière Marseille', category: 'Port', note: 'Sur devis', tagline: 'Costa · MSC · bagages XL', photo: '/photos/v5-2.jpg', photoSm: '/photos/v5-2-sm.jpg' },

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
    { label: 'Tarif jour (7h–19h)', value: '2,24 € / km' },
    { label: 'Tarif nuit (19h–7h)', value: '2,88 € / km' },
    { label: 'Dimanches & jours fériés', value: '2,88 € / km' },
    { label: 'Attente / marche lente', value: '35,60 € / h' },
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
    key: 'gare',
    title: 'Départ Gare Saint-Charles',
    subtitle: 'Forfaits depuis la gare TGV de Marseille',
    hasNight: true,
    rows: [
      { dest: "La Penne-sur-Huveaune", day: "45 €", night: "55 €" },
      { dest: "Aubagne", day: "50 €", night: "65 €" },
      { dest: "Carnoux-en-Provence", day: "65 €", night: "80 €" },
      { dest: "Roquefort-la-Bédoule", day: "65 €", night: "85 €" },
      { dest: "Cassis", day: "75 €", night: "95 €" },
      { dest: "La Ciotat", day: "85 €", night: "110 €" },
      { dest: "Saint-Cyr-sur-Mer", day: "110 €", night: "135 €" },
      { dest: "Bandol", day: "135 €", night: "170 €" },
      { dest: "Sanary-sur-Mer", day: "140 €", night: "180 €" },
      { dest: "Six-Fours-les-Plages", day: "155 €", night: "195 €" },
      { dest: "La Seyne-sur-Mer", day: "155 €", night: "195 €" },
      { dest: "Ollioules", day: "145 €", night: "185 €" },
      { dest: "Toulon", day: "160 €", night: "200 €" },
      { dest: "La Valette-du-Var", day: "175 €", night: "220 €" },
      { dest: "Le Pradet", day: "180 €", night: "230 €" },
      { dest: "Carqueiranne", day: "190 €", night: "240 €" },
      { dest: "Hyères", day: "200 €", night: "255 €" },
      { dest: "La Londe-les-Maures", day: "220 €", night: "285 €" },
      { dest: "Bormes-les-Mimosas", day: "245 €", night: "310 €" },
      { dest: "Le Lavandou", day: "245 €", night: "310 €" },
      { dest: "Rayol-Canadel-sur-Mer", day: "270 €", night: "345 €" },
      { dest: "Cavalaire-sur-Mer", day: "290 €", night: "370 €" },
      { dest: "La Croix-Valmer", day: "290 €", night: "370 €" },
      { dest: "Cogolin", day: "290 €", night: "370 €" },
      { dest: "Gassin", day: "310 €", night: "410 €" },
      { dest: "Ramatuelle", day: "320 €", night: "410 €" },
      { dest: "Saint-Tropez", day: "320 €", night: "410 €" },
      { dest: "Sainte-Maxime", day: "335 €", night: "430 €" },
      { dest: "Fréjus", day: "320 €", night: "410 €" },
      { dest: "Saint-Raphaël", day: "330 €", night: "420 €" },
      { dest: "Mandelieu-la-Napoule", day: "385 €", night: "490 €" },
      { dest: "Cannes", day: "385 €", night: "490 €" },
      { dest: "Antibes", day: "430 €", night: "545 €" },
      { dest: "Cagnes-sur-Mer", day: "430 €", night: "560 €" },
      { dest: "Nice", day: "470 €", night: "590 €" },
      { dest: "Avignon", day: "230 €", night: "290 €" },
      { dest: "Arles", day: "215 €", night: "290 €" },
      { dest: "Toulouse", day: "950 €", night: "1210 €" },
      { dest: "Montpellier", day: "400 €", night: "510 €" },
      { dest: "Lyon", day: "740 €", night: "940 €" },
    ],
  },
  {
    key: 'airport',
    title: 'Départ Aéroport Marseille Provence',
    subtitle: "Forfaits depuis l'aéroport (Marignane)",
    hasNight: true,
    rows: [
      { dest: "La Penne-sur-Huveaune", day: "95–100 €", night: "125 €" },
      { dest: "Aubagne", day: "115 €", night: "73 €" },
      { dest: "Carnoux-en-Provence", day: "125 €", night: "145 €" },
      { dest: "Roquefort-la-Bédoule", day: "135 €", night: "150 €" },
      { dest: "Cassis", day: "130 €", night: "160 €" },
      { dest: "La Ciotat", day: "140 €", night: "180 €" },
      { dest: "Saint-Cyr-sur-Mer", day: "150 €", night: "190 €" },
      { dest: "Bandol", day: "175 €", night: "225 €" },
      { dest: "Sanary-sur-Mer", day: "180 €", night: "235 €" },
      { dest: "Six-Fours-les-Plages", day: "200 €", night: "250 €" },
      { dest: "La Seyne-sur-Mer", day: "200 €", night: "255 €" },
      { dest: "Ollioules", day: "190 €", night: "245 €" },
      { dest: "Toulon", day: "200 €", night: "260 €" },
      { dest: "La Valette-du-Var", day: "220 €", night: "280 €" },
      { dest: "Le Pradet", day: "225 €", night: "285 €" },
      { dest: "Carqueiranne", day: "250 €", night: "320 €" },
      { dest: "Hyères", day: "245 €", night: "315 €" },
      { dest: "La Londe-les-Maures", day: "265 €", night: "340 €" },
      { dest: "Bormes-les-Mimosas", day: "290 €", night: "370 €" },
      { dest: "Le Lavandou", day: "290 €", night: "375 €" },
      { dest: "Rayol-Canadel-sur-Mer", day: "440 €", night: "560 €" },
      { dest: "Cavalaire-sur-Mer", day: "350 €", night: "445 €" },
      { dest: "La Croix-Valmer", day: "225 €", night: "425 €" },
      { dest: "Cogolin", day: "315 €", night: "400 €" },
      { dest: "Gassin", day: "335 €", night: "435 €" },
      { dest: "Ramatuelle", day: "340 €", night: "420 €" },
      { dest: "Saint-Tropez", day: "335 €", night: "385 €" },
      { dest: "Sainte-Maxime", day: "335 €", night: "430 €" },
      { dest: "Fréjus", day: "325 €", night: "415 €" },
      { dest: "Saint-Raphaël", day: "335 €", night: "425 €" },
      { dest: "Mandelieu-la-Napoule", day: "385 €", night: "490 €" },
      { dest: "Cannes", day: "310 €", night: "520 €" },
      { dest: "Antibes", day: "430 €", night: "540 €" },
      { dest: "Cagnes-sur-Mer", day: "450 €", night: "565 €" },
      { dest: "Nice", day: "470 €", night: "595 €" },
      { dest: "Arles", day: "190 €", night: "235 €" },
      { dest: "Avignon", day: "210 €", night: "265 €" },
      { dest: "Montpellier", day: "340 €", night: "400 €" },
      { dest: "Toulouse", day: "915 €", night: "1165 €" },
      { dest: "Lyon", day: "710 €", night: "895 €" },
    ],
  },
  {
    key: 'ski',
    title: 'Stations de ski — Départ Marseille',
    subtitle: 'Longue distance, tarif aller simple à partir de',
    hasNight: false,
    rows: [
      { dest: "Superdévoluy", from: "520 €" },
      { dest: "Orcières Merlette", from: "520 €" },
      { dest: "Les Orres", from: "520 €" },
      { dest: "Pra Loup", from: "550 €" },
      { dest: "Vars", from: "580 €" },
      { dest: "Risoul", from: "560 €" },
      { dest: "Serre Chevalier", from: "640 €" },
      { dest: "Montgenèvre", from: "650 €" },
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
    image: '/photos/v0-2.jpg',
    imageSm: '/photos/v0-2-sm.jpg',
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
  context: 'Aéroport' | 'Port' | 'Gare' | 'Longue distance' | 'Marseille' | 'Hôtel' | 'Montagne'
}

export const gallery: GalleryPhoto[] = [
  {
    src: '/photos/v1.jpg',
    srcSm: '/photos/v1-sm.jpg',
    alt: 'Mercedes Classe V Taxi Julien devant un hôtel avec bagages',
    caption: 'Bagages XL — chargement hôtel',
    context: 'Hôtel',
  },
  {
    src: '/photos/v11.jpg',
    srcSm: '/photos/v11-sm.jpg',
    alt: 'Mercedes Classe V Taxi Julien devant un paquebot Costa',
    caption: 'Port de croisière — Costa',
    context: 'Port',
  },
  {
    src: '/photos/v5-2.jpg',
    srcSm: '/photos/v5-2-sm.jpg',
    alt: 'Mercedes Classe V Taxi Julien devant un navire MSC',
    caption: 'Port de croisière — MSC',
    context: 'Port',
  },
  {
    src: '/photos/v4.jpg',
    srcSm: '/photos/v4-sm.jpg',
    alt: 'Mercedes Classe V Taxi Julien en montagne, neige et sommets',
    caption: 'Montagne — neige & sommets',
    context: 'Montagne',
  },
  {
    src: '/photos/v10.jpg',
    srcSm: '/photos/v10-sm.jpg',
    alt: 'Mercedes Classe V Taxi Julien devant le Terminal 1 de l\'aéroport Marseille Provence, de jour',
    caption: 'Terminal 1 — accueil de jour',
    context: 'Aéroport',
  },
  {
    src: '/photos/v2-2.jpg',
    srcSm: '/photos/v2-2-sm.jpg',
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
    src: '/photos/v0-2.jpg',
    srcSm: '/photos/v0-2-sm.jpg',
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
  { author: "Amelie Lesueur", context: "Hôtel → bateau → gare · croisière", rating: 5, text: "Au top du top . Taxi pour 5 personnes , spacieux , propre et le conducteur juste génial, agréable, bonne conduite , connaît sa ville , bonne discussion et très ponctuel. Je recommande +++. Nous l'avons pris à l'allée, de l'hôtel au bateau puis au retour du bateau à la gare vraiment super." },
  { author: "Camille FOURNIL", context: "Aéroport → Pra Loup · sièges enfant", rating: 5, text: "Très bon transport entre Aéroport et pra Lou , Avec un service de qualité demande de siège bébé , siège auto . Et une conduite parfaite pour les gens souffrant du mal des transports :" },
  { author: "Tiffanie Rech", context: "Trajets collaborateurs Toulon ↔ Trets", rating: 5, text: "Je suis ravie d'avoir fait confiance à Taxi Julien pour assurer les trajets de nos collaborateurs entre Toulon et Trets. Que ce soit de jour comme de nuit, le service a toujours été irréprochable, alliant professionnalisme et gentillesse. Une prestation au top, que je recommande sans hésiter !" },
  { author: "Patrice Duchan", context: "Van 6 personnes + bagages", rating: 5, text: "Que dire ... Parfait tant dans la ponctualité la courtoisie de Julien l'espace de son van pour 6 personnes et leur bagages la propreté du véhicule les renseignements sur Marseille Bref je recommande à 1000 % et n'hésiterai pas à le recontacter prochainement" },
  { author: "Pasquine Rachidi", context: "Van 7 places · famille", rating: 5, text: "Chauffeur très ponctuel, véhicule 7 places, propre et spacieux parfait pour les trajets en groupe ou en famille. La conduite est agréable, fluide et rassurante. De plus le chauffeur est sympathique et professionnel, un vrai plaisir d'échanger pendant le trajet. Je recommande vivement" },
  { author: "Fabienne Reiff", context: "Transfert van Mercedes", rating: 5, text: "Taxi Julien, une référence sérieuse, de parole, efficace et très aimable dans un van très spacieux et confortable. Conduite impeccable, communication avant la prise en charge et prise en charge parfaite. Merci, à recommander les yeux fermés." },
  { author: "Christelle H", context: "Cliente régulière", rating: 5, text: "Julien est un grand professionnel, j ai utilisé ses services à plusieurs reprises et continuerai de le faire. Les trajets avec Julien sont agréables et sûrs, son véhicule ultra confortable et extrêmement bien entretenu. Vous pouvez lui faire confiance les yeux fermés !" },
  { author: "Maël Barthe", context: "Transfert aéroport", rating: 5, text: "Un énorme merci à Taxi Julien pour : la qualité et la propreté de son véhicule, sa ponctualité, son professionnalisme et sa gentillesse. Rien à redire, un taxi à recommander absolument !" },
  { author: "Laura Boyer", context: "Deux trajets · réservation téléphone", rating: 5, text: "Très bon premier contact par téléphone. Julien a été à été ponctuel, très aimable, réactif et très professionnel pour les 2 trajets pour lesquels je l'ai sollicité. C'est un taxi que je recommande !" },
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

export const articles: Article[] = articlesData as unknown as Article[]



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
