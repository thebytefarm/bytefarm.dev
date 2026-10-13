import { useEffect, useMemo, useRef, useState } from "react";

import { SiteIcon } from "~/components/site-icon";

function getInstallOutput(command: string): readonly string[] {
  const packageName = command.split(/\s+/).at(-1) ?? "";
  if (command.startsWith("pnpm ")) {
    return [
      "Packages: +1",
      "Progress: resolved 1, downloaded 1, added 1, done",
      "",
      command.includes(" -D ") ? "devDependencies:" : "dependencies:",
      `+ ${packageName}`,
      "",
      "Done in 1s",
    ];
  }
  if (command.startsWith("cargo ")) {
    return ["    Updating crates.io index", `      Adding ${packageName} to dependencies`];
  }
  return ["added 1 package in 1s"];
}

/**
 * Animates an install preview once on entering view, with clipboard feedback.
 * @param props - Exact command to display and copy.
 * @returns A copyable command with a temporary success state.
 */
export function InstallCommand({ command }: { command: string }) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const output = useMemo(() => getInstallOutput(command), [command]);
  const [characters, setCharacters] = useState(0);
  const [outputLines, setOutputLines] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      const frame = window.requestAnimationFrame(() => {
        setCharacters(command.length);
        setOutputLines(output.length);
        setIsFinished(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    let hasStarted = false;
    let observer: IntersectionObserver | undefined;

    function startPreview() {
      if (hasStarted) return;
      hasStarted = true;
      observer?.disconnect();
      let character = 0;
      let line = 0;

      function showOutput() {
        line += 1;
        setOutputLines(line);
        if (line < output.length) {
          timer = setTimeout(showOutput, 300);
        } else {
          setIsFinished(true);
        }
      }

      function typeCommand() {
        character += 1;
        setCharacters(character);
        timer =
          character < command.length ? setTimeout(typeCommand, 35) : setTimeout(showOutput, 450);
      }

      typeCommand();
    }

    if (typeof IntersectionObserver === "undefined") {
      timer = setTimeout(startPreview, 0);
    } else {
      const navigationHeight =
        document.querySelector('[aria-label="Main navigation"]')?.getBoundingClientRect().height ??
        0;
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio === 1)) {
            startPreview();
          }
        },
        { threshold: 1, rootMargin: `-${navigationHeight}px 0px 0px 0px` },
      );
      if (terminalRef.current) observer.observe(terminalRef.current);
    }

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, [command, output]);

  useEffect(() => {
    if (status !== "copied") return;
    const timeout = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timeout);
  }, [status]);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="project-page__install" ref={terminalRef}>
      <div className="project-page__terminal-bar">
        <span className="project-page__install-title">
          <SiteIcon name="terminal" size={16} /> install preview
        </span>
        <button
          type="button"
          onClick={copyCommand}
          disabled={status === "copied"}
          aria-label={status === "copied" ? "Copied!" : "Copy install command"}
          title={status === "copied" ? "Copied!" : "Copy install command"}
          className={`project-page__copy${status === "copied" ? " project-page__copy--success" : ""}`}
        >
          <SiteIcon name={status === "copied" ? "check" : "copy"} size={18} />
        </button>
      </div>
      <pre tabIndex={0} aria-label="Install command">
        <span className="sr-only">{command}</span>
        <code aria-hidden="true">
          <span className="project-page__command">
            $ {command.slice(0, characters)}
            {!isFinished && <span className="project-page__install-cursor">▌</span>}
          </span>
          {outputLines > 0 && (
            <span className="project-page__install-output">
              {"\n\n"}
              {output.slice(0, outputLines).join("\n")}
            </span>
          )}
        </code>
      </pre>
      <span className="sr-only" role="status">
        {status === "copied" ? "Copied!" : ""}
      </span>
      {status === "error" && (
        <p className="project-page__copy-error" role="status">
          Couldn’t copy. Select the command and copy it manually.
        </p>
      )}
    </div>
  );
}
