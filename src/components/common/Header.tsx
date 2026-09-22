import { useState, useEffect } from 'react';
import { PhoneCall, Compass, Menu, X } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'bg-[#0F0E0C]/85 backdrop-blur-md border-b border-[#F4EFE6]/08 py-3.5 shadow-2xl'
          : 'bg-gradient-to-b from-[#0F0E0C]/90 via-[#0F0E0C]/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-3 group focus:outline-none"
          aria-label="Accueil Maison Kèmi Immobilier"
        >
          <div className="w-8 h-8 rounded-full border border-[#C9A15B]/50 flex items-center justify-center bg-[#181613] group-hover:border-[#C9A15B] transition-colors shadow-sm">
            <span className="font-display font-semibold text-sm text-[#C9A15B]">K</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display tracking-[0.2em] text-sm font-semibold text-[#F4EFE6] uppercase">
              Maison Kèmi
            </span>
            <span className="text-[9px] tracking-[0.25em] text-[#C9A15B] uppercase font-sans font-medium">
              Immobilier de Prestige
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-[11px] tracking-[0.16em] uppercase font-medium text-[#D9CBB0]">
          <button
            onClick={() => scrollToSection('visite')}
            className="hover:text-[#C9A15B] transition-colors focus:outline-none flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#C9A15B]" />
            La Visite
          </button>
          <button
            onClick={() => scrollToSection('biens')}
            className="hover:text-[#C9A15B] transition-colors focus:outline-none"
          >
            Collection
          </button>
          <button
            onClick={() => scrollToSection('processus')}
            className="hover:text-[#C9A15B] transition-colors focus:outline-none"
          >
            Méthodologie
          </button>
          <button
            onClick={() => scrollToSection('garanties')}
            className="hover:text-[#C9A15B] transition-colors focus:outline-none"
          >
            Engagements
          </button>
          <button
            onClick={() => scrollToSection('estimation')}
            className="hover:text-[#C9A15B] transition-colors focus:outline-none"
          >
            Estimation
          </button>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://wa.me/22900000000?text=Bonjour%20Maison%20Kèmi,%20je%20souhaite%20des%20renseignements%20sur%20vos%20villas%20de%20prestige."
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full border border-[#C9A15B]/30 hover:border-[#C9A15B] bg-[#161512]/60 hover:bg-[#C9A15B]/10 text-[11px] text-[#F4EFE6] font-medium tracking-wider flex items-center gap-1.5 transition-all"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={() => scrollToSection('contact-final')}
            className="px-4 py-1.5 rounded-full bg-[#C9A15B] hover:bg-[#D8B36F] text-[#0F0E0C] text-[11px] font-semibold tracking-wider flex items-center gap-1.5 transition-all shadow-md hover:shadow-[#C9A15B]/20 active:scale-[0.98]"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Réserver</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#F4EFE6] hover:text-[#C9A15B] transition-colors"
          aria-label="Ouvrir le menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-[#0F0E0C]/98 backdrop-blur-xl border-b border-[#F4EFE6]/10 px-6 py-8 shadow-2xl flex flex-col gap-6 text-sm uppercase tracking-widest text-[#F4EFE6]">
          <button
            onClick={() => scrollToSection('visite')}
            className="text-left py-2 hover:text-[#C9A15B] border-b border-[#F4EFE6]/05"
          >
            La Visite Séquentielle
          </button>
          <button
            onClick={() => scrollToSection('biens')}
            className="text-left py-2 hover:text-[#C9A15B] border-b border-[#F4EFE6]/05"
          >
            Nos Propriétés d'Exception
          </button>
          <button
            onClick={() => scrollToSection('processus')}
            className="text-left py-2 hover:text-[#C9A15B] border-b border-[#F4EFE6]/05"
          >
            Processus d'Acquisition
          </button>
          <button
            onClick={() => scrollToSection('garanties')}
            className="text-left py-2 hover:text-[#C9A15B] border-b border-[#F4EFE6]/05"
          >
            Nos 3 Garanties
          </button>
          <button
            onClick={() => scrollToSection('estimation')}
            className="text-left py-2 hover:text-[#C9A15B] border-b border-[#F4EFE6]/05"
          >
            Faire Estimer son Bien
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="text-left py-2 hover:text-[#C9A15B] border-b border-[#F4EFE6]/05"
          >
            Questions Fréquentes
          </button>

          <div className="pt-4 flex flex-col gap-3">
            <a
              href="https://wa.me/22900000000?text=Bonjour%20Maison%20Kèmi,%20je%20souhaite%20des%20renseignements%20sur%20vos%20villas%20de%20prestige."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 text-center text-xs font-semibold text-[#F4EFE6] flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span>Contacter sur WhatsApp</span>
            </a>
            <button
              onClick={() => scrollToSection('contact-final')}
              className="w-full py-3 rounded-full bg-[#C9A15B] text-[#0F0E0C] text-center text-xs font-semibold"
            >
              Réserver une Visite Privée
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
