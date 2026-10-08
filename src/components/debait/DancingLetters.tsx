import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { cinematicEase, useFinePointer } from "@/lib/motion";

type DancingLettersProps = {
  active: boolean;
  className?: string;
};

type LetterConfig = {
  char: string;
  isAccent?: boolean;
  baseRotate: number;
  wobbleRange: [number, number];
  duration: number;
};

const LETTER_CONFIGS: LetterConfig[] = [
  { char: "D", baseRotate: -6, wobbleRange: [-10, -2], duration: 3.2 },
  { char: "E", baseRotate: 3, wobbleRange: [-1, 7], duration: 2.8 },
  { char: "’", isAccent: true, baseRotate: -7, wobbleRange: [-12, -2], duration: 2.4 },
  { char: "B", baseRotate: 4, wobbleRange: [1, 8], duration: 3.4 },
  { char: "A", baseRotate: -4, wobbleRange: [-8, 0], duration: 3.0 },
  { char: "I", baseRotate: 2, wobbleRange: [-2, 6], duration: 2.6 },
  { char: "T", baseRotate: 5, wobbleRange: [2, 10], duration: 3.5 },
];

function LetterNode({
  config,
  index,
  active,
  reduce,
  registerRef,
}: {
  config: LetterConfig;
  index: number;
  active: boolean;
  reduce: boolean | null;
  registerRef: (index: number, node: HTMLSpanElement | null) => void;
}) {
  const { char, isAccent, baseRotate, wobbleRange, duration } = config;

  return (
    <span
      ref={(node) => registerRef(index, node)}
      aria-hidden="true"
      className="inline-block origin-bottom will-change-transform"
      style={{
        transition: "transform 0.12s ease-out",
      }}
    >
      <motion.span
        initial={reduce ? false : { opacity: 0, y: 55, rotate: baseRotate }}
        animate={
          active
            ? !reduce
              ? {
                  opacity: 1,
                  y: [0, -8, 0, 6, 0],
                  rotate: [baseRotate, wobbleRange[0], baseRotate, wobbleRange[1], baseRotate],
                  scale: [1, 1.03, 1, 0.98, 1],
                }
              : { opacity: 1, y: 0, rotate: baseRotate }
            : { opacity: 0, y: 55, rotate: baseRotate }
        }
        transition={
          active && !reduce
            ? {
                opacity: { duration: 0.6, delay: 0.05 + index * 0.05, ease: cinematicEase },
                y: { duration, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: duration * 1.15, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: duration * 1.3, repeat: Infinity, ease: "easeInOut" },
              }
            : { duration: 0.6 }
        }
        className={`inline-block origin-bottom select-none transition-colors will-change-transform ${
          isAccent
            ? "text-hot drop-shadow-[0_0_28px_rgba(216,27,114,0.7)]"
            : "text-sun drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
        }`}
      >
        {char}
      </motion.span>
    </span>
  );
}

/**
 * High-performance, lively organic DE'BAIT kinetic wordmark.
 * Direct GPU transforms on outer container with 0 component re-renders on cursor movement.
 */
export function DancingLetters({ active, className = "" }: DancingLettersProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const finePointer = useFinePointer();
  const reduce = useReducedMotion();
  const enabled = active && finePointer && !reduce;
  const rafId = useRef<number | null>(null);

  const registerRef = useCallback((index: number, node: HTMLSpanElement | null) => {
    letterRefs.current[index] = node;
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (!enabled) return;
    const clientX = event.clientX;
    const clientY = event.clientY;

    if (rafId.current !== null) return;

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      letterRefs.current.forEach((node, idx) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(clientX - centerX, clientY - centerY);
        const radius = 240;

        if (distance < radius) {
          const power = 1 - distance / radius;
          const dirX = (centerX - clientX) / distance;
          const dirY = (centerY - clientY) / distance;

          // Elastic push away from cursor with rotational twist
          const repulseX = dirX * power * 26;
          const repulseY = dirY * power * 22 - power * 14;
          const repulseRot = (idx % 2 === 0 ? 1 : -1) * power * 12 + dirX * 8;
          const repulseScale = 1 + power * 0.12;

          node.style.transition = "transform 0.08s ease-out";
          node.style.transform = `translate3d(${repulseX.toFixed(2)}px, ${repulseY.toFixed(2)}px, 0) rotate(${repulseRot.toFixed(2)}deg) scale(${repulseScale.toFixed(3)})`;
        } else {
          node.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
          node.style.transform = "";
        }
      });
    });
  };

  const handlePointerLeave = () => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    letterRefs.current.forEach((node) => {
      if (node) {
        node.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
        node.style.transform = "";
      }
    });
  };

  useEffect(() => {
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <span
      ref={containerRef}
      aria-label="DE'BAIT"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`dancing-letters inline-flex select-none ${className}`}
    >
      {LETTER_CONFIGS.map((config, index) => (
        <LetterNode
          key={`${config.char}-${index}`}
          config={config}
          index={index}
          active={active}
          reduce={reduce}
          registerRef={registerRef}
        />
      ))}
    </span>
  );
}
