import { ShieldCheck, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0A0908] text-[#F4EFE6] border-t border-[#F4EFE6]/08 pt-20 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        {/* Identité de marque */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full border border-[#C9A15B]/50 flex items-center justify-center bg-[#181613]">
              <span className="font-display font-semibold text-base text-[#C9A15B]">K</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display tracking-[0.2em] text-base font-semibold text-[#F4EFE6] uppercase">
                Maison Kèmi
              </span>
              <span className="text-[9px] tracking-[0.3em] text-[#C9A15B] uppercase font-sans font-medium">
                Immobilier de Prestige
              </span>
            </div>
          </div>

          <p className="text-sm text-[#D9CBB0]/70 font-light leading-relaxed max-w-sm mb-6">
            L'adresse d'exception pour les acquéreurs et investisseurs recherchant la quintessence de l'architecture résidentielle et la sérénité juridique absolue.
          </p>

          <div className="flex items-center gap-2 text-xs text-[#C9A15B]">
            <ShieldCheck className="w-4 h-4" />
            <span>Titres fonciers rigoureusement vérifiés</span>
          </div>
        </div>

        {/* Navigation rapide */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#C9A15B] font-semibold mb-5">
            L'Expérience
          </h4>
          <ul className="space-y-3 text-sm text-[#D9CBB0]/80 font-light">
            <li>
              <a href="#visite" className="hover:text-[#C9A15B] transition-colors">
                La Visite Immersive (Canvas)
              </a>
            </li>
            <li>
              <a href="#biens" className="hover:text-[#C9A15B] transition-colors">
                Collection Privée de Villas
              </a>
            </li>
            <li>
              <a href="#processus" className="hover:text-[#C9A15B] transition-colors">
                Processus d'Acquisition
              </a>
            </li>
            <li>
              <a href="#garanties" className="hover:text-[#C9A15B] transition-colors">
                Nos 3 Garanties
              </a>
            </li>
            <li>
              <a href="#estimation" className="hover:text-[#C9A15B] transition-colors">
                Estimation Vendeur
              </a>
            </li>
          </ul>
        </div>

        {/* Quartiers */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#C9A15B] font-semibold mb-5">
            Territoires
          </h4>
          <ul className="space-y-3 text-sm text-[#D9CBB0]/80 font-light">
            <li>
              <span className="hover:text-[#C9A15B] transition-colors cursor-pointer">
                Cocody Ambassades
              </span>
            </li>
            <li>
              <span className="hover:text-[#C9A15B] transition-colors cursor-pointer">
                Plateau Marina
              </span>
            </li>
            <li>
              <span className="hover:text-[#C9A15B] transition-colors cursor-pointer">
                Riviera Golf
              </span>
            </li>
            <li>
              <span className="hover:text-[#C9A15B] transition-colors cursor-pointer">
                Zone 4 Résidentielle
              </span>
            </li>
            <li>
              <span className="hover:text-[#C9A15B] transition-colors cursor-pointer">
                Domaines Off-Market
              </span>
            </li>
          </ul>
        </div>

        {/* Contact direct */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#C9A15B] font-semibold mb-5">
            Bureaux Privés
          </h4>
          <ul className="space-y-3 text-sm text-[#D9CBB0]/80 font-light">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C9A15B] shrink-0 mt-0.5" />
              <span>Boulevard de la Marina, Cotonou</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#C9A15B] shrink-0" />
              <span>+229 01 00 00 00</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#C9A15B] shrink-0" />
              <span>contact@maisonkemi.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Ligne basse de copyright & retour haut */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-[#F4EFE6]/06 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D9CBB0]/50 font-light">
        <div className="flex flex-wrap items-center gap-4">
          <span>© {new Date().getFullYear()} MAISON KÈMI IMMOBILIER. Tous droits réservés.</span>
          <span>•</span>
          <span className="text-[#C9A15B]/70">Démo de Portfolio pour Agences Immobilières</span>
        </div>

        <button
          onClick={scrollToTop}
          className="min-h-[44px] px-3 py-2 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A15B] hover:text-[#D8B36F] hover:bg-[#161512] rounded-lg transition-colors group cursor-pointer"
          aria-label="Remonter en haut de la page"
        >
          <span>Remonter en haut</span>
          <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
}
