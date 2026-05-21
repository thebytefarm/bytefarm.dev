import type { Meta, StoryObj } from "@storybook/react-vite";
import { Scene } from "./Scene";

const meta = {
  title: "Toons/Scene",
  component: Scene,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Scene>;

export default meta;
type Story = StoryObj<typeof meta>;

const REF = "/bytefarm-reference.png";

/* Live scene only (banner 2.5:1). */
export const Live: Story = {
  render: () => (
    <div
      style={{
        width: "100vw",
        height: "calc(100vw / 2.5)",
        background: "#1a1a2e",
      }}
    >
      <Scene />
    </div>
  ),
};

/* Stacked: reference on top, live scene below at same width. */
export const Stacked: Story = {
  render: () => (
    <div style={{ width: "100vw", background: "#1a1a2e" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "25 / 10" }}>
        <img
          src={REF}
          alt="reference"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
            imageRendering: "pixelated",
            display: "block",
          }}
        />
        <Label text="REFERENCE" />
      </div>
      <div style={{ position: "relative", width: "100%" }}>
        <Scene />
        <Label text="LIVE" />
      </div>
    </div>
  ),
};

/* Overlay: reference image sits behind live scene at 40% opacity so we can
   verify sprite positions line up pixel-for-pixel. */
export const Overlay: Story = {
  render: () => (
    <div style={{ width: "100vw", background: "#1a1a2e" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "25 / 10" }}>
        <img
          src={REF}
          alt="reference behind scene"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
            imageRendering: "pixelated",
            opacity: 0.5,
            zIndex: 100,
            pointerEvents: "none",
          }}
        />
        <Scene />
        <Label text="OVERLAY (ref @ 50%)" />
      </div>
    </div>
  ),
};

/* Reference image at full bleed for visual study. */
export const ReferenceOnly: Story = {
  render: () => (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={REF}
        alt="ByteFarm reference"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          imageRendering: "pixelated",
        }}
      />
    </div>
  ),
};

function Label({ text }: { text: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 8,
        left: 8,
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        padding: "4px 8px",
        fontFamily: "ui-monospace, monospace",
        fontSize: 12,
        borderRadius: 4,
        zIndex: 200,
      }}
    >
      {text}
    </div>
  );
}
