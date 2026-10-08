import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { editorialSpring, useFinePointer } from "@/lib/motion";

export function Magnetic({
  children,
  className = "",
  strength = 14,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const finePointer = useFinePointer();
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, editorialSpring);
  const springY = useSpring(y, editorialSpring);
  const enabled = finePointer && !reduce;
  const [hovering, setHovering] = useState(false);
  const rectRef = useRef<DOMRect | null>(null);

  return (
    <motion.span
      data-magnetic
      style={{ x: springX, y: springY }}
      animate={{ scale: hovering && enabled ? 1.035 : 1 }}
      transition={editorialSpring}
      onPointerEnter={(event) => {
        if (!enabled) return;
        rectRef.current = event.currentTarget.getBoundingClientRect();
        setHovering(true);
      }}
      onPointerMove={(event) => {
        if (!enabled || !rectRef.current) return;
        const rect = rectRef.current;
        x.set(((event.clientX - rect.left) / rect.width - 0.5) * strength * 2);
        y.set(((event.clientY - rect.top) / rect.height - 0.5) * strength * 2);
      }}
      onPointerLeave={() => {
        rectRef.current = null;
        setHovering(false);
        x.set(0);
        y.set(0);
      }}
      className={`magnetic-control inline-flex ${className}`}
    >
      {children}
    </motion.span>
  );
}
