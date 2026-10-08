import type { Match } from "@/content/tournament";

interface LiveMatchesProps {
  matches: Match[];
  selectedMatchId?: string;
  onSelectMatch: (matchId: string) => void;
}

export function LiveMatches({ matches, selectedMatchId, onSelectMatch }: LiveMatchesProps) {
  return (
    <section id="live-section" className="py-8" aria-label="Current Live Matches">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-3">
        <div>
          <div className="flex items-center gap-2 font-type text-xs uppercase tracking-widest text-ink">
            <span className="pulse-dot h-2 w-2 rounded-full bg-hot" />
            <span className="font-bold text-hot">STAGE 02</span>
            <span>·</span>
            <span>Real-Time Arena</span>
          </div>
          <h2 className="display text-4xl text-ink md:text-5xl">
            Live <span className="text-hot">Now.</span>
          </h2>
        </div>

        <div className="font-type text-xs text-muted-foreground">
          {matches.length > 0 ? (
            <span className="text-ink font-bold">
              {matches.length} active debate{matches.length > 1 ? "s" : ""} on floor
            </span>
          ) : (
            <span>No active match</span>
          )}
        </div>
      </div>

      {matches.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {matches.map((match) => {
            const isSelected = selectedMatchId === match.id;
            return (
              <div
                key={match.id}
                className={`relative border-4 transition-all ${
                  isSelected
                    ? "border-hot bg-sun/15 shadow-[6px_6px_0_var(--hot)]"
                    : "border-ink bg-paper shadow-[4px_4px_0_var(--ink)] hover:-translate-y-1"
                }`}
              >
                {/* Header status */}
                <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-4 py-2 text-paper font-type text-xs uppercase">
                  <div className="flex items-center gap-2 text-sun font-bold">
                    <span>{match.roundLabel}</span>
                    <span>·</span>
                    <span>ZONE 0{match.zone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-hot font-bold bg-paper px-2 py-0.5">
                    <span className="pulse-dot h-2 w-2 rounded-full bg-hot" />
                    MATCH IN PROGRESS
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <p className="font-serif italic text-sm text-muted-foreground mb-4">
                    &ldquo;{match.motion}&rdquo;
                  </p>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
                    <div>
                      <span className="font-type text-[10px] uppercase text-muted-foreground">
                        PROPOSITION
                      </span>
                      <h4 className="display text-3xl text-ink">{match.teamA?.name || "Team A"}</h4>
                      <p className="display text-5xl text-hot mt-1">
                        {match.scoreA?.total ?? "--"}
                      </p>
                    </div>

                    <div className="display text-3xl text-hot italic">VS</div>

                    <div>
                      <span className="font-type text-[10px] uppercase text-muted-foreground">
                        OPPOSITION
                      </span>
                      <h4 className="display text-3xl text-ink">{match.teamB?.name || "Team B"}</h4>
                      <p className="display text-5xl text-hot mt-1">
                        {match.scoreB?.total ?? "--"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-ink/20 pt-4">
                    <span className="font-type text-xs text-stone">
                      {match.court || "Zone 01 · Main Stage"}
                    </span>
                    <button
                      onClick={() => onSelectMatch(match.id)}
                      className={`border-2 border-ink px-4 py-2 font-type text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0_var(--ink)] ${
                        isSelected
                          ? "bg-ink text-sun font-bold"
                          : "bg-sun text-ink hover:bg-hot hover:text-paper"
                      }`}
                    >
                      {isSelected ? "✓ CURRENTLY VIEWING" : "VIEW SCORECARD →"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="border-2 border-dashed border-ink/40 bg-ivory p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-sun text-xl">
            ⏳
          </div>
          <h3 className="display mt-4 text-3xl text-ink">NO MATCH IS CURRENTLY LIVE</h3>
          <p className="mx-auto mt-2 max-w-md font-serif text-base text-muted-foreground">
            The arguments have paused or the next round is being briefed. Once the buzzer rings and
            the teams take the floor, the live scorecard and audience voting will stream here in
            real time.
          </p>
          <div className="mt-6 inline-block border border-ink bg-paper px-4 py-1.5 font-type text-xs uppercase text-ink">
            Reporting &amp; Briefing Underway · Check Schedule on Main Site
          </div>
        </div>
      )}
    </section>
  );
}
