import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: Math.min(y, 24) }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "20px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Kicker({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-4 font-type text-sm uppercase tracking-widest">
      <span className="bg-ink px-2 py-1 text-sun">{n}</span>
      <span>{children}</span>
      <span className="h-px flex-1 bg-ink/30" />
    </div>
  );
}

/** Hand-drawn pink scribble strokes */
export function Scribble({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden fill="none">
      {["M20 100 L150 20", "M50 110 L185 40", "M95 112 L190 70"].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke="var(--hot)"
          strokeWidth={10 - i * 2}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.9 + i * 0.15, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

export function Underline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 20"
      className={className}
      aria-hidden
      fill="none"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M3 14 C 80 4, 160 18, 297 6"
        stroke="var(--hot)"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
      />
    </svg>
  );
}
