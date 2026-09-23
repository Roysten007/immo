import { useState } from 'react';
import { FAQ_ITEMS } from '../../data/faq';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-28 px-6 md:px-12 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C9A15B]/30 bg-[#161512] mb-4">
          <HelpCircle className="w-4 h-4 text-[#C9A15B]" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A15B] font-semibold font-sans">
            Transparence Intégrale
          </span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#F4EFE6] font-medium leading-tight mb-3">
          Foire aux questions <br />
          <span className="text-[#C9A15B]">& cadre d'acquisition.</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#D9CBB0]/75 font-light leading-relaxed">
          Toutes les réponses juridiques, financières et procédurales pour sécuriser votre investissement.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={item.id}
              className={`rounded-2xl transition-all duration-300 overflow-hidden border ${
                isOpen
                  ? 'glass-panel-brass border-[#C9A15B]/40 shadow-xl'
                  : 'glass-panel border-[#F4EFE6]/06 hover:border-[#C9A15B]/20'
              }`}
            >
              <button
                onClick={() => toggleItem(idx)}
                className="w-full px-6 md:px-8 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#C9A15B] px-2.5 py-1 rounded bg-[#0F0E0C]/60 border border-[#C9A15B]/20 shrink-0 font-medium">
                    {item.category}
                  </span>
                  <span className="font-display text-base sm:text-lg text-[#F4EFE6] font-medium">
                    {item.question}
                  </span>
                </div>
                <div
                  className={`w-8 h-8 rounded-full border border-[#F4EFE6]/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-[#C9A15B] text-[#0F0E0C] border-[#C9A15B]' : 'text-[#D9CBB0]'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out px-6 md:px-8 ${
                  isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'
                } overflow-hidden`}
              >
                <p className="text-sm md:text-base text-[#D9CBB0]/90 font-light leading-relaxed border-t border-[#F4EFE6]/06 pt-4">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
