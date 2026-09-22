import { useState } from 'react';
import { Search, MapPin, Home, SlidersHorizontal, ArrowRight, Sparkles } from 'lucide-react';

export function QuickSearch() {
  const [propertyType, setPropertyType] = useState('tous');
  const [location, setLocation] = useState('tous');
  const [budget, setBudget] = useState('tous');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const el = document.getElementById('biens');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const quickFilter = (type: string) => {
    setPropertyType(type);
    const el = document.getElementById('biens');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="recherche" className="relative z-20 py-20 md:py-32 px-6 md:px-12 max-w-6xl mx-auto">
      {/* Lueur d'ambiance en arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#C9A15B]/[0.035] rounded-full blur-[140px] pointer-events-none" />

      {/* En-tête de recherche spacieux et élégant */}
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C9A15B]/25 bg-[#161512] mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A15B]" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A15B] font-semibold font-sans">
            Sourcing d'Exception
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-[#F4EFE6] font-medium leading-tight mb-3">
          Trouvez votre <span className="text-[#C9A15B]">prochaine adresse.</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#D9CBB0]/75 font-light leading-relaxed max-w-md mx-auto">
          Filtrez par typologie, secteur confidentiel et budget pour explorer notre collection active et off-market.
        </p>
      </div>

      {/* Carte de recherche principale large et bien aérée */}
      <div className="relative z-10 rounded-3xl bg-[#141310]/95 backdrop-blur-2xl border border-[#C9A15B]/30 p-6 sm:p-8 lg:p-10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] hover:border-[#C9A15B]/50 transition-all duration-300">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5 items-end"
        >
          {/* 1. Type de bien */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-wider text-[#D9CBB0]/80 font-sans flex items-center gap-1.5 font-medium">
              <Home className="w-3.5 h-3.5 text-[#C9A15B]" />
              <span>Type de propriété</span>
            </label>
            <div className="relative">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full h-14 px-4.5 rounded-2xl bg-[#1A1813] border border-[#F4EFE6]/10 text-sm text-[#F4EFE6] focus:outline-none focus:border-[#C9A15B] cursor-pointer font-medium transition-all shadow-inner"
              >
                <option value="tous" className="bg-[#161512] text-[#F4EFE6]">Toutes les typologies</option>
                <option value="villa" className="bg-[#161512] text-[#F4EFE6]">Villa d'Architecte</option>
                <option value="penthouse" className="bg-[#161512] text-[#F4EFE6]">Penthouse & Rooftop</option>
                <option value="manoir" className="bg-[#161512] text-[#F4EFE6]">Manoir & Domaine Privé</option>
                <option value="duplex" className="bg-[#161512] text-[#F4EFE6]">Duplex Contemporain</option>
              </select>
            </div>
          </div>

          {/* 2. Quartier */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-wider text-[#D9CBB0]/80 font-sans flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#C9A15B]" />
              <span>Secteur prisé</span>
            </label>
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-14 px-4.5 rounded-2xl bg-[#1A1813] border border-[#F4EFE6]/10 text-sm text-[#F4EFE6] focus:outline-none focus:border-[#C9A15B] cursor-pointer font-medium transition-all shadow-inner"
              >
                <option value="tous" className="bg-[#161512] text-[#F4EFE6]">Tous les secteurs</option>
                <option value="cocody" className="bg-[#161512] text-[#F4EFE6]">Cocody Ambassades</option>
                <option value="plateau" className="bg-[#161512] text-[#F4EFE6]">Plateau Marina</option>
                <option value="riviera" className="bg-[#161512] text-[#F4EFE6]">Riviera Golf</option>
                <option value="assinie" className="bg-[#161512] text-[#F4EFE6]">Assinie Bord de Mer</option>
                <option value="zone4" className="bg-[#161512] text-[#F4EFE6]">Zone 4 Résidentielle</option>
              </select>
            </div>
          </div>

          {/* 3. Budget */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-wider text-[#D9CBB0]/80 font-sans flex items-center gap-1.5 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9A15B]" />
              <span>Budget indicatif</span>
            </label>
            <div className="relative">
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full h-14 px-4.5 rounded-2xl bg-[#1A1813] border border-[#F4EFE6]/10 text-sm text-[#F4EFE6] focus:outline-none focus:border-[#C9A15B] cursor-pointer font-medium transition-all shadow-inner"
              >
                <option value="tous" className="bg-[#161512] text-[#F4EFE6]">Tous budgets</option>
                <option value="200-350" className="bg-[#161512] text-[#F4EFE6]">200M – 350M FCFA</option>
                <option value="350-600" className="bg-[#161512] text-[#F4EFE6]">350M – 600M FCFA</option>
                <option value="600+" className="bg-[#161512] text-[#F4EFE6]">600M FCFA et plus</option>
              </select>
            </div>
          </div>

          {/* 4. Bouton recherche */}
          <div className="w-full">
            <button
              type="submit"
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#C9A15B] to-[#D8B36F] text-[#0F0E0C] font-semibold text-sm tracking-wider flex items-center justify-center gap-2.5 transition-all hover:brightness-105 active:scale-[0.98] shadow-lg hover:shadow-[#C9A15B]/30 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Explorer les biens</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Suggestions rapides sous le formulaire */}
        <div className="mt-6 pt-5 border-t border-[#F4EFE6]/08 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-[#D9CBB0]/70 font-light">
            <span className="text-[11px] text-[#C9A15B] font-medium">Recherches fréquentes :</span>
            <button
              type="button"
              onClick={() => quickFilter('villa')}
              className="px-2.5 py-1 rounded-lg bg-[#1C1A15] hover:bg-[#C9A15B]/15 text-[#F4EFE6]/80 hover:text-[#C9A15B] border border-[#F4EFE6]/06 transition-colors cursor-pointer"
            >
              Villa avec piscine
            </button>
            <button
              type="button"
              onClick={() => quickFilter('penthouse')}
              className="px-2.5 py-1 rounded-lg bg-[#1C1A15] hover:bg-[#C9A15B]/15 text-[#F4EFE6]/80 hover:text-[#C9A15B] border border-[#F4EFE6]/06 transition-colors cursor-pointer"
            >
              Penthouse vue dégagée
            </button>
            <button
              type="button"
              onClick={() => quickFilter('manoir')}
              className="px-2.5 py-1 rounded-lg bg-[#1C1A15] hover:bg-[#C9A15B]/15 text-[#F4EFE6]/80 hover:text-[#C9A15B] border border-[#F4EFE6]/06 transition-colors cursor-pointer"
            >
              Domaine sécurisé
            </button>
          </div>
          <span className="text-[11px] text-[#C9A15B]/80 font-medium">
            Portefeuille 100% audité
          </span>
        </div>
      </div>
    </section>
  );
}
