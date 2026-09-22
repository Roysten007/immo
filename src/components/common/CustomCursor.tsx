import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHoveredRef = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Désactiver complètement sur écrans tactiles
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // Position immédiate pour le point central (zéro latence)
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(${isHoveredRef.current ? 0 : 1})`;

      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target &&
          (target.tagName === 'BUTTON' ||
            target.tagName === 'A' ||
            target.tagName === 'INPUT' ||
            target.tagName === 'SELECT' ||
            target.closest('button') ||
            target.closest('a') ||
            target.getAttribute('role') === 'button')
      );

      if (isInteractive !== isHoveredRef.current) {
        isHoveredRef.current = isInteractive;
        if (isInteractive) {
          ring.classList.add('w-12', 'h-12', 'border-[#C9A15B]', 'bg-[#C9A15B]/15', 'backdrop-blur-[1px]');
          ring.classList.remove('w-8', 'h-8', 'border-[#C9A15B]/40', 'bg-transparent');
          dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(0)`;
        } else {
          ring.classList.remove('w-12', 'h-12', 'border-[#C9A15B]', 'bg-[#C9A15B]/15', 'backdrop-blur-[1px]');
          ring.classList.add('w-8', 'h-8', 'border-[#C9A15B]/40', 'bg-transparent');
          dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(1)`;
        }
      }
    };

    // Boucle RAF ultra-fluide pour l'anneau de suivi (inertie lerp 0.18)
    const renderRing = () => {
      const lerp = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerp;

      ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      rafId.current = requestAnimationFrame(renderRing);
    };

    rafId.current = requestAnimationFrame(renderRing);

    const onMouseLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const onMouseEnter = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Curseur principal petit point laiton */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#C9A15B] pointer-events-none transition-transform duration-75 will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
      {/* Anneau de suivi fluide */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none transition-[width,height,border-color,background-color] duration-200 ease-out border w-8 h-8 border-[#C9A15B]/40 bg-transparent will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
    </div>
  );
}
