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

  const [isMobile, setIsMobile] = useState(false);
  const [totalFrames, setTotalFrames] = useState<number>(0);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isFirstStageReady, setIsFirstStageReady] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Détecter mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Charger les métadonnées de la séquence
  useEffect(() => {
    fetch('/sequence-meta.json')
      .then((res) => res.json())
      .then((data: SequenceMeta) => {
        const count = isMobile ? data.mobile.count : data.desktop.count;
        setTotalFrames(count);
      })
      .catch((err) => {
        console.warn('Impossible de charger sequence-meta.json, utilisation des valeurs par défaut', err);
        const fallbackCount = isMobile ? 400 : 800;
        setTotalFrames(fallbackCount);
      });
  }, [isMobile]);

  // Fonction de dessin de frame sur le canvas (mode cover)
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Trouver la frame la plus proche déjà chargée
    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete) {
      // Rechercher en arrière puis en avant
      for (let i = frameIndex - 1; i >= 0; i--) {
        if (imagesRef.current[i]?.complete) {
          img = imagesRef.current[i];
          break;
        }
      }
      if (!img || !img.complete) {
        for (let i = frameIndex + 1; i < imagesRef.current.length; i++) {
          if (imagesRef.current[i]?.complete) {
            img = imagesRef.current[i];
            break;
          }
        }
      }
    }

    if (!img || !img.complete) return;

    // Calcul du rendu "cover" mathématiquement parfait
    const hRatio = canvas.width / img.naturalWidth;
    const vRatio = canvas.height / img.naturalHeight;
    const ratio = Math.max(hRatio, vRatio);
    const centerShiftX = (canvas.width - img.naturalWidth * ratio) / 2;
    const centerShiftY = (canvas.height - img.naturalHeight * ratio) / 2;

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

  // Redimensionnement du canvas avec devicePixelRatio géré
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    drawFrame(Math.round(frameObjRef.current.frame));
  }, [drawFrame]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Préchargement en deux temps :
  // Temps 1 : 30 premières frames pour affichage immédiat
  // Temps 2 : arrière-plan pour les frames restantes
  useEffect(() => {
    if (totalFrames <= 0) return;

    const folder = isMobile ? '/frames-mobile' : '/frames';
    imagesRef.current = new Array(totalFrames).fill(null);
    let loaded = 0;
    const FIRST_STAGE_COUNT = Math.min(30, totalFrames);

    const loadSingleImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        const frameNum = String(index + 1).padStart(4, '0');
        img.src = `${folder}/frame_${frameNum}.webp`;

        img.onload = () => {
          imagesRef.current[index] = img;
          loaded++;
          setLoadedCount(loaded);
          if (index === 0) {
            handleResize();
          }
          resolve();
        };

        img.onerror = () => {
          // Si frame manquante, on résout quand même pour ne pas bloquer
          resolve();
        };
      });
    };

    // Phase 1 : Charger les 30 premières immédiatement
    const stage1Promises = [];
    for (let i = 0; i < FIRST_STAGE_COUNT; i++) {
      stage1Promises.push(loadSingleImage(i));
    }

    Promise.all(stage1Promises).then(() => {
      setIsFirstStageReady(true);
      handleResize();
      drawFrame(0);

      // Phase 2 : Arrière-plan pour toutes les autres frames par lots de 15
      const loadRemaining = async () => {
        const batchSize = 15;
        for (let i = FIRST_STAGE_COUNT; i < totalFrames; i += batchSize) {
          const batch = [];
          for (let j = i; j < Math.min(i + batchSize, totalFrames); j++) {
            batch.push(loadSingleImage(j));
          }
          await Promise.all(batch);
        }
      };

      loadRemaining();
    });
  }, [totalFrames, isMobile, handleResize, drawFrame]);

  // ScrollTrigger scrub de la séquence
  useEffect(() => {
    if (!isFirstStageReady || totalFrames <= 0 || !containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6, // Interpolation douce demandée (0.6)
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);

          // Calcul de la frame cible
          const targetFrame = Math.min(
            Math.floor(progress * (totalFrames - 1)),
            totalFrames - 1
          );

          frameObjRef.current.frame = targetFrame;
          drawFrame(targetFrame);

          // Calcul précis du chapitre actif (1 clip = 1 chapitre, répartition exacte à 1/9ème)
          const chapterIndex = Math.min(
            Math.floor(progress * CHAPTERS.length),
            CHAPTERS.length - 1
          );
          setActiveChapterIndex(chapterIndex);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isFirstStageReady, totalFrames, drawFrame]);

  // Calcul du pourcentage de chargement global
  const loadPercentage = totalFrames > 0 ? Math.round((loadedCount / totalFrames) * 100) : 0;

  return (
    <div
      id="visite"
      ref={containerRef}
      className="relative w-full bg-[#0F0E0C]"
      style={{ height: '900vh' }}
    >
      {/* Conteneur Sticky 100vh */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Canvas plein écran */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block"
        />

        {/* Effet de grain animé subtil & vignettage cinéma */}
        <div className="absolute inset-0 canvas-vignette pointer-events-none" />
        <div className="absolute inset-0 grain-overlay pointer-events-none" />

        {/* Écran de chargement élégant (Logo + % + barre fine laiton) */}
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
                className="h-full bg-[#C9A15B] transition-all duration-300 ease-out"
                style={{ width: `${Math.max(10, (loadedCount / 30) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-mono text-[#D9CBB0]/70">
              {loadPercentage}%
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
        {scrollProgress < 0.05 && isFirstStageReady && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none opacity-80 animate-bounce">
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#C9A15B] font-medium font-sans">
              Faites défiler
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#C9A15B]" />
          </div>
        )}

        {/* Barre fine de progression de la visite en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F4EFE6]/08">
          <div
            className="h-full bg-gradient-to-r from-[#C9A15B] to-[#B5654A] transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
