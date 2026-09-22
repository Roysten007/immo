import { ShieldCheck, UserCheck, Scale, CheckCircle } from 'lucide-react';

export function WhyUs() {
  const guarantees = [
    {
      icon: ShieldCheck,
      badge: "Garantie Juridique",
      titleRegular: "Titres & Documents ",
      titleItalic: "Vérifiés",
      description:
        "Triple audit foncier systématique : cadastre certifié, absence totale d'hypothèque et conformité d'urbanisme.",
      points: [
        "Audit notarié systématique",
        "Purge intégrale des hypothèques",
        "Conformité urbaine certifiée"
      ]
    },
    {
      icon: UserCheck,
      badge: "Garantie Immersion",
      titleRegular: "Visites Privées ",
      titleItalic: "7j/7",
      description:
        "Parcours privatisé à votre rythme avec un directeur associé maîtrisant chaque détail du bien.",
      points: [
        "Créneaux flexibles sur-mesure",
        "Dossier technique complet remis",
        "Confidentialité absolue"
      ]
    },
    {
      icon: Scale,
      badge: "Garantie Valeur",
      titleRegular: "Négociation & ",
      titleItalic: "Juste Prix",
      description:
        "Analyse comparative pointue du secteur pour défendre vos intérêts financiers avec rigueur.",
      points: [
        "Évaluation multi-critères",
        "Défense stricte de vos intérêts",
        "Positionnement vérifié"
      ]
    }
  ];

  return (
    <section id="garanties" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A15B]/30 bg-[#161512] mb-3">
          <CheckCircle className="w-3.5 h-3.5 text-[#C9A15B]" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A15B] font-semibold font-sans">
            Sécurité & Sérénité
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F4EFE6] font-medium leading-tight mb-4">
          Trois garanties formelles <br />
          <span className="text-[#C9A15B]">pour votre acquisition.</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#D9CBB0]/75 font-light leading-relaxed">
          Un protocole rigoureux pour préserver vos intérêts et la valeur pérenne de votre patrimoine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {guarantees.map((item, idx) => {
          const Icon = item.icon;

          return (
            <div
              key={idx}
              className="glass-panel p-7 md:p-8 rounded-2xl border border-[#F4EFE6]/08 hover:border-[#C9A15B]/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-xl hover:shadow-[#C9A15B]/05"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#C9A15B]/10 border border-[#C9A15B]/30 flex items-center justify-center text-[#C9A15B] mb-5 group-hover:bg-[#C9A15B] group-hover:text-[#0F0E0C] transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>

                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A15B] font-semibold mb-2 block">
                  {item.badge}
                </span>

                <h3 className="font-display text-xl sm:text-2xl text-[#F4EFE6] font-medium mb-3">
                  <span>{item.titleRegular}</span>
                  <span className="text-[#C9A15B]">{item.titleItalic}</span>
                </h3>

                <p className="text-xs sm:text-sm text-[#D9CBB0]/75 font-light leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 border-t border-[#F4EFE6]/06 space-y-2.5">
                {item.points.map((pt, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#F4EFE6]/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A15B]" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
