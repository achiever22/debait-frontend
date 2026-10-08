import { useState, useEffect, useCallback, useMemo } from "react";
import {
  type TournamentTree,
  type Match,
  type UserVote,
  type ZoneNumber,
  demoTournamentData,
  emptyTournamentData,
} from "@/content/tournament";

const STORAGE_VOTES_KEY = "debait_user_votes_v1";
const STORAGE_MODE_KEY = "debait_tournament_mode_v1";

export function useTournament() {
  // 'demo' (active live tournament simulation) vs 'empty' (pure pre-event bracket)
  const [dataMode, setDataMode] = useState<"demo" | "empty">("demo");
  const [tree, setTree] = useState<TournamentTree>(demoTournamentData);
  const [selectedMatchId, setSelectedMatchId] = useState<string>("sf-2"); // Default to live semifinal
  const [modalMatchId, setModalMatchId] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, UserVote>>({});

  // Load votes, tree and mode preference from storage
  useEffect(() => {
    try {
      const savedTree = localStorage.getItem("debait_tournament_tree_v1");
      if (savedTree) {
        setTree(JSON.parse(savedTree));
      }
      const savedVotes = localStorage.getItem(STORAGE_VOTES_KEY);
      if (savedVotes) {
        setUserVotes(JSON.parse(savedVotes));
      }
      const savedMode = localStorage.getItem(STORAGE_MODE_KEY);
      if (savedMode === "empty" || savedMode === "demo") {
        setDataMode(savedMode);
        if (!savedTree) {
          setTree(savedMode === "demo" ? demoTournamentData : emptyTournamentData);
        }
      }
    } catch {
      // ignore in SSR or restricted environments
    }

    const handleTreeUpdate = (event: Event) => {
      const custom = event as CustomEvent<TournamentTree>;
      if (custom.detail) {
        setTree(custom.detail);
      } else {
        try {
          const savedTree = localStorage.getItem("debait_tournament_tree_v1");
          if (savedTree) {
            setTree(JSON.parse(savedTree));
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("tournament-tree-updated", handleTreeUpdate);
    window.addEventListener("storage", handleTreeUpdate);
    return () => {
      window.removeEventListener("tournament-tree-updated", handleTreeUpdate);
      window.removeEventListener("storage", handleTreeUpdate);
    };
  }, []);

  const switchDataMode = useCallback((mode: "demo" | "empty") => {
    setDataMode(mode);
    setTree(mode === "demo" ? demoTournamentData : emptyTournamentData);
    try {
      localStorage.setItem(STORAGE_MODE_KEY, mode);
    } catch {
      // ignore
    }
  }, []);

  // All matches flattened
  const allMatches = useMemo<Match[]>(() => {
    return [...(tree.preliminaries || []), ...(tree.semiFinals || []), tree.final].filter(Boolean);
  }, [tree]);

  // Current live matches
  const liveMatches = useMemo<Match[]>(() => {
    return allMatches.filter((m) => m.status === "live");
  }, [allMatches]);

  // Selected match object
  const activeMatch = useMemo<Match | undefined>(() => {
    return allMatches.find((m) => m.id === selectedMatchId) || liveMatches[0] || allMatches[0];
  }, [allMatches, selectedMatchId, liveMatches]);

  // Match for detail modal
  const modalMatch = useMemo<Match | undefined>(() => {
    if (!modalMatchId) return undefined;
    return allMatches.find((m) => m.id === modalMatchId);
  }, [allMatches, modalMatchId]);

  // Cast audience vote
  const castVote = useCallback(
    (matchId: string, teamId: string) => {
      // Record vote in user state
      const newVote: UserVote = { matchId, teamId, timestamp: Date.now() };
      const updatedUserVotes = { ...userVotes, [matchId]: newVote };
      setUserVotes(updatedUserVotes);
      try {
        localStorage.setItem(STORAGE_VOTES_KEY, JSON.stringify(updatedUserVotes));
      } catch {
        // ignore
      }

      // Update match vote percentage in memory
      setTree((prevTree) => {
        const updateMatch = (match: Match): Match => {
          if (match.id !== matchId) return match;
          const isTeamA = match.teamA?.id === teamId;
          const currentTotal = match.votes.totalVotes || 100;
          const newTotal = currentTotal + 1;

          // Recompute distribution
          let newPctA = match.votes.teamA;
          let newPctB = match.votes.teamB;

          if (isTeamA) {
            newPctA = Math.min(
              99,
              Math.round((((match.votes.teamA * currentTotal) / 100 + 1) / newTotal) * 100),
            );
            newPctB = 100 - newPctA;
          } else {
            newPctB = Math.min(
              99,
              Math.round((((match.votes.teamB * currentTotal) / 100 + 1) / newTotal) * 100),
            );
            newPctA = 100 - newPctB;
          }

          return {
            ...match,
            votes: {
              teamA: newPctA,
              teamB: newPctB,
              totalVotes: newTotal,
            },
          };
        };

        return {
          ...prevTree,
          preliminaries: (prevTree.preliminaries || []).map(updateMatch),
          semiFinals: (prevTree.semiFinals || []).map(updateMatch),
          final: updateMatch(prevTree.final),
        };
      });
    },
    [userVotes],
  );

  // Simulation controls for testing realtime transitions
  const setMatchZone = useCallback((matchId: string, zone: ZoneNumber) => {
    setTree((prevTree) => {
      const update = (m: Match): Match => (m.id === matchId ? { ...m, zone } : m);
      return {
        ...prevTree,
        preliminaries: (prevTree.preliminaries || []).map(update),
        semiFinals: (prevTree.semiFinals || []).map(update),
        final: update(prevTree.final),
      };
    });
  }, []);

  const toggleSwitchRound = useCallback((matchId: string) => {
    setTree((prevTree) => {
      const update = (m: Match): Match =>
        m.id === matchId ? { ...m, switchRoundTriggered: !m.switchRoundTriggered } : m;
      return {
        ...prevTree,
        preliminaries: (prevTree.preliminaries || []).map(update),
        semiFinals: (prevTree.semiFinals || []).map(update),
        final: update(prevTree.final),
      };
    });
  }, []);

  return {
    tree,
    dataMode,
    switchDataMode,
    allMatches,
    liveMatches,
    activeMatch,
    selectedMatchId,
    setSelectedMatchId,
    modalMatch,
    modalMatchId,
    setModalMatchId,
    userVotes,
    castVote,
    setMatchZone,
    toggleSwitchRound,
  };
}
