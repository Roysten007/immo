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
  const fetchImageRef = useRef<((idx: number) => Promise<HTMLImageElement | null>) | null>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const currentChapterRef = useRef(0);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [totalFrames, setTotalFrames] = useState<number>(0);
  const [isFirstStageReady, setIsFirstStageReady] = useState(false);
  const [loadPercent, setLoadPercent] = useState(10);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Détecter mobile (< 768px) / desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Charger les métadonnées complètes de la séquence (utilisation des frames HD 1600x900)
  useEffect(() => {
    fetch('/sequence-meta.json')
      .then((res) => res.json())
      .then((data: SequenceMeta) => {
        const count = data.desktop?.count || 1351;
        setTotalFrames(count);
      })
      .catch((err) => {
        console.warn('Erreur chargement sequence-meta.json, utilisation des valeurs par défaut', err);
        setTotalFrames(1351);
      });
  }, []);

  // Dessin sur Canvas plein écran pur et net avec cadrage adaptatif haute précision
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

    // Si la frame exacte n'est pas encore prête, déclencher son chargement prioritaire
    let img = imagesRef.current[clampedIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      fetchImageRef.current?.(clampedIndex);

      // Recherche bidirectionnelle instantanée de la frame prête la plus proche
      for (let offset = 1; offset < total; offset++) {
        const prev = clampedIndex - offset;
        if (prev >= 0 && imagesRef.current[prev]?.complete && imagesRef.current[prev]?.naturalWidth !== 0) {
          img = imagesRef.current[prev];
          break;
        }
        const next = clampedIndex + offset;
        if (next < total && imagesRef.current[next]?.complete && imagesRef.current[next]?.naturalWidth !== 0) {
          img = imagesRef.current[next];
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;

    if (isMobile) {
      // --- MODE MOBILE LUXE CINÉMATIQUE HAUTE PRÉCISION ---
      // 1. Fond d'ambiance bokeh immersif (profondeur de champ cinématique)
      const bgAspect = cw / ch;
      const bgSw = nh * bgAspect;
      const bgSx = (nw - bgSw) * 0.5;
      
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'low';
      if ('filter' in ctx) {
        ctx.filter = 'blur(12px) brightness(0.6)';
      }
      ctx.drawImage(img, bgSx, 0, bgSw, nh, 0, 0, cw, ch);
      ctx.restore();

      // Voile sombre subtil pour sublimer le contraste et l'éclairage de la villa
      ctx.fillStyle = 'rgba(15, 14, 12, 0.65)';
      ctx.fillRect(0, 0, cw, ch);

      // 2. Fenêtre d'orfèvrerie architecturale : Rendu SUPER-SHARP supersamplé
      // Ratio 16:11.5 équilibrant ciel et jardin sans aucun rognage destructeur
      const targetAspect = 16 / 11.5;
      const fgSw = Math.min(nw, Math.round(nh * targetAspect));
      const fgSh = Math.round(fgSw / targetAspect);
      const fgSx = Math.round((nw - fgSw) * 0.5);
      const fgSy = Math.round((nh - fgSh) * 0.35); // Cadrage architectural noble

      // Marges élégantes (4% de chaque côté)
      const marginX = Math.round(cw * 0.04);
      const destW = cw - marginX * 2;
      const destH = Math.round(destW / targetAspect);
      // Positionnement vertical optimal : démarre avec aisance sous le badge chapitre
      const destX = marginX;
      const destY = Math.round(ch * 0.14);

      // Découpe arrondie moderne (rayon 20px CSS adapté au DPR)
      const radius = Math.round(20 * (cw / (window.innerWidth || 390)));

      ctx.save();
      // Ombre portée profonde et douce style galerie d'art
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = Math.round(28 * (cw / 390));
      ctx.shadowOffsetY = Math.round(14 * (cw / 390));

      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(destX, destY, destW, destH, radius);
      } else {
        ctx.rect(destX, destY, destW, destH);
      }
      ctx.clip();

      // Dessin de l'image architecturale supersamplée (100% nette)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, fgSx, fgSy, fgSw, fgSh, destX, destY, destW, destH);
      ctx.restore();

      // Fin liseré laiton champagne doré (#C9A15B)
      ctx.save();
      ctx.strokeStyle = 'rgba(201, 161, 91, 0.5)';
      ctx.lineWidth = Math.max(1.5, Math.round(cw / 390));
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(destX, destY, destW, destH, radius);
      } else {
        ctx.rect(destX, destY, destW, destH);
      }
      ctx.stroke();
      ctx.restore();
    } else {
      // --- MODE DESKTOP : PLEIN ÉCRAN CINÉMATIQUE 16:9 ---
      const canvasAspect = cw / ch;
      const imgAspect = nw / nh;
      let sx = 0;
      let sy = 0;
      let sw = nw;
      let sh = nh;

      if (canvasAspect < imgAspect) {
        sw = nh * canvasAspect;
        sx = (nw - sw) * 0.5;
      } else {
        sh = nw / canvasAspect;
        sy = (nh - sh) * 0.5;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    }
  }, [isMobile]);

  // Redimensionnement du Canvas adapté à la résolution Retina de l'écran (Mobile & Desktop)
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Mobile : DPR jusqu'à 2.5 pour une netteté cristalline sur écrans Retina (iPhone 3x, Samsung)
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width > 0 ? rect.width : window.innerWidth;
    const h = rect.height > 0 ? rect.height : window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    drawFrame(Math.round(frameObjRef.current.frame));
  }, [drawFrame]);

  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Moteur de streaming ultra-rapide JIT (Just-In-Time) :
  // Phase 1 : Anchors globales couvrant les 9 chapitres en < 300ms
  // Phase 2 : Pool concurrent continu priorisé autour du scroll du visiteur
  useEffect(() => {
    if (totalFrames <= 0) return;

    let isCancelled = false;
    // Toujours charger les frames HD 1600x900 (/frames) pour une netteté cristalline sur mobile et desktop
    const folder = '/frames';
    imagesRef.current = new Array(totalFrames).fill(null);
    const requested = new Set<number>();
    const inFlight = new Set<number>();

    const fetchImage = (index: number): Promise<HTMLImageElement | null> => {
      if (index < 0 || index >= totalFrames) return Promise.resolve(null);
      if (imagesRef.current[index]?.complete) return Promise.resolve(imagesRef.current[index]);
      if (requested.has(index)) return Promise.resolve(null);
      requested.add(index);
      inFlight.add(index);

      return new Promise((resolve) => {
        const img = new Image();
        const frameNum = String(index + 1).padStart(4, '0');
        img.src = `${folder}/frame_${frameNum}.webp`;

        img.onload = () => {
          inFlight.delete(index);
          if (!isCancelled) {
            imagesRef.current[index] = img;
            // Rafraîchir si la frame correspond à la position actuelle du scroll
            const current = Math.round(frameObjRef.current.frame);
            if (Math.abs(current - index) <= 1) {
              drawFrame(current);
            }
          }
          resolve(img);
        };

        img.onerror = () => {
          inFlight.delete(index);
          resolve(null);
        };
      });
    };

    fetchImageRef.current = fetchImage;

    // 1. Anchors clés couvrant l'ensemble des 9 espaces de la villa en < 350ms
    const anchorIndices: number[] = [];
    for (let i = 0; i < Math.min(10, totalFrames); i++) {
      anchorIndices.push(i);
    }
    // Grille régulière de keyframes : 1 frame tous les 15 index sur l'ensemble de la séquence (~90 keyframes HD)
    for (let i = 0; i < totalFrames; i += 15) {
      anchorIndices.push(i);
    }
    // Points précis des 9 chapitres
    for (let c = 0; c < CHAPTERS.length; c++) {
      const chapterStart = Math.floor((c / CHAPTERS.length) * totalFrames);
      const chapterMid = Math.floor(((c + 0.5) / CHAPTERS.length) * totalFrames);
      anchorIndices.push(chapterStart, chapterMid);
    }
    const uniqueAnchors = Array.from(new Set(anchorIndices)).filter(
      (idx) => idx >= 0 && idx < totalFrames
    );

    let loadedAnchors = 0;
    const initialBatch = uniqueAnchors.map((idx) =>
      fetchImage(idx).then(() => {
        if (!isCancelled) {
          loadedAnchors++;
          setLoadPercent(Math.min(98, Math.round((loadedAnchors / uniqueAnchors.length) * 100)));
        }
      })
    );

    Promise.all(initialBatch).then(() => {
      if (isCancelled) return;
      setLoadPercent(100);
      setIsFirstStageReady(true);
      handleResize();
      drawFrame(0);
      ScrollTrigger.refresh();

      // 2. Pool de téléchargement continu fluide en tâche de fond (8 connexions mobile, 12 desktop)
      const MAX_CONCURRENT = isMobile ? 8 : 12;
      let activeJobs = 0;
      const queue: number[] = [];

      const pumpQueue = () => {
        if (isCancelled) return;
        while (activeJobs < MAX_CONCURRENT && queue.length > 0) {
          const nextIndex = queue.shift();
          if (nextIndex !== undefined && !requested.has(nextIndex)) {
            activeJobs++;
            fetchImage(nextIndex).finally(() => {
              activeJobs--;
              pumpQueue();
            });
          }
        }
      };

      const intervalId = setInterval(() => {
        if (isCancelled) {
          clearInterval(intervalId);
          return;
        }

        const current = Math.round(frameObjRef.current.frame);
        const priorityBatch: number[] = [];

        // Fenêtre prioritaire autour du regard du visiteur (+/- 25 frames)
        for (let offset = 0; offset <= 25; offset++) {
          const fwd = current + offset;
          const bwd = current - offset;
          if (fwd < totalFrames && !requested.has(fwd)) priorityBatch.push(fwd);
          if (bwd >= 0 && !requested.has(bwd)) priorityBatch.push(bwd);
        }

        if (priorityBatch.length > 0) {
          queue.unshift(...priorityBatch);
        }

        // Remplissage progressif des keyframes
        if (queue.length < 20) {
          for (let k = 0; k < totalFrames; k += 2) {
            if (!requested.has(k) && !queue.includes(k)) {
              queue.push(k);
              if (queue.length > 60) break;
            }
          }
        }

        // Reste des frames séquentielles
        if (queue.length < 10) {
          for (let k = 0; k < totalFrames; k++) {
            if (!requested.has(k) && !queue.includes(k)) {
              queue.push(k);
              if (queue.length > 50) break;
            }
          }
        }

        pumpQueue();
      }, 100);

      return () => clearInterval(intervalId);
    });

    return () => {
      isCancelled = true;
    };
  }, [totalFrames, isMobile, handleResize, drawFrame]);

  // Scrub GSAP avec inertie tactile et fluidité 60/120fps
  useEffect(() => {
    if (!isFirstStageReady || totalFrames <= 0 || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(frameObjRef.current, {
        frame: totalFrames - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: isMobile ? 0.05 : 0.7, // Instantané & direct sur mobile (0.05s), glisse cinématique sur desktop (0.7s)
        },
        onUpdate: () => {
          const currentFrame = Math.round(frameObjRef.current.frame);
          drawFrame(currentFrame);

          // Lookahead immédiat : préchargement ultra-réactif des frames voisines
          if (fetchImageRef.current) {
            for (let off = 1; off <= 10; off++) {
              const ahead = currentFrame + off;
              if (ahead < totalFrames) fetchImageRef.current(ahead);
              const behind = currentFrame - off;
              if (behind >= 0) fetchImageRef.current(behind);
            }
          }

          const progress = frameObjRef.current.frame / (totalFrames - 1);

          if (progressLineRef.current) {
            progressLineRef.current.style.transform = `scaleX(${progress})`;
          }

          if (scrollHintRef.current) {
            if (progress > 0.02) {
              scrollHintRef.current.style.opacity = '0';
              scrollHintRef.current.style.pointerEvents = 'none';
            } else {
              scrollHintRef.current.style.opacity = '0.85';
            }
          }

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

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [isFirstStageReady, totalFrames, isMobile, drawFrame]);

  return (
    <div
      id="visite"
      ref={containerRef}
      className="relative w-full bg-[#0F0E0C]"
      style={{ height: isMobile ? '550vh' : '900vh' }}
    >
      {/* Conteneur Sticky 100dvh Plein Écran */}
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden bg-[#0F0E0C]">
        {/* --- CANVAS IMMERSIF PLEIN ÉCRAN (Bord-à-bord naturel sur Mobile & Desktop) --- */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover block will-change-transform z-0"
        />

        {/* Dégradés d'ambiance cinématiques discrets pour la lisibilité des textes */}
        <div className="absolute inset-x-0 bottom-0 h-[40vh] md:h-[38vh] bg-gradient-to-t from-[#0F0E0C] via-[#0F0E0C]/60 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 top-0 h-[14vh] bg-gradient-to-b from-[#0F0E0C]/70 to-transparent pointer-events-none z-10" />

        {/* Écran de chargement initial raffiné (Prêt en < 300ms) */}
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

        {/* --- MISE EN PAGE MOBILE ÉDITORIALE LUXE (< md) --- */}
        <div className="flex md:hidden absolute inset-0 flex-col justify-between pt-20 pb-8 px-5 z-20 pointer-events-none">
          {/* En-tête Mobile : Numéro & Nom de l'espace + Indicateur 9 tirets */}
          <div className="flex items-center justify-between w-full pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181613]/85 backdrop-blur-md border border-[#C9A15B]/35 shadow-lg">
              <span className="text-[10px] font-mono tracking-widest text-[#C9A15B] font-semibold">
                {CHAPTERS[activeChapterIndex]?.number}
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#F4EFE6] font-semibold font-sans">
                {CHAPTERS[activeChapterIndex]?.room}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-[#181613]/70 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/5">
              {CHAPTERS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === activeChapterIndex ? 'w-4 bg-[#C9A15B]' : 'w-1 bg-[#F4EFE6]/25'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Pied Mobile : Titre Haute Couture, Bénéfice & Actions */}
          <div className="text-center flex flex-col items-center pointer-events-auto px-2 max-w-sm mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A15B] font-sans font-medium mb-1">
              {CHAPTERS[activeChapterIndex]?.room}
            </span>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#F4EFE6] leading-tight mb-2">
              <span>{CHAPTERS[activeChapterIndex]?.titleRegular} </span>
              <span className="serif-italic-brass text-[#C9A15B]">
                {CHAPTERS[activeChapterIndex]?.titleItalic}
              </span>
              {CHAPTERS[activeChapterIndex]?.titleSuffix && (
                <span> {CHAPTERS[activeChapterIndex]?.titleSuffix}</span>
              )}
            </h1>

            {CHAPTERS[activeChapterIndex]?.subtitle && (
              <p className="text-xs text-[#D9CBB0]/90 font-normal leading-relaxed line-clamp-2 mb-3">
                {CHAPTERS[activeChapterIndex]?.subtitle}
              </p>
            )}

            {CHAPTERS[activeChapterIndex]?.cta ? (
              <div className="flex flex-col gap-2 w-full pt-1">
                <button
                  onClick={() => {
                    const el = document.getElementById('contact-final');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#C9A15B] to-[#D8B36F] hover:from-[#D8B36F] hover:to-[#C9A15B] text-[#0F0E0C] text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#C9A15B]/20 active:scale-95 transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{CHAPTERS[activeChapterIndex]?.cta?.primaryText}</span>
                </button>
                <a
                  href="https://wa.me/22900000000?text=Bonjour%20Maison%20Kèmi,%20cette%20visite%20m'a%20séduit(e).%20Je%20souhaite%20en%20savoir%20plus."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full border border-[#25D366]/40 bg-[#161512]/90 hover:bg-[#25D366]/10 text-xs text-[#F4EFE6] font-semibold tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>{CHAPTERS[activeChapterIndex]?.cta?.whatsappText}</span>
                </a>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 opacity-75 text-[9px] uppercase tracking-[0.25em] text-[#C9A15B] pt-1">
                <span>Glissez pour continuer</span>
                <ChevronDown className="w-3 h-3 animate-bounce" />
              </div>
            )}
          </div>
        </div>

        {/* --- MISE EN PAGE DESKTOP (md:flex) --- */}
        {/* Indicateur des 9 espaces de la villa sur le côté droit (Desktop) */}
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-20 pointer-events-auto">
          {CHAPTERS.map((ch, idx) => {
            const isActive = activeChapterIndex === idx;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  const el = containerRef.current;
                  if (el) {
                    const scrollHeight = el.offsetHeight - window.innerHeight;
                    const targetScroll = (scrollHeight * (idx + 0.1)) / CHAPTERS.length;
                    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                  }
                }}
                className="group flex items-center justify-end gap-3 py-1 cursor-pointer select-none"
                title={`${ch.number} ${ch.room}`}
                aria-label={`Accéder au chapitre ${ch.number} : ${ch.room}`}
              >
                <span
                  className={`text-[10px] tracking-wider uppercase transition-all duration-300 pointer-events-none ${
                    isActive
                      ? 'text-[#C9A15B] opacity-100 font-medium translate-x-0'
                      : 'text-[#D9CBB0]/40 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
                  }`}
                >
                  {ch.room}
                </span>
                <div
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-2 h-6 bg-[#C9A15B] shadow-[0_0_12px_rgba(201,161,91,0.7)]'
                      : 'w-1.5 h-1.5 bg-[#F4EFE6]/25 group-hover:bg-[#C9A15B]/70'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Chapitres de texte élégants et lisibles sur toute la largeur (Desktop) */}
        <div className="hidden md:flex absolute inset-0 pointer-events-none flex-col justify-end pb-8 sm:pb-12 md:pb-16 px-6 md:px-16 z-10">
          <div className="max-w-2xl mx-auto w-full grid grid-cols-1 grid-rows-1">
            {CHAPTERS.map((ch, idx) => {
              const isActive = activeChapterIndex === idx;

              return (
                <div
                  key={ch.id}
                  className={`col-start-1 row-start-1 text-center sm:text-left transition-all duration-400 ease-out transform ${
                    isActive
                      ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto z-10'
                      : 'opacity-0 translate-y-4 scale-[0.98] pointer-events-none z-0'
                  }`}
                >
                  {/* Badge élégant étape & numéro */}
                  <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-[#161512]/80 backdrop-blur-md border border-[#C9A15B]/30 shadow-md">
                    <span className="text-[10px] font-mono tracking-widest text-[#C9A15B] uppercase font-semibold">
                      {ch.number}
                    </span>
                    <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#F4EFE6] font-semibold font-sans">
                      {ch.room}
                    </span>
                  </div>

                  {/* Titre principal bold, impactant et bien contrasté */}
                  <h1 className="hero-title text-[#F4EFE6] font-bold mb-2 leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                    <span>{ch.titleRegular}</span>
                    <span className="serif-italic-brass font-bold text-[#C9A15B]">{ch.titleItalic}</span>
                    {ch.titleSuffix && <span>{ch.titleSuffix}</span>}
                  </h1>

                  {/* Sous-titre clair et lisible */}
                  {ch.subtitle && (
                    <p className="text-xs sm:text-sm md:text-base text-[#F4EFE6]/90 font-medium max-w-lg leading-relaxed mb-4 md:mb-5 mx-auto sm:mx-0 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
                      {ch.subtitle}
                    </p>
                  )}

                  {/* Boutons d'action chapitre 09 */}
                  {ch.cta && (
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 pointer-events-auto">
                      <button
                        onClick={() => {
                          const el = document.getElementById('contact-final');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#C9A15B] hover:bg-[#D8B36F] text-[#0F0E0C] text-xs font-bold tracking-wider flex items-center gap-2 transition-all shadow-xl hover:shadow-[#C9A15B]/25 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>{ch.cta.primaryText}</span>
                      </button>

                      <a
                        href="https://wa.me/22900000000?text=Bonjour%20Maison%20Kèmi,%20cette%20visite%20m'a%20séduit(e).%20Je%20souhaite%20en%20savoir%20plus."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-full border border-[#25D366]/40 hover:border-[#25D366] bg-[#161512]/90 hover:bg-[#25D366]/10 text-xs text-[#F4EFE6] font-semibold tracking-wider flex items-center gap-2 transition-all hover:scale-[1.02]"
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

        {/* Indicateur discret de scroll au début de la visite (Desktop) */}
        <div
          ref={scrollHintRef}
          className="hidden md:flex absolute bottom-5 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 pointer-events-none opacity-85 transition-opacity duration-300 animate-bounce z-20"
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#C9A15B] font-medium font-sans">
            Faites défiler
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#C9A15B]" />
        </div>

        {/* Barre fine de progression de la visite en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F4EFE6]/08 overflow-hidden z-20">
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
