import { useState } from 'react';
import { MapPin, ArrowUpRight, Compass } from 'lucide-react';

interface Neighborhood {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  avgPrice: string;
  vibe: string;
  highlights: string[];
}

const NEIGHBORHOODS: Neighborhood[] = [
  {
    id: "cocody",
    name: "Cocody Ambassades",
    tagline: "Le prestige diplomatique & la canopée séculaire",
    description: "Allées verdoyantes hautement sécurisées, résidences d'ambassadeurs et vastes propriétés coloniales ou contemporaines d'exception.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    avgPrice: "1 250 000 FCFA/m²",
    vibe: "Calme, arboré, ultra-sécurisé",
    highlights: ["Sécurité 24/7", "Écoles internationales", "Canopée préservée"]
  },
  {
    id: "plateau",
    name: "Plateau Marina",
    tagline: "L'énergie cosmopolite face à la lagune",
    description: "Le quartier d'affaires et de vie nocturne chic. Penthouses aux vues vertigineuses sur la baie et accès piéton aux restaurants étoilés.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    avgPrice: "1 100 000 FCFA/m²",
    vibe: "Moderne, vibrant, panoramique",
    highlights: ["Vue panoramique", "Marina privée", "Vie culturelle"]
  },
  {
    id: "riviera",
    name: "Riviera Golf",
    tagline: "L'élégance sportive au bord du green",
    description: "Havre de paix pour les passionnés de golf et de nature. Domaines privés clôturés, architecture avant-gardiste et quiétude totale.",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    avgPrice: "980 000 FCFA/m²",
    vibe: "Verdoyant, exclusif, sportif",
    highlights: ["Parcours 18 trous", "Club-house", "Parcs paysagers"]
  },
  {
    id: "zone4",
    name: "Zone 4 Résidentielle",
    tagline: "L'art de vivre épicurien et balnéaire",
    description: "Quartier prisé des expatriés et esthètes. Gastronomie réputée, boutiques de créateurs et villas intimistes avec jardins luxuriants.",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
    avgPrice: "920 000 FCFA/m²",
    vibe: "Épicurien, chic, accessible",
    highlights: ["Haute gastronomie", "Proximité aéroport", "Ambiance conviviale"]
  }
];

export function Neighborhoods() {
  const [activeTab, setActiveTab] = useState(NEIGHBORHOODS[0].id);
  const activeNeighborhood = NEIGHBORHOODS.find((n) => n.id === activeTab) || NEIGHBORHOODS[0];

  return (
    <section className="py-28 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-6 h-[1px] bg-[#C9A15B]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A15B] font-medium font-sans">
              Territoires de Prestige
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F4EFE6] font-medium leading-tight">
            Les quartiers <br />
            <span className="text-[#C9A15B]">les plus prisés.</span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#D9CBB0]/75 max-w-md font-light leading-relaxed">
          L'emplacement définit la valeur intemporelle d'un bien. Découvrez les micro-secteurs d'exception.
        </p>
      </div>

      {/* Onglets de sélection */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {NEIGHBORHOODS.map((n) => (
          <button
            key={n.id}
            onClick={() => setActiveTab(n.id)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all shrink-0 ${
              activeTab === n.id
                ? 'bg-[#C9A15B] text-[#0F0E0C] shadow-lg shadow-[#C9A15B]/20 font-semibold'
                : 'bg-[#161512] text-[#D9CBB0]/70 border border-[#F4EFE6]/08 hover:text-[#F4EFE6] hover:border-[#C9A15B]/30'
            }`}
          >
            {n.name}
          </button>
        ))}
      </div>

      {/* Carte immersive du quartier actif */}
      <div className="rounded-3xl overflow-hidden glass-panel border border-[#C9A15B]/30 grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
        {/* Visuel */}
        <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[480px] overflow-hidden">
          <img
            src={activeNeighborhood.image}
            alt={activeNeighborhood.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E0C] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0F0E0C]" />

          <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F0E0C]/75 backdrop-blur-md border border-[#C9A15B]/30 text-xs text-[#C9A15B]">
            <Compass className="w-3.5 h-3.5" />
            <span>{activeNeighborhood.vibe}</span>
          </div>
        </div>

        {/* Contenu & Caractéristiques */}
        <div className="lg:col-span-5 p-7 md:p-10 flex flex-col justify-between bg-[#161512]">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-[#C9A15B] uppercase tracking-widest mb-2 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Secteur d'Élite</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl text-[#F4EFE6] font-medium mb-1">
              {activeNeighborhood.name}
            </h3>

            <p className="text-xs sm:text-sm text-[#C9A15B] mb-4">
              "{activeNeighborhood.tagline}"
            </p>

            <p className="text-xs sm:text-sm text-[#D9CBB0]/75 font-light leading-relaxed mb-6">
              {activeNeighborhood.description}
            </p>

            {/* Points forts */}
            <div className="space-y-3 mb-8">
              {activeNeighborhood.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-[#F4EFE6]/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A15B]" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prix indicatif & CTA */}
          <div className="pt-6 border-t border-[#F4EFE6]/08 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#D9CBB0]/60 uppercase tracking-wider block">
                Prix moyen indicatif
              </span>
              <span className="font-display text-xl text-[#C9A15B] font-medium">
                {activeNeighborhood.avgPrice}
              </span>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('biens');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-full border border-[#C9A15B]/40 hover:border-[#C9A15B] text-xs text-[#F4EFE6] font-medium flex items-center gap-1.5 transition-colors hover:bg-[#C9A15B]/10"
            >
              <span>Voir les biens</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C9A15B]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
