import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InstallCommand } from "~/components/install-command";

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({ matches: true }));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("install command clipboard", () => {
  it("waits for full visibility, copies the complete command during typing, and never replays", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    let onIntersection: IntersectionObserverCallback | undefined;
    const observer = { observe: vi.fn(), disconnect: vi.fn() } as unknown as IntersectionObserver;
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn(function (callback: IntersectionObserverCallback) {
        onIntersection = callback;
        return observer;
      }),
    );
    render(<InstallCommand command="npm install ciderpress" />);
    const code = screen.getByLabelText("Install command").querySelector("code");
    expect(code?.textContent).not.toContain("npm install ciderpress");

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy install command" }));
    });
    expect(writeText).toHaveBeenCalledWith("npm install ciderpress");

    act(() => {
      onIntersection?.(
        [{ isIntersecting: true, intersectionRatio: 0.99 } as IntersectionObserverEntry],
        observer,
      );
      vi.advanceTimersByTime(10000);
    });
    expect(code?.textContent).not.toContain("npm install ciderpress");
    expect(observer.disconnect).not.toHaveBeenCalled();

    act(() => {
      onIntersection?.(
        [{ isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
        observer,
      );
      vi.advanceTimersByTime(10000);
    });
    const completedPreview = code?.textContent;
    expect(completedPreview).toContain("npm install ciderpress");
    expect(completedPreview).toContain("added 1 package in 1s");
    expect(observer.disconnect).toHaveBeenCalledOnce();

    act(() => {
      onIntersection?.(
        [{ isIntersecting: false, intersectionRatio: 0 } as IntersectionObserverEntry],
        observer,
      );
      onIntersection?.(
        [{ isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
        observer,
      );
    });
    expect(code?.textContent).toBe(completedPreview);
    expect(observer.disconnect).toHaveBeenCalledOnce();
  });

  it("copies only the command and resets its success feedback after two seconds", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<InstallCommand command="npm install ciderpress" />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy install command" }));
    });

    expect(writeText).toHaveBeenCalledWith("npm install ciderpress");
    expect(screen.getByRole("button", { name: "Copied!" }).hasAttribute("disabled")).toBe(true);

    act(() => vi.advanceTimersByTime(2000));
    expect(
      screen.getByRole("button", { name: "Copy install command" }).hasAttribute("disabled"),
    ).toBe(false);
  });

  it("shows a manual-copy fallback instead of success when clipboard access fails", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Clipboard permission denied"));
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<InstallCommand command="pnpm add marxml" />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy install command" }));
    });

    expect(screen.getByText(/Couldn’t copy/).textContent).toContain("Couldn’t copy");
    expect(screen.queryByRole("button", { name: "Copied!" })).toBeNull();
    expect(
      screen.getByRole("button", { name: "Copy install command" }).hasAttribute("disabled"),
    ).toBe(false);
    expect(screen.getByLabelText("Install command").textContent).toContain("pnpm add marxml");
  });
});
