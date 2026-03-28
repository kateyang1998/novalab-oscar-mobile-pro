// src/test/screens/SplashScreen.test.jsx
// UC-01: Login (Splash → SignIn navigation)

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SplashScreen from "../../screens/SplashScreen";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("../../assets/logoWhite.png", () => ({ default: "logoWhite.png" }));

// ─── Helper ───────────────────────────────────────────────────────────────────

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={["/splash"]}>
      <Routes>
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/signin" element={<div data-testid="signin-screen">Sign In</div>} />
      </Routes>
    </MemoryRouter>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("SplashScreen — UC-01: Login (initial navigation)", () => {

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders the OSCAR logo", () => {
    renderScreen();
    expect(screen.getByAltText("OSCAR Mobile Pro Logo")).toBeInTheDocument();
  });

  it("renders the logo with correct src", () => {
    renderScreen();
    expect(screen.getByAltText("OSCAR Mobile Pro Logo")).toHaveAttribute("src", "logoWhite.png");
  });

  it("does not navigate immediately on render", () => {
    renderScreen();
    expect(screen.queryByTestId("signin-screen")).not.toBeInTheDocument();
    expect(screen.getByAltText("OSCAR Mobile Pro Logo")).toBeInTheDocument();
  });

  // ── Navigation ─────────────────────────────────────────────────────────────

  it("navigates to /signin after 2 seconds", () => {
    renderScreen();

    // Before timer fires — still on splash
    expect(screen.getByAltText("OSCAR Mobile Pro Logo")).toBeInTheDocument();

    // Advance timer inside act() so React processes state updates
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByTestId("signin-screen")).toBeInTheDocument();
  });

  it("does not navigate before 2 seconds", () => {
    renderScreen();

    act(() => {
      vi.advanceTimersByTime(1999);
    });

    expect(screen.queryByTestId("signin-screen")).not.toBeInTheDocument();
    expect(screen.getByAltText("OSCAR Mobile Pro Logo")).toBeInTheDocument();
  });

  // ── Cleanup ────────────────────────────────────────────────────────────────

  it("clears the timer on unmount to prevent memory leaks", () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
    const { unmount } = renderScreen();

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});