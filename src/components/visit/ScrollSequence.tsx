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
  const currentScrollProgressRef = useRef(0);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [totalFrames, setTotalFrames] = useState<number>(0);
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

  // Charger les métadonnées complètes de la séquence
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

  // Fonction de dessin sur canvas plein écran Retina / 1080p avec interpolation cover
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

    const total = imagesRef.current.length;
    if (total === 0) return;

    const clampedIndex = Math.max(0, Math.min(frameIndex, total - 1));

    // Trouver la frame la plus proche prête
    let img = imagesRef.current[clampedIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Recherche arrière
      for (let i = clampedIndex - 1; i >= 0; i--) {
        if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth !== 0) {
          img = imagesRef.current[i];
          break;
        }
      }
      // Recherche avant
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let i = clampedIndex + 1; i < total; i++) {
          if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth !== 0) {
            img = imagesRef.current[i];
            break;
          }
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Calcul exact cover mathématique
    const cw = canvas.width;
    const ch = canvas.height;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;

    const ratio = Math.max(cw / nw, ch / nh);
    const rw = nw * ratio;
    const rh = nh * ratio;
    const cx = (cw - rw) * 0.5;
    const cy = (ch - rh) * 0.5;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, nw, nh, cx, cy, rw, rh);
  }, []);

  // Redimensionnement du Canvas avec haute résolution (dpr = 2)
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

  // Chargement ultra-performant continu :
  // Étape 1 : 25 premières images pour démarrage immédiat (< 500ms)
  // Étape 2 : Stream de toutes les frames avec priorité dynamique autour du scroll du visiteur
  useEffect(() => {
    if (totalFrames <= 0) return;

    let isCancelled = false;
    const folder = isMobile ? '/frames-mobile' : '/frames';
    imagesRef.current = new Array(totalFrames).fill(null);
    const requested = new Set<number>();

    const fetchImage = (index: number): Promise<void> => {
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

    // 1. Charger immédiatement les 20 premières frames pour affichage instantané
    const initialBatch: Promise<void>[] = [];
    const INITIAL_COUNT = Math.min(20, totalFrames);
    let loadedCount = 0;

    for (let i = 0; i < INITIAL_COUNT; i++) {
      initialBatch.push(
        fetchImage(i).then(() => {
          if (!isCancelled) {
            loadedCount++;
            setLoadPercent(Math.min(95, Math.round((loadedCount / INITIAL_COUNT) * 100)));
          }
        })
      );
    }

    Promise.all(initialBatch).then(() => {
      if (isCancelled) return;
      setLoadPercent(100);
      setIsFirstStageReady(true);
      handleResize();
      drawFrame(0);

      // 2. Stream continu de TOUTES les frames en tâche de fond avec réseau fluide
      // Priorise toujours les frames autour du scroll actuel du visiteur
      const backgroundLoader = async () => {
        // En priorité : 1 frame toutes les 3 frames sur toute la longueur pour garantir un défilement continu immédiat
        const keyframeStep = isMobile ? 3 : 3;
        const keyframeBatch: Promise<void>[] = [];
        for (let k = 0; k < totalFrames; k += keyframeStep) {
          if (isCancelled) return;
          keyframeBatch.push(fetchImage(k));
          if (keyframeBatch.length >= 16) {
            await Promise.all(keyframeBatch);
            keyframeBatch.length = 0;
          }
        }
        if (keyframeBatch.length > 0) {
          await Promise.all(keyframeBatch);
        }

        // Ensuite : Remplir l'intégralité des frames 15 fps restantes par blocs dynamiques
        let nextIndex = 0;
        while (nextIndex < totalFrames && !isCancelled) {
          const currentTarget = Math.round(frameObjRef.current.frame);
          const rangeStart = Math.max(0, currentTarget - 20);
          const rangeEnd = Math.min(totalFrames, currentTarget + 40);

          const batch: Promise<void>[] = [];

          // D'abord les frames situées autour de la position de scroll actuelle
          for (let p = rangeStart; p < rangeEnd; p++) {
            if (!requested.has(p)) {
              batch.push(fetchImage(p));
              if (batch.length >= 16) break;
            }
          }

          // Puis les frames séquentielles restantes
          if (batch.length < 16) {
            for (let i = nextIndex; i < totalFrames && batch.length < 16; i++) {
              if (!requested.has(i)) {
                batch.push(fetchImage(i));
              }
              nextIndex = i + 1;
            }
          }

          if (batch.length > 0) {
            await Promise.all(batch);
          } else {
            nextIndex += 16;
          }
        }
      };

      const timer = setTimeout(() => {
        backgroundLoader();
      }, 50);

      return () => clearTimeout(timer);
    });

    return () => {
      isCancelled = true;
    };
  }, [totalFrames, isMobile, handleResize, drawFrame]);

  // Scrub GSAP avec inertie physique et fluidité tactile ressentie
  useEffect(() => {
    if (!isFirstStageReady || totalFrames <= 0 || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Tween GSAP avec interpolation physique 'scrub: 0.5'
      // C'est ce tween qui donne la sensation de glisse cinématique et tactile du scroll !
      gsap.to(frameObjRef.current, {
        frame: totalFrames - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5, // Easing cinématique doux
          onUpdate: (self) => {
            const progress = self.progress;
            currentScrollProgressRef.current = progress;

            // Barre de progression GPU
            if (progressLineRef.current) {
              progressLineRef.current.style.transform = `scaleX(${progress})`;
            }

            // Masquer l'indicateur de défilement dès que l'utilisateur commence à scroller
            if (scrollHintRef.current) {
              if (progress > 0.03) {
                scrollHintRef.current.style.opacity = '0';
                scrollHintRef.current.style.pointerEvents = 'none';
              } else {
                scrollHintRef.current.style.opacity = '0.85';
              }
            }

            // Dessiner la frame interpolée
            const frameToDraw = Math.round(frameObjRef.current.frame);
            drawFrame(frameToDraw);

            // Calcul du chapitre actif avec transition visuelle
            const chapterIndex = Math.min(
              Math.floor(progress * CHAPTERS.length),
              CHAPTERS.length - 1
            );
            if (chapterIndex !== currentChapterRef.current) {
              currentChapterRef.current = chapterIndex;
              setActiveChapterIndex(chapterIndex);
            }
          },
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
        {/* Canvas plein écran en haute résolution native */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block will-change-transform"
        />

        {/* Effet de grain animé subtil & vignettage cinéma */}
        <div className="absolute inset-0 canvas-vignette pointer-events-none" />
        <div className="absolute inset-0 grain-overlay pointer-events-none" />

        {/* Écran de chargement initial raffiné (Prêt en < 500ms) */}
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

        {/* Chapitres de texte avec animations riches (fade + slide-up + scale subtil) */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-12 md:pb-16 px-6 md:px-12 lg:px-16">
          <div className="max-w-2xl mx-auto w-full grid grid-cols-1 grid-rows-1">
            {CHAPTERS.map((ch, idx) => {
              const isActive = activeChapterIndex === idx;

              return (
                <div
                  key={ch.id}
                  className={`col-start-1 row-start-1 text-center sm:text-left transition-all duration-700 ease-out transform ${
                    isActive
                      ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto z-10'
                      : 'opacity-0 translate-y-6 scale-[0.97] pointer-events-none z-0'
                  }`}
                >
                  {/* Label laiton & numéro d'étape "01 / 09" */}
                  <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-2.5">
                    <span className="text-[10px] font-mono tracking-widest text-[#C9A15B] uppercase px-2 py-0.5 rounded-full border border-[#C9A15B]/30 bg-[#181613]/80 backdrop-blur-sm shadow-md">
                      {ch.number}
                    </span>
                    <span className="text-[11px] tracking-[0.25em] uppercase text-[#D9CBB0] font-medium font-sans">
                      {ch.room}
                    </span>
                  </div>

                  {/* Titre principal soigné */}
                  <h1 className="hero-title text-[#F4EFE6] mb-2.5 font-medium leading-tight drop-shadow-sm">
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
