import type { AnchorHTMLAttributes } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { FarmNav } from "~/components/farm-nav";

vi.mock("@tanstack/react-router", () => ({
  useLocation: () => "/about",
  Link: ({
    to,
    hash,
    hashScrollIntoView: _scroll,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    to: string;
    hash?: string;
    hashScrollIntoView?: unknown;
  }) => <a {...props} href={`${to}${hash ? `#${hash}` : ""}`} />,
}));

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("opens the navigation and restores toggle focus when Escape dismisses it", () => {
  render(<FarmNav />);
  const toggle = screen.getByRole("button", { name: "Open navigation" });
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(toggle);
  expect(toggle.getAttribute("aria-expanded")).toBe("true");
  screen.getByRole("link", { name: "about" }).focus();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(toggle);
});

it("dismisses on link selection or an outside pointer event, but not inside the nav", () => {
  render(<FarmNav />);
  const toggle = screen.getByRole("button", { name: "Open navigation" });
  fireEvent.click(toggle);
  fireEvent.pointerDown(screen.getByRole("navigation"));
  expect(toggle.getAttribute("aria-expanded")).toBe("true");
  fireEvent.click(screen.getByRole("link", { name: "about" }));
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(toggle);
  fireEvent.pointerDown(document.body);
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
});
