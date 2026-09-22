import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CHAPTERS } from '../../data/chapters';
import { Calendar, ChevronDown } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

gsap.registerPlugin(ScrollTrigger);

interface SequenceMeta {
  desktop: { count: number; fps: number };
  mobile: { count: number; fps: number };
}

export function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const frameObjRef = useRef({ frame: 0 });
  const progressLineRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const currentChapterRef = useRef(0);
  const activeFrameTargetRef = useRef(0);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [totalFrames, setTotalFrames] = useState<number>(0);
  const [isFirstStageReady, setIsFirstStageReady] = useState(false);
  const [loadPercent, setLoadPercent] = useState(15);
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

  // Charger les métadonnées complètes de la séquence (1351 frames desktop, 720 mobile)
  useEffect(() => {
    fetch('/sequence-meta.json')
      .then((res) => res.json())
      .then((data: SequenceMeta) => {
        const count = isMobile ? data.mobile.count : data.desktop.count;
        setTotalFrames(count);
      })
      .catch((err) => {
        console.warn('Erreur chargement sequence-meta.json, utilisation des valeurs par défaut', err);
        setTotalFrames(isMobile ? 720 : 1351);
      });
  }, [isMobile]);

  // Fonction de dessin de frame sur le canvas avec qualité maximale et cover parfait
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

    // Trouver la frame exacte ou la frame chargée la plus proche
    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Recherche arrière prioritaire
      for (let i = frameIndex - 1; i >= 0; i--) {
        if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth !== 0) {
          img = imagesRef.current[i];
          break;
        }
      }
      // Recherche avant de secours
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

    // Rendu "cover" parfait sans déformation
    const hRatio = canvas.width / img.naturalWidth;
    const vRatio = canvas.height / img.naturalHeight;
    const ratio = Math.max(hRatio, vRatio);
    const centerShiftX = (canvas.width - img.naturalWidth * ratio) / 2;
    const centerShiftY = (canvas.height - img.naturalHeight * ratio) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.naturalWidth,
      img.naturalHeight,
      centerShiftX,
      centerShiftY,
      img.naturalWidth * ratio,
      img.naturalHeight * ratio
    );
  }, []);

  // Redimensionnement du canvas (Pleine netteté Retina / 1080p avec dpr = 2)
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    drawFrame(Math.round(frameObjRef.current.frame));
  }, [drawFrame]);

  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Chargement intelligent et continu de l'intégralité des frames :
  // 1. Amorce ultra-rapide (25 premières frames + repères des 9 chapitres) -> Prêt immédiatement en haute qualité
  // 2. Préchargement continu en tâche de fond de TOUTES les 1351 frames sans bloquer le navigateur (zéro re-render React)
  useEffect(() => {
    if (totalFrames <= 0) return;

    let isCancelled = false;
    const folder = isMobile ? '/frames-mobile' : '/frames';
    imagesRef.current = new Array(totalFrames).fill(null);
    const requested = new Set<number>();

    const loadSingleImage = (index: number): Promise<void> => {
      if (index < 0 || index >= totalFrames) return Promise.resolve();
      if (requested.has(index)) return Promise.resolve();
      requested.add(index);

      return new Promise((resolve) => {
        const img = new Image();
        const frameNum = String(index + 1).padStart(4, '0');
        img.src = `${folder}/frame_${frameNum}.webp`;

        img.onload = () => {
          if (!isCancelled) {
            imagesRef.current[index] = img;
            // Si c'est la première frame, initialiser le canvas
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

    // Phase 1 : Amorce prioritaire (25 premières frames + repères de chapitres)
    const priorityIndices = new Set<number>();
    for (let i = 0; i < Math.min(25, totalFrames); i++) {
      priorityIndices.add(i);
    }
    // Repères des 9 chapitres
    for (let c = 0; c < CHAPTERS.length; c++) {
      const idx = Math.min(Math.floor((c / CHAPTERS.length) * totalFrames), totalFrames - 1);
      priorityIndices.add(idx);
      if (idx > 0) priorityIndices.add(idx - 1);
      if (idx < totalFrames - 1) priorityIndices.add(idx + 1);
    }

    const priorityList = Array.from(priorityIndices);
    let loadedCount = 0;

    const priorityPromises = priorityList.map((idx) =>
      loadSingleImage(idx).then(() => {
        if (!isCancelled) {
          loadedCount++;
          const pct = Math.min(98, Math.round((loadedCount / priorityList.length) * 100));
          setLoadPercent(pct);
        }
      })
    );

    Promise.all(priorityPromises).then(() => {
      if (isCancelled) return;
      setLoadPercent(100);
      setIsFirstStageReady(true);
      handleResize();
      drawFrame(0);

      // Phase 2 : Chargement en arrière-plan continu et intelligent de TOUTES les frames
      // Priorise les frames autour du scroll actuel du visiteur pour une fluidité absolue
      const loadAllFramesQueue = async () => {
        const batchSize = 12;
        let nextIndex = 0;

        while (nextIndex < totalFrames && !isCancelled) {
          // Déterminer la zone de priorité autour de la frame observée
          const currentTarget = activeFrameTargetRef.current;
          const lookaheadStart = Math.max(0, currentTarget - 15);
          const lookaheadEnd = Math.min(totalFrames, currentTarget + 30);

          const batchPromises: Promise<void>[] = [];

          // Charger d'abord les frames proches du visiteur
          for (let p = lookaheadStart; p < lookaheadEnd; p++) {
            if (!requested.has(p)) {
              batchPromises.push(loadSingleImage(p));
              if (batchPromises.length >= batchSize) break;
            }
          }

          // Compléter par les frames séquentielles restantes
          if (batchPromises.length < batchSize) {
            for (let i = nextIndex; i < totalFrames && batchPromises.length < batchSize; i++) {
              if (!requested.has(i)) {
                batchPromises.push(loadSingleImage(i));
              }
              nextIndex = i + 1;
            }
          }

          if (batchPromises.length > 0) {
            await Promise.all(batchPromises);
            // Micro-pause pour laisser la boucle d'événements du navigateur libre
            await new Promise((r) => setTimeout(r, 16));
          } else {
            nextIndex += batchSize;
          }
        }
      };

      const timer = setTimeout(() => {
        loadAllFramesQueue();
      }, 100);

      return () => clearTimeout(timer);
    });

    return () => {
      isCancelled = true;
    };
  }, [totalFrames, isMobile, handleResize, drawFrame]);

  // Scrub ScrollTrigger de la vidéo intégrale (1351 frames desktop, 720 frames mobile)
  useEffect(() => {
    if (!isFirstStageReady || totalFrames <= 0 || !containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;

          // 1. Barre de progression en accélération matérielle GPU (zéro reflow)
          if (progressLineRef.current) {
            progressLineRef.current.style.transform = `scaleX(${progress})`;
          }

          // 2. Masquage du hint de scroll après 3%
          if (scrollHintRef.current) {
            if (progress > 0.03) {
              scrollHintRef.current.style.opacity = '0';
              scrollHintRef.current.style.pointerEvents = 'none';
            } else {
              scrollHintRef.current.style.opacity = '0.85';
            }
          }

          // 3. Calcul précis de la frame cible parmi l'INTÉGRALITÉ des frames
          const targetFrame = Math.min(
            Math.floor(progress * (totalFrames - 1)),
            totalFrames - 1
          );

          activeFrameTargetRef.current = targetFrame;
          frameObjRef.current.frame = targetFrame;
          drawFrame(targetFrame);

          // 4. Chapitre actif (mis à jour uniquement lors du changement de chapitre)
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

    return () => ctx.revert();
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
        {/* Canvas plein écran en pleine résolution native */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block will-change-transform"
        />

        {/* Effet de grain animé subtil & vignettage cinéma */}
        <div className="absolute inset-0 canvas-vignette pointer-events-none" />
        <div className="absolute inset-0 grain-overlay pointer-events-none" />

        {/* Écran de chargement initial raffiné */}
        {!isFirstStageReady && (
          <div className="absolute inset-0 z-50 bg-[#0F0E0C] flex flex-col items-center justify-center px-6 transition-opacity duration-700">
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

        {/* Chapitres de texte (apparition / disparition progressive parfaitement fluide) */}
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

        {/* Barre fine de progression de la visite en bas */}
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
