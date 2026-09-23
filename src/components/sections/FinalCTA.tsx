import { Calendar, Phone, ArrowUpRight } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

export function FinalCTA() {
  return (
    <section
      id="contact-final"
      className="relative py-32 px-6 md:px-12 overflow-hidden bg-gradient-to-b from-[#0F0E0C] via-[#2A1713] to-[#0F0E0C] border-t border-[#F4EFE6]/08"
    >
      {/* Lueur subtile en arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(600px,100vw)] h-[min(600px,100vw)] max-w-full bg-[#B5654A]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <div className="w-14 h-14 rounded-full border border-[#C9A15B]/40 flex items-center justify-center mb-6 bg-[#181613] shadow-2xl">
          <span className="font-display font-semibold text-xl text-[#C9A15B]">K</span>
        </div>

        <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A15B] font-semibold font-sans mb-3">
          Votre Nouvelle Adresse
        </span>

        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#F4EFE6] font-medium leading-[1.1] tracking-tight mb-4">
          Cette visite peut être <br />
          <span className="text-[#C9A15B]">la vôtre dès cette semaine.</span>
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-[#D9CBB0]/80 font-light max-w-xl leading-relaxed mb-10">
          Résidence d'exception ou investissement patrimonial sécurisé : nos directeurs associés se tiennent à votre disposition pour une entrevue confidentielle.
        </p>

        {/* Boutons d'action majeurs */}
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto justify-center mb-12">
          {/* Bouton principal magnétique */}
          <a
            href="https://wa.me/22900000000?text=Bonjour%20Maison%20Kèmi,%20je%20souhaite%20planifier%20une%20visite%20privée%20pour%20l'une%20de%20vos%20propriétés."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-9 py-5 rounded-full bg-[#C9A15B] hover:bg-[#D8B36F] text-[#0F0E0C] text-sm font-semibold uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl hover:shadow-[#C9A15B]/30 hover:scale-105 active:scale-95 group"
          >
            <Calendar className="w-4 h-4" />
            <span>Réserver une visite privée</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Bouton WhatsApp direct */}
          <a
            href="https://wa.me/22900000000?text=Bonjour%20Maison%20Kèmi,%20j'aimerais%20échanger%20directement%20avec%20un%20conseiller%20dédié."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-5 rounded-full border border-[#25D366]/50 hover:border-[#25D366] bg-[#161512]/90 hover:bg-[#25D366]/15 text-sm font-semibold text-[#F4EFE6] uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105"
          >
            <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
            <span>WhatsApp Direct</span>
          </a>
        </div>

        {/* Coordonnées rapides */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#D9CBB0]/70 font-sans border-t border-[#F4EFE6]/08 pt-8 w-full">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#C9A15B]" />
            <span>Ligne Directe : +229 01 00 00 00</span>
          </div>
          <span>•</span>
          <div>Agence Principale : Boulevard de la Marina, Cotonou</div>
          <span>•</span>
          <div>Discrétion notariée assurée</div>
        </div>
      </div>
    </section>
  );
}
