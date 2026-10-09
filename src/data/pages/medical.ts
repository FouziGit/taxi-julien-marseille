import type { DestContent } from '../taxi'

// Page service : transport médical conventionné. Reconstruit le cluster
// « taxi conventionné CPAM / VSL / hôpitaux » perdu à la migration.
// Établissements réels uniquement ; aucun tarif (transport conventionné,
// prise en charge sur prescription).
export const medicalPages: DestContent[] = [
  {
    id: 'transport-medical-conventionne',
    kind: 'service',
    path: '/transport-medical-conventionne/',
    destName: 'Transport médical conventionné',
    destCategory: 'Hôpital',
    destPhoto: '/photos/v10.jpg',
    destPhotoSm: '/photos/v10-sm.jpg',
    distanceKm: 0,
    durationReal: '—',
    deptCode: '13',
    deptName: 'Bouches-du-Rhône',
    geo: { lat: 43.2965, lng: 5.3698 },
    seoTitle: 'Taxi conventionné CPAM Marseille | Taxi Julien',
    seoDescription: 'Taxi conventionné CPAM à Marseille : transport assis sur prescription vers Timone, Conception, Nord, Paoli-Calmettes, cliniques. Sans avance de frais.',
    h1: 'Taxi conventionné CPAM à Marseille',
    kicker: '— Transport médical · Bouches-du-Rhône',
    heroSubtitle: 'Transport assis sur prescription · Hôpitaux et cliniques de Marseille · 24h/24',
    lead: "Taxi Julien est conventionné par l'Assurance Maladie : sur prescription médicale de transport, vos trajets vers l'hôpital, la clinique ou le centre de soins sont pris en charge selon vos droits, sans avance de frais. Consultations, hospitalisations, séances répétées (dialyse, chimiothérapie, rééducation) : un chauffeur ponctuel, un véhicule spacieux et une facturation directe à la caisse.",
    fareLabel: 'Pris en charge CPAM',
    fareNote: 'Sur prescription médicale de transport. Hors prescription : tarif réglementé au compteur.',
    ctaTitle: "Besoin d'un taxi conventionné ?",
    whatsappText: 'Bonjour, je souhaite réserver un taxi conventionné (transport médical sur prescription).',
    spotsTitle: 'Hôpitaux et cliniques desservis',
    spotsSub: 'Les établissements de Marseille et de la métropole où nous déposons et récupérons nos patients.',
    spots: [
      { name: 'Hôpital de la Timone (AP-HM)', blurb: "Marseille 5e. Adultes et enfants, urgences, consultations spécialisées. Dépose devant l'entrée demandée.", type: 'hospital' },
      { name: 'Hôpital de la Conception (AP-HM)', blurb: 'Marseille 5e. Consultations, hospitalisations de jour.', type: 'hospital' },
      { name: 'Hôpital Nord (AP-HM)', blurb: 'Marseille 15e. Accessible depuis tous les arrondissements et la métropole nord.', type: 'hospital' },
      { name: 'Hôpital Sainte-Marguerite (AP-HM)', blurb: 'Marseille 9e. Rééducation, gériatrie, consultations.', type: 'hospital' },
      { name: 'Institut Paoli-Calmettes (IPC)', blurb: "Marseille 9e. Centre de lutte contre le cancer : séances répétées planifiées à l'avance.", type: 'hospital' },
      { name: 'Hôpital Européen', blurb: 'Marseille 3e. Consultations et hospitalisations.', type: 'hospital' },
      { name: 'Hôpital Saint-Joseph', blurb: 'Marseille 8e. Établissement privé à but non lucratif, toutes spécialités.', type: 'hospital' },
      { name: 'Cliniques Clairval, Bouchard, Beauregard', blurb: 'Marseille 9e, 6e et 12e. Transferts vers les cliniques privées de la ville.', type: 'hospital' },
    ],
    useCases: [
      'Consultation ou examen sur prescription médicale de transport',
      'Séances répétées : dialyse, chimiothérapie, radiothérapie, rééducation — trajets réguliers planifiés',
      "Entrée ou sortie d'hospitalisation, avec bagages",
      'Transfert depuis le Var ou les Alpes-Maritimes vers un hôpital marseillais (longue distance conventionnée)',
    ],
    faq: [
      {
        q: "Qu'est-ce qu'un taxi conventionné ?",
        a: "Un taxi ayant signé une convention avec l'Assurance Maladie. Sur prescription médicale de transport établie par votre médecin, le trajet est pris en charge selon vos droits et nous facturons directement la caisse : vous n'avancez pas les frais.",
      },
      {
        q: 'Que dois-je présenter au chauffeur ?',
        a: 'La prescription médicale de transport remplie par votre médecin, votre carte Vitale et, le cas échéant, votre attestation de mutuelle. Sans prescription, la course est facturée au tarif réglementé.',
      },
      {
        q: 'Pouvez-vous assurer des trajets réguliers (dialyse, chimiothérapie) ?',
        a: "Oui. Nous planifions les séances à l'avance avec des horaires fixes et le même chauffeur autant que possible. Appelez-nous pour mettre en place le planning.",
      },
      {
        q: 'Intervenez-vous en dehors de Marseille ?',
        a: 'Oui : toute la métropole, le Var et les Alpes-Maritimes vers les hôpitaux de Marseille, et inversement. Les longues distances conventionnées se préparent par téléphone.',
      },
      {
        q: 'Le véhicule est-il adapté ?',
        a: 'Mercedes Classe V : accès facile, espace pour un accompagnant et les bagages, climatisation. Transport assis uniquement (pas de fauteuil roulant non pliable).',
      },
    ],
    related: ['aeroport-marseille-provence', 'gare-saint-charles', 'toulon', 'aix-en-provence'],
  },
]
