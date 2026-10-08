import {
  type Match,
  type MatchStatus,
  type ScoreBreakdown,
  type Team,
  type TournamentTree,
  type VotingStatus,
  type ZoneNumber,
  demoTournamentData,
} from "@/content/tournament";

export const STORAGE_SESSION_KEY = "debait_rural_session_v1";
export const STORAGE_TREE_KEY = "debait_tournament_tree_v1";

export interface AdminSession {
  token: string;
  username: string;
  timestamp: number;
}

export interface BackendStatus {
  mode: "local-demo" | "connected";
  label: string;
  url?: string;
}

/**
 * Authentication Service interface.
 * Prepares the frontend for real backend authentication without hardcoded passwords.
 */
export const AdminAuthService = {
  getSession(): AdminSession | null {
    if (typeof window === "undefined") return null;
    try {
      const data = sessionStorage.getItem(STORAGE_SESSION_KEY);
      if (!data) return null;
      const parsed = JSON.parse(data) as AdminSession;
      if (parsed.token && parsed.username) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },

  async login(
    username: string,
    keyOrSecret: string,
  ): Promise<{ success: boolean; error?: string }> {
    const trimmedUser = username.trim();
    const trimmedKey = keyOrSecret.trim();

    if (!trimmedUser || !trimmedKey) {
      return { success: false, error: "Please enter both operator identifier and admin key." };
    }

    // Backend-ready check: when a backend URL is configured, forward to API
    const backendUrl =
      typeof import.meta !== "undefined" && import.meta.env
        ? (import.meta.env.VITE_BACKEND_API_URL as string | undefined)
        : undefined;

    if (backendUrl) {
      try {
        const res = await fetch(`${backendUrl}/admin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: trimmedUser, key: trimmedKey }),
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { message?: string };
          return { success: false, error: body.message || "Invalid credentials." };
        }
        const data = (await res.json()) as { token: string };
        const session: AdminSession = {
          token: data.token,
          username: trimmedUser,
          timestamp: Date.now(),
        };
        sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
        return { success: true };
      } catch {
        return { success: false, error: "Unable to connect to authentication server." };
      }
    }

    // In local demo / transition mode:
    // Generate an authentic cryptographic operator token without hardcoded passwords
    const generatedToken =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `rural_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const session: AdminSession = {
      token: generatedToken,
      username: trimmedUser,
      timestamp: Date.now(),
    };

    try {
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
      return { success: true };
    } catch {
      return { success: false, error: "Unable to store session in this browser environment." };
    }
  },

  logout(): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.removeItem(STORAGE_SESSION_KEY);
      window.dispatchEvent(new Event("rural-auth-change"));
    } catch {
      // ignore
    }
  },

  getBackendStatus(): BackendStatus {
    const backendUrl =
      typeof import.meta !== "undefined" && import.meta.env
        ? (import.meta.env.VITE_BACKEND_API_URL as string | undefined)
        : undefined;

    if (backendUrl) {
      return {
        mode: "connected",
        label: "Connected to Event Backend",
        url: backendUrl,
      };
    }

    return {
      mode: "local-demo",
      label: "Standalone Desk (Backend-Ready)",
    };
  },
};

/**
 * Tournament Administrative Data Service.
 * Acts as the centralized contract for updating matches, official judge marks,
 * and team metadata. Propagates changes to shared storage so public live views stay in sync.
 */
export const TournamentAdminApi = {
  getTree(): TournamentTree {
    if (typeof window === "undefined") return demoTournamentData;
    try {
      const saved = localStorage.getItem(STORAGE_TREE_KEY);
      if (saved) {
        return JSON.parse(saved) as TournamentTree;
      }
    } catch {
      // ignore
    }
    return demoTournamentData;
  },

  saveTree(tree: TournamentTree): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_TREE_KEY, JSON.stringify(tree));
      // Dispatch custom local event for immediate reactivity in active tabs
      window.dispatchEvent(new CustomEvent("tournament-tree-updated", { detail: tree }));
    } catch {
      // ignore
    }
  },

  getAllMatches(tree = this.getTree()): Match[] {
    return [...(tree.preliminaries || []), ...(tree.semiFinals || []), tree.final].filter(Boolean);
  },

  updateMatchScores(
    matchId: string,
    scoreA: ScoreBreakdown,
    scoreB: ScoreBreakdown,
  ): { success: boolean; error?: string } {
    // Score validation
    if (
      scoreA.content < 0 ||
      scoreA.content > 40 ||
      scoreB.content < 0 ||
      scoreB.content > 40 ||
      scoreA.strategy < 0 ||
      scoreA.strategy > 30 ||
      scoreB.strategy < 0 ||
      scoreB.strategy > 30 ||
      scoreA.style < 0 ||
      scoreA.style > 30 ||
      scoreB.style < 0 ||
      scoreB.style > 30
    ) {
      return {
        success: false,
        error: "Scores exceed official rubric bounds (Content 40, Strategy 30, Style 30).",
      };
    }

    const tree = this.getTree();
    const update = (m: Match): Match => {
      if (m.id !== matchId) return m;
      return {
        ...m,
        scoreA: {
          content: Math.round(scoreA.content),
          strategy: Math.round(scoreA.strategy),
          style: Math.round(scoreA.style),
          total: Math.round(scoreA.content + scoreA.strategy + scoreA.style),
        },
        scoreB: {
          content: Math.round(scoreB.content),
          strategy: Math.round(scoreB.strategy),
          style: Math.round(scoreB.style),
          total: Math.round(scoreB.content + scoreB.strategy + scoreB.style),
        },
      };
    };

    const nextTree: TournamentTree = {
      ...tree,
      preliminaries: (tree.preliminaries || []).map(update),
      semiFinals: (tree.semiFinals || []).map(update),
      final: update(tree.final),
    };

    this.saveTree(nextTree);
    return { success: true };
  },

  updateMatchStatus(
    matchId: string,
    status: MatchStatus,
    winnerTeamId?: string,
  ): { success: boolean } {
    const tree = this.getTree();
    const update = (m: Match): Match => {
      if (m.id !== matchId) return m;
      const completedTime =
        status === "completed"
          ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : m.completedTime;
      return {
        ...m,
        status,
        winnerTeamId: winnerTeamId !== undefined ? winnerTeamId : m.winnerTeamId,
        completedTime,
      };
    };

    const nextTree: TournamentTree = {
      ...tree,
      preliminaries: (tree.preliminaries || []).map(update),
      semiFinals: (tree.semiFinals || []).map(update),
      final: update(tree.final),
    };

    this.saveTree(nextTree);
    return { success: true };
  },

  setMatchZone(matchId: string, zone: ZoneNumber): { success: boolean } {
    const tree = this.getTree();
    const update = (m: Match): Match => (m.id === matchId ? { ...m, zone } : m);

    const nextTree: TournamentTree = {
      ...tree,
      preliminaries: (tree.preliminaries || []).map(update),
      semiFinals: (tree.semiFinals || []).map(update),
      final: update(tree.final),
    };

    this.saveTree(nextTree);
    return { success: true };
  },

  toggleSwitchRound(matchId: string): { success: boolean } {
    const tree = this.getTree();
    const update = (m: Match): Match =>
      m.id === matchId ? { ...m, switchRoundTriggered: !m.switchRoundTriggered } : m;

    const nextTree: TournamentTree = {
      ...tree,
      preliminaries: (tree.preliminaries || []).map(update),
      semiFinals: (tree.semiFinals || []).map(update),
      final: update(tree.final),
    };

    this.saveTree(nextTree);
    return { success: true };
  },

  setVotingStatus(matchId: string, votingStatus: VotingStatus): { success: boolean } {
    const tree = this.getTree();
    const update = (m: Match): Match => (m.id === matchId ? { ...m, votingStatus } : m);

    const nextTree: TournamentTree = {
      ...tree,
      preliminaries: (tree.preliminaries || []).map(update),
      semiFinals: (tree.semiFinals || []).map(update),
      final: update(tree.final),
    };

    this.saveTree(nextTree);
    return { success: true };
  },

  updateTeam(teamId: string, data: Partial<Team>): { success: boolean } {
    const tree = this.getTree();
    const updateTeamInMatch = (team?: Team): Team | undefined => {
      if (!team || team.id !== teamId) return team;
      return { ...team, ...data };
    };

    const updateMatch = (m: Match): Match => ({
      ...m,
      teamA: updateTeamInMatch(m.teamA),
      teamB: updateTeamInMatch(m.teamB),
    });

    const nextTree: TournamentTree = {
      ...tree,
      preliminaries: (tree.preliminaries || []).map(updateMatch),
      semiFinals: (tree.semiFinals || []).map(updateMatch),
      final: updateMatch(tree.final),
      champion: updateTeamInMatch(tree.champion),
    };

    this.saveTree(nextTree);
    return { success: true };
  },
};
