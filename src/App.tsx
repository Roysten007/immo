import { useLenis } from './hooks/useLenis';
import { CustomCursor } from './components/common/CustomCursor';
import { Header } from './components/common/Header';
import { ScrollSequence } from './components/visit/ScrollSequence';
import { QuickSearch } from './components/sections/QuickSearch';
import { FeaturedProperties } from './components/sections/FeaturedProperties';
import { Manifesto } from './components/sections/Manifesto';
import { HowToBuy } from './components/sections/HowToBuy';
import { WhyUs } from './components/sections/WhyUs';
import { KeyMetrics } from './components/sections/KeyMetrics';
import { Neighborhoods } from './components/sections/Neighborhoods';
import { Testimonials } from './components/sections/Testimonials';
import { FreeValuation } from './components/sections/FreeValuation';
import { FAQ } from './components/sections/FAQ';
import { FinalCTA } from './components/sections/FinalCTA';
import { Footer } from './components/sections/Footer';

export function App() {
  // Initialisation du smooth scroll Lenis connecté à GSAP ScrollTrigger
  useLenis();

  return (
    <div className="min-h-screen bg-[#0F0E0C] text-[#F4EFE6] relative selection:bg-[#C9A15B]/30 selection:text-[#F4EFE6] overflow-x-clip w-full">
      {/* Curseur personnalisé desktop */}
      <CustomCursor />

      {/* Header fixe avec auto-masquage au scroll */}
      <Header />

      {/* SÉQUENCE PRINCIPALE "LA VISITE" (Canvas plein écran sticky sur 900vh) */}
      <main>
        <ScrollSequence />

        {/* Barre de recherche rapide flottante */}
        <QuickSearch />

        {/* Biens d'exception à la une */}
        <FeaturedProperties />

        {/* Manifeste mot par mot */}
        <Manifesto />

        {/* Comment acheter avec nous (Scroll horizontal en 4 étapes) */}
        <HowToBuy />

        {/* Pourquoi nous : Les 3 garanties */}
        <WhyUs />

        {/* Chiffres clés animés */}
        <KeyMetrics />

        {/* Guide immersif des quartiers */}
        <Neighborhoods />

        {/* Témoignages d'acquéreurs */}
        <Testimonials />

        {/* Estimation gratuite pour propriétaires vendeurs */}
        <FreeValuation />

        {/* Foire aux questions */}
        <FAQ />

        {/* Section de clôture et CTA final */}
        <FinalCTA />
      </main>

      {/* Footer complet */}
      <Footer />
    </div>
  );
}

export default App;
