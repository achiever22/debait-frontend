// Official DE'BAIT Tournament Data Model & Contracts
// 16 Teams -> 8 Preliminary Matches -> Top 8 Selected (Day 1) -> 2 Semifinals -> 1 Final -> Champion
// Official scoring categories: Content (40) + Strategy (30) + Style (30) = Total (100)
// Official zones: Zone 01 (Opening Cases) -> Zone 02 (Open Crossfire) -> Zone 03 (Final Statement)

export type TeamStatus = "registered" | "qualified" | "eliminated" | "champion";

export interface Team {
  id: string;
  number: number;
  name: string;
  stream?: string;
  seed?: number;
  status: TeamStatus;
  members?: string[];
}

export interface ScoreBreakdown {
  content: number; // max 40
  strategy: number; // max 30
  style: number; // max 30
  total: number; // max 100
}

export type ZoneNumber = 1 | 2 | 3;

export interface ZoneInfo {
  number: ZoneNumber;
  title: string;
  subtitle: string;
  description: string;
}

export const ZONES_METADATA: Record<ZoneNumber, ZoneInfo> = {
  1: {
    number: 1,
    title: "Opening Cases",
    subtitle: "Core Casework",
    description: "All 3 Core Speakers construct their initial arguments uninterrupted.",
  },
  2: {
    number: 2,
    title: "Open Crossfire",
    subtitle: "Direct Rebuttal & Switch Opportunity",
    description: "Rebuttal speakers engage. Buzzer may strike for a sudden 5-minute Switch Round.",
  },
  3: {
    number: 3,
    title: "Final Statement",
    subtitle: "Closing Defence",
    description:
      "One Core Speaker delivers a decisive 90-second summation defending their current stance.",
  },
};

export type MatchRound = "preliminary" | "semifinal" | "final";
export type MatchStatus = "upcoming" | "live" | "completed";
export type VotingStatus = "open" | "closed" | "upcoming";

export interface MatchVotes {
  teamA: number;
  teamB: number;
  totalVotes: number;
}

export interface Match {
  id: string;
  matchNumber: number;
  round: MatchRound;
  roundLabel: string;
  stageName: string;
  motion: string;
  zone: ZoneNumber;
  switchRoundTriggered?: boolean;
  teamA?: Team;
  teamB?: Team;
  scoreA?: ScoreBreakdown;
  scoreB?: ScoreBreakdown;
  winnerTeamId?: string;
  status: MatchStatus;
  scheduledTime?: string;
  completedTime?: string;
  court?: string;
  votes: MatchVotes;
  votingStatus: VotingStatus;
}

export interface UserVote {
  matchId: string;
  teamId: string;
  timestamp: number;
}

export interface TournamentTree {
  preliminaries: Match[]; // 8 matches: 16 teams debate in Day 1
  semiFinals: Match[]; // 2 matches: Final Four (SF 1 & SF 2)
  final: Match; // 1 match (Grand Championship Final)
  champion?: Team;
}

// 16 Official Teams (Team 01 to Team 16)
export const OFFICIAL_TEAMS: Team[] = Array.from({ length: 16 }, (_, i) => {
  const num = i + 1;
  const streams = ["Engineering", "Law", "Pharmacy", "B.Ed"];
  const stream = streams[i % streams.length];
  return {
    id: `team-${String(num).padStart(2, "0")}`,
    number: num,
    name: `Team ${String(num).padStart(2, "0")}`,
    stream,
    status: "registered",
  };
});

// Empty / Pre-Tournament State: 16 teams in 8 Preliminary matches
export const emptyTournamentData: TournamentTree = {
  preliminaries: [
    {
      id: "pr-1",
      matchNumber: 1,
      round: "preliminary",
      roundLabel: "Prelim 01",
      stageName: "Prelims · Match 01",
      motion: "This house would ban algorithmically curated feeds for users under 18.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 01 · 12:30 PM",
      completedTime: "01:05 PM",
      court: "Hall A · Stage 1",
      teamA: { ...OFFICIAL_TEAMS[0], status: "qualified" },
      teamB: { ...OFFICIAL_TEAMS[1], status: "eliminated" },
      scoreA: { content: 34, strategy: 26, style: 24, total: 84 },
      scoreB: { content: 30, strategy: 23, style: 22, total: 75 },
      winnerTeamId: "team-01",
      votes: { teamA: 58, teamB: 42, totalVotes: 88 },
      votingStatus: "closed",
    },
    {
      id: "pr-2",
      matchNumber: 2,
      round: "preliminary",
      roundLabel: "Prelim 02",
      stageName: "Prelims · Match 02",
      motion: "This house believes digital micro-influencing has commodified human friendship.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 01 · 12:50 PM",
      completedTime: "01:25 PM",
      court: "Hall B · Stage 2",
      teamA: { ...OFFICIAL_TEAMS[2], status: "eliminated" },
      teamB: { ...OFFICIAL_TEAMS[3], status: "qualified" },
      scoreA: { content: 31, strategy: 24, style: 22, total: 77 },
      scoreB: { content: 33, strategy: 25, style: 23, total: 81 },
      winnerTeamId: "team-04",
      votes: { teamA: 44, teamB: 56, totalVotes: 72 },
      votingStatus: "closed",
    },
    {
      id: "pr-3",
      matchNumber: 3,
      round: "preliminary",
      roundLabel: "Prelim 03",
      stageName: "Prelims · Match 03",
      motion:
        "This house would prohibit educational institutions from monitoring students' social accounts.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 01 · 01:10 PM",
      completedTime: "01:45 PM",
      court: "Hall A · Stage 1",
      teamA: { ...OFFICIAL_TEAMS[4], status: "qualified" },
      teamB: { ...OFFICIAL_TEAMS[5], status: "eliminated" },
      scoreA: { content: 35, strategy: 25, style: 24, total: 84 },
      scoreB: { content: 32, strategy: 24, style: 22, total: 78 },
      winnerTeamId: "team-05",
      votes: { teamA: 61, teamB: 39, totalVotes: 93 },
      votingStatus: "closed",
    },
    {
      id: "pr-4",
      matchNumber: 4,
      round: "preliminary",
      roundLabel: "Prelim 04",
      stageName: "Prelims · Match 04",
      motion:
        "This house prefers decentralized social protocols over centralized platform moderation.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 01 · 01:30 PM",
      completedTime: "02:05 PM",
      court: "Hall B · Stage 2",
      teamA: { ...OFFICIAL_TEAMS[6], status: "eliminated" },
      teamB: { ...OFFICIAL_TEAMS[7], status: "qualified" },
      scoreA: { content: 30, strategy: 23, style: 22, total: 75 },
      scoreB: { content: 33, strategy: 25, style: 24, total: 82 },
      winnerTeamId: "team-08",
      votes: { teamA: 47, teamB: 53, totalVotes: 79 },
      votingStatus: "closed",
    },
    {
      id: "pr-5",
      matchNumber: 5,
      round: "preliminary",
      roundLabel: "Prelim 05",
      stageName: "Prelims · Match 05",
      motion:
        "This house would mandate verified real-identity badges for all political discussion accounts.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 01 · 12:30 PM",
      completedTime: "01:05 PM",
      court: "Seminar 1 · Stage 3",
      teamA: { ...OFFICIAL_TEAMS[8], status: "qualified" },
      teamB: { ...OFFICIAL_TEAMS[9], status: "eliminated" },
      scoreA: { content: 36, strategy: 26, style: 25, total: 87 },
      scoreB: { content: 32, strategy: 24, style: 23, total: 79 },
      winnerTeamId: "team-09",
      votes: { teamA: 63, teamB: 37, totalVotes: 85 },
      votingStatus: "closed",
    },
    {
      id: "pr-6",
      matchNumber: 6,
      round: "preliminary",
      roundLabel: "Prelim 06",
      stageName: "Prelims · Match 06",
      motion:
        "This house believes the right to be forgotten should be absolute for content posted before age 18.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 01 · 12:50 PM",
      completedTime: "01:25 PM",
      court: "Seminar 2 · Stage 4",
      teamA: { ...OFFICIAL_TEAMS[10], status: "eliminated" },
      teamB: { ...OFFICIAL_TEAMS[11], status: "qualified" },
      scoreA: { content: 31, strategy: 24, style: 23, total: 78 },
      scoreB: { content: 34, strategy: 25, style: 24, total: 83 },
      winnerTeamId: "team-12",
      votes: { teamA: 45, teamB: 55, totalVotes: 91 },
      votingStatus: "closed",
    },
    {
      id: "pr-7",
      matchNumber: 7,
      round: "preliminary",
      roundLabel: "Prelim 07",
      stageName: "Prelims · Match 07",
      motion: "This house would hold platforms strictly liable for synthetic deepfake defamation.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 01 · 01:10 PM",
      completedTime: "01:45 PM",
      court: "Seminar 1 · Stage 3",
      teamA: { ...OFFICIAL_TEAMS[12], status: "eliminated" },
      teamB: { ...OFFICIAL_TEAMS[13], status: "qualified" },
      scoreA: { content: 32, strategy: 24, style: 23, total: 79 },
      scoreB: { content: 35, strategy: 26, style: 24, total: 85 },
      winnerTeamId: "team-14",
      votes: { teamA: 41, teamB: 59, totalVotes: 97 },
      votingStatus: "closed",
    },
    {
      id: "pr-8",
      matchNumber: 8,
      round: "preliminary",
      roundLabel: "Prelim 08",
      stageName: "Prelims · Match 08",
      motion:
        "This house opposes the commercial monetization of family vlogging featuring minor children.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 01 · 01:30 PM",
      completedTime: "02:05 PM",
      court: "Seminar 2 · Stage 4",
      teamA: { ...OFFICIAL_TEAMS[14], status: "qualified" },
      teamB: { ...OFFICIAL_TEAMS[15], status: "eliminated" },
      scoreA: { content: 34, strategy: 25, style: 24, total: 83 },
      scoreB: { content: 31, strategy: 23, style: 22, total: 76 },
      winnerTeamId: "team-15",
      votes: { teamA: 55, teamB: 45, totalVotes: 82 },
      votingStatus: "closed",
    },
  ],
  semiFinals: [
    {
      id: "sf-1",
      matchNumber: 9,
      round: "semifinal",
      roundLabel: "Semifinal 01",
      stageName: "Final Four · Match 01",
      motion:
        "This house would prohibit targeted political advertising during active election cycles.",
      zone: 1,
      status: "upcoming",
      scheduledTime: "Day 02 · 12:30 PM",
      court: "Zone 01 · Main Stage",
      votes: { teamA: 0, teamB: 0, totalVotes: 0 },
      votingStatus: "upcoming",
    },
    {
      id: "sf-2",
      matchNumber: 10,
      round: "semifinal",
      roundLabel: "Semifinal 02",
      stageName: "Final Four · Match 02",
      motion:
        "This house believes digital connectivity has reduced empathy in younger generations.",
      zone: 1,
      status: "upcoming",
      scheduledTime: "Day 02 · 01:00 PM",
      court: "Zone 01 · Main Stage",
      votes: { teamA: 0, teamB: 0, totalVotes: 0 },
      votingStatus: "upcoming",
    },
  ],
  final: {
    id: "fn-1",
    matchNumber: 11,
    round: "final",
    roundLabel: "Grand Final",
    stageName: "Championship Debate",
    motion:
      "This house would replace human legislative drafting with open-source ethical artificial intelligence.",
    zone: 1,
    status: "upcoming",
    scheduledTime: "Day 02 · 02:15 PM",
    court: "Main Stage · Block 4 Auditorium",
    votes: { teamA: 0, teamB: 0, totalVotes: 0 },
    votingStatus: "upcoming",
  },
};

// Rich Simulated Tournament Data: 8 Prelims completed -> Top 8 evaluated -> SF 1 completed, SF 2 LIVE NOW!
export const demoTournamentData: TournamentTree = {
  preliminaries: [
    {
      id: "pr-1",
      matchNumber: 1,
      round: "preliminary",
      roundLabel: "Prelim 01",
      stageName: "Prelims · Match 01",
      motion: "This house would ban algorithmically curated feeds for users under 18.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 01 · 12:30 PM",
      completedTime: "01:05 PM",
      court: "Hall A · Stage 1",
      teamA: { ...OFFICIAL_TEAMS[0], status: "qualified" }, // Team 01 (Winner)
      teamB: { ...OFFICIAL_TEAMS[1], status: "eliminated" }, // Team 02
      scoreA: { content: 36, strategy: 27, style: 25, total: 88 },
      scoreB: { content: 33, strategy: 24, style: 24, total: 81 },
      winnerTeamId: "team-01",
      votes: { teamA: 62, teamB: 38, totalVotes: 110 },
      votingStatus: "closed",
    },
    {
      id: "pr-2",
      matchNumber: 2,
      round: "preliminary",
      roundLabel: "Prelim 02",
      stageName: "Prelims · Match 02",
      motion: "This house believes digital micro-influencing has commodified human friendship.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 01 · 12:50 PM",
      completedTime: "01:25 PM",
      court: "Hall B · Stage 2",
      teamA: { ...OFFICIAL_TEAMS[2], status: "eliminated" }, // Team 03
      teamB: { ...OFFICIAL_TEAMS[3], status: "qualified" }, // Team 04 (Winner)
      scoreA: { content: 32, strategy: 25, style: 23, total: 80 },
      scoreB: { content: 35, strategy: 26, style: 24, total: 85 },
      winnerTeamId: "team-04",
      votes: { teamA: 45, teamB: 55, totalVotes: 98 },
      votingStatus: "closed",
    },
    {
      id: "pr-3",
      matchNumber: 3,
      round: "preliminary",
      roundLabel: "Prelim 03",
      stageName: "Prelims · Match 03",
      motion:
        "This house would prohibit educational institutions from monitoring students' social accounts.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 01 · 01:10 PM",
      completedTime: "01:45 PM",
      court: "Hall A · Stage 1",
      teamA: { ...OFFICIAL_TEAMS[4], status: "qualified" }, // Team 05 (Winner)
      teamB: { ...OFFICIAL_TEAMS[5], status: "eliminated" }, // Team 06
      scoreA: { content: 35, strategy: 26, style: 25, total: 86 },
      scoreB: { content: 33, strategy: 25, style: 24, total: 82 },
      winnerTeamId: "team-05",
      votes: { teamA: 59, teamB: 41, totalVotes: 104 },
      votingStatus: "closed",
    },
    {
      id: "pr-4",
      matchNumber: 4,
      round: "preliminary",
      roundLabel: "Prelim 04",
      stageName: "Prelims · Match 04",
      motion:
        "This house prefers decentralized social protocols over centralized platform moderation.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 01 · 01:30 PM",
      completedTime: "02:05 PM",
      court: "Hall B · Stage 2",
      teamA: { ...OFFICIAL_TEAMS[6], status: "eliminated" }, // Team 07
      teamB: { ...OFFICIAL_TEAMS[7], status: "qualified" }, // Team 08 (Winner)
      scoreA: { content: 31, strategy: 24, style: 24, total: 79 },
      scoreB: { content: 34, strategy: 26, style: 24, total: 84 },
      winnerTeamId: "team-08",
      votes: { teamA: 48, teamB: 52, totalVotes: 95 },
      votingStatus: "closed",
    },
    {
      id: "pr-5",
      matchNumber: 5,
      round: "preliminary",
      roundLabel: "Prelim 05",
      stageName: "Prelims · Match 05",
      motion:
        "This house would mandate verified real-identity badges for all political discussion accounts.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 01 · 12:30 PM",
      completedTime: "01:05 PM",
      court: "Seminar 1 · Stage 3",
      teamA: { ...OFFICIAL_TEAMS[8], status: "qualified" }, // Team 09 (Winner)
      teamB: { ...OFFICIAL_TEAMS[9], status: "eliminated" }, // Team 10
      scoreA: { content: 35, strategy: 27, style: 25, total: 87 },
      scoreB: { content: 33, strategy: 25, style: 24, total: 82 },
      winnerTeamId: "team-09",
      votes: { teamA: 64, teamB: 36, totalVotes: 115 },
      votingStatus: "closed",
    },
    {
      id: "pr-6",
      matchNumber: 6,
      round: "preliminary",
      roundLabel: "Prelim 06",
      stageName: "Prelims · Match 06",
      motion:
        "This house believes the right to be forgotten should be absolute for content posted before age 18.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 01 · 12:50 PM",
      completedTime: "01:25 PM",
      court: "Seminar 2 · Stage 4",
      teamA: { ...OFFICIAL_TEAMS[10], status: "eliminated" }, // Team 11
      teamB: { ...OFFICIAL_TEAMS[11], status: "qualified" }, // Team 12 (Winner)
      scoreA: { content: 31, strategy: 24, style: 24, total: 81 },
      scoreB: { content: 34, strategy: 26, style: 25, total: 85 },
      winnerTeamId: "team-12",
      votes: { teamA: 46, teamB: 54, totalVotes: 102 },
      votingStatus: "closed",
    },
    {
      id: "pr-7",
      matchNumber: 7,
      round: "preliminary",
      roundLabel: "Prelim 07",
      stageName: "Prelims · Match 07",
      motion: "This house would hold platforms strictly liable for synthetic deepfake defamation.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 01 · 01:10 PM",
      completedTime: "01:45 PM",
      court: "Seminar 1 · Stage 3",
      teamA: { ...OFFICIAL_TEAMS[12], status: "eliminated" }, // Team 13
      teamB: { ...OFFICIAL_TEAMS[13], status: "qualified" }, // Team 14 (Winner)
      scoreA: { content: 33, strategy: 26, style: 24, total: 83 },
      scoreB: { content: 36, strategy: 27, style: 25, total: 88 },
      winnerTeamId: "team-14",
      votes: { teamA: 42, teamB: 58, totalVotes: 120 },
      votingStatus: "closed",
    },
    {
      id: "pr-8",
      matchNumber: 8,
      round: "preliminary",
      roundLabel: "Prelim 08",
      stageName: "Prelims · Match 08",
      motion:
        "This house opposes the commercial monetization of family vlogging featuring minor children.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 01 · 01:30 PM",
      completedTime: "02:05 PM",
      court: "Seminar 2 · Stage 4",
      teamA: { ...OFFICIAL_TEAMS[14], status: "qualified" }, // Team 15 (Winner)
      teamB: { ...OFFICIAL_TEAMS[15], status: "eliminated" }, // Team 16
      scoreA: { content: 35, strategy: 26, style: 25, total: 86 },
      scoreB: { content: 32, strategy: 24, style: 24, total: 80 },
      winnerTeamId: "team-15",
      votes: { teamA: 57, teamB: 43, totalVotes: 94 },
      votingStatus: "closed",
    },
  ],
  semiFinals: [
    {
      id: "sf-1",
      matchNumber: 9,
      round: "semifinal",
      roundLabel: "Semifinal 01",
      stageName: "Final Four · Match 01",
      motion:
        "This house would prohibit targeted political advertising during active election cycles.",
      zone: 3,
      status: "completed",
      scheduledTime: "Day 02 · 12:30 PM",
      completedTime: "01:15 PM",
      court: "Zone 01 · Main Stage",
      teamA: { ...OFFICIAL_TEAMS[0], status: "qualified" }, // Team 01 (Winner)
      teamB: { ...OFFICIAL_TEAMS[4], status: "eliminated" }, // Team 05
      scoreA: { content: 37, strategy: 28, style: 27, total: 92 },
      scoreB: { content: 35, strategy: 26, style: 26, total: 87 },
      winnerTeamId: "team-01",
      votes: { teamA: 68, teamB: 32, totalVotes: 210 },
      votingStatus: "closed",
    },
    {
      id: "sf-2",
      matchNumber: 10,
      round: "semifinal",
      roundLabel: "Semifinal 02",
      stageName: "Final Four · Match 02",
      motion:
        "This house believes digital connectivity has reduced human empathy in younger generations.",
      zone: 2, // Zone 02 Open Crossfire is ACTIVE NOW!
      switchRoundTriggered: true, // Switch Round Buzzer struck!
      status: "live",
      scheduledTime: "Day 02 · 01:15 PM",
      court: "Zone 01 · Main Stage",
      teamA: { ...OFFICIAL_TEAMS[8], status: "qualified" }, // Team 09
      teamB: { ...OFFICIAL_TEAMS[13], status: "qualified" }, // Team 14
      scoreA: { content: 35, strategy: 26, style: 26, total: 87 },
      scoreB: { content: 34, strategy: 26, style: 25, total: 85 },
      votes: { teamA: 64, teamB: 36, totalVotes: 324 },
      votingStatus: "open",
    },
  ],
  final: {
    id: "fn-1",
    matchNumber: 11,
    round: "final",
    roundLabel: "Grand Final",
    stageName: "Championship Debate",
    motion:
      "This house would replace human legislative drafting with open-source ethical artificial intelligence.",
    zone: 1,
    status: "upcoming",
    scheduledTime: "Day 02 · 02:15 PM",
    court: "Main Stage · Block 4 Auditorium",
    teamA: { ...OFFICIAL_TEAMS[0], status: "qualified" }, // Team 01 (SF 01 Winner)
    teamB: undefined, // Awaiting Winner of SF 02
    votes: { teamA: 0, teamB: 0, totalVotes: 0 },
    votingStatus: "upcoming",
  },
  champion: undefined,
};
