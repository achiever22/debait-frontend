import { useState } from "react";
import { Users, Edit3, Check, X, Shield, Award } from "lucide-react";
import type { Team, TeamStatus } from "@/content/tournament";

interface TeamManagementProps {
  teams: Team[];
  onUpdateTeam: (teamId: string, data: Partial<Team>) => { success: boolean };
}

export function TeamManagement({ teams, onUpdateTeam }: TeamManagementProps) {
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editStream, setEditStream] = useState("");
  const [editStatus, setEditStatus] = useState<TeamStatus>("registered");
  const [editMembers, setEditMembers] = useState<string[]>([
    "", // Speaker 1 (Lead)
    "", // Speaker 2
    "", // Speaker 3
    "", // Substitute 1
    "", // Substitute 2
  ]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const startEdit = (team: Team) => {
    setEditingTeamId(team.id);
    setEditName(team.name);
    setEditStream(team.stream || "Engineering");
    setEditStatus(team.status);

    const members = [...(team.members || [])];
    while (members.length < 5) {
      if (members.length === 0) members.push(`${team.name} Lead`);
      else if (members.length < 3) members.push(`Speaker ${members.length + 1}`);
      else members.push(`Substitute ${members.length - 2}`);
    }
    setEditMembers(members.slice(0, 5));
    setFeedback(null);
  };

  const cancelEdit = () => {
    setEditingTeamId(null);
    setFeedback(null);
  };

  const saveEdit = (teamId: string) => {
    const res = onUpdateTeam(teamId, {
      name: editName.trim() || `Team ${teamId}`,
      stream: editStream.trim() || "General",
      status: editStatus,
      members: editMembers.map((m, idx) => m.trim() || `Member ${idx + 1}`),
    });

    if (res.success) {
      setFeedback(`Team updated successfully.`);
      setTimeout(() => {
        setEditingTeamId(null);
        setFeedback(null);
      }, 700);
    }
  };

  const getStatusBadge = (status: TeamStatus) => {
    switch (status) {
      case "champion":
        return (
          <span className="inline-flex items-center gap-1 border border-hot bg-hot/15 px-2 py-0.5 font-type text-[10px] font-bold uppercase tracking-wider text-hot">
            <Award size={11} /> Champion
          </span>
        );
      case "qualified":
        return (
          <span className="inline-flex items-center gap-1 border border-sun bg-sun/15 px-2 py-0.5 font-type text-[10px] font-bold uppercase tracking-wider text-sun">
            <Shield size={11} /> Qualified
          </span>
        );
      case "eliminated":
        return (
          <span className="inline-flex items-center gap-1 border border-mist/30 bg-mist/5 px-2 py-0.5 font-type text-[10px] uppercase tracking-wider text-mist/60">
            Eliminated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 border border-line bg-surface-raised px-2 py-0.5 font-type text-[10px] uppercase tracking-wider text-mist/80">
            Registered
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-line bg-surface p-4">
        <div>
          <h2 className="display text-xl text-paper tracking-wide">
            OFFICIAL TEAMS ROSTER <span className="text-sun">({teams.length} TEAMS)</span>
          </h2>
          <p className="mt-0.5 font-type text-xs uppercase tracking-wider text-mist/60">
            Rulebook standard: 5 members per team (3 Main Core Speakers + 2 Official Substitutes)
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-mist/70">
          <span className="inline-block h-2 w-2 rounded-full bg-sun" />
          <span>Roster Locked: 16 Teams Capacity</span>
        </div>
      </div>

      {feedback && (
        <div className="border-2 border-sun bg-sun/10 px-4 py-2 font-mono text-xs font-bold text-sun">
          {feedback}
        </div>
      )}

      {/* Grid of Teams */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {teams.map((team) => {
          const isEditing = editingTeamId === team.id;
          const members =
            team.members && team.members.length === 5
              ? team.members
              : [
                  `${team.name} Lead (Speaker 1)`,
                  "Speaker 2",
                  "Speaker 3",
                  "Substitute 1",
                  "Substitute 2",
                ];

          return (
            <div
              key={team.id}
              className={`flex flex-col justify-between border-2 transition-colors ${
                isEditing
                  ? "border-sun bg-surface-raised shadow-[4px_4px_0_rgba(255,214,0,0.2)]"
                  : "border-line bg-surface hover:border-mist/40"
              } p-4`}
            >
              {isEditing ? (
                /* EDIT FORM */
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="font-mono text-xs font-bold text-sun">
                      EDIT TEAM #{String(team.number).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="text-mist/60 hover:text-mist"
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="block font-type text-[10px] uppercase tracking-wider text-mist/70">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mt-0.5 w-full border border-line bg-canvas px-2 py-1 font-mono text-xs text-paper focus:border-sun focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-type text-[10px] uppercase tracking-wider text-mist/70">
                        Stream
                      </label>
                      <input
                        type="text"
                        value={editStream}
                        onChange={(e) => setEditStream(e.target.value)}
                        className="mt-0.5 w-full border border-line bg-canvas px-2 py-1 font-mono text-xs text-paper focus:border-sun focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-type text-[10px] uppercase tracking-wider text-mist/70">
                        Status
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as TeamStatus)}
                        className="mt-0.5 w-full border border-line bg-canvas px-2 py-1 font-mono text-xs text-paper focus:border-sun focus:outline-none"
                      >
                        <option value="registered">Registered</option>
                        <option value="qualified">Qualified</option>
                        <option value="eliminated">Eliminated</option>
                        <option value="champion">Champion</option>
                      </select>
                    </div>
                  </div>

                  {/* 5 Members Inputs */}
                  <div className="border-t border-line pt-2">
                    <span className="block font-type text-[10px] uppercase tracking-wider text-sun font-bold">
                      Team Members (5 total)
                    </span>
                    <div className="mt-1 space-y-1.5">
                      <div>
                        <span className="text-[10px] font-mono text-mist/60">
                          1. Main Speaker (Lead)
                        </span>
                        <input
                          type="text"
                          value={editMembers[0]}
                          onChange={(e) => {
                            const next = [...editMembers];
                            next[0] = e.target.value;
                            setEditMembers(next);
                          }}
                          className="mt-0.5 w-full border border-line bg-canvas px-2 py-0.5 font-mono text-[11px] text-paper focus:border-sun focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-mist/60">2. Main Speaker</span>
                        <input
                          type="text"
                          value={editMembers[1]}
                          onChange={(e) => {
                            const next = [...editMembers];
                            next[1] = e.target.value;
                            setEditMembers(next);
                          }}
                          className="mt-0.5 w-full border border-line bg-canvas px-2 py-0.5 font-mono text-[11px] text-paper focus:border-sun focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-mist/60">3. Main Speaker</span>
                        <input
                          type="text"
                          value={editMembers[2]}
                          onChange={(e) => {
                            const next = [...editMembers];
                            next[2] = e.target.value;
                            setEditMembers(next);
                          }}
                          className="mt-0.5 w-full border border-line bg-canvas px-2 py-0.5 font-mono text-[11px] text-paper focus:border-sun focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-mist/60">4. Substitute 1</span>
                        <input
                          type="text"
                          value={editMembers[3]}
                          onChange={(e) => {
                            const next = [...editMembers];
                            next[3] = e.target.value;
                            setEditMembers(next);
                          }}
                          className="mt-0.5 w-full border border-line bg-canvas px-2 py-0.5 font-mono text-[11px] text-paper focus:border-sun focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-mist/60">5. Substitute 2</span>
                        <input
                          type="text"
                          value={editMembers[4]}
                          onChange={(e) => {
                            const next = [...editMembers];
                            next[4] = e.target.value;
                            setEditMembers(next);
                          }}
                          className="mt-0.5 w-full border border-line bg-canvas px-2 py-0.5 font-mono text-[11px] text-paper focus:border-sun focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save / Cancel buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(team.id)}
                      className="flex-1 flex items-center justify-center gap-1 border-2 border-sun bg-sun px-3 py-1.5 font-type text-xs font-bold uppercase text-canvas hover:bg-sun/90"
                    >
                      <Check size={13} /> Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="border border-line bg-surface px-3 py-1.5 font-type text-xs uppercase text-mist hover:text-paper"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* READONLY CARD */
                <>
                  <div>
                    {/* Top Row: Number & Status */}
                    <div className="flex items-center justify-between border-b border-line pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sun">
                          #{String(team.number).padStart(2, "0")}
                        </span>
                        <span className="font-type text-[11px] uppercase tracking-wider text-mist/60">
                          {team.stream || "General"}
                        </span>
                      </div>
                      {getStatusBadge(team.status)}
                    </div>

                    {/* Team Name */}
                    <h3 className="display mt-2 text-lg text-paper tracking-wide">{team.name}</h3>

                    {/* Members List */}
                    <div className="mt-3 space-y-1.5 border-t border-line/60 pt-2.5">
                      <div className="flex items-center gap-1 font-type text-[10px] uppercase tracking-wider text-mist/50">
                        <Users size={11} /> 3 Main Speakers + 2 Subs
                      </div>
                      <div className="space-y-1 font-mono text-xs">
                        <div className="flex items-baseline justify-between text-mist/90">
                          <span className="truncate">1. {members[0]}</span>
                          <span className="shrink-0 text-[10px] text-sun uppercase font-bold ml-1">
                            LEAD
                          </span>
                        </div>
                        <div className="text-mist/80 truncate">2. {members[1]}</div>
                        <div className="text-mist/80 truncate">3. {members[2]}</div>
                        <div className="text-mist/50 truncate text-[11px]">Sub: {members[3]}</div>
                        <div className="text-mist/50 truncate text-[11px]">Sub: {members[4]}</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action: Edit */}
                  <div className="mt-4 border-t border-line pt-2">
                    <button
                      type="button"
                      onClick={() => startEdit(team)}
                      className="flex w-full items-center justify-center gap-1.5 border border-line bg-surface-raised py-1.5 font-type text-xs uppercase tracking-wider text-mist/80 hover:border-sun hover:bg-sun hover:text-canvas transition-colors"
                    >
                      <Edit3 size={12} /> Edit Details
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
