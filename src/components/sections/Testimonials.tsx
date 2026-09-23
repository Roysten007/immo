import { useRef } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  propertyAcquired: string;
  year: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "La visite immersive en amont nous a permis de sélectionner notre villa avant même de rentrer d'expatriation. L'audit juridique du titre foncier par Maison Kèmi a été d'une rigueur absolue. Signature réalisée en 40 jours.",
    author: "Dr. Marc-Olivier & Sophie D.",
    title: "Chirurgien & Directrice Financière",
    propertyAcquired: "Villa contemporaine à Cocody Ambassades",
    year: "2025",
    rating: 5
  },
  {
    quote:
      "Trouver un penthouse avec rooftop privatif sans vice caché relevait du défi. L'équipe a négocié avec fermeté et élégance les dernières finitions auprès du promoteur. Un service digne des plus grands family offices.",
    author: "Alexandre V.",
    title: "Fondateur Groupe Tech & Investisseur",
    propertyAcquired: "Penthouse Marina au Plateau",
    year: "2025",
    rating: 5
  },
  {
    quote:
      "Ce qui frappe chez Maison Kèmi, c'est la discrétion et le respect du temps. Pas d'appels incessants, uniquement des propositions off-market calibrées au millimètre. Une expérience d'achat d'un calme souverain.",
    author: "Fatou B. K.",
    title: "Administratrice de Sociétés",
    propertyAcquired: "Domaine paysager Riviera Golf",
    year: "2024",
    rating: 5
  },
  {
    quote:
      "La recherche d'une propriété en bord de mer sécurisée nous semblait complexe. Maison Kèmi nous a ouvert les portes d'une villa d'architecte introuvable sur le marché public. Tout a été limpide du compromis aux clés.",
    author: "Jean-Philippe & Claire M.",
    title: "Directeur Général Régional & Avocate",
    propertyAcquired: "Villa d'Architecte à Assinie-Bia",
    year: "2025",
    rating: 5
  },
  {
    quote:
      "La vérification notariale approfondie du titre foncier et la purge intégrale des servitudes nous ont apporté une sérénité totale. Nous avons conclu deux acquisitions patrimoniales majeures les yeux fermés.",
    author: "Seydou & Aïcha D.",
    title: "Dirigeants de Family Office",
    propertyAcquired: "Propriété privée à Grand-Bassam",
    year: "2024",
    rating: 5
  },
  {
    quote:
      "Sens du détail rare, sélection architecturale irréprochable et maîtrise parfaite des volumes. Maison Kèmi comprend l'âme des lieux et respecte les exigences des collectionneurs d'art de vivre.",
    author: "Hélène T.",
    title: "Architecte d'Intérieur & Collectionneuse",
    propertyAcquired: "Résidence de Maître aux Deux Plateaux",
    year: "2025",
    rating: 5
  }
];

export function Testimonials() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Défilement manuel via les boutons de commande
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -460 : 460;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Duplication pour boucle infinie sans à-coup
  const duplicatedList = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section id="temoignages" className="py-28 md:py-36 relative overflow-hidden">
      {/* Lueur d'ambiance d'arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(900px,100vw)] h-[400px] max-w-full bg-[#C9A15B]/[0.025] rounded-full blur-[160px] pointer-events-none" />

      {/* En-tête de section avec commandes de carrousel */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-14 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A15B]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A15B] font-semibold font-sans">
                Retours d'Acquéreurs
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#F4EFE6] font-medium leading-tight">
              La confiance <br />
              <span className="text-[#C9A15B]">de nos résidents.</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-[#D9CBB0]/60 hidden sm:inline font-light">
              Survolez pour figer la lecture
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-11 h-11 rounded-full border border-[#F4EFE6]/15 bg-[#141310] hover:border-[#C9A15B] hover:text-[#C9A15B] text-[#F4EFE6] flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                aria-label="Avis précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-11 h-11 rounded-full border border-[#F4EFE6]/15 bg-[#141310] hover:border-[#C9A15B] hover:text-[#C9A15B] text-[#F4EFE6] flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                aria-label="Avis suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Carrousel défilant continu (Marquee dynamique) */}
      <div className="relative w-full overflow-hidden">
        {/* Masques de dégradé sur les bords pour transition en douceur */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-36 bg-gradient-to-r from-[#0F0E0C] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-36 bg-gradient-to-l from-[#0F0E0C] to-transparent z-10" />

        {/* Piste animée défilante infinie */}
        <div
          ref={scrollContainerRef}
          className="animate-marquee-scroll flex gap-6 px-6 cursor-grab active:cursor-grabbing"
        >
          {duplicatedList.map((item, idx) => (
            <div
              key={idx}
              className="w-[85vw] max-w-[340px] sm:max-w-[420px] md:max-w-[460px] shrink-0 rounded-3xl bg-[#141310]/95 backdrop-blur-2xl border border-[#F4EFE6]/10 hover:border-[#C9A15B]/50 p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-2xl hover:shadow-[0_20px_50px_-15px_rgba(201,161,91,0.18)] select-none"
            >
              <div>
                {/* Étoiles & Guimet */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C9A15B] text-[#C9A15B]" />
                    ))}
                  </div>
                  <Quote className="w-7 h-7 text-[#C9A15B]/25" />
                </div>

                {/* Citation */}
                <p className="text-xs sm:text-[13px] md:text-sm text-[#F4EFE6]/90 font-light leading-relaxed mb-6 italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Auteur & Détails d'acquisition */}
              <div className="pt-4 border-t border-[#F4EFE6]/08">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-sm sm:text-base text-[#F4EFE6] font-medium">
                    {item.author}
                  </span>
                  <span className="text-[11px] text-[#C9A15B] font-mono font-medium px-2 py-0.5 rounded bg-[#C9A15B]/10 border border-[#C9A15B]/20">
                    {item.year}
                  </span>
                </div>
                <p className="text-xs text-[#D9CBB0]/70 font-light mb-2">{item.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#C9A15B] font-medium truncate max-w-[280px]">
                    Acquisition : {item.propertyAcquired}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#C9A15B]/50 shrink-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
