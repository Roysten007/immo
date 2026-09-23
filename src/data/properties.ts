export interface Property {
  id: string;
  title: string;
  category: 'Villa' | 'Penthouse' | 'Domaine';
  categoryLabel: string;
  badge: 'Mandat Exclusif' | 'Nouvelle Collection' | 'Signature Privée';
  price: string;
  priceNote: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  surface: number; // m² habitables
  outdoorSurface: string; // m² extérieurs
  image: string;
  tagline: string;
  description: string;
  features: string[];
}

export const FEATURED_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    title: "Villa Élysée — Jardins Suspendus",
    category: "Villa",
    categoryLabel: "Villa Contemporaine",
    badge: "Mandat Exclusif",
    price: "485 000 000 FCFA",
    priceNote: "Prix de présentation",
    location: "Cocody Ambassades",
    bedrooms: 5,
    bathrooms: 5,
    surface: 580,
    outdoorSurface: "Parc 1 200 m²",
    image: "/properties/prop-elysee.webp",
    tagline: "Façade minérale en pierre naturelle, menuiseries laiton et baies vitrées toute hauteur.",
    description: "Conçue par un cabinet d'architectes renommé, cette villa conjugue épure minérale et végétation luxuriante. Salon cathédrale de 110 m², finitions en chêne clair et laiton brossé, sécurité périmétrique certifiée.",
    features: ["Piscine miroir chauffée", "Salon cathédrale 110 m²", "Suite parentale 75 m²", "Domotique intégrale Lutron"]
  },
  {
    id: "prop-2",
    title: "Le Belvédère — Duplex Cathédrale",
    category: "Penthouse",
    categoryLabel: "Penthouse & Duplex",
    badge: "Signature Privée",
    price: "320 000 000 FCFA",
    priceNote: "Prix de présentation",
    location: "Plateau Marina",
    bedrooms: 4,
    bathrooms: 4,
    surface: 360,
    outdoorSurface: "Terrasse 90 m²",
    image: "/properties/prop-belvedere.webp",
    tagline: "Volumes vertigineux, claustra laiton et escalier suspendu en chêne massif.",
    description: "Une pièce d'orfèvrerie spatiale au sommet d'une résidence sécurisée. Double hauteur sous verrière, salon d'angle baigné de soleil, escalier graphique à marches flottantes et conciergerie privée 24/7.",
    features: ["Hauteur sous plafond 6m", "Escalier sculptural en chêne", "Ascenseur privatif à clé", "Conciergerie 24/7"]
  },
  {
    id: "prop-3",
    title: "Domaine Acacia — Suite Panoramique",
    category: "Domaine",
    categoryLabel: "Domaine d'Architecte",
    badge: "Mandat Exclusif",
    price: "650 000 000 FCFA",
    priceNote: "Prix de présentation",
    location: "Riviera Golf",
    bedrooms: 6,
    bathrooms: 6,
    surface: 720,
    outdoorSurface: "Parc 2 500 m²",
    image: "/properties/prop-acacia.webp",
    tagline: "Master suite d'exception, baignoire taillée dans la pierre et terrasse solarium.",
    description: "Un havre de discrétion absolue implanté dans un parc arboré classé. Aile parentale avec dressing sur mesure, baignoire monolithique taillée dans la roche et vue imprenable sur la pinède environnante.",
    features: ["Parc privé 2 500 m²", "Espace spa & bain minéral", "Pavillon pour invités", "Poste de sécurité dédié"]
  },
  {
    id: "prop-4",
    title: "Villa Lumina — Piscine Miroir & Sunset",
    category: "Villa",
    categoryLabel: "Villa de Maître",
    badge: "Nouvelle Collection",
    price: "390 000 000 FCFA",
    priceNote: "Prix de présentation",
    location: "Zone 4 Résidentielle",
    bedrooms: 4,
    bathrooms: 4,
    surface: 440,
    outdoorSurface: "Deck 180 m²",
    image: "/properties/prop-lumina.webp",
    tagline: "Piscine à débordement crépusculaire, salon d'été encastré et vue dégagée.",
    description: "L'art de recevoir à l'extérieur. Bassin miroir turquoise de 18 mètres, salon lounge encastré au niveau de l'eau, éclairage scénographique nocturne et cuisine d'été professionnelle intégrée.",
    features: ["Bassin de nage 18m", "Salon d'été immergé", "Cuisine extérieure en pierre", "Exposition sud-ouest pure"]
  },
  {
    id: "prop-5",
    title: "Penthouse Sky Garden — Vue Lagune",
    category: "Penthouse",
    categoryLabel: "Penthouse d'Exception",
    badge: "Nouvelle Collection",
    price: "420 000 000 FCFA",
    priceNote: "Prix de présentation",
    location: "Plateau Marina",
    bedrooms: 4,
    bathrooms: 4,
    surface: 410,
    outdoorSurface: "Rooftop 130 m²",
    image: "/properties/prop-sky-garden.webp",
    tagline: "Rooftop privatif suspendu au-dessus de la lagune, jacuzzi panoramique et finitions marbre.",
    description: "Dominant la baie avec une perspective à 270 degrés, ce penthouse déploie un salon d'angle spectaculaire ouvert sur un rooftop paysager doté d'un jacuzzi en marbre noir et cuisine d'extérieur.",
    features: ["Rooftop paysager 130 m²", "Jacuzzi à débordement", "Vue panoramique 270°", "Accès ascenseur privé à code"]
  },
  {
    id: "prop-6",
    title: "Domaine des Palmes — Havres & Sérénité",
    category: "Domaine",
    categoryLabel: "Domaine Sécurisé",
    badge: "Signature Privée",
    price: "720 000 000 FCFA",
    priceNote: "Prix de présentation",
    location: "Riviera 3",
    bedrooms: 7,
    bathrooms: 7,
    surface: 860,
    outdoorSurface: "Parc 3 500 m²",
    image: "/properties/prop-palmes.webp",
    tagline: "Propriété d'envergure nichée au cœur d'un parc tropical clôturé de 3 500 m².",
    description: "Une demeure de maître combinant architecture néo-coloniale et domotique contemporaine. Piscine semi-olympique, pavillon de service indépendant, héliport d'appoint et sécurité privée renforcée.",
    features: ["Parc tropical 3 500 m²", "Piscine 25 mètres", "Pavillon de garde & dépendances", "Générateur & forage dédiés"]
  }
];
