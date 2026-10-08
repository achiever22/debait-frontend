import { useMemo } from "react";
import { CheckCircle2, Award, Clock } from "lucide-react";
import type { Match } from "@/content/tournament";

interface RecentResultsProps {
  allMatches: Match[];
  onSelectMatch: (matchId: string) => void;
}

export function RecentResults({ allMatches, onSelectMatch }: RecentResultsProps) {
  const completedMatches = useMemo(
    () => allMatches.filter((m) => m.status === "completed"),
    [allMatches],
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-line bg-surface p-4">
        <div>
          <h2 className="display text-xl text-paper tracking-wide">
            RECENT RESULTS &amp; OFFICIAL MARKS
          </h2>
          <p className="mt-0.5 font-type text-xs uppercase tracking-wider text-mist/60">
            Adjudicated rounds with verified judge scores (Content 40 / Strategy 30 / Style 30)
          </p>
        </div>
        <div className="border border-line bg-canvas px-3 py-1 font-mono text-xs text-sun">
          {completedMatches.length} / {allMatches.length} MATCHES CONCLUDED
        </div>
      </div>

      {completedMatches.length === 0 ? (
        <div className="border-2 border-line bg-surface p-8 text-center font-type text-mist/60">
          No matches marked as completed yet. Use &ldquo;Live Control&rdquo; or &ldquo;Score
          Entry&rdquo; to complete rounds.
        </div>
      ) : (
        <div className="space-y-4">
          {completedMatches.map((m) => {
            const winnerTeam =
              m.winnerTeamId === m.teamA?.id
                ? m.teamA
                : m.winnerTeamId === m.teamB?.id
                  ? m.teamB
                  : undefined;

            return (
              <div
                key={m.id}
                className="border-2 border-line bg-surface p-5 hover:border-mist/40 transition-colors"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sun uppercase">
                      {m.roundLabel}
                    </span>
                    <span className="font-type text-xs uppercase text-mist/60">{m.stageName}</span>
                    {m.completedTime && (
                      <span className="flex items-center gap-1 font-mono text-xs text-mist/50">
                        <Clock size={11} /> Concluded at {m.completedTime}
                      </span>
                    )}
                  </div>

                  {winnerTeam && (
                    <div className="flex items-center gap-1.5 border border-sun bg-sun/15 px-3 py-1 font-type text-xs font-bold uppercase tracking-wider text-sun">
                      <Award size={13} />
                      <span>WINNER: {winnerTeam.name}</span>
                    </div>
                  )}
                </div>

                {/* Motion */}
                <p className="mt-3 font-serif text-sm italic text-mist/80">
                  &ldquo;{m.motion}&rdquo;
                </p>

                {/* Teams & Score breakdown comparison */}
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Proposition */}
                  <div
                    className={`border p-3 ${
                      m.winnerTeamId === m.teamA?.id
                        ? "border-sun bg-sun/5"
                        : "border-line bg-canvas/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-type text-xs font-bold uppercase text-sun">PROP</span>
                        <span className="font-mono text-sm font-bold text-paper">
                          {m.teamA?.name ?? "Proposition"}
                        </span>
                      </div>
                      <span className="font-mono text-xl font-bold text-paper">
                        {m.scoreA?.total ?? "-"}
                      </span>
                    </div>

                    {m.scoreA && (
                      <div className="mt-2 grid grid-cols-3 gap-2 border-t border-line/60 pt-2 font-mono text-[11px] text-mist/70">
                        <div>
                          <span className="text-mist/40 block text-[9px] uppercase">
                            Content /40
                          </span>
                          <span>{m.scoreA.content}</span>
                        </div>
                        <div>
                          <span className="text-mist/40 block text-[9px] uppercase">
                            Strategy /30
                          </span>
                          <span>{m.scoreA.strategy}</span>
                        </div>
                        <div>
                          <span className="text-mist/40 block text-[9px] uppercase">Style /30</span>
                          <span>{m.scoreA.style}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Opposition */}
                  <div
                    className={`border p-3 ${
                      m.winnerTeamId === m.teamB?.id
                        ? "border-hot bg-hot/5"
                        : "border-line bg-canvas/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-type text-xs font-bold uppercase text-hot">OPP</span>
                        <span className="font-mono text-sm font-bold text-paper">
                          {m.teamB?.name ?? "Opposition"}
                        </span>
                      </div>
                      <span className="font-mono text-xl font-bold text-paper">
                        {m.scoreB?.total ?? "-"}
                      </span>
                    </div>

                    {m.scoreB && (
                      <div className="mt-2 grid grid-cols-3 gap-2 border-t border-line/60 pt-2 font-mono text-[11px] text-mist/70">
                        <div>
                          <span className="text-mist/40 block text-[9px] uppercase">
                            Content /40
                          </span>
                          <span>{m.scoreB.content}</span>
                        </div>
                        <div>
                          <span className="text-mist/40 block text-[9px] uppercase">
                            Strategy /30
                          </span>
                          <span>{m.scoreB.strategy}</span>
                        </div>
                        <div>
                          <span className="text-mist/40 block text-[9px] uppercase">Style /30</span>
                          <span>{m.scoreB.style}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer action */}
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onSelectMatch(m.id)}
                    className="border border-line bg-surface-raised px-3 py-1 font-type text-xs uppercase text-mist hover:border-sun hover:text-paper"
                  >
                    Edit / Review in Score Entry
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
