import { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  event,
  previewMatch,
  liveMatch,
  rules,
  schedule,
  teams,
  type LiveMatch,
  type Team,
} from "@/content/event";
import logoMark from "@/assets/logo-mark.png";
import { Kicker, Reveal, Scribble } from "./primitives";
import { Magnetic } from "./Magnetic";
import { TransitionLink } from "./CinematicTransition";

export function Schedule() {
  const [day, setDay] = useState(0);
  return (
    <section
      id="schedule"
      className="grain relative bg-ivory px-5 py-24 md:px-10 md:py-32"
      aria-labelledby="sch-h"
    >
      <div className="mx-auto max-w-[1400px]">
        <Kicker n="08">Schedule</Kicker>
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 id="sch-h" className="display text-6xl md:text-8xl">
              Two days.
              <br />
              <span className="text-hot">One stage.</span>
            </h2>
            <p className="mt-6 font-type text-sm uppercase tracking-wider">{event.venue}</p>
            <p className="mt-2 inline-block bg-sun px-2 py-1 font-type text-xs uppercase tracking-wider">
              {event.timeNote}
            </p>
            <div className="mt-10 flex gap-3" role="tablist" aria-label="Choose day">
              {schedule.map((d, i) => (
                <Magnetic key={d.label} strength={8}>
                  <button
                    role="tab"
                    aria-selected={day === i}
                    onClick={() => setDay(i)}
                    className={`border-2 border-ink px-5 py-3 text-left transition-colors ${day === i ? "bg-ink text-sun" : "hover:bg-sun"}`}
                  >
                    <span className="display block text-3xl">{d.label}</span>
                    <span className="font-type text-xs uppercase">{d.date}</span>
                  </button>
                </Magnetic>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.ol
              key={day}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="border-t-2 border-ink"
              role="tabpanel"
            >
              {schedule[day]!.items.map((it) => {
                const big = /Round|finals|Final/.test(it.title);
                return (
                  <li
                    key={it.time}
                    className="group grid grid-cols-[110px_1fr] items-baseline gap-4 border-b border-ink/25 py-5 md:grid-cols-[160px_1fr]"
                  >
                    <span className="font-type text-sm text-hot md:text-base">{it.time}</span>
                    <span
                      className={`${big ? "display text-3xl md:text-5xl" : "font-serif text-lg md:text-xl"} transition-transform group-hover:translate-x-2`}
                    >
                      {it.title}
                    </span>
                  </li>
                );
              })}
            </motion.ol>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export function TeamCard({ team }: { team: Team }) {
  const filled = !!team.name;
  return (
    <div
      className={`group relative aspect-[4/5] border-2 border-ink p-4 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--hot)] ${
        filled ? "bg-paper" : "bg-ivory"
      }`}
    >
      <span
        className="display text-6xl text-sun md:text-7xl"
        style={{ textShadow: "3px 3px 0 var(--ink)" }}
      >
        {String(team.number).padStart(2, "0")}
      </span>
      <div className="absolute inset-x-4 bottom-4">
        <p className="display text-2xl">{team.name ?? "Slot open"}</p>
        <p className="font-type text-xs uppercase text-muted-foreground">
          {team.status ?? "Awaiting registration"}
          {team.currentRound ? ` · ${team.currentRound}` : ""}
        </p>
        {team.members && <p className="mt-1 text-xs">{team.members.join(", ")}</p>}
      </div>
    </div>
  );
}

export function Teams() {
  return (
    <section id="teams" className="bg-paper px-5 py-24 md:px-10 md:py-32" aria-labelledby="teams-h">
      <div className="mx-auto max-w-[1400px]">
        <Kicker n="09">The teams</Kicker>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="teams-h" className="display text-6xl md:text-8xl">
            Sixteen <span className="text-hot">seats.</span>
          </h2>
          <p className="max-w-sm font-serif text-lg">
            Teams of five from {event.streams.join(", ")}. Line-ups appear here once registration
            closes.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {teams.map((t) => (
            <TeamCard key={t.number} team={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Rules() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="rules" className="bg-ivory px-5 py-24 md:px-10 md:py-32" aria-labelledby="rules-h">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[1fr_1.6fr]">
        <div>
          <Kicker n="10">Rules</Kicker>
          <h2 id="rules-h" className="display text-6xl md:text-8xl">
            Know the
            <br />
            <span className="text-hot">floor.</span>
          </h2>
        </div>
        <ul className="border-t-2 border-ink">
          {rules.map((r, i) => {
            const isOpen = open === i;
            return (
              <li key={r.title} className="border-b-2 border-ink">
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`rule-${i}`}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left hover:text-hot focus-visible:outline-2 focus-visible:outline-hot"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-type text-sm text-hot">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="display text-3xl md:text-4xl">{r.title}</span>
                    </span>
                    <Plus
                      className={`shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`rule-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 pl-10 font-serif text-lg leading-relaxed">
                        {r.body}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function LiveScorecard({ match, preview }: { match: LiveMatch; preview?: boolean }) {
  return (
    <div className="relative border-2 border-ivory/20 bg-ink p-6 md:p-8">
      {preview && (
        <span className="absolute -top-3 left-6 bg-sun px-2 py-0.5 font-type text-xs uppercase text-ink">
          Design preview · not real data
        </span>
      )}
      <div className="flex items-center justify-between font-type text-xs uppercase tracking-widest text-stone">
        <span>{match.round}</span>
        <span className="flex items-center gap-2">
          <span className="pulse-dot h-2 w-2 rounded-full bg-hot" /> Zone 0{match.zone}
        </span>
      </div>
      <p className="mt-3 font-serif italic text-ivory/70">{match.motion}</p>
      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div>
          <p className="font-type text-xs uppercase text-stone">Proposition</p>
          <p className="display text-3xl text-ivory">{match.proposition.name}</p>
          <p className="display text-6xl text-sun">{match.proposition.score}</p>
        </div>
        <span className="display text-3xl text-hot">vs</span>
        <div className="text-right">
          <p className="font-type text-xs uppercase text-stone">Opposition</p>
          <p className="display text-3xl text-ivory">{match.opposition.name}</p>
          <p className="display text-6xl text-sun">{match.opposition.score}</p>
        </div>
      </div>
      <div className="mt-8">
        <p className="font-type text-xs uppercase tracking-widest text-stone">Audience vote</p>
        <div className="mt-2 flex h-4 overflow-hidden">
          <div className="bg-sun" style={{ width: `${match.votes.proposition}%` }} />
          <div className="bg-hot" style={{ width: `${match.votes.opposition}%` }} />
        </div>
        <div className="mt-1 flex justify-between font-type text-xs text-ivory/70">
          <span>{match.votes.proposition}%</span>
          <span>{match.votes.opposition}%</span>
        </div>
      </div>
    </div>
  );
}

export function Live() {
  return (
    <section
      id="live"
      className="grain-dark relative overflow-hidden bg-ink px-5 py-24 text-ivory md:px-10 md:py-32"
      aria-labelledby="live-h"
    >
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 md:grid-cols-2">
        <div>
          <div className="mb-8 flex items-center gap-4 font-type text-sm uppercase tracking-widest">
            <span className="bg-hot px-2 py-1 text-paper">11</span>
            <span>Coming soon</span>
          </div>
          <h2 id="live-h" className="display text-7xl md:text-9xl">
            Watch it
            <br />
            <span className="text-sun">live.</span>
          </h2>
          <p className="mt-6 max-w-md font-serif text-xl text-ivory/80">
            A live companion is on the way: the current match, competing teams, official scorecards,
            the bracket as it moves, and audience voting.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2 font-type text-xs uppercase">
            {["Current match", "Teams", "Scorecards", "Bracket", "Audience vote"].map((x) => (
              <li key={x} className="border border-ivory/30 px-3 py-1.5">
                {x}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Magnetic>
              <TransitionLink
                href="/scoreboard"
                className="btn-hot inline-flex items-center gap-2 border-2 border-sun text-base"
              >
                <span>ENTER LIVE SCOREBOARD</span>
                <span>→</span>
              </TransitionLink>
            </Magnetic>
          </div>
        </div>
        <Reveal>
          {liveMatch ? (
            <LiveScorecard match={liveMatch} />
          ) : (
            <LiveScorecard match={previewMatch} preview />
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function Closing() {
  return (
    <section className="grain relative overflow-hidden bg-sun px-5 pb-10 pt-28 text-ink md:px-10 md:pt-40">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="display text-[17vw] leading-[0.85] text-ink md:text-[12vw]">Same minds.</p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="display text-[17vw] leading-[0.85] text-ink md:text-[12vw]">Different</p>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="display text-[17vw] leading-[0.85] text-hot md:text-[12vw]">arguments.</p>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="font-type mt-6 max-w-2xl text-base uppercase tracking-widest text-ink/85 md:text-xl">
            16 teams. 2 days. 3 rounds. One stage. Orators&rsquo; Club MJCET.
          </p>
        </Reveal>
        <div className="relative mt-12 inline-block">
          <p className="font-hand text-4xl text-ink md:text-6xl">Make your point.</p>
          <Scribble className="absolute -right-24 -top-12 w-28" />
        </div>

        <footer className="mt-28 grid gap-8 border-t-2 border-ink pt-8 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <img
              src={logoMark}
              alt="Orators' Club MJCET, Dept. of English"
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <p className="display text-2xl">{event.organizer}</p>
              <p className="font-type text-xs uppercase">{event.college} · Dept. of English</p>
            </div>
          </div>
          <div className="font-type text-sm">
            <p className="uppercase">Contact</p>
            {event.contacts.map((c) => (
              <p key={c.phone}>
                {c.name} —{" "}
                <a className="underline hover:text-hot" href={`tel:+91${c.phone}`}>
                  {c.phone}
                </a>
              </p>
            ))}
          </div>
          <div className="font-type text-sm md:text-right">
            <p className="uppercase">{event.venue}</p>
            <a
              className="underline hover:text-hot"
              href={event.instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              {event.instagram}
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
