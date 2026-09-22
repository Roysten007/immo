import { WhatsAppIcon } from './WhatsAppIcon';

export function WhatsAppFloating() {
  const whatsappUrl =
    "https://wa.me/22900000000?text=Bonjour%20Maison%20Kèmi,%20je%20souhaite%20des%20renseignements%20sur%20vos%20villas%20et%20appartements%20de%20prestige.";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip bulle élégante */}
      <div className="hidden md:flex mr-3 px-3.5 py-1.5 rounded-full bg-[#161512]/90 backdrop-blur-md border border-[#C9A15B]/30 text-xs text-[#F4EFE6] font-medium shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 pointer-events-none">
        <span className="text-[#C9A15B] mr-1">Direct :</span> Échangez avec un conseiller
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter Maison Kèmi Immobilier par WhatsApp"
        className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_4px_25px_rgba(37,211,102,0.45)] hover:scale-105 active:scale-95 transition-all duration-300"
      >
        {/* Pulse radar wave */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />

        <WhatsAppIcon className="w-7 h-7 text-white" />
      </a>
    </div>
  );
}
