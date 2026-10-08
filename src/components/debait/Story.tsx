import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import debaters from "@/assets/debaters.png";
import { event, pillars, stages, stats } from "@/content/event";
import { Kicker, Reveal, Underline } from "./primitives";
import { ForAgainst } from "./ForAgainst";

export function Intro() {
  return (
    <section id="event" className="grain relative bg-surface px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Kicker n="01">The event</Kicker>
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <h2 className="display text-6xl md:text-8xl lg:text-9xl">
              A stage for
              <br />
              <span className="relative inline-block">
                <span className="text-hot">sharper</span>
                <Underline className="absolute -bottom-3 left-0 h-5 w-full" />
              </span>{" "}
              voices.
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="self-end">
            <p className="font-serif text-xl leading-relaxed md:text-2xl">
              DE’BAIT is the debate event by the {event.organizer}, the official public-speaking
              club of {event.college}. A two-day tournament built around articulation, spontaneous
              thinking and critical discussion.
            </p>
            <p className="mt-6 text-muted-foreground">
              Open to students from {event.streams.join(", ")}. Registration is first come, first
              served.
            </p>
          </Reveal>
        </div>
        <ul className="mt-20 grid border-t-2 border-ink md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p} delay={i * 0.1}>
              <li className="group flex items-baseline gap-4 border-b-2 border-ink py-6 md:border-b-0 md:border-r-2 md:px-6 md:last:border-r-0">
                <span className="font-type text-sm text-hot">0{i + 1}</span>
                <span className="display text-5xl transition-colors group-hover:text-hot md:text-6xl">
                  {p}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Theme() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["10%", "-30%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-35%", "5%"]);
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, -80]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-canvas py-24 text-mist md:py-32"
      aria-labelledby="theme-h"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Kicker n="02">The theme</Kicker>
      </div>
      <h2 id="theme-h" className="sr-only">
        Social Media &amp; Digital Natives
      </h2>
      <div aria-hidden className="display select-none whitespace-nowrap">
        <motion.div
          style={{ x: x1 }}
          className="text-[22vw] leading-[0.85] text-mist md:text-[16vw]"
        >
          Social Media · Social Media
        </motion.div>
        <motion.div
          style={{ x: x2 }}
          className="text-[22vw] leading-[0.85] text-transparent [-webkit-text-stroke:2px_var(--mist)] md:text-[16vw]"
        >
          &amp; Digital Natives &amp; Digital
        </motion.div>
      </div>
      <div className="relative mx-auto mt-10 grid max-w-[1400px] items-center gap-8 px-5 md:grid-cols-[1fr_1.4fr] md:px-10">
        <Reveal>
          <p className="font-hand text-3xl text-hot md:text-4xl">Every feed has two sides.</p>
          <p className="mt-4 max-w-sm font-serif text-lg text-mist/75">
            This edition’s motions orbit one theme: Social Media &amp; Digital Natives. Teams learn
            the motion before each round.
          </p>
        </Reveal>
        <motion.img
          initial={reduce ? false : { opacity: 0, scale: 1.1, clipPath: "inset(8% 0 8% 0)" }}
          whileInView={{ opacity: 0.8, scale: 1, clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: imgY }}
          src={debaters}
          alt="Illustration of two debaters at lecterns facing each other before an audience"
          width={1536}
          height={1024}
          loading="lazy"
          className="w-full mix-blend-screen opacity-80"
        />
      </div>
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <ForAgainst />
      </div>
    </section>
  );
}

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (n) => setV(Math.round(n)),
    });
    return () => c.stop();
  }, [inView, to, reduce]);
  return <span ref={ref}>{v}</span>;
}

export function Stats() {
  return (
    <section
      className="bg-canvas px-5 py-24 text-mist md:px-10 md:py-32"
      aria-label="Event at a glance"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 flex items-center gap-4 font-type text-sm uppercase tracking-widest text-mist">
          <span className="border border-line bg-surface px-2 py-1 text-sun">03</span>
          <span>At a glance</span>
          <span className="h-px flex-1 bg-line" />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div
                className="display text-[26vw] leading-none text-sun md:text-[13vw] xl:text-[180px]"
                style={{ textShadow: "4px 4px 0 rgba(0,0,0,0.85)" }}
              >
                <Count to={s.value} />
              </div>
              <div className="mt-3 flex items-center gap-3 font-type text-xs uppercase tracking-wider text-mist/85 md:text-sm">
                <span className="h-0.5 w-8 bg-hot" /> {s.label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Tournament() {
  const [active, setActive] = useState(0);
  return (
    <section id="format" className="grain relative bg-ink px-5 py-24 text-ivory md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 flex items-center gap-4 font-type text-sm uppercase tracking-widest">
          <span className="bg-sun px-2 py-1 text-ink">04</span>
          <span>The road to the final</span>
          <span className="h-px flex-1 bg-ivory/30" />
        </div>
        <Reveal>
          <h2 className="display text-5xl md:text-7xl lg:text-8xl">
            16 <span className="text-hot">→</span> 8 <span className="text-hot">→</span> SEMIFINALS{" "}
            <span className="text-hot">→</span> <span className="text-sun">FINAL</span>
          </h2>
        </Reveal>
        <ol className="mt-16 grid gap-0 md:grid-cols-4">
          {stages.map((s, i) => (
            <li key={s.name} className="relative">
              <button
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={`w-full border-l-2 py-6 pl-6 text-left transition-colors md:border-l-0 md:border-t-2 md:pl-0 md:pr-6 md:pt-8 ${
                  active === i ? "border-hot" : "border-ivory/25"
                }`}
              >
                <span
                  className={`absolute -left-[7px] top-8 h-3 w-3 rounded-full md:left-0 md:-top-[7px] ${active >= i ? "bg-hot" : "bg-ivory/40"}`}
                />
                <span className="font-type text-xs uppercase tracking-widest text-stone">
                  Stage 0{i + 1}
                </span>
                <span
                  className={`display mt-2 block text-4xl transition-colors md:text-5xl ${active === i ? "text-sun" : ""}`}
                >
                  {s.name}
                </span>
                {/* team dots */}
                <span className="mt-4 flex flex-wrap gap-1.5" aria-hidden>
                  {Array.from({ length: s.teams }).map((_, d) => (
                    <span
                      key={d}
                      className={`h-2.5 w-2.5 ${active === i ? "bg-hot" : "bg-ivory/30"} transition-colors`}
                    />
                  ))}
                </span>
                <span className="mt-4 block text-sm text-ivory/70">
                  <b className="text-ivory">{s.teams} teams.</b> {s.note}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
