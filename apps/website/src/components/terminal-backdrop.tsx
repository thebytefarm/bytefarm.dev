/**
 * Renders low-contrast terminal scenery in the wide-screen page gutters.
 * @returns Decorative terminal readouts and ASCII crop rows.
 */
export function TerminalBackdrop() {
  return (
    <div className="terminal-backdrop" aria-hidden="true">
      <div className="terminal-backdrop__rail terminal-backdrop__rail--left">
        <span className="terminal-backdrop__label">BYTEFARM // SYSTEM</span>
        <pre>
          {
            "> boot bytefarm\n[ok] mount /projects\n[ok] source: open\n[ok] agents: ready\n\n> grow --watch\n_"
          }
        </pre>
        <pre className="terminal-backdrop__crops">
          {
            "  \\|/   \\|/   \\|/\n---+-----+-----+---\n  \\|/   \\|/   \\|/\n---+-----+-----+---\n  \\|/   \\|/   \\|/\n---+-----+-----+---"
          }
        </pre>
        <span className="terminal-backdrop__vertical">BUILD / CULTIVATE / REPEAT</span>
      </div>
      <div className="terminal-backdrop__rail terminal-backdrop__rail--right">
        <span className="terminal-backdrop__label">/DEV/OPEN-SOURCE</span>
        <pre>
          {
            "ciderpress  [docs]\nmaltty      [cli]\nmarxml      [parse]\nalmanac     [index]\nhopper      [agents]\ngranary     [context]"
          }
        </pre>
        <div className="terminal-backdrop__radar">
          <span>+</span>
        </div>
        <pre>
          {"commit. push. grow.\n\n> awaiting input"}
          <span className="terminal-backdrop__cursor">_</span>
        </pre>
      </div>
    </div>
  );
}
