import type { Match } from "@/content/tournament";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface MatchDetailModalProps {
  match?: Match;
  isOpen: boolean;
  onClose: () => void;
}

export function MatchDetailModal({ match, isOpen, onClose }: MatchDetailModalProps) {
  if (!match) return null;

  const { teamA, teamB, scoreA, scoreB, roundLabel, motion, court, completedTime } = match;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl border-4 border-ink bg-ivory p-0 shadow-[8px_8px_0_var(--ink)] sm:rounded-none">
        {/* Header */}
        <div className="border-b-4 border-ink bg-ink p-6 text-paper">
          <DialogHeader>
            <div className="flex items-center gap-2 font-type text-xs uppercase tracking-widest text-sun">
              <span>{roundLabel}</span>
              <span>·</span>
              <span>MATCH #{String(match.matchNumber).padStart(2, "0")}</span>
            </div>
            <DialogTitle className="display text-3xl text-paper md:text-4xl">
              Official Judge Summary
            </DialogTitle>
            <DialogDescription className="font-serif italic text-sm text-stone text-left">
              &ldquo;{motion}&rdquo;
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Metadata pill */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/20 pb-3 font-type text-xs text-muted-foreground">
            <span>Location: {court || "Main Stage"}</span>
            <span>
              Status: {completedTime ? `Concluded at ${completedTime}` : match.status.toUpperCase()}
            </span>
          </div>

          {/* Head to head table */}
          <div className="border-2 border-ink bg-paper">
            {/* Table Header */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr] border-b-2 border-ink bg-sun/40 p-3 font-type text-xs font-bold uppercase tracking-wider text-ink">
              <span>Judging Criterion</span>
              <span className="text-center">{teamA?.name || "Team A"}</span>
              <span className="text-center">{teamB?.name || "Team B"}</span>
            </div>

            {/* Content (Max 40) */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr] items-center border-b border-ink/20 p-3 text-sm font-type">
              <div>
                <span className="font-bold text-ink">Content</span>
                <span className="block text-[11px] text-muted-foreground">
                  Reasoning, casework &amp; evidence (max 40)
                </span>
              </div>
              <div className="display text-center text-2xl text-ink">
                {scoreA ? scoreA.content : "--"}
              </div>
              <div className="display text-center text-2xl text-ink">
                {scoreB ? scoreB.content : "--"}
              </div>
            </div>

            {/* Strategy (Max 30) */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr] items-center border-b border-ink/20 p-3 text-sm font-type">
              <div>
                <span className="font-bold text-ink">Strategy</span>
                <span className="block text-[11px] text-muted-foreground">
                  Crossfire, rebuttal &amp; POI (max 30)
                </span>
              </div>
              <div className="display text-center text-2xl text-ink">
                {scoreA ? scoreA.strategy : "--"}
              </div>
              <div className="display text-center text-2xl text-ink">
                {scoreB ? scoreB.strategy : "--"}
              </div>
            </div>

            {/* Style (Max 30) */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr] items-center border-b-2 border-ink p-3 text-sm font-type">
              <div>
                <span className="font-bold text-ink">Style</span>
                <span className="block text-[11px] text-muted-foreground">
                  Clarity, posture &amp; rhetoric (max 30)
                </span>
              </div>
              <div className="display text-center text-2xl text-ink">
                {scoreA ? scoreA.style : "--"}
              </div>
              <div className="display text-center text-2xl text-ink">
                {scoreB ? scoreB.style : "--"}
              </div>
            </div>

            {/* TOTAL (100) */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr] items-center bg-sun/60 p-4 font-type">
              <div>
                <span className="display text-xl text-ink">TOTAL SCORE</span>
                <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                  Max 100 Points
                </span>
              </div>
              <div className="display text-center text-4xl text-hot">
                {scoreA ? scoreA.total : "--"}
              </div>
              <div className="display text-center text-4xl text-hot">
                {scoreB ? scoreB.total : "--"}
              </div>
            </div>
          </div>

          {/* Winner announcement */}
          {match.winnerTeamId && (
            <div className="flex items-center justify-between border-2 border-ink bg-sun p-4 font-type shadow-[3px_3px_0_var(--ink)]">
              <span className="text-xs uppercase font-bold text-ink">OFFICIAL WINNER</span>
              <span className="display text-2xl text-ink">
                {match.winnerTeamId === teamA?.id ? teamA?.name : teamB?.name}
              </span>
            </div>
          )}

          {/* Dismiss button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="border-2 border-ink bg-ink px-6 py-2 font-type text-xs uppercase tracking-wider text-sun transition-colors hover:bg-hot hover:text-paper shadow-[2px_2px_0_var(--ink)]"
            >
              Close Summary ✕
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
