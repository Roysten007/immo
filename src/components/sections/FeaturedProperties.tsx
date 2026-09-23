import { useState, useMemo } from 'react';
import { FEATURED_PROPERTIES, type Property } from '../../data/properties';
import { BedDouble, Bath, Maximize2, MapPin, ArrowUpRight, X, Calendar, CheckCircle2, Trees, Sparkles } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

type FilterCategory = 'all' | 'Villa' | 'Penthouse' | 'Domaine';

export function FeaturedProperties() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filteredProperties = useMemo(() => {
    if (activeFilter === 'all') return FEATURED_PROPERTIES;
    return FEATURED_PROPERTIES.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  const filterOptions: { id: FilterCategory; label: string; count: number }[] = [
    { id: 'all', label: 'Toutes les résidences', count: FEATURED_PROPERTIES.length },
    { id: 'Villa', label: 'Villas Contemporaines', count: FEATURED_PROPERTIES.filter(p => p.category === 'Villa').length },
    { id: 'Penthouse', label: 'Penthouses & Duplex', count: FEATURED_PROPERTIES.filter(p => p.category === 'Penthouse').length },
    { id: 'Domaine', label: 'Domaines d\'Architecte', count: FEATURED_PROPERTIES.filter(p => p.category === 'Domaine').length },
  ];

  return (
    <section id="biens" className="relative py-24 sm:py-32 px-6 md:px-12 max-w-7xl mx-auto">
      {/* En-tête de section soigné */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 lg:mb-16 gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-8 h-[1px] bg-[#C9A15B]" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A15B] font-medium font-sans">
              Portefeuille Privé & Mandats
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F4EFE6] font-medium leading-[1.15]">
            Résidences d'architecte <br />
            <span className="serif-italic-brass">sélectionnées avec rigueur.</span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#D9CBB0]/75 max-w-md font-light leading-relaxed">
          Audit structurel, foncier et architectural systématique. Seules les adresses d'exception au caractère unique intègrent notre collection.
        </p>
      </div>

      {/* Filtres de catégorie discrets & élégants */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-10 scrollbar-none">
        {filterOptions.map((opt) => {
          const isActive = activeFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setActiveFilter(opt.id)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs tracking-wider transition-all duration-300 shrink-0 font-medium ${
                isActive
                  ? 'bg-[#C9A15B] text-[#0F0E0C] shadow-lg shadow-[#C9A15B]/15'
                  : 'bg-[#161512] text-[#D9CBB0]/80 hover:text-[#F4EFE6] border border-[#F4EFE6]/08 hover:border-[#C9A15B]/30'
              }`}
            >
              <span>{opt.label}</span>
              <span className={`ml-2 text-[10px] ${isActive ? 'text-[#0F0E0C]/70' : 'text-[#C9A15B]'}`}>
                ({opt.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Grille des biens compacte, équilibrée en 3 colonnes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
        {filteredProperties.map((prop) => (
          <article
            key={prop.id}
            className="group relative rounded-2xl overflow-hidden bg-[#141310]/95 border border-[#F4EFE6]/08 hover:border-[#C9A15B]/50 transition-all duration-400 flex flex-col hover:-translate-y-1.5 hover:shadow-[0_20px_45px_-12px_rgba(201,161,91,0.18)]"
          >
            {/* Image aux proportions élégantes et compactes */}
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#1A1916]">
              <img
                src={prop.image}
                alt={prop.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              {/* Dégradé léger en bas d'image */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#141310] via-transparent to-transparent opacity-60" />

              {/* Badges discrets et lisibles */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-[#0F0E0C]/85 backdrop-blur-md border border-[#C9A15B]/35 text-[#C9A15B]">
                  {prop.badge}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] tracking-wider uppercase bg-[#0F0E0C]/70 backdrop-blur-md border border-[#F4EFE6]/10 text-[#D9CBB0]">
                  {prop.categoryLabel}
                </span>
              </div>
            </div>

            {/* Contenu textuel soigné et compact */}
            <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
              <div>
                {/* Localisation & Extérieur */}
                <div className="flex items-center justify-between text-[10px] text-[#C9A15B] tracking-wider uppercase mb-2 font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{prop.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#D9CBB0]/70 font-mono text-[10px]">
                    <Trees className="w-3 h-3 text-[#C9A15B]" />
                    <span>{prop.outdoorSurface}</span>
                  </div>
                </div>

                {/* Titre de la résidence */}
                <h3 className="font-display text-lg sm:text-xl text-[#F4EFE6] font-medium mb-2 group-hover:text-[#C9A15B] transition-colors duration-300 line-clamp-1">
                  {prop.title}
                </h3>

                {/* Phrase d'accroche architecturale */}
                <p className="text-xs text-[#D9CBB0]/75 font-light leading-relaxed mb-4 line-clamp-2">
                  {prop.tagline}
                </p>

                {/* Spécifications architecturales épurées et compactes */}
                <div className="grid grid-cols-3 gap-1.5 py-2.5 px-3 rounded-xl bg-[#1A1815]/70 border border-[#F4EFE6]/05 text-[11px] text-[#D9CBB0]">
                  <div className="flex items-center gap-1.5">
                    <BedDouble className="w-3 h-3 text-[#C9A15B] shrink-0" />
                    <span className="truncate">{prop.bedrooms} ch.</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-x border-[#F4EFE6]/06 px-1.5 justify-center">
                    <Bath className="w-3 h-3 text-[#C9A15B] shrink-0" />
                    <span className="truncate">{prop.bathrooms} sdb</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Maximize2 className="w-3 h-3 text-[#C9A15B] shrink-0" />
                    <span className="truncate">{prop.surface} m²</span>
                  </div>
                </div>
              </div>

              {/* Prix & Bouton de consultation */}
              <div className="pt-4 mt-4 border-t border-[#F4EFE6]/08 flex items-end justify-between gap-3">
                <div>
                  <span className="text-[9px] text-[#D9CBB0]/60 block uppercase tracking-wider mb-0.5">
                    {prop.priceNote}
                  </span>
                  <span className="font-display text-lg sm:text-xl text-[#F4EFE6] font-semibold tracking-tight">
                    {prop.price}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedProperty(prop)}
                  className="px-3.5 py-2 rounded-full bg-[#1F1D19] group-hover:bg-[#C9A15B] text-[#F4EFE6] group-hover:text-[#0F0E0C] text-[11px] font-medium tracking-wider flex items-center gap-1.5 border border-[#C9A15B]/30 group-hover:border-[#C9A15B] transition-all duration-300 shadow-sm cursor-pointer"
                  aria-label={`Découvrir la fiche complète de ${prop.title}`}
                >
                  <span>Dossier</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal de détail du bien (Présentation de prestige) */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 bg-[#0F0E0C]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
          <div className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-[#141310] border border-[#C9A15B]/40 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl">
            {/* Bouton fermeture */}
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#1A1916] text-[#F4EFE6]/70 hover:text-[#C9A15B] hover:bg-[#25231F] transition-colors"
              aria-label="Fermer le dossier"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Visuel d'en-tête */}
            <div className="rounded-xl overflow-hidden mb-6 aspect-[16/9] relative bg-[#1A1916]">
              <img
                src={selectedProperty.image}
                alt={selectedProperty.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#C9A15B] text-[#0F0E0C]">
                  {selectedProperty.badge}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase bg-[#0F0E0C]/80 backdrop-blur-md text-[#F4EFE6] border border-[#F4EFE6]/10">
                  {selectedProperty.categoryLabel}
                </span>
              </div>
            </div>

            {/* Localisation & Titre */}
            <div className="flex items-center gap-2 text-xs text-[#C9A15B] uppercase tracking-widest mb-2 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedProperty.location}</span>
              <span className="text-[#D9CBB0]/30">•</span>
              <span>{selectedProperty.outdoorSurface}</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl text-[#F4EFE6] font-medium mb-3">
              {selectedProperty.title}
            </h3>

            {/* Prix */}
            <div className="flex items-baseline gap-3 mb-6 pb-4 border-b border-[#F4EFE6]/08">
              <span className="font-display text-2xl sm:text-3xl text-[#C9A15B] font-semibold">
                {selectedProperty.price}
              </span>
              <span className="text-xs text-[#D9CBB0]/60 uppercase tracking-wider">
                ({selectedProperty.priceNote})
              </span>
            </div>

            {/* Descriptif d'architecte */}
            <p className="text-xs sm:text-sm text-[#D9CBB0] font-light leading-relaxed mb-6">
              {selectedProperty.description}
            </p>

            {/* Grille des caractéristiques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#1A1815] border border-[#F4EFE6]/06 mb-6 text-xs text-[#D9CBB0]">
              <div className="flex sm:flex-col justify-between sm:justify-start">
                <span className="text-[10px] text-[#D9CBB0]/60 uppercase tracking-wider block">Chambres</span>
                <span className="text-sm font-medium text-[#F4EFE6]">{selectedProperty.bedrooms} suites privatives</span>
              </div>
              <div className="border-t sm:border-t-0 sm:border-x border-[#F4EFE6]/08 pt-2 sm:pt-0 sm:px-3 flex sm:flex-col justify-between sm:justify-start">
                <span className="text-[10px] text-[#D9CBB0]/60 uppercase tracking-wider block">Salles de bain</span>
                <span className="text-sm font-medium text-[#F4EFE6]">{selectedProperty.bathrooms} en suite</span>
              </div>
              <div className="border-t sm:border-t-0 border-[#F4EFE6]/08 pt-2 sm:pt-0 sm:text-right flex sm:flex-col justify-between sm:justify-start sm:items-end">
                <span className="text-[10px] text-[#D9CBB0]/60 uppercase tracking-wider block">Surface habitable</span>
                <span className="text-sm font-medium text-[#F4EFE6]">{selectedProperty.surface} m²</span>
              </div>
            </div>

            {/* Prestations exclusives */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest text-[#C9A15B] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <h4>Prestations & Signatures</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedProperty.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-[#F4EFE6]/90 p-2.5 rounded-lg bg-[#1A1815]/60 border border-[#F4EFE6]/05">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A15B] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions de prise de contact / Visite */}
            <div className="pt-6 border-t border-[#F4EFE6]/10 flex flex-col sm:flex-row items-center gap-3.5">
              <button
                onClick={() => {
                  setSelectedProperty(null);
                  const el = document.getElementById('contact-final');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#C9A15B] hover:bg-[#D8B36F] text-[#0F0E0C] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02]"
              >
                <Calendar className="w-4 h-4" />
                <span>Demander une visite privée</span>
              </button>

              <a
                href={`https://wa.me/22900000000?text=Bonjour,%20je%20souhaite%20recevoir%20le%20dossier%20confidentiel%20de%20la%20propriété%20:%20${encodeURIComponent(selectedProperty.title)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 rounded-full border border-[#25D366]/40 hover:border-[#25D366] bg-[#25D366]/10 text-xs font-semibold text-[#F4EFE6] uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span>Dossier WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
