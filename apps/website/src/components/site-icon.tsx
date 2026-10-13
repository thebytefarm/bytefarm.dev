const ICON_PATHS = {
  github:
    "M5 2h4v2H7v2H5zm0 10H3V6h2zm2 2H5v-2h2zm2 2v-2H7v2H3v-2H1v2h2v2h4v4h2v-4h2v-2zm0 0v2H7v-2zm6-12v2H9V4zm4 2h-2V4h-2V2h4zm0 6V6h2v6zm-2 2v-2h2v2zm-2 2v-2h2v2zm0 2h-2v-2h2zm0 0h2v4h-2z",
  discord:
    "M9 21H5v-2h4zm10 0h-4v-2h4zM5 19H3v-2h2zm12-2h-2v2h-2v-2h-2v2H9v-2H7v-2h10zm4 2h-2v-2h2zM3 17H1V7h2zm20 0h-2V7h2zm-12-4H8v-3h3zm5 0h-3v-3h3zM5 7H3V5h2zm10 0H9V5h6zm6 0h-2V5h2zM9 5H5V3h4zm10 0h-4V3h4z",
  pause: "M10 20H4V4h6zm8-16v16h-6V4zm-4 2v12h2V6zM6 18h2V6H6z",
  play: "M15 11h-2V9h2zm0 4h-2v-2h2zm-2 2h-2v-2h2zm0-8h-2V7h2zm-2-2H9V5h2zM9 21H7V3h2zm6-8h2v-2h-2zm-6 4h2v2H9z",
  star: "M5 20h3v2H3v-6h2zm16 2h-5v-2h3v-4h2zm-11-2H8v-2h2zm6 0h-2v-2h2zm-2-2h-4v-2h4zm-7-2H5v-3h2zm12 0h-2v-3h2zM5 13H3v-2h2zm16 0h-2v-2h2zM9 9H3v2H1V7h8zm14 2h-2V9h-6V7h8zM11 7H9V3h2zm4 0h-2V3h2zm-2-4h-2V1h2z",
  "arrow-right":
    "M4 11v2h16v-2zm12 2v2h2v-2zm-2 2v2h2v-2zm-2 2v2h2v-2zm4-6V9h2v2z M14 15V7h2v8zm-2 2V5h2v12z",
  "external-link":
    "M11 5H5v2h6zM5 7H3v12h2zm12 12H5v2h12zm2-6h-2v6h2zm-8 0H9v2h2zm2-2h-2v2h2zm2-2h-2v2h2zm2-2h-2v2h2zm2-2h-2v2h2zm2-2h-2v8h2z M21 3h-8v2h8z",
  "book-open":
    "M2 3h9v2H2zM0 19h11v2H0zM13 3h9v2h-9zm0 16h11v2H13zM11 5h2v18h-2zM0 5h2v14H0zm22 0h2v14h-2zm-7 2h5v2h-5zm0 4h5v2h-5zm0 4h2v2h-2z",
  copy: "M8 6h12v2H8zM4 2h12v2H4zm2 6h2v12H6zM2 4h2v12H2zm6 16h12v2H8zM20 8h2v12h-2zm-4-4h2v2h-2zM4 16h2v2H4z",
  check:
    "M10 18H8v-2h2zm-2-2H6v-2h2zm4-2v2h-2v-2zm-6 0H4v-2h2zm8 0h-2v-2h2zm2-2h-2v-2h2zm2-2h-2V8h2zm2-2h-2V6h2z",
  folder: "M4 4h6v2H4zm0 14h16v2H4zM20 8h2v10h-2zM2 6h2v12H2zm8 0h10v2H10z",
  sliders:
    "M8 14H7v6H5v-6H2v-2h6zm5 6h-2V10h2zm9-2h-3v2h-2v-2h-1v-2h6zm-3-4h-2V4h2zM7 10H5V4h2zm6-4h2v2H9V6h2V4h2z",
  layout: "M20 20H4v-2h4v-8H4v8H2V6h2v2h16V6h2v12h-2v-8H10v8h10zm0-14H4V4h16z",
  terminal:
    "M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zM6 16h2v2H6zm2-2h2v2H8zm-2-2h2v2H6z",
  code: "M11 18H9v-4h2zm-4-1H5v-2h2zm12-2v2h-2v-2zM5 15H3v-2h2zm16 0h-2v-2h2zm-8-1h-2v-4h2zM3 13H1v-2h2zm20 0h-2v-2h2zM5 11H3V9h2zm16 0h-2V9h2zm-6-1h-2V6h2zM7 9H5V7h2zm12 0h-2V7h2z",
  search:
    "M22 22h-2v-2h2zm-2-2h-2v-2h2zm-6-2H6v-2h8zm4 0h-2v-2h2zM6 16H4v-2h2zm10 0h-2v-2h2zM4 14H2V6h2zm14 0h-2V6h2zM6 6H4V4h2zm10 0h-2V4h2zm-2-2H6V2h8z",
  edit: "M18 2h-2v2h-2v2h-2v2h-2v2H8v2H6v2H4v2H2v6h6v-2h2v-2h2v-2h2v-2h2v-2h2v-2h2V8h2V6h-2V4h-2zm0 8h-2v2h-2v2h-2v2h-2v2H8v-2H6v-2h2v-2h2v-2h2V8h2V6h2v2h2zM6 16H4v4h4v-2H6z",
  shield:
    "M4 2h16v2H4zM2 4h2v10H2zm18 0h2v10h-2zM4 14h2v2H4zm2 2h2v2H6zm4 4h4v2h-4zm10-6h-2v2h2zm-2 2h-2v2h2zm-2 2h-2v2h2zm-6 0H8v2h2z",
  "git-branch":
    "M4 14h4v2H4zm0 6h4v2H4zm-2-4h2v4H2zm6 0h2v4H8zm8-14h4v2h-4zm0 6h4v2h-4zm-2-4h2v4h-2zm6 0h2v4h-2zm-8 13h5v2h-5zm5-5h2v5h-2zM5 2h2v10H5z",
  refresh:
    "M13 20H9v-2h4zm6-4h2v2h-2v2h-2v-2h-2v-2h2V8h2zM9 18H7v-2h2zM7 6h2v2H7v8H5V8H3V6h2V4h2zm8 10h-2v-2h2zm8 0h-2v-2h2zM3 10H1V8h2zm8 0H9V8h2zm6-2h-2V6h2zm-2-2h-4V4h4z",
  archive:
    "M3 2h18v2H3zm0 5h18v2H3zM1 4h2v3H1zm20 0h2v3h-2zm-2 5h2v11h-2zM3 9h2v11H3zm2 11h14v2H5zm4-9h6v2H9z",
  image:
    "M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zm-4 8h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm-8 0h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2zM20 16h2v2h-2zM8 16h2v2H8zm-2 2h2v2H6zM8 6h2v2H8zM6 8h2v2H6zm2 2h2v2H8zm2-2h2v2h-2z",
  notes:
    "M6 8h2v12H6zM2 4h2v12H2zm18 4h2v8h-2zM8 6h12v2H8zM4 2h12v2H4zm14 14h2v2h-2zm-2 2h2v2h-2zm-8 2h8v2H8zm6-6h6v2h-6zM14 14h2v6h-2zm2-10h2v2h-2zM4 16h2v2H4z",
} as const;

export type SiteIconName = keyof typeof ICON_PATHS | "arrow-left";

interface SiteIconProps {
  name: SiteIconName;
  size?: number;
}

/**
 * Renders bundled Pixelarticons paths from Iconify; license: /pixelarticons-license.txt.
 * @param props - Icon name and square size in pixels.
 * @returns A decorative SVG that inherits the surrounding text color.
 */
export function SiteIcon({ name, size = 24 }: SiteIconProps) {
  return (
    <svg
      className="site-icon"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={ICON_PATHS[name === "arrow-left" ? "arrow-right" : name]}
        transform={name === "arrow-left" ? "translate(24 0) scale(-1 1)" : undefined}
      />
    </svg>
  );
}
