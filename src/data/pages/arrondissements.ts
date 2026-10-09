import type { DestContent, DestSpot } from '../taxi'

// Aéroport Marseille Provence depuis chaque arrondissement — reconstruit le
// cluster « taxi 13008 aéroport » de l'ancien site, avec le forfait réel de la
// grille (70 – 110 € selon véhicule et passagers) et des repères réels par
// arrondissement. Aucune distance chiffrée : elle varie selon l'adresse.
type Arrondissement = { n: number; cp: string; quartiers: string[]; spots: DestSpot[] }

const ordinal = (n: number) => (n === 1 ? '1er' : `${n}e`)

const ARRONDISSEMENTS: Arrondissement[] = [
  { n: 1, cp: '13001', quartiers: ['Vieux-Port', 'Noailles', 'Belsunce', 'Opéra', 'Canebière', 'Thiers'], spots: [
    { name: 'Vieux-Port', blurb: 'Dépose quai des Belges ou quai du Port, devant votre hôtel.', type: 'monument' },
    { name: 'Gare Saint-Charles', blurb: "Correspondance train ↔ avion : prise en charge au pied de l'escalier monumental.", type: 'other' },
    { name: 'La Canebière', blurb: 'Hôtels et résidences du centre, de la Bourse aux Réformés.', type: 'shopping' } ] },
  { n: 2, cp: '13002', quartiers: ['La Joliette', 'Le Panier', 'Arenc', 'Grands-Carmes', 'Hôtel-de-Ville'], spots: [
    { name: 'MuCEM et cathédrale de la Major', blurb: 'Esplanade du J4, Fort Saint-Jean.', type: 'museum' },
    { name: 'Les Terrasses du Port et les Docks', blurb: "Bureaux, hôtels et commerces d'Euroméditerranée.", type: 'shopping' },
    { name: 'InterContinental Hôtel-Dieu', blurb: "Dépose devant l'hôtel, bagages pris en charge.", type: 'hotel' } ] },
  { n: 3, cp: '13003', quartiers: ['Belle-de-Mai', 'Saint-Mauront', 'Saint-Lazare', 'La Villette'], spots: [
    { name: 'Friche la Belle de Mai', blurb: 'Lieu culturel : concerts, expositions, bureaux.', type: 'museum' },
    { name: 'Hôpital Européen', blurb: 'Transferts patients et visiteurs (taxi conventionné).', type: 'hospital' },
    { name: 'Gare Saint-Charles (côté Saint-Lazare)', blurb: 'Accès par le boulevard Voltaire.', type: 'other' } ] },
  { n: 4, cp: '13004', quartiers: ['Les Chartreux', 'Cinq-Avenues', 'La Blancarde', 'Chutes-Lavie'], spots: [
    { name: 'Palais Longchamp', blurb: 'Muséum et musée des Beaux-Arts, parc.', type: 'monument' },
    { name: 'Gare de la Blancarde', blurb: 'Métro et tramway, TER.', type: 'other' },
    { name: 'Le Dôme', blurb: 'Salle de concerts et spectacles.', type: 'other' } ] },
  { n: 5, cp: '13005', quartiers: ['La Timone', 'Baille', 'Saint-Pierre', 'Le Camas'], spots: [
    { name: 'Hôpital de la Timone', blurb: "Dépose devant l'entrée demandée (adultes, enfants).", type: 'hospital' },
    { name: 'Hôpital de la Conception', blurb: 'Consultations et hospitalisations.', type: 'hospital' },
    { name: 'Faculté de médecine', blurb: 'Campus Timone.', type: 'other' } ] },
  { n: 6, cp: '13006', quartiers: ['Castellane', 'Vauban', 'Notre-Dame-du-Mont', 'Lodi', 'Préfecture', 'Cours Julien'], spots: [
    { name: 'Notre-Dame de la Garde', blurb: 'Basilique : dépose en haut, parking impossible.', type: 'church' },
    { name: 'Place Castellane', blurb: 'Hôtels, résidences Citadines et Ibis Styles, métro.', type: 'hotel' },
    { name: 'Clinique Bouchard', blurb: 'Transferts patients (taxi conventionné).', type: 'hospital' } ] },
  { n: 7, cp: '13007', quartiers: ['Le Pharo', 'Saint-Victor', 'Endoume', 'Roucas-Blanc', 'Bompard', 'Les Catalans'], spots: [
    { name: 'Palais du Pharo', blurb: 'Congrès et réceptions.', type: 'monument' },
    { name: 'Corniche Kennedy et vallon des Auffes', blurb: 'Hôtels nhow, Sofitel, Radisson Blu, Le Petit Nice.', type: 'hotel' },
    { name: 'Abbaye Saint-Victor', blurb: 'Quartier résidentiel au-dessus du Vieux-Port.', type: 'church' } ] },
  { n: 8, cp: '13008', quartiers: ['Le Prado', 'Périer', 'Bonneveine', 'La Pointe-Rouge', 'Montredon', 'Les Goudes', 'Sainte-Anne'], spots: [
    { name: 'Orange Vélodrome', blurb: 'Matchs et concerts : dépose aux abords, retour planifié.', type: 'sport' },
    { name: 'Parc Chanot — Palais des Congrès', blurb: 'Salons, congrès, hôtels Novotel et Golden Tulip voisins.', type: 'other' },
    { name: 'Plages du Prado et parc Borély', blurb: 'Du Rond-Point du Prado à la Pointe-Rouge.', type: 'beach' },
    { name: 'Hôpital Saint-Joseph', blurb: 'Transferts patients (taxi conventionné).', type: 'hospital' } ] },
  { n: 9, cp: '13009', quartiers: ['Mazargues', 'Sainte-Marguerite', 'Le Cabot', 'La Panouse', 'Luminy', 'Vaufrèges'], spots: [
    { name: 'Institut Paoli-Calmettes', blurb: 'Séances répétées planifiées (taxi conventionné).', type: 'hospital' },
    { name: 'Hôpital Sainte-Marguerite et clinique Clairval', blurb: 'Transferts patients et visiteurs.', type: 'hospital' },
    { name: 'Campus de Luminy et calanques', blurb: 'Sormiou, Morgiou : dépose au départ des sentiers.', type: 'hike' } ] },
  { n: 10, cp: '13010', quartiers: ['Saint-Tronc', 'Pont-de-Vivaux', 'La Capelette', 'Menpenti', 'Saint-Loup'], spots: [
    { name: 'Palais omnisports Marseille Grand-Est', blurb: 'Patinoire et événements.', type: 'sport' },
    { name: 'Kyriad Palais des Congrès', blurb: "Hôtel desservi, dépose devant l'entrée.", type: 'hotel' },
    { name: 'La Capelette', blurb: 'Résidences et entreprises du secteur.', type: 'other' } ] },
  { n: 11, cp: '13011', quartiers: ['La Valentine', 'Les Caillols', 'Saint-Marcel', 'La Pomme', 'Les Camoins', 'La Treille'], spots: [
    { name: 'Centre commercial La Valentine', blurb: 'Zone commerciale et hôtels de la Valentine.', type: 'shopping' },
    { name: 'Château de la Buzine', blurb: 'La « maison de ma mère » de Pagnol.', type: 'monument' },
    { name: "Saint-Marcel et la vallée de l'Huveaune", blurb: "Accès rapide à l'A50.", type: 'other' } ] },
  { n: 12, cp: '13012', quartiers: ['Saint-Barnabé', 'Les Trois-Lucs', 'Montolivet', 'Saint-Julien', 'La Fourragère', 'Bois-Luzy'], spots: [
    { name: 'Clinique Beauregard', blurb: 'Transferts patients (taxi conventionné).', type: 'hospital' },
    { name: 'Saint-Barnabé', blurb: 'Village et résidences, métro La Fourragère.', type: 'other' },
    { name: 'Parc de la Moline', blurb: "Quartiers résidentiels de l'est marseillais.", type: 'other' } ] },
  { n: 13, cp: '13013', quartiers: ['Château-Gombert', 'Saint-Jérôme', 'Malpassé', 'Les Olives', 'La Rose', 'Saint-Mitre'], spots: [
    { name: 'Technopôle de Château-Gombert', blurb: "Entreprises et écoles d'ingénieurs : déplacements professionnels.", type: 'other' },
    { name: 'Campus Saint-Jérôme', blurb: 'Université, résidences étudiantes.', type: 'other' },
    { name: 'Métro La Rose', blurb: 'Terminus nord de la ligne 1.', type: 'other' } ] },
  { n: 14, cp: '13014', quartiers: ['Sainte-Marthe', 'Le Merlan', 'Saint-Barthélemy', 'Bon-Secours', 'Le Canet', 'Les Arnavaux'], spots: [
    { name: 'Centre commercial Le Merlan', blurb: 'Zone commerciale et résidences.', type: 'shopping' },
    { name: 'Sainte-Marthe', blurb: "Accès direct à l'A7 vers l'aéroport.", type: 'other' },
    { name: 'Saint-Barthélemy', blurb: 'Quartiers nord, desserte 24h/24.', type: 'other' } ] },
  { n: 15, cp: '13015', quartiers: ['Saint-Louis', 'Saint-Antoine', 'La Viste', 'La Cabucelle', 'Les Aygalades', 'La Delorme'], spots: [
    { name: 'Hôpital Nord', blurb: 'Transferts patients et visiteurs (taxi conventionné).', type: 'hospital' },
    { name: 'Terminal croisières (Môle Léon Gourret)', blurb: 'Embarquements MSC et Costa.', type: 'other' },
    { name: 'Marché aux puces', blurb: 'Les Crottes, accès A55.', type: 'market' } ] },
  { n: 16, cp: '13016', quartiers: ["L'Estaque", 'Saint-Henri', 'Saint-André', 'Les Riaux'], spots: [
    { name: "Port de l'Estaque", blurb: 'Le village des peintres, les plages de Corbière.', type: 'beach' },
    { name: 'Saint-Henri et Saint-André', blurb: "L'arrondissement le plus proche de l'aéroport par l'A55.", type: 'other' },
    { name: "Gare de l'Estaque", blurb: 'TER vers Miramas et Marseille.', type: 'other' } ] },
]

export const arrondissementPages: DestContent[] = ARRONDISSEMENTS.map(a => {
  const name = `Marseille ${ordinal(a.n)} (${a.cp})`
  return {
    id: `aeroport-${a.cp}`,
    kind: 'service',
    path: `/aeroport/${a.cp}/`,
    destName: name,
    destCategory: 'Aéroport',
    destPhoto: '/photos/hero.jpg',
    destPhotoSm: '/photos/hero-sm.jpg',
    distanceKm: 0,
    durationReal: '—',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.2965, lng: 5.3698 },
    seoTitle: `Taxi Marseille ${ordinal(a.n)} → Aéroport : forfait fixe | Taxi Julien`,
    seoDescription: `Taxi du ${ordinal(a.n)} arrondissement de Marseille (${a.cp}) vers l'aéroport Marseille Provence : forfait fixe 70 – 110 €, suivi du vol, Mercedes Classe V 7 places. 24h/24.`,
    h1: `Taxi Marseille ${ordinal(a.n)} → Aéroport Marseille Provence`,
    kicker: `— Aéroport · ${a.cp}`,
    heroSubtitle: `${a.quartiers.slice(0, 3).join(' · ')} · Forfait fixe · Suivi du vol`,
    lead: `Depuis ${a.quartiers.join(', ')} : nous venons vous chercher à votre adresse dans le ${ordinal(a.n)} arrondissement et vous déposons au terminal 1 ou 2 de l'aéroport Marseille Provence. Forfait fixe de 70 à 110 € selon le véhicule et le nombre de passagers, annoncé à la réservation. Au retour, nous suivons votre vol et vous attendons dans le hall avec une pancarte.`,
    fareLabel: '70 – 110 €',
    fareNote: "Forfait fixe aller simple selon véhicule et nombre de passagers, péages inclus. Même tarif de l'aéroport vers votre adresse.",
    ctaTitle: `Un taxi vers l'aéroport depuis le ${ordinal(a.n)} ?`,
    whatsappText: `Bonjour, je souhaite réserver un taxi depuis Marseille ${ordinal(a.n)} (${a.cp}) vers l'aéroport Marseille Provence.`,
    spotsTitle: `Nos points de prise en charge dans le ${ordinal(a.n)}`,
    spotsSub: 'Repères du quartier où nous déposons et récupérons le plus souvent.',
    spots: a.spots,
    useCases: [
      "Départ tôt le matin ou retour tard le soir : réservation la veille, chauffeur à l'heure",
      "Famille jusqu'à 7 passagers avec valises, poussette ou siège bébé sur demande",
      'Déplacement professionnel avec facture',
      'Retour de vol avec suivi en temps réel et attente incluse en cas de retard',
    ],
    faq: [
      { q: `Combien coûte un taxi du ${ordinal(a.n)} arrondissement à l'aéroport ?`, a: "Forfait fixe entre 70 et 110 € selon le véhicule et le nombre de passagers, péages compris. Le montant exact vous est annoncé à la réservation et ne change pas en route." },
      { q: 'Combien de temps faut-il prévoir ?', a: "Comptez 30 à 45 minutes selon le quartier et l'heure ; aux heures de pointe, nous vous proposons une heure de départ adaptée pour arriver 2 h avant un vol international." },
      { q: "Suivez-vous les vols à l'arrivée ?", a: "Oui. Nous surveillons votre numéro de vol : en cas de retard, l'attente est incluse et le chauffeur vous attend dans le hall des arrivées." },
      { q: `Quels quartiers du ${ordinal(a.n)} desservez-vous ?`, a: `Tout l'arrondissement : ${a.quartiers.join(', ')}. Indiquez simplement votre adresse exacte à la réservation.` },
    ],
    related: ['aeroport-marseille-provence', 'gare-saint-charles', 'port-croisiere-marseille', 'transport-medical-conventionne'],
  }
})
