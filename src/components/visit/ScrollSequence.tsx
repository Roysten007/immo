import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CHAPTERS } from '../../data/chapters';
import { Calendar, ChevronDown } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

gsap.registerPlugin(ScrollTrigger);

// Définition des paliers de performance ultra-rapides
// Desktop : 271 frames sélectionnées (step de 5 parmi les 1351) -> ~12 Mo au total
// Mobile : 180 frames sélectionnées (step de 4 parmi les 720) -> ~3.6 Mo au total
const DESKTOP_FRAMES = 271;
const DESKTOP_STEP = 5;
const MOBILE_FRAMES = 180;
const MOBILE_STEP = 4;

export function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const frameObjRef = useRef({ frame: 0 });
  const progressLineRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const currentChapterRef = useRef(0);
  const rafDrawId = useRef<number | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isFirstStageReady, setIsFirstStageReady] = useState(false);
  const [loadPercent, setLoadPercent] = useState(10);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Détecter mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalFrames = isMobile ? MOBILE_FRAMES : DESKTOP_FRAMES;
  const frameStep = isMobile ? MOBILE_STEP : DESKTOP_STEP;
  const folder = isMobile ? '/frames-mobile' : '/frames';

  // Obtenir l'URL de la frame correspondant à l'index virtuel
  const getFrameUrl = useCallback(
    (index: number) => {
      const maxReal = isMobile ? 720 : 1351;
      const realNum = Math.min(1 + index * frameStep, maxReal);
      const padded = String(realNum).padStart(4, '0');
      return `${folder}/frame_${padded}.webp`;
    },
    [isMobile, frameStep, folder]
  );

  // Fonction de dessin optimisée sur le Canvas (mode cover avec alpha: false)
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!ctxRef.current) {
      ctxRef.current = canvas.getContext('2d', {
        alpha: false,
        desynchronized: true,
      });
    }
    const ctx = ctxRef.current;
    if (!ctx) return;

    // Trouver la frame la plus proche déjà prête
    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let i = frameIndex - 1; i >= 0; i--) {
        if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth !== 0) {
          img = imagesRef.current[i];
          break;
        }
      }
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let i = frameIndex + 1; i < imagesRef.current.length; i++) {
          if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth !== 0) {
            img = imagesRef.current[i];
            break;
          }
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Calcul mathématique exact cover
    const cw = canvas.width;
    const ch = canvas.height;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;

    const ratio = Math.max(cw / nw, ch / nh);
    const rw = nw * ratio;
    const rh = nh * ratio;
    const cx = (cw - rw) * 0.5;
    const cy = (ch - rh) * 0.5;

    ctx.drawImage(img, 0, 0, nw, nh, cx, cy, rw, rh);
  }, []);

  // Redimensionnement du canvas (DPR plafonné à 1.5 pour soulager le GPU et booster le 60fps)
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    drawFrame(Math.round(frameObjRef.current.frame));
  }, [drawFrame]);

  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Chargement ultra-performant en 2 temps :
  // Tier 1 (Immédiat) : 12 premières frames + 1 keyframe par chapitre (~20 images = ~800 Ko)
  // Prêt en moins de 500ms !
  // Tier 2 (Arrière-plan doux) : Reste des frames par micro-lots non bloquants
  useEffect(() => {
    let isCancelled = false;
    imagesRef.current = new Array(totalFrames).fill(null);

    const loadImagePromise = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (imagesRef.current[index]?.complete) {
          resolve();
          return;
        }
        const img = new Image();
        img.src = getFrameUrl(index);
        img.onload = () => {
          if (!isCancelled) {
            imagesRef.current[index] = img;
            if (index === 0) {
              handleResize();
            }
          }
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
      });
    };

    // Phase 1 : Charger l'amorce immédiate
    const priorityIndices = new Set<number>();
    // Premières frames
    for (let i = 0; i < Math.min(12, totalFrames); i++) {
      priorityIndices.add(i);
    }
    // 1 frame clé par chapitre
    CHAPTERS.forEach((_, chIdx) => {
      const targetIndex = Math.min(
        Math.floor((chIdx / CHAPTERS.length) * totalFrames),
        totalFrames - 1
      );
      priorityIndices.add(targetIndex);
    });

    const priorityArray = Array.from(priorityIndices);
    let loadedPriority = 0;

    const priorityPromises = priorityArray.map((idx) =>
      loadImagePromise(idx).then(() => {
        if (!isCancelled) {
          loadedPriority++;
          const percent = Math.min(95, Math.round((loadedPriority / priorityArray.length) * 100));
          setLoadPercent(percent);
        }
      })
    );

    Promise.all(priorityPromises).then(() => {
      if (isCancelled) return;
      setLoadPercent(100);
      setIsFirstStageReady(true);
      handleResize();
      drawFrame(0);

      // Phase 2 : Reste des frames en arrière-plan par micro-lots avec délai
      const loadBackground = async () => {
        const batchSize = 8;
        for (let i = 0; i < totalFrames; i += batchSize) {
          if (isCancelled) break;
          const batch = [];
          for (let j = i; j < Math.min(i + batchSize, totalFrames); j++) {
            if (!priorityIndices.has(j)) {
              batch.push(loadImagePromise(j));
            }
          }
          if (batch.length > 0) {
            await Promise.all(batch);
            // Petite pause pour laisser respirer le thread principal et le réseau
            await new Promise((r) => setTimeout(r, 60));
          }
        }
      };

      // Démarrer après que le premier rendu soit stabilisé
      const timer = setTimeout(() => {
        loadBackground();
      }, 200);

      return () => clearTimeout(timer);
    });

    return () => {
      isCancelled = true;
      if (rafDrawId.current) cancelAnimationFrame(rafDrawId.current);
    };
  }, [totalFrames, getFrameUrl, handleResize, drawFrame]);

  // ScrollTrigger scrub de la séquence avec GSAP ScrollTrigger (optimisé zéro re-render)
  useEffect(() => {
    if (!isFirstStageReady || !containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;

          // 1. Mise à jour de la barre de progression en GPU (transform au lieu de width React)
          if (progressLineRef.current) {
            progressLineRef.current.style.transform = `scaleX(${progress})`;
          }

          // 2. Masquage du hint de scroll après 4% de défilement
          if (scrollHintRef.current) {
            if (progress > 0.04) {
              scrollHintRef.current.style.opacity = '0';
              scrollHintRef.current.style.pointerEvents = 'none';
            } else {
              scrollHintRef.current.style.opacity = '0.85';
            }
          }

          // 3. Calcul de la frame cible
          const targetFrame = Math.min(
            Math.floor(progress * (totalFrames - 1)),
            totalFrames - 1
          );
          frameObjRef.current.frame = targetFrame;

          // Debounce RAF pour éviter les drawFrame redondants
          if (!rafDrawId.current) {
            rafDrawId.current = requestAnimationFrame(() => {
              drawFrame(Math.round(frameObjRef.current.frame));
              rafDrawId.current = null;
            });
          }

          // 4. Changement de chapitre uniquement quand l'index change (zéro re-render inutile)
          const chapterIndex = Math.min(
            Math.floor(progress * CHAPTERS.length),
            CHAPTERS.length - 1
          );
          if (chapterIndex !== currentChapterRef.current) {
            currentChapterRef.current = chapterIndex;
            setActiveChapterIndex(chapterIndex);
          }
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      if (rafDrawId.current) cancelAnimationFrame(rafDrawId.current);
    };
  }, [isFirstStageReady, totalFrames, drawFrame]);

  return (
    <div
      id="visite"
      ref={containerRef}
      className="relative w-full bg-[#0F0E0C]"
      style={{ height: '900vh' }}
    >
      {/* Conteneur Sticky 100vh */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Canvas plein écran avec accélération matérielle */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block will-change-transform"
        />

        {/* Effet de grain animé subtil & vignettage cinéma */}
        <div className="absolute inset-0 canvas-vignette pointer-events-none" />
        <div className="absolute inset-0 grain-overlay pointer-events-none" />

        {/* Écran de chargement ultra-rapide (Prêt en <500ms) */}
        {!isFirstStageReady && (
          <div className="absolute inset-0 z-50 bg-[#0F0E0C] flex flex-col items-center justify-center px-6 transition-opacity duration-500">
            <div className="w-14 h-14 rounded-full border border-[#C9A15B]/40 flex items-center justify-center mb-6 animate-pulse">
              <span className="font-display font-semibold text-2xl text-[#C9A15B]">K</span>
            </div>
            <h2 className="font-display text-xl md:text-2xl tracking-[0.2em] text-[#F4EFE6] uppercase mb-2 font-semibold">
              Maison Kèmi
            </h2>
            <p className="text-xs uppercase tracking-[0.25em] text-[#C9A15B] mb-8 font-sans">
              Chargement de la Visite Privée
            </p>

            {/* Barre fine laiton */}
            <div className="w-64 max-w-full h-[2px] bg-[#2A2824] rounded-full overflow-hidden relative mb-4">
              <div
                className="h-full bg-[#C9A15B] transition-all duration-200 ease-out"
                style={{ width: `${loadPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono text-[#D9CBB0]/70">
              {loadPercent}%
            </span>
          </div>
        )}

        {/* Dégradé discret pour garantir une parfaite lisibilité des textes */}
        <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-t from-[#0F0E0C]/85 via-[#0F0E0C]/25 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-[20vh] bg-gradient-to-b from-[#0F0E0C]/60 to-transparent pointer-events-none" />

        {/* Chapitres de texte (transition GPU fluide) */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-12 md:pb-16 px-6 md:px-12 lg:px-16">
          <div className="max-w-2xl mx-auto w-full grid grid-cols-1 grid-rows-1">
            {CHAPTERS.map((ch, idx) => {
              const isActive = activeChapterIndex === idx;

              return (
                <div
                  key={ch.id}
                  className={`col-start-1 row-start-1 text-center sm:text-left transition-all duration-500 ease-out transform ${
                    isActive
                      ? 'opacity-100 translate-y-0 pointer-events-auto z-10'
                      : 'opacity-0 translate-y-3 pointer-events-none z-0'
                  }`}
                >
                  {/* Label laiton & numéro d'étape "01 / 09" */}
                  <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-2.5">
                    <span className="text-[10px] font-mono tracking-widest text-[#C9A15B] uppercase px-2 py-0.5 rounded-full border border-[#C9A15B]/30 bg-[#181613]/80 backdrop-blur-sm">
                      {ch.number}
                    </span>
                    <span className="text-[11px] tracking-[0.25em] uppercase text-[#D9CBB0] font-medium font-sans">
                      {ch.room}
                    </span>
                  </div>

                  {/* Titre principal soigné */}
                  <h1 className="hero-title text-[#F4EFE6] mb-2.5 font-medium leading-tight">
                    <span>{ch.titleRegular}</span>
                    <span className="serif-italic-brass">{ch.titleItalic}</span>
                    {ch.titleSuffix && <span>{ch.titleSuffix}</span>}
                  </h1>

                  {/* Sous-titre bénéfice concret épuré */}
                  {ch.subtitle && (
                    <p className="text-xs sm:text-sm md:text-base text-[#D9CBB0]/85 font-light max-w-lg leading-relaxed mb-5 mx-auto sm:mx-0">
                      {ch.subtitle}
                    </p>
                  )}

                  {/* Boutons CTA sur le chapitre final (09) */}
                  {ch.cta && (
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3.5 pt-1 pointer-events-auto">
                      <button
                        onClick={() => {
                          const el = document.getElementById('contact-final');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-6 py-3 rounded-full bg-[#C9A15B] hover:bg-[#D8B36F] text-[#0F0E0C] text-xs font-semibold tracking-wider flex items-center gap-2 transition-all shadow-xl hover:shadow-[#C9A15B]/25 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>{ch.cta.primaryText}</span>
                      </button>

                      <a
                        href="https://wa.me/22900000000?text=Bonjour%20Maison%20Kèmi,%20cette%20visite%20m'a%20séduit(e).%20Je%20souhaite%20en%20savoir%20plus."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3 rounded-full border border-[#25D366]/40 hover:border-[#25D366] bg-[#161512]/80 hover:bg-[#25D366]/10 text-xs text-[#F4EFE6] font-medium tracking-wider flex items-center gap-2 transition-all hover:scale-[1.02]"
                      >
                        <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                        <span>{ch.cta.whatsappText}</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicateur discret de scroll au début de la visite */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none opacity-85 transition-opacity duration-300 animate-bounce"
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#C9A15B] font-medium font-sans">
            Faites défiler
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#C9A15B]" />
        </div>

        {/* Barre fine de progression de la visite en bas (GPU scaleX transform pour 60fps sans reflow) */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F4EFE6]/08 overflow-hidden">
          <div
            ref={progressLineRef}
            className="h-full w-full bg-gradient-to-r from-[#C9A15B] to-[#B5654A] origin-left will-change-transform"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>
    </div>
  );
}
