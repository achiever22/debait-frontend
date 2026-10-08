import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type AmbientBackgroundProps = {
  className?: string;
  density?: "low" | "medium";
};

type FlowPath = {
  direction: -1 | 1;
  hue: "yellow" | "magenta" | "mist";
  phase: number;
  speed: number;
  offset: number;
};

const colors = {
  yellow: "255, 214, 0",
  magenta: "216, 27, 114",
  mist: "245, 245, 240",
} as const;

/**
 * A deliberately quiet field of argument paths. It is one reusable canvas,
 * pauses outside the viewport/tab, and is never used together with the intro canvas.
 */
export function AmbientBackground({ className = "", density = "medium" }: AmbientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduce) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const compact = window.matchMedia("(max-width: 767px)");
    const pathCount = density === "low" ? 5 : compact.matches ? 5 : 9;
    const paths: FlowPath[] = Array.from({ length: pathCount }, (_, index) => ({
      direction: index % 2 === 0 ? -1 : 1,
      hue: index % 5 === 0 ? "magenta" : index % 3 === 0 ? "mist" : "yellow",
      phase: Math.random(),
      speed: 0.028 + Math.random() * 0.022,
      offset: 0.12 + Math.random() * 0.76,
    }));

    let frame = 0;
    let visible = !document.hidden;
    let inView = true;
    let last = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, compact.matches ? 1.2 : 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time: number) => {
      if (!visible || !inView) {
        frame = 0;
        return;
      }

      const elapsed = last === 0 ? 0 : (time - last) / 1000;
      last = time;
      context.clearRect(0, 0, width, height);
      context.lineCap = "round";

      paths.forEach((path, index) => {
        path.phase = (path.phase + elapsed * path.speed) % 1;
        const startX = path.direction < 0 ? -width * 0.08 : width * 1.08;
        const startY = height * path.offset;
        const centerX = width * (0.48 + Math.sin((time / 9000 + index) * 1.4) * 0.05);
        const centerY = height * (0.5 + Math.cos((time / 11000 + index) * 1.2) * 0.08);
        const controlX = width * (path.direction < 0 ? 0.28 : 0.72);
        const controlY = startY + (centerY - startY) * 0.2;
        const color = colors[path.hue];

        context.beginPath();
        context.moveTo(startX, startY);
        context.bezierCurveTo(controlX, controlY, centerX, centerY, centerX, centerY);
        context.strokeStyle = `rgba(${color}, ${path.hue === "mist" ? 0.026 : 0.065})`;
        context.lineWidth = path.hue === "mist" ? 0.55 : 0.8;
        context.stroke();

        const travel = path.phase;
        const inverse = 1 - travel;
        const particleX =
          inverse * inverse * inverse * startX +
          3 * inverse * inverse * travel * controlX +
          3 * inverse * travel * travel * centerX +
          travel * travel * travel * centerX;
        const particleY =
          inverse * inverse * inverse * startY +
          3 * inverse * inverse * travel * controlY +
          3 * inverse * travel * travel * centerY +
          travel * travel * travel * centerY;

        context.beginPath();
        context.arc(particleX, particleY, compact.matches ? 1 : 1.4, 0, Math.PI * 2);
        context.fillStyle = `rgba(${color}, 0.16)`;
        context.fill();
      });

      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!frame && visible && inView) frame = requestAnimationFrame(draw);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) start();
      else stop();
    };
    const onCompactChange = () => {
      resize();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        if (inView) start();
        else stop();
      },
      { threshold: 0 },
    );

    resize();
    observer.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    compact.addEventListener("change", onCompactChange);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      compact.removeEventListener("change", onCompactChange);
    };
  }, [density, reduce]);

  return (
    <canvas ref={canvasRef} aria-hidden="true" className={`ambient-background ${className}`} />
  );
}
