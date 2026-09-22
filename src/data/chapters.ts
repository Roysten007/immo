export interface Chapter {
  id: number;
  number: string;
  room: string;
  titleRegular: string;
  titleItalic: string;
  titleSuffix?: string;
  subtitle?: string;
  progressStart: number;
  progressEnd: number;
  cta?: {
    primaryText: string;
    whatsappText: string;
  };
}

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    number: "01 / 09",
    room: "L'Arrivée chez vous",
    titleRegular: "Imaginez avoir ",
    titleItalic: "votre maison d'exception.",
    subtitle: "Franchir cette double porte chaque soir, laisser le bruit derrière vous et retrouver la quiétude absolue de votre domaine.",
    progressStart: 0 / 9,
    progressEnd: 1 / 9
  },
  {
    id: 2,
    number: "02 / 09",
    room: "Le Seuil franchi",
    titleRegular: "Poussez la porte, ",
    titleItalic: "respirez l'espace.",
    subtitle: "Une hauteur monumentale baignée de lumière naturelle. Le sentiment immédiat d'être enfin chez vous.",
    progressStart: 1 / 9,
    progressEnd: 2 / 9
  },
  {
    id: 3,
    number: "03 / 09",
    room: "Le Grand Salon",
    titleRegular: "Imaginez vos soirées ",
    titleItalic: "baignées de clarté.",
    subtitle: "Un salon spacieux et feutré aux matières nobles, pensé pour vous détendre et réunir ceux qui comptent.",
    progressStart: 2 / 9,
    progressEnd: 3 / 9
  },
  {
    id: 4,
    number: "04 / 09",
    room: "Cuisine & Espace Repas",
    titleRegular: "Votre café du matin ",
    titleItalic: "face au jardin.",
    subtitle: "Un îlot sculptural en marbre où cuisiner devient un plaisir quotidien, les yeux rivés sur l'eau et la nature.",
    progressStart: 3 / 9,
    progressEnd: 4 / 9
  },
  {
    id: 5,
    number: "05 / 09",
    room: "L'Aile Privée",
    titleRegular: "Montez les marches ",
    titleItalic: "vers votre suite.",
    subtitle: "L'escalier en chêne vous guide vers votre étage de repos. La journée s'efface, le silence s'installe.",
    progressStart: 4 / 9,
    progressEnd: 5 / 9
  },
  {
    id: 6,
    number: "06 / 09",
    room: "Le Spa Privatif",
    titleRegular: "Un bain chaud ",
    titleItalic: "face aux collines.",
    subtitle: "Une baignoire taillée dans la pierre naturelle face au paysage pour relâcher toute la fatigue de votre journée.",
    progressStart: 5 / 9,
    progressEnd: 6 / 9
  },
  {
    id: 7,
    number: "07 / 09",
    room: "La Galerie Nuit",
    titleRegular: "La douceur ",
    titleItalic: "du sur-mesure.",
    subtitle: "Des boiseries claires, des rangements invisibles et une intimité préservée pour votre sommeil.",
    progressStart: 6 / 9,
    progressEnd: 7 / 9
  },
  {
    id: 8,
    number: "08 / 09",
    room: "Le Belvédère",
    titleRegular: "Prenez de la hauteur ",
    titleItalic: "sur votre domaine.",
    subtitle: "Votre terrasse suspendue à l'étage pour contempler les collines d'oliviers et la lumière dorée du soir.",
    progressStart: 7 / 9,
    progressEnd: 8 / 9
  },
  {
    id: 9,
    number: "09 / 09",
    room: "Votre Havre de Vie",
    titleRegular: "Imaginez ce coucher de soleil ",
    titleItalic: "chez vous.",
    subtitle: "La piscine miroir illuminée, la douceur de la brise nocturne... Cette adresse d'exception peut être la vôtre.",
    progressStart: 8 / 9,
    progressEnd: 1.0,
    cta: {
      primaryText: "Demander une visite privée",
      whatsappText: "Échanger sur WhatsApp"
    }
  }
];
