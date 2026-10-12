interface SiteIconProps {
  name: "github" | "discord" | "pause" | "play";
  size?: number;
}

/**
 * Renders locally drawn icons for community links and scenery controls.
 * @param props - Icon name and square size in pixels.
 * @returns A decorative SVG that inherits the surrounding text color.
 */
export function SiteIcon({ name, size = 20 }: SiteIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "github" && (
        <>
          <path d="M8 21v-4c-4 1-5-2-6-3m14 7v-4c0-1-.4-1.8-1-2.4 3-.5 5-2 5-5.6 0-1.3-.5-2.5-1.4-3.4.3-1.2.3-2.4-.1-3.6-1.5 0-2.8.7-4 1.5a12 12 0 0 0-5 0C8.3 2.7 7 2 5.5 2c-.4 1.2-.4 2.4-.1 3.6C4.5 6.5 4 7.7 4 9c0 3.6 2 5.1 5 5.6-.6.6-1 1.4-1 2.4" />
        </>
      )}
      {name === "discord" && (
        <>
          <path d="m8 4-3 1C3 8 2 12 2 16l5 3 2-3m7-12 3 1c2 3 3 7 3 11l-5 3-2-3M7 7c3-1 7-1 10 0M7 15c3 2 7 2 10 0" />
          <circle cx={8.5} cy={11.5} r={1} fill="currentColor" stroke="none" />
          <circle cx={15.5} cy={11.5} r={1} fill="currentColor" stroke="none" />
        </>
      )}
      {name === "pause" && <path d="M8 5v14M16 5v14" strokeWidth={3} />}
      {name === "play" && <path d="m8 5 11 7-11 7Z" fill="currentColor" stroke="none" />}
    </svg>
  );
}
