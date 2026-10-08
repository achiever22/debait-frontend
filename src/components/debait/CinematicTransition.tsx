import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cinematicEase } from "@/lib/motion";

type TransitionContextValue = {
  play: (action: () => void) => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Authoritative DE'BAIT Identity Page Transition:
 * Derived from Video 2 / Fallback Storyboard:
 * 1. Current page is overtaken / consumed by atmospheric color
 * 2. Yellow + hot-magenta energetic field expands aggressively
 * 3. Giant DE'BAIT wordmark occupies the center screen with depth & scale
 * 4. Destination page emerges through the branded atmospheric reveal
 */
export function CinematicTransitionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const timers = useRef<number[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    const activeTimers = timers.current;
    return () => activeTimers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const play = useCallback(
    (action: () => void) => {
      if (reduce) {
        action();
        return;
      }
      if (activeRef.current) return;

      activeRef.current = true;
      setActive(true);

      const releaseTimer = (timer: number) => {
        const index = timers.current.indexOf(timer);
        if (index !== -1) timers.current.splice(index, 1);
      };

      // Perform navigation action while the giant DE'BAIT title and colors dominate
      const actionTimer = window.setTimeout(() => {
        releaseTimer(actionTimer);
        action();
      }, 420);

      // Complete transition cycle and reveal destination
      const completionTimer = window.setTimeout(() => {
        releaseTimer(completionTimer);
        activeRef.current = false;
        setActive(false);
      }, 980);

      timers.current.push(actionTimer, completionTimer);
    },
    [reduce],
  );

  return (
    <TransitionContext.Provider value={{ play }}>
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: cinematicEase }}
            className="pointer-events-auto fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-canvas"
          >
            {/* 1. Yellow & Hot-Magenta atmospheric field background */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.25, 1.5],
                opacity: [0, 1, 0.9],
              }}
              exit={{ opacity: 0, scale: 1.6 }}
              transition={{ duration: 0.95, ease: "easeOut" }}
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_45%_50%,rgba(216,27,114,0.92)_0%,rgba(255,214,0,0.88)_35%,rgba(5,5,5,0.98)_85%)] blur-2xl"
            />

            {/* 2. Secondary moving atmospheric glow orbs */}
            <motion.div
              initial={{ x: "-30%", y: "15%", opacity: 0 }}
              animate={{ x: "20%", y: "-10%", opacity: 0.85 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute h-[65vw] w-[65vw] rounded-full bg-sun/40 blur-[100px]"
            />
            <motion.div
              initial={{ x: "30%", y: "-20%", opacity: 0 }}
              animate={{ x: "-15%", y: "15%", opacity: 0.85 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute h-[70vw] w-[70vw] rounded-full bg-hot/50 blur-[110px]"
            />

            {/* 3. Dominant central DE'BAIT Wordmark moving through the viewer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.82, letterSpacing: "-0.04em" }}
              animate={{
                opacity: [0, 1, 1, 0.95],
                scale: [0.82, 1, 1.14],
                letterSpacing: ["-0.04em", "0.02em", "0.06em"],
              }}
              exit={{
                opacity: 0,
                scale: 1.35,
                filter: "blur(12px)",
              }}
              transition={{ duration: 0.92, ease: cinematicEase }}
              className="relative z-10 flex flex-col items-center justify-center text-center select-none"
            >
              <p className="font-type text-xs uppercase tracking-[0.4em] text-paper/85 drop-shadow-md md:text-sm">
                Orators&apos; Club MJCET
              </p>
              <h1 className="display text-[26vw] leading-none text-paper drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] md:text-[18vw] lg:text-[230px]">
                DE&apos;BAIT
              </h1>
              <p className="mt-2 font-type text-xs uppercase tracking-[0.3em] text-sun drop-shadow-md md:text-sm">
                Same minds. Different arguments.
              </p>
            </motion.div>

            {/* Subtle grain overlay */}
            <div className="grain pointer-events-none absolute inset-0 opacity-40" />
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}

// This hook intentionally shares the transition context with its provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useCinematicTransition() {
  const value = useContext(TransitionContext);
  if (!value)
    throw new Error("useCinematicTransition must be used inside CinematicTransitionProvider");
  return value;
}

type TransitionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

/** An anchor that preserves native link affordances while adding the authoritative transition. */
export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ href = "#", onClick, target, ...props }, ref) => {
    const navigate = useNavigate();
    const { play } = useCinematicTransition();

    const go = useCallback(() => {
      const validHref = href || "#";
      const [path, rawHash] = validHref.split("#");
      const hash = rawHash ? `#${rawHash}` : "";

      if (!path || path === window.location.pathname) {
        if (hash) scrollToHash(hash);
        return;
      }

      navigate({ to: path as "/" | "/register" | "/scoreboard" });
      if (hash) window.setTimeout(() => scrollToHash(hash), 80);
    }, [href, navigate]);

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        target
      ) {
        return;
      }
      event.preventDefault();
      play(go);
    };

    return <a ref={ref} href={href || "#"} target={target} onClick={handleClick} {...props} />;
  },
);

TransitionLink.displayName = "TransitionLink";
