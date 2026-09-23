import { useEffect, useRef, useState } from 'react';
import { Award, Building2, Clock, Users } from 'lucide-react';

interface Metric {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
  icon: typeof Award;
  isExample: boolean;
}

const METRICS: Metric[] = [
  {
    value: 100,
    suffix: "%",
    label: "Titres Fonciers Audités",
    sublabel: "Zéro contentieux juridique",
    icon: Award,
    isExample: true
  },
  {
    value: 45,
    suffix: " Jours",
    label: "Délai Moyen d'Acquisition",
    sublabel: "Du coup de cœur à la signature",
    icon: Clock,
    isExample: true
  },
  {
    value: 98,
    suffix: "%",
    label: "Satisfaction Acquéreurs",
    sublabel: "Clients accompagnés à vie",
    icon: Users,
    isExample: true
  },
  {
    value: 18,
    suffix: " Mrds",
    prefix: "+",
    label: "Volume de Biens Négociés",
    sublabel: "En FCFA sur l'année écoulée",
    icon: Building2,
    isExample: true
  }
];

export function KeyMetrics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<number[]>(METRICS.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Animation des compteurs
          METRICS.forEach((m, idx) => {
            const duration = 2000; // 2s
            const steps = 50;
            const stepValue = m.value / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += stepValue;
              if (current >= m.value) {
                current = m.value;
                clearInterval(timer);
              }
              setCounts((prev) => {
                const next = [...prev];
                next[idx] = Math.floor(current);
                return next;
              });
            }, duration / steps);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={containerRef}
      className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-y border-[#F4EFE6]/06"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
        {METRICS.map((item, idx) => {
          const Icon = item.icon;

          return (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-6 rounded-2xl glass-panel border border-[#F4EFE6]/04 hover:border-[#C9A15B]/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#C9A15B]/10 border border-[#C9A15B]/20 flex items-center justify-center text-[#C9A15B] mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex items-baseline gap-1 mb-2 font-display text-3xl sm:text-4xl text-[#F4EFE6] font-medium">
                {item.prefix && <span className="text-[#C9A15B]">{item.prefix}</span>}
                <span className="tabular-nums">{counts[idx]}</span>
                <span className="text-xl sm:text-2xl text-[#C9A15B]">{item.suffix}</span>
              </div>

              <h4 className="text-xs uppercase tracking-widest text-[#F4EFE6] font-medium mb-1">
                {item.label}
              </h4>

              <p className="text-[11px] text-[#D9CBB0]/60 font-light mb-3">
                {item.sublabel}
              </p>

              {item.isExample && (
                <span className="text-[9px] uppercase tracking-wider text-[#D9CBB0]/40 px-2 py-0.5 rounded bg-[#0F0E0C]/40 border border-[#F4EFE6]/05">
                  Donnée exemple
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
