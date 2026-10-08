import { useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Radio,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import type { Match, MatchRound, MatchStatus } from "@/content/tournament";

interface MatchManagementProps {
  allMatches: Match[];
  activeMatchId: string;
  onSelectMatch: (matchId: string) => void;
  onUpdateStatus: (matchId: string, status: MatchStatus, winnerTeamId?: string) => void;
}

export function MatchManagement({
  allMatches,
  activeMatchId,
  onSelectMatch,
  onUpdateStatus,
}: MatchManagementProps) {
  const [filterRound, setFilterRound] = useState<"all" | MatchRound>("all");

  const preliminaries = useMemo(
    () => allMatches.filter((m) => m.round === "preliminary"),
    [allMatches],
  );
  const semiFinals = useMemo(() => allMatches.filter((m) => m.round === "semifinal"), [allMatches]);
  const finalMatch = useMemo(() => allMatches.filter((m) => m.round === "final"), [allMatches]);

  const filteredMatches = useMemo(() => {
    if (filterRound === "all") return allMatches;
    return allMatches.filter((m) => m.round === filterRound);
  }, [allMatches, filterRound]);

  const getStatusBadge = (status: MatchStatus) => {
    switch (status) {
      case "live":
        return (
          <span className="flex items-center gap-1 border border-sun bg-sun/15 px-2 py-0.5 font-type text-[10px] font-bold uppercase tracking-wider text-sun animate-pulse">
            <Radio size={11} /> LIVE NOW
          </span>
        );
      case "completed":
        return (
          <span className="flex items-center gap-1 border border-line bg-surface-raised px-2 py-0.5 font-type text-[10px] uppercase tracking-wider text-mist/70">
            <CheckCircle2 size={11} className="text-sun" /> COMPLETED
          </span>
        );
      default:
        return (
          <span className="border border-line bg-canvas px-2 py-0.5 font-type text-[10px] uppercase tracking-wider text-mist/50">
            UPCOMING
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Stage Counts and Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-line bg-surface p-4">
        <div>
          <h2 className="display text-xl text-paper tracking-wide">
            MATCH MANAGEMENT <span className="text-sun">(11 TOTAL)</span>
          </h2>
          <p className="mt-0.5 font-type text-xs uppercase tracking-wider text-mist/60">
            Progression: 8 Preliminaries (Day 1) → 2 Semifinals (Day 2) → 1 Grand Final
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 border border-line bg-canvas p-1">
          <button
            type="button"
            onClick={() => setFilterRound("all")}
            className={`px-3 py-1 font-type text-xs uppercase tracking-wider ${
              filterRound === "all"
                ? "bg-sun text-canvas font-bold"
                : "text-mist/70 hover:text-paper"
            }`}
          >
            All ({allMatches.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRound("preliminary")}
            className={`px-3 py-1 font-type text-xs uppercase tracking-wider ${
              filterRound === "preliminary"
                ? "bg-sun text-canvas font-bold"
                : "text-mist/70 hover:text-paper"
            }`}
          >
            Prelims ({preliminaries.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRound("semifinal")}
            className={`px-3 py-1 font-type text-xs uppercase tracking-wider ${
              filterRound === "semifinal"
                ? "bg-sun text-canvas font-bold"
                : "text-mist/70 hover:text-paper"
            }`}
          >
            Semifinals ({semiFinals.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRound("final")}
            className={`px-3 py-1 font-type text-xs uppercase tracking-wider ${
              filterRound === "final"
                ? "bg-sun text-canvas font-bold"
                : "text-mist/70 hover:text-paper"
            }`}
          >
            Final ({finalMatch.length})
          </button>
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-3">
        {filteredMatches.map((m) => {
          const isSelected = m.id === activeMatchId;
          const scoreA = m.scoreA?.total ?? "-";
          const scoreB = m.scoreB?.total ?? "-";

          return (
            <div
              key={m.id}
              className={`border-2 transition-all p-4 ${
                isSelected
                  ? "border-sun bg-surface-raised shadow-[4px_4px_0_rgba(255,214,0,0.3)]"
                  : "border-line bg-surface hover:border-mist/40"
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Left: Round & Schedule info */}
                <div className="min-w-[220px]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sun uppercase">
                      {m.roundLabel}
                    </span>
                    {getStatusBadge(m.status)}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 font-type text-xs text-mist/60">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {m.scheduledTime || "Schedule TBD"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {m.court || "Stage TBD"}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-1 font-serif text-xs italic text-mist/80 max-w-md">
                    &ldquo;{m.motion}&rdquo;
                  </p>
                </div>

                {/* Center: Proposition vs Opposition + Scores */}
                <div className="flex-1 border-t border-line/60 pt-3 lg:border-t-0 lg:pt-0 lg:px-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Team A */}
                    <div
                      className={`border p-2 ${
                        m.winnerTeamId === m.teamA?.id
                          ? "border-sun/60 bg-sun/10"
                          : "border-line/60 bg-canvas"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-type text-[10px] uppercase tracking-wider text-sun font-bold">
                          PROP
                        </span>
                        <span className="font-mono text-sm font-bold text-paper">{scoreA}</span>
                      </div>
                      <div className="mt-0.5 truncate font-mono text-xs text-mist">
                        {m.teamA?.name ?? "TBD"}
                      </div>
                      {m.winnerTeamId === m.teamA?.id && (
                        <span className="mt-1 inline-block text-[9px] uppercase font-bold text-sun">
                          ★ WINNER
                        </span>
                      )}
                    </div>

                    {/* Team B */}
                    <div
                      className={`border p-2 ${
                        m.winnerTeamId === m.teamB?.id
                          ? "border-hot/60 bg-hot/10"
                          : "border-line/60 bg-canvas"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-type text-[10px] uppercase tracking-wider text-hot font-bold">
                          OPP
                        </span>
                        <span className="font-mono text-sm font-bold text-paper">{scoreB}</span>
                      </div>
                      <div className="mt-0.5 truncate font-mono text-xs text-mist">
                        {m.teamB?.name ?? "TBD"}
                      </div>
                      {m.winnerTeamId === m.teamB?.id && (
                        <span className="mt-1 inline-block text-[9px] uppercase font-bold text-hot">
                          ★ WINNER
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Quick Operational Actions */}
                <div className="flex flex-wrap items-center gap-2 border-t border-line/60 pt-3 lg:border-t-0 lg:pt-0">
                  <button
                    type="button"
                    onClick={() => onSelectMatch(m.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 font-type text-xs uppercase tracking-wider ${
                      isSelected
                        ? "border-2 border-sun bg-sun text-canvas font-bold"
                        : "border border-line bg-surface-raised text-mist hover:border-sun hover:text-paper"
                    }`}
                  >
                    <span>{isSelected ? "Active Target" : "Select Match"}</span>
                    <ChevronRight size={13} />
                  </button>

                  {m.status !== "live" && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(m.id, "live")}
                      className="border border-sun/60 bg-sun/10 px-2.5 py-1.5 font-type text-xs uppercase tracking-wider text-sun hover:bg-sun hover:text-canvas transition-colors"
                      title="Set Live"
                    >
                      Set Live
                    </button>
                  )}

                  {m.status === "live" && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(m.id, "upcoming")}
                      className="border border-line bg-surface-raised px-2.5 py-1.5 font-type text-xs uppercase tracking-wider text-mist hover:text-paper"
                      title="Set to Upcoming/Paused"
                    >
                      Pause
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
