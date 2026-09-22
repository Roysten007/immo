export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-1",
    category: "Sécurité Juridique",
    question: "Comment vérifiez-vous le titre foncier et la validité juridique d'un bien ?",
    answer: "Chaque bien sélectionné par MAISON KÈMI fait l'objet d'un audit juridique strict en amont de toute commercialisation : vérification du titre foncier au bureau de la conservation foncière, purge des hypothèques, certificat de conformité d'urbanisme et contrôle d'identité notarié. Nous ne présentons aucun bien sans dossier 100% clarifié."
  },
  {
    id: "faq-2",
    category: "Honoraires",
    question: "Quels sont vos frais d'agence et que comprennent-ils exactement ?",
    answer: "Nos honoraires s'élèvent à un barème transparent de 5% HT sur la transaction finale (mention exemple). Ils englobent l'accompagnement complet : visites privées illimitées, audit technique préalable, négociation stratégique, liaison directe avec l'étude notariale et conciergerie d'installation après signature."
  },
  {
    id: "faq-3",
    category: "Financement",
    question: "Accompagnez-vous les acquéreurs pour le montage de financement bancaire ?",
    answer: "Absolument. Nous travaillons en partenariat direct avec les pôles Banque Privée et Gestion de Patrimoine des plus grandes institutions financières locales et internationales, facilitant des conditions de crédit préférentielles et une instruction accélérée de votre dossier."
  },
  {
    id: "faq-4",
    category: "Processus & Délais",
    question: "Quel est le délai moyen entre le coup de cœur et la remise des clés ?",
    answer: "Grâce à notre pré-audit complet des titres de propriété, la signature de l'acte authentique et la remise des clés s'effectuent généralement sous 45 à 60 jours ouvrés avec votre notaire, contre souvent 4 à 6 mois sur le marché classique."
  },
  {
    id: "faq-5",
    category: "Visites Privées",
    question: "Comment se déroule la visite privée d'une villa ou d'un penthouse ?",
    answer: "Nos visites sont toujours individuelles, discrètes et orchestrées selon vos disponibilités (en journée ou en soirée pour apprécier les lumières). Un conseiller dédié vous accompagne avec le dossier architectural complet, sans pression commerciale."
  }
];
