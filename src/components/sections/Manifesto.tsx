import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const words = [
    "Une", "demeure", "ne", "se", "mesure", "pas", "en", "mètres", "carrés.",
    "Elle", "est", "le", "sanctuaire", "de", "vos", "souvenirs,",
    "le", "refuge", "rare", "et", "le", "patrimoine",
    "précieux", "de", "toute", "une", "vie."
  ];

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const wordElements = textRef.current.querySelectorAll('.manifesto-word');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordElements,
        { opacity: 0.15, y: 4 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.04,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'bottom 45%',
            scrub: 0.5,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="manifesto"
      ref={containerRef}
      className="relative py-32 md:py-44 px-6 md:px-12 max-w-5xl mx-auto text-center flex flex-col items-center justify-center border-t border-b border-[#F4EFE6]/06"
    >
      <div className="flex items-center gap-3 mb-8">
        <span className="w-8 h-[1px] bg-[#C9A15B]" />
        <span className="text-xs uppercase tracking-[0.3em] text-[#C9A15B] font-medium font-sans">
          Notre Manifeste
        </span>
        <span className="w-8 h-[1px] bg-[#C9A15B]" />
      </div>

      <p
        ref={textRef}
        className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#F4EFE6] leading-[1.35] font-normal tracking-tight max-w-3xl"
      >
        {words.map((word, i) => {
          const isHighlight =
            word.includes("sanctuaire") ||
            word.includes("souvenirs") ||
            word.includes("refuge") ||
            word.includes("patrimoine") ||
            word.includes("précieux");

          return (
            <span
              key={i}
              className={`manifesto-word inline-block mr-[0.25em] transition-colors duration-200 ${
                isHighlight ? 'text-[#C9A15B] font-medium' : ''
              }`}
            >
              {word}
            </span>
          );
        })}
      </p>

      <div className="mt-12 flex flex-col items-center">
        <span className="text-xs uppercase tracking-[0.2em] text-[#D9CBB0]/60 font-sans">
          Maison Kèmi • Direction Artistique & Foncière
        </span>
      </div>
    </section>
  );
}
