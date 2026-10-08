import { useState, useEffect, useCallback, useMemo } from "react";
import {
  type Match,
  type MatchStatus,
  type ScoreBreakdown,
  type Team,
  type TournamentTree,
  type VotingStatus,
  type ZoneNumber,
  OFFICIAL_TEAMS,
  demoTournamentData,
} from "@/content/tournament";
import { TournamentAdminApi } from "@/lib/admin-api";

export function useAdminTournament() {
  const [tree, setTree] = useState<TournamentTree>(() => TournamentAdminApi.getTree());
  const [activeMatchId, setActiveMatchId] = useState<string>("sf-2"); // Default to live match

  // Listen to external tree changes
  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const custom = event as CustomEvent<TournamentTree>;
      if (custom.detail) {
        setTree(custom.detail);
      } else {
        setTree(TournamentAdminApi.getTree());
      }
    };

    window.addEventListener("tournament-tree-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("tournament-tree-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const allMatches = useMemo<Match[]>(() => {
    return TournamentAdminApi.getAllMatches(tree);
  }, [tree]);

  const activeMatch = useMemo<Match | undefined>(() => {
    return allMatches.find((m) => m.id === activeMatchId) || allMatches[0];
  }, [allMatches, activeMatchId]);

  // Aggregate the 16 official teams with any dynamic team state from matches
  const allTeams = useMemo<Team[]>(() => {
    const teamMap = new Map<string, Team>();
    OFFICIAL_TEAMS.forEach((t) => teamMap.set(t.id, { ...t }));

    allMatches.forEach((m) => {
      if (m.teamA) teamMap.set(m.teamA.id, { ...teamMap.get(m.teamA.id), ...m.teamA });
      if (m.teamB) teamMap.set(m.teamB.id, { ...teamMap.get(m.teamB.id), ...m.teamB });
    });

    return Array.from(teamMap.values()).sort((a, b) => a.number - b.number);
  }, [allMatches]);

  const updateScores = useCallback(
    (matchId: string, scoreA: ScoreBreakdown, scoreB: ScoreBreakdown) => {
      const res = TournamentAdminApi.updateMatchScores(matchId, scoreA, scoreB);
      if (res.success) {
        setTree(TournamentAdminApi.getTree());
      }
      return res;
    },
    [],
  );

  const updateStatus = useCallback(
    (matchId: string, status: MatchStatus, winnerTeamId?: string) => {
      const res = TournamentAdminApi.updateMatchStatus(matchId, status, winnerTeamId);
      if (res.success) {
        setTree(TournamentAdminApi.getTree());
      }
      return res;
    },
    [],
  );

  const setZone = useCallback((matchId: string, zone: ZoneNumber) => {
    const res = TournamentAdminApi.setMatchZone(matchId, zone);
    if (res.success) {
      setTree(TournamentAdminApi.getTree());
    }
  }, []);

  const toggleSwitch = useCallback((matchId: string) => {
    const res = TournamentAdminApi.toggleSwitchRound(matchId);
    if (res.success) {
      setTree(TournamentAdminApi.getTree());
    }
  }, []);

  const setVoting = useCallback((matchId: string, status: VotingStatus) => {
    const res = TournamentAdminApi.setVotingStatus(matchId, status);
    if (res.success) {
      setTree(TournamentAdminApi.getTree());
    }
  }, []);

  const updateTeam = useCallback((teamId: string, data: Partial<Team>) => {
    const res = TournamentAdminApi.updateTeam(teamId, data);
    if (res.success) {
      setTree(TournamentAdminApi.getTree());
    }
    return res;
  }, []);

  const resetTournament = useCallback(() => {
    TournamentAdminApi.saveTree(demoTournamentData);
    setTree(demoTournamentData);
  }, []);

  return {
    tree,
    allMatches,
    allTeams,
    activeMatch,
    activeMatchId,
    setActiveMatchId,
    updateScores,
    updateStatus,
    setZone,
    toggleSwitch,
    setVoting,
    updateTeam,
    resetTournament,
  };
}
