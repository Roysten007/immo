import { useState } from 'react';
import { Send, CheckCircle2, Shield, Lock } from 'lucide-react';

export function FreeValuation() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    propertyType: 'villa',
    neighborhood: 'cocody',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  return (
    <section id="estimation" className="py-28 px-6 md:px-12 max-w-5xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden glass-panel-brass p-8 md:p-14 border border-[#C9A15B]/30 shadow-2xl">
        <div className="relative z-10 max-w-2xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C9A15B]/40 bg-[#161512] mb-4">
            <Shield className="w-4 h-4 text-[#C9A15B]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#C9A15B] font-semibold font-sans">
              Propriétaires & Vendeurs
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#F4EFE6] font-medium leading-tight mb-3">
            Confiez votre bien à <br />
            <span className="text-[#C9A15B]">l'excellence Maison Kèmi.</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#D9CBB0]/75 font-light leading-relaxed">
            Estimation confidentielle sous 48h et mise en relation directe avec notre réseau d'acquéreurs qualifiés.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-[#181613] border border-[#C9A15B]/40 text-center max-w-md mx-auto animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-[#C9A15B] mx-auto mb-4" />
            <h3 className="font-display text-xl text-[#F4EFE6] mb-2 font-medium">
              Demande reçue avec discrétion
            </h3>
            <p className="text-xs md:text-sm text-[#D9CBB0]/80 font-light mb-6 leading-relaxed">
              Merci M./Mme {formData.name}. Un directeur associé vous contactera personnellement sous 24 heures pour convenir d'une visite d'estimation.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-3 min-h-[44px] inline-flex items-center justify-center rounded-full border border-[#C9A15B]/40 text-xs text-[#C9A15B] hover:bg-[#C9A15B]/10 transition-colors font-medium cursor-pointer"
            >
              Envoyer une autre demande
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nom */}
              <div className="flex flex-col">
                <label className="text-[11px] uppercase tracking-wider text-[#D9CBB0]/80 mb-1.5 font-medium">
                  Votre Nom Complet *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jean-Eudes Kouassi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-3 rounded-xl bg-[#0F0E0C]/80 border border-[#F4EFE6]/10 text-sm text-[#F4EFE6] placeholder-[#D9CBB0]/30 focus:outline-none focus:border-[#C9A15B] transition-colors"
                />
              </div>

              {/* Téléphone / WhatsApp */}
              <div className="flex flex-col">
                <label className="text-[11px] uppercase tracking-wider text-[#D9CBB0]/80 mb-1.5 font-medium">
                  Téléphone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+225 07 00 00 00"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="px-4 py-3 rounded-xl bg-[#0F0E0C]/80 border border-[#F4EFE6]/10 text-sm text-[#F4EFE6] placeholder-[#D9CBB0]/30 focus:outline-none focus:border-[#C9A15B] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Type de bien */}
              <div className="flex flex-col">
                <label className="text-[11px] uppercase tracking-wider text-[#D9CBB0]/80 mb-1.5 font-medium">
                  Typologie du bien
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="px-4 py-3 rounded-xl bg-[#0F0E0C]/80 border border-[#F4EFE6]/10 text-sm text-[#F4EFE6] focus:outline-none focus:border-[#C9A15B] transition-colors cursor-pointer"
                >
                  <option value="villa" className="bg-[#161512]">Villa de Prestige</option>
                  <option value="penthouse" className="bg-[#161512]">Penthouse / Rooftop</option>
                  <option value="manoir" className="bg-[#161512]">Manoir / Domaine</option>
                  <option value="terrain" className="bg-[#161512]">Terrain d'Exception</option>
                </select>
              </div>

              {/* Quartier */}
              <div className="flex flex-col">
                <label className="text-[11px] uppercase tracking-wider text-[#D9CBB0]/80 mb-1.5 font-medium">
                  Localisation
                </label>
                <select
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="px-4 py-3 rounded-xl bg-[#0F0E0C]/80 border border-[#F4EFE6]/10 text-sm text-[#F4EFE6] focus:outline-none focus:border-[#C9A15B] transition-colors cursor-pointer"
                >
                  <option value="cocody" className="bg-[#161512]">Cocody Ambassades</option>
                  <option value="plateau" className="bg-[#161512]">Plateau Marina</option>
                  <option value="riviera" className="bg-[#161512]">Riviera Golf</option>
                  <option value="zone4" className="bg-[#161512]">Zone 4 Résidentielle</option>
                  <option value="autre" className="bg-[#161512]">Autre secteur privilégié</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-4 rounded-xl bg-[#C9A15B] hover:bg-[#D8B36F] text-[#0F0E0C] text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-[#C9A15B]/30 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>Demander mon estimation confidentielle</span>
            </button>

            <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-[#D9CBB0]/60">
              <Lock className="w-3.5 h-3.5 text-[#C9A15B]" />
              <span>Données strictement confidentielles, sans engagement de vente.</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
