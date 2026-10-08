import { render, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Hero } from "@/components/debait/Hero";
import { CinematicTransitionProvider } from "@/components/debait/CinematicTransition";

describe("Hero and Typewriter stability", () => {
  it("renders Hero and cycles through typewriter phrases without throwing", () => {
    vi.useFakeTimers();
    const { container } = render(
      <CinematicTransitionProvider>
        <Hero introReady={true} />
      </CinematicTransitionProvider>,
    );

    // Fast-forward through multiple full cycles of typing and deleting
    // 1 cycle = ~4.5s. 5 cycles = 25s.
    act(() => {
      vi.advanceTimersByTime(25000);
    });

    expect(container).toBeDefined();
    expect(container.innerHTML).not.toContain("This page didn't load");
    vi.useRealTimers();
  });
});
