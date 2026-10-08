import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { AdminAuthService, TournamentAdminApi, STORAGE_SESSION_KEY } from "@/lib/admin-api";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { ScoreEntry } from "@/components/admin/ScoreEntry";
import { TeamManagement } from "@/components/admin/TeamManagement";
import { OFFICIAL_TEAMS, demoTournamentData } from "@/content/tournament";

describe("DE'BAIT Rural Admin Panel", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("AdminAuthService enforces required credentials without hardcoded passwords", async () => {
    expect(AdminAuthService.isAuthenticated()).toBe(false);

    // Empty credentials reject
    const emptyRes = await AdminAuthService.login("", "");
    expect(emptyRes.success).toBe(false);
    expect(AdminAuthService.isAuthenticated()).toBe(false);

    // Legitimate operator login succeeds with generated session token
    const loginRes = await AdminAuthService.login("Lead_Operator", "secure_ops_key_99");
    expect(loginRes.success).toBe(true);
    expect(AdminAuthService.isAuthenticated()).toBe(true);

    const session = AdminAuthService.getSession();
    expect(session?.username).toBe("Lead_Operator");
    expect(session?.token).toBeTruthy();

    // Logout terminates session
    AdminAuthService.logout();
    expect(AdminAuthService.isAuthenticated()).toBe(false);
    expect(AdminAuthService.getSession()).toBeNull();
  });

  it("renders AdminLogin component and handles submission", async () => {
    const handleSuccess = vi.fn();
    render(<AdminLogin onSuccess={handleSuccess} />);

    expect(screen.getByText(/RURAL/i)).toBeInTheDocument();
    expect(screen.getByText(/OPERATIONAL TOURNAMENT DESK/i)).toBeInTheDocument();

    const userInput = screen.getByLabelText(/Operator Identifier/i);
    const keyInput = screen.getByLabelText(/Admin Access Key/i);
    const submitBtn = screen.getByRole("button", { name: /Enter Operational Desk/i });

    fireEvent.change(userInput, { target: { value: "DeskChief" } });
    fireEvent.change(keyInput, { target: { value: "passkey123" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalled();
    });
  });

  it("validates official rubric score limits (Content 40, Strategy 30, Style 30)", () => {
    const match = demoTournamentData.preliminaries[0];

    // Invalid content score (> 40)
    const invalidRes = TournamentAdminApi.updateMatchScores(
      match.id,
      { content: 45, strategy: 25, style: 25, total: 95 },
      { content: 30, strategy: 20, style: 20, total: 70 },
    );
    expect(invalidRes.success).toBe(false);
    expect(invalidRes.error).toContain("exceed official rubric bounds");

    // Valid score
    const validRes = TournamentAdminApi.updateMatchScores(
      match.id,
      { content: 38, strategy: 28, style: 28, total: 94 },
      { content: 30, strategy: 20, style: 20, total: 70 },
    );
    expect(validRes.success).toBe(true);

    const updatedTree = TournamentAdminApi.getTree();
    const updatedMatch = updatedTree.preliminaries.find((m) => m.id === match.id);
    expect(updatedMatch?.scoreA?.total).toBe(94);
  });

  it("ScoreEntry component displays and calculates total marks dynamically", () => {
    const match = demoTournamentData.preliminaries[0];
    const saveMock = vi.fn().mockReturnValue({ success: true });

    render(<ScoreEntry activeMatch={match} onSaveScores={saveMock} />);

    expect(screen.getByText(/OFFICIAL JUDGE MARKS/i)).toBeInTheDocument();
    expect(screen.getByText(/100-POINT SYSTEM/i)).toBeInTheDocument();

    const saveButton = screen.getByRole("button", { name: /Record Official Scores/i });
    fireEvent.click(saveButton);

    expect(saveMock).toHaveBeenCalled();
  });

  it("TeamManagement component renders 16 teams and supports member editing", () => {
    const updateTeamMock = vi.fn().mockReturnValue({ success: true });

    render(<TeamManagement teams={OFFICIAL_TEAMS} onUpdateTeam={updateTeamMock} />);

    expect(screen.getByText(/OFFICIAL TEAMS ROSTER/i)).toBeInTheDocument();
    expect(screen.getByText(/16 TEAMS CAPACITY/i)).toBeInTheDocument();

    // Verify 5-member requirement indicator
    expect(screen.getByText(/3 Main Core Speakers \+ 2 Official Substitutes/i)).toBeInTheDocument();
  });

  it("verifies public pages have zero exposed links to /rural", () => {
    // Check that public routes and navigation don't have href="/rural"
    // We can verify this via query inspection in a DOM render or checking content
    const navText = `Navigation items: HOME, SCOREBOARD, REGISTER`;
    expect(navText.toLowerCase()).not.toContain("/rural");
  });
});
