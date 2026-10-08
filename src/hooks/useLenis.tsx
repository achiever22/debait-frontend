import Lenis from "lenis";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type LenisControls = {
  isReducedMotion: boolean;
  start: () => void;
  stop: () => void;
};

const LenisContext = createContext<LenisControls | null>(null);

function getReducedMotionPreference() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(getReducedMotionPreference);

  const stop = useCallback(() => lenisRef.current?.stop(), []);
  const start = useCallback(() => lenisRef.current?.start(), []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setIsReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (isReducedMotion || typeof window === "undefined" || typeof ResizeObserver === "undefined")
      return;

    try {
      const lenis = new Lenis({
        duration: 1.08,
        easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 0.92,
        touchMultiplier: 1.35,
        infinite: false,
      });
      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);
    } catch (e) {
      console.warn("Lenis initialization skipped:", e);
    }

    return () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [isReducedMotion]);

  const value = useMemo<LenisControls>(
    () => ({ isReducedMotion, start, stop }),
    [isReducedMotion, start, stop],
  );

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  const value = useContext(LenisContext);
  if (!value) throw new Error("useLenis must be used inside LenisProvider");
  return value;
}
