import { useEffect, useRef, useState } from 'react';
import { Compass, Eye, ShieldCheck, Key, Check, Sparkles, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Step {
  number: string;
  phase: string;
  timeframe: string;
  title: string;
  titleAccent: string;
  description: string;
  badge: string;
  highlights: [string, string];
  icon: typeof Compass;
}

const STEPS: Step[] = [
  {
    number: "01",
    phase: "Cadrage Initial",
    timeframe: "Jours 1 — 3",
    title: "Cahier d'",
    titleAccent: "Exigences",
    description: "Comprendre vos critères stricts, vos impératifs de discrétion et activer immédiatement notre réseau confidentiel off-market avant toute recherche.",
    badge: "Accès Off-Market Privilégié",
    highlights: ["Sourcing 100% confidentiel", "Filtrage sans compromis"],
    icon: Compass
  },
  {
    number: "02",
    phase: "Expérience Privée",
    timeframe: "Semaine 1",
    title: "Immersion ",
    titleAccent: "Privée",
    description: "Visites individuelles à vos heures choisies pour apprécier volumes, matières et expositions lumineuses, avec remise d'un dossier architectural complet.",
    badge: "Visite Sur-Mesure Dédiée",
    highlights: ["Créneau privatisé exclusif", "Dossier technique complet"],
    icon: Eye
  },
  {
    number: "03",
    phase: "Sécurisation Foncier",
    timeframe: "Semaines 2 — 3",
    title: "Audit & ",
    titleAccent: "Sécurité",
    description: "Contrôle notarié approfondi du titre foncier, purge intégrale des hypothèques et négociation stratégique rigoureuse pour acheter au juste prix.",
    badge: "Titre 100% Vérifié & Garanti",
    highlights: ["Triple audit notarié", "Négociation patrimoniale"],
    icon: ShieldCheck
  },
  {
    number: "04",
    phase: "Consécration",
    timeframe: "Jour J & Post-Achat",
    title: "Signature & ",
    titleAccent: "Clés",
    description: "Signature de l'acte authentique et conciergerie dédiée pour une installation en toute sérénité, de la gestion des transferts jusqu'à l'accueil.",
    badge: "Remise Solennelle en Main Propre",
    highlights: ["Remise solennelle privée", "Conciergerie d'installation"],
    icon: Key
  }
];

export function HowToBuy() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Repères d'ancrage latéraux pour les courbes de connexion S-curve
  const anchor1Ref = useRef<HTMLDivElement>(null); // Carte 1 côté droit
  const anchor2Ref = useRef<HTMLDivElement>(null); // Carte 2 côté gauche
  const anchor3Ref = useRef<HTMLDivElement>(null); // Carte 3 côté droit
  const anchor4Ref = useRef<HTMLDivElement>(null); // Carte 4 côté gauche

  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [curves, setCurves] = useState<{ path1: string; path2: string; path3: string }>({
    path1: '',
    path2: '',
    path3: ''
  });

  // Calcul dynamique des 3 courbes en S reliant les cartes en quinconce alterné
  useEffect(() => {
    const updateCurves = () => {
      if (!containerRef.current) return;
      const cRect = containerRef.current.getBoundingClientRect();

      const getPoint = (el: HTMLElement | null) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.left - cRect.left + r.width / 2,
          y: r.top - cRect.top + r.height / 2
        };
      };

      const p1 = getPoint(anchor1Ref.current);
      const p2 = getPoint(anchor2Ref.current);
      const p3 = getPoint(anchor3Ref.current);
      const p4 = getPoint(anchor4Ref.current);

      if (p1 && p2 && p3 && p4) {
        // Courbe 1 : Carte 1 (gauche) -> Carte 2 (droite)
        const dx1 = p2.x - p1.x;
        const c1 = `M ${p1.x} ${p1.y} C ${p1.x + dx1 * 0.55} ${p1.y}, ${p2.x - dx1 * 0.55} ${p2.y}, ${p2.x} ${p2.y}`;

        // Courbe 2 : Carte 2 (droite) -> Carte 3 (gauche)
        const dx2 = p3.x - p2.x;
        const c2 = `M ${p2.x} ${p2.y} C ${p2.x + dx2 * 0.55} ${p2.y}, ${p3.x - dx2 * 0.55} ${p3.y}, ${p3.x} ${p3.y}`;

        // Courbe 3 : Carte 3 (gauche) -> Carte 4 (droite)
        const dx3 = p4.x - p3.x;
        const c3 = `M ${p3.x} ${p3.y} C ${p3.x + dx3 * 0.55} ${p3.y}, ${p4.x - dx3 * 0.55} ${p4.y}, ${p4.x} ${p4.y}`;

        setCurves({ path1: c1, path2: c2, path3: c3 });
      }
    };

    updateCurves();
    const t1 = setTimeout(updateCurves, 150);
    const t2 = setTimeout(updateCurves, 500);

    const resizeObserver = new ResizeObserver(() => updateCurves());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener('resize', updateCurves);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateCurves);
    };
  }, []);

  // Animation d'entrée progressive avec GSAP ScrollTrigger
  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = cardRefs.current.filter(Boolean);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 40
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="processus"
      ref={sectionRef}
      className="py-32 md:py-44 px-6 md:px-12 max-w-6xl mx-auto relative overflow-hidden scroll-mt-24"
    >
      {/* Lueur d'ambiance d'arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,100vw)] h-[550px] max-w-full bg-[#C9A15B]/[0.03] rounded-full blur-[160px] pointer-events-none" />

      {/* En-tête de section centré et aéré */}
      <div className="text-center max-w-2xl mx-auto mb-20 md:mb-28 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C9A15B]/25 bg-[#161512] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A15B]" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A15B] font-semibold font-sans">
            Protocole d'Acquisition
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F4EFE6] font-medium leading-tight mb-4">
          De la recherche <br />
          <span className="text-[#C9A15B]">aux clés en 4 temps.</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#D9CBB0]/75 font-light leading-relaxed max-w-lg mx-auto">
          Quatre blocs méthodiques, transparents et sécurisés pour vivre une acquisition d'exception, sans compromis ni friction.
        </p>
      </div>

      {/* Conteneur principal des 4 blocs spacieux en quinconce alterné */}
      <div ref={containerRef} className="relative z-10">
        {/* Calque SVG des 3 courbes sinueuses en pointillés dorés (affiché dès tablette / desktop) */}
        <svg
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter id="goldBeamGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="curveGoldBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9A15B" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#F4EFE6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#C9A15B" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {[curves.path1, curves.path2, curves.path3].map((pathD, i) =>
            pathD ? (
              <g key={i}>
                {/* Ligne directrice pointillée dorée */}
                <path
                  d={pathD}
                  stroke="rgba(201, 161, 91, 0.3)"
                  strokeWidth="1.75"
                  strokeDasharray="6 8"
                  fill="none"
                />
                {/* Faisceau d'énergie lumineux animé en continu le long du S-curve */}
                <path
                  d={pathD}
                  stroke="url(#curveGoldBeam)"
                  strokeWidth="2.5"
                  strokeDasharray="90 280"
                  className="animate-zigzag-beam"
                  fill="none"
                  filter="url(#goldBeamGlow)"
                />
              </g>
            ) : null
          )}
        </svg>

        {/* 
          Disposition en quinconce alterné fluide (comme la référence) :
          - Bloc 01 : Aligné à gauche (w-full md:w-[47%] mr-auto)
          - Bloc 02 : Aligné à droite (w-full md:w-[47%] ml-auto md:-mt-28 lg:-mt-36)
          - Bloc 03 : Aligné à gauche (w-full md:w-[47%] mr-auto md:-mt-28 lg:-mt-36)
          - Bloc 04 : Aligné à droite (w-full md:w-[47%] ml-auto md:-mt-28 lg:-mt-36)
        */}
        <div className="flex flex-col">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isHovered = activeStep === idx;
            const isLeft = idx % 2 === 0;

            // Décalage vertical en quinconce sur grand écran
            const positionClasses =
              idx === 0
                ? "md:w-[47%] md:mr-auto mt-0 mb-10 md:mb-0"
                : idx === 1
                ? "md:w-[47%] md:ml-auto md:-mt-28 lg:-mt-36 mb-10 md:mb-0"
                : idx === 2
                ? "md:w-[47%] md:mr-auto md:-mt-28 lg:-mt-36 mb-10 md:mb-0"
                : "md:w-[47%] md:ml-auto md:-mt-28 lg:-mt-36 mb-0";

            return (
              <div
                key={idx}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                onMouseEnter={() => setActiveStep(idx)}
                onMouseLeave={() => setActiveStep(null)}
                className={`relative rounded-3xl bg-[#141310]/95 backdrop-blur-2xl border transition-all duration-500 p-8 sm:p-10 cursor-pointer ${positionClasses} ${
                  isHovered
                    ? "border-[#C9A15B]/60 shadow-[0_30px_70px_-15px_rgba(201,161,91,0.22)] -translate-y-1.5"
                    : "border-[#F4EFE6]/10 hover:border-[#C9A15B]/40 shadow-2xl"
                }`}
              >
                {/* 
                  Pastille / Bille flottante en haut de chaque carte 
                  (Inspirée de la référence visuelle, transposée en finition laiton/or haute joaillerie)
                */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-b from-[#C9A15B] to-[#7D5F28] p-[2px] shadow-[0_0_16px_rgba(201,161,91,0.6)] z-20">
                  <div className="w-full h-full rounded-full bg-[#1A1813] flex items-center justify-center">
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        isHovered ? "bg-[#FFF4D0] scale-125" : "bg-[#C9A15B] animate-pulse-beacon"
                      }`}
                    />
                  </div>
                </div>

                {/* Balise repère d'ancrage invisible pour le tracé SVG */}
                <div
                  ref={
                    idx === 0
                      ? anchor1Ref
                      : idx === 1
                      ? anchor2Ref
                      : idx === 2
                      ? anchor3Ref
                      : anchor4Ref
                  }
                  className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${
                    isLeft ? "-right-1.5" : "-left-1.5"
                  }`}
                />

                {/* Halo doré interne au survol */}
                <div
                  className={`absolute -inset-0.5 rounded-3xl bg-gradient-to-b from-[#C9A15B]/20 via-[#C9A15B]/05 to-transparent blur-md transition-opacity duration-500 pointer-events-none ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Numéro géant au tracé épuré (haut gauche) & Badge de phase */}
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div>
                    <span className="font-display text-5xl sm:text-6xl font-light text-[#C9A15B] block leading-none mb-2 tracking-tight">
                      {step.number}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#D9CBB0]/60 font-semibold font-sans">
                      {step.phase}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#1C1A15] border border-[#C9A15B]/30 flex items-center justify-center text-[#C9A15B] group-hover:bg-[#C9A15B] group-hover:text-[#0F0E0C] transition-all duration-400 shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] text-[#D9CBB0]/60 font-light">
                      {step.timeframe}
                    </span>
                  </div>
                </div>

                {/* Titre du bloc */}
                <div className="relative z-10 mb-4">
                  <h3 className="font-display text-2xl sm:text-3xl text-[#F4EFE6] font-medium leading-tight">
                    <span>{step.title}</span>
                    <span className="text-[#C9A15B]">{step.titleAccent}</span>
                  </h3>
                </div>

                {/* Description généreuse et aérée */}
                <div className="relative z-10 mb-7">
                  <p className="text-sm sm:text-[15px] text-[#D9CBB0]/80 font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Deux points d'engagement clés */}
                <div className="relative z-10 space-y-2 pt-5 border-t border-[#F4EFE6]/08 mb-6">
                  {step.highlights.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#F4EFE6]/90 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A15B] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Bas de carte : Badge de garantie certifiée */}
                <div className="relative z-10 pt-4 border-t border-[#F4EFE6]/08 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-[#F4EFE6]/90">
                    <span className="w-4 h-4 rounded-full bg-[#C9A15B]/20 text-[#C9A15B] flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span>{step.badge}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#C9A15B]/40 group-hover:text-[#C9A15B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
