import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { scoring, switchFacts, switchTips, zones } from "@/content/event";
import { Kicker, Reveal } from "./primitives";
import { Magnetic } from "./Magnetic";

function ZoneBlock({ z, onActive }: { z: (typeof zones)[number]; onActive: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive();
  }, [inView, onActive]);
  return (
    <div
      ref={ref}
      className="flex min-h-[60vh] flex-col justify-center border-b border-ink/20 py-12 md:min-h-[75vh]"
    >
      <span className="font-type text-sm uppercase tracking-widest text-hot">Zone {z.n}</span>
      <h3 className="display mt-2 text-5xl md:text-7xl">{z.title}</h3>
      <p className="mt-6 max-w-lg font-serif text-lg leading-relaxed md:text-xl">{z.body}</p>
    </div>
  );
}

export function Zones() {
  const [active, setActive] = useState(0);
  return (
    <section className="bg-ivory px-5 py-24 md:px-10 md:py-32" aria-labelledby="zones-h">
      <div className="mx-auto max-w-[1400px]">
        <Kicker n="05">How a match flows</Kicker>
        <h2 id="zones-h" className="display max-w-4xl text-6xl md:text-8xl">
          Three zones. <span className="text-hot">One round.</span>
        </h2>
        <p className="mt-6 max-w-xl font-type text-sm uppercase tracking-wider text-muted-foreground">
          5 players per team: 3 Core Speakers on the floor, 2 Substitutes on the bench.
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <div className="sticky top-24 hidden h-[70vh] md:block">
            <div className="relative flex h-full items-center justify-center overflow-hidden bg-sun">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -60 }}
                  transition={{ duration: 0.45 }}
                  className="display text-[22vw] leading-none text-ink lg:text-[260px]"
                  aria-hidden
                >
                  {zones[active]!.n}
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-6 left-6 right-6 flex gap-2">
                {zones.map((z, i) => (
                  <div key={z.n} className="flex-1">
                    <div
                      className={`h-1.5 transition-colors ${i <= active ? "bg-hot" : "bg-ink/20"}`}
                    />
                    <p
                      className={`mt-2 font-type text-xs uppercase ${i === active ? "text-ink" : "text-ink/50"}`}
                    >
                      {z.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            {zones.map((z, i) => (
              <ZoneBlock key={z.n} z={z} onActive={() => setActive(i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SwitchRound() {
  const [side, setSide] = useState<"prop" | "switch" | "opp">("prop");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30%" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce) return;
    const t1 = setTimeout(() => setSide("switch"), 1200);
    const t2 = setTimeout(() => setSide("opp"), 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [inView, reduce]);

  const cycle = () => {
    const next = side === "opp" ? "prop" : "opp";
    setSide("switch");
    setTimeout(() => setSide(next), reduce ? 0 : 700);
  };

  const isOpp = side === "opp";
  const isSwitch = side === "switch";

  return (
    <section
      ref={ref}
      className={`grain relative overflow-hidden px-5 py-24 transition-colors duration-700 md:px-10 md:py-32 ${
        isOpp ? "bg-hot text-paper" : isSwitch ? "bg-ink text-sun" : "bg-sun text-ink"
      }`}
      aria-labelledby="switch-h"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 flex items-center gap-4 font-type text-sm uppercase tracking-widest">
          <span className="border-2 border-current px-2 py-0.5">06</span>
          <span>Rule 9 · Unannounced</span>
          <span className="h-px flex-1 bg-current opacity-30" />
        </div>
        <h2 id="switch-h" className="display text-7xl md:text-[10rem]">
          The Switch Round
        </h2>

        <div
          className="mt-12 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]"
          aria-live="polite"
        >
          <div
            className={`display text-5xl transition-all duration-500 md:text-7xl ${side === "prop" ? "opacity-100" : "opacity-30 line-through"}`}
          >
            Proposition
          </div>
          <Magnetic strength={12}>
            <button
              onClick={cycle}
              className="display mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-current text-3xl transition-transform hover:rotate-180 focus-visible:outline-4 focus-visible:outline-offset-4"
              aria-label="Switch sides"
            >
              <motion.span animate={{ rotate: isSwitch ? 180 : 0 }} transition={{ duration: 0.6 }}>
                ⇄
              </motion.span>
            </button>
          </Magnetic>
          <div
            className={`display text-5xl transition-all duration-500 md:text-right md:text-7xl ${isOpp ? "opacity-100" : "opacity-30"}`}
          >
            Opposition
          </div>
        </div>
        <p className="mt-6 text-center font-hand text-2xl">
          {isSwitch
            ? "Switch! 5 minutes on the clock."
            : isOpp
              ? "Now defend the other side."
              : "You prepared for this side…"}
        </p>

        <p className="mx-auto mt-14 max-w-2xl text-center font-serif text-xl leading-relaxed md:text-2xl">
          At one round of the organizers’ choosing, never announced in advance, both teams are told
          minutes before taking the floor that they must argue the opposite side of the motion.
        </p>

        <div className="mt-16 grid gap-px bg-current md:grid-cols-3">
          {switchFacts.map((f) => (
            <div
              key={f.k}
              className={`p-6 transition-colors duration-700 ${isOpp ? "bg-hot" : isSwitch ? "bg-ink" : "bg-sun"}`}
            >
              <p className="display text-3xl">{f.k}</p>
              <p className="mt-3 opacity-90">{f.v}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-20 font-type text-sm uppercase tracking-widest">In case of a switch</h3>
        <ol className="mt-6 grid gap-8 md:grid-cols-3">
          {switchTips.map((t, i) => (
            <li key={t.t}>
              <span className="display text-6xl opacity-40">0{i + 1}</span>
              <p className="display mt-1 text-3xl">{t.t}</p>
              <p className="mt-2 opacity-90">{t.b}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Scoring() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  return (
    <section className="bg-ivory px-5 py-24 md:px-10 md:py-32" aria-labelledby="score-h">
      <div className="mx-auto max-w-[1400px]">
        <Kicker n="07">Scoring</Kicker>
        <h2 id="score-h" className="display text-6xl md:text-8xl">
          Every round, <span className="text-hot">100 points.</span>
        </h2>
        <div ref={ref} className="mt-14">
          <div className="flex h-20 w-full overflow-hidden border-2 border-ink md:h-28">
            {scoring.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ width: 0 }}
                animate={{ width: inView ? `${s.points}%` : 0 }}
                transition={{ duration: 0.9, delay: i * 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                className={`flex items-center overflow-hidden border-r-2 border-ink px-4 last:border-r-0 ${
                  ["bg-sun", "bg-hot text-paper", "bg-ink text-sun"][i]
                }`}
              >
                <span className="display whitespace-nowrap text-3xl md:text-5xl">{s.points}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-4">
            {scoring.map((s, i) => (
              <Reveal key={s.label} delay={0.3 + i * 0.2}>
                <p className="display text-4xl">
                  {s.label} <span className="text-hot">{s.points}</span>
                </p>
                <p className="mt-1 text-muted-foreground">{s.desc}</p>
              </Reveal>
            ))}
            <Reveal delay={1.1}>
              <p className="display text-4xl">
                Total <span className="bg-sun px-2">100</span>
              </p>
              <p className="mt-1 text-muted-foreground">
                Judges’ decision for each round is final.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
