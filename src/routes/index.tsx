import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { Nav } from "@/components/debait/Nav";
import { OpeningSequence } from "@/components/debait/OpeningSequence";
import { Hero } from "@/components/debait/Hero";
import { Intro, Stats, Theme, Tournament } from "@/components/debait/Story";
import { Scoring, SwitchRound, Zones } from "@/components/debait/Match";
import { Closing, Live, Rules, Schedule, Teams } from "@/components/debait/Info";
import { FAQ } from "@/components/debait/FAQ";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DE'BAIT — Same Minds, Different Arguments | Orators' Club MJCET" },
      {
        name: "description",
        content:
          "DE'BAIT, the two-day debate tournament by Orators' Club MJCET. 16 teams, theme: Social Media & Digital Natives.",
      },
      { property: "og:title", content: "DE'BAIT — Same Minds, Different Arguments" },
      {
        property: "og:description",
        content:
          "16 teams. 2 days. 3 rounds. One stage. Orators' Club MJCET debate championship on Social Media & Digital Natives.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [heroReady, setHeroReady] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroReveal = useCallback(() => setHeroReady(true), []);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <main
      className="cinematic-site relative isolate overflow-hidden bg-canvas"
      data-intro-complete={introComplete}
    >
      <OpeningSequence onReveal={handleIntroReveal} onComplete={handleIntroComplete} />
      <div className="relative z-10">
        <Nav introReady={heroReady} />
        <Hero introReady={heroReady} />
        <Intro />
        <Theme />
        <Stats />
        <Tournament />
        <Zones />
        <SwitchRound />
        <Scoring />
        <Schedule />
        <Teams />
        <Rules />
        <FAQ />
        <Live />
        <Closing />
      </div>
    </main>
  );
}
