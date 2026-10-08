import { motion, useReducedMotion } from "motion/react";
import { type PointerEvent, useState } from "react";
import { cinematicEase, useFinePointer } from "@/lib/motion";

type Side = "for" | "against" | null;

export function ForAgainst() {
  const [active, setActive] = useState<Side>(null);
  const reduce = useReducedMotion();
  const finePointer = useFinePointer();
  const interactive = finePointer && !reduce;

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setActive(event.clientX - rect.left < rect.width / 2 ? "for" : "against");
  };

  return (
    <div
      data-magnetic
      onPointerMove={onMove}
      onPointerLeave={() => setActive(null)}
      className="for-against mt-14 flex min-h-48 overflow-hidden border border-line md:min-h-64"
      aria-label="For and against debate interaction"
    >
      <motion.div
        animate={{ flex: active === "for" ? 1.18 : active === "against" ? 0.82 : 1 }}
        transition={{ duration: 0.5, ease: cinematicEase }}
        className="flex min-w-0 items-end bg-sun p-5 text-canvas md:p-8"
      >
        <div>
          <p className="font-type text-[10px] uppercase tracking-[0.22em] opacity-65">
            Proposition
          </p>
          <p className="display mt-2 text-6xl md:text-8xl">For</p>
        </div>
      </motion.div>
      <motion.div
        animate={{ flex: active === "against" ? 1.18 : active === "for" ? 0.82 : 1 }}
        transition={{ duration: 0.5, ease: cinematicEase }}
        className="flex min-w-0 items-end justify-end bg-hot p-5 text-mist md:p-8"
      >
        <div className="text-right">
          <p className="font-type text-[10px] uppercase tracking-[0.22em] text-mist/65">
            Opposition
          </p>
          <p className="display mt-2 text-5xl md:text-8xl">Against</p>
        </div>
      </motion.div>
    </div>
  );
}
