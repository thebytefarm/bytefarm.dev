import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType, ReactNode } from "react";
import {
  AppleTree,
  Barn,
  Bush,
  BushPink,
  BushSmall,
  Cabbage,
  Chicken,
  Cloud,
  Corn,
  Cow,
  Crate,
  Fence,
  HayBale,
  Leaf,
  LittleGuy,
  Pig,
  Pumpkin,
  Silo,
  Sprout,
  Sunflower,
  Tractor,
  TreeOak,
  Windmill,
} from "./sprites";

/*
 * Each story shows the LIVE SVG sprite (auto-generated from its reference
 * PNG) at 3 sizes alongside the dedicated crop PNG.
 */

function ReferenceImage({ src, label }: { src: string; label: string }) {
  return (
    <div className="bf-compare-panel">
      <h2>Reference crop</h2>
      <p>{label}</p>
      <img className="bf-reference-img" src={src} alt={label} />
    </div>
  );
}

function SpriteRow({
  Sprite,
  sizes,
  variant = "default",
}: {
  Sprite: ComponentType<{ className?: string }>;
  sizes: number[];
  variant?: "default" | "grass";
}) {
  return (
    <div className={`bf-sprite-frame ${variant === "grass" ? "bf-sprite-frame--grass" : ""}`}>
      <div className="bf-size-row">
        {sizes.map((size) => (
          <div key={size}>
            <div style={{ width: size }}>
              <Sprite />
            </div>
            <span>{size}px</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparePanel({
  title,
  refSrc,
  refLabel,
  children,
}: {
  title: string;
  refSrc: string;
  refLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="bf-compare-grid">
      <div className="bf-compare-panel">
        <h2>{title}</h2>
        <p>Current SVG at multiple sizes</p>
        {children}
      </div>
      <ReferenceImage src={refSrc} label={refLabel} />
    </div>
  );
}

const meta = {
  title: "Toons/Sprites",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const LogoLeaf: Story = {
  render: () => (
    <ComparePanel title="Leaf" refSrc="/sprites/logo.png" refLabel="leaf from logo">
      <SpriteRow Sprite={Leaf} sizes={[32, 64, 128]} />
    </ComparePanel>
  ),
};

export const CloudSprite: Story = {
  name: "Cloud",
  render: () => (
    <ComparePanel title="Cloud" refSrc="/sprites/cloud-medium.png" refLabel="medium cloud">
      <SpriteRow Sprite={Cloud} sizes={[80, 140, 220]} />
    </ComparePanel>
  ),
};

export const TreeBigOak: Story = {
  render: () => (
    <ComparePanel title="TreeOak" refSrc="/sprites/tree-oak.png" refLabel="big oak tree">
      <SpriteRow Sprite={TreeOak} sizes={[120, 200, 280]} variant="grass" />
    </ComparePanel>
  ),
};

export const TreeApple: Story = {
  render: () => (
    <ComparePanel title="AppleTree" refSrc="/sprites/apple-tree.png" refLabel="apple tree">
      <SpriteRow Sprite={AppleTree} sizes={[80, 130, 180]} variant="grass" />
    </ComparePanel>
  ),
};

export const BarnSprite: Story = {
  name: "Barn",
  render: () => (
    <ComparePanel title="Barn" refSrc="/sprites/barn.png" refLabel="red barn">
      <SpriteRow Sprite={Barn} sizes={[160, 240, 340]} variant="grass" />
    </ComparePanel>
  ),
};

export const SiloSprite: Story = {
  name: "Silo",
  render: () => (
    <ComparePanel title="Silo" refSrc="/sprites/silo.png" refLabel="grey silo">
      <SpriteRow Sprite={Silo} sizes={[80, 130, 200]} variant="grass" />
    </ComparePanel>
  ),
};

export const SunflowerSprite: Story = {
  name: "Sunflower",
  render: () => (
    <ComparePanel title="Sunflower" refSrc="/sprites/sunflower-full.png" refLabel="sunflower">
      <SpriteRow Sprite={Sunflower} sizes={[36, 56, 88]} variant="grass" />
    </ComparePanel>
  ),
};

export const PumpkinSprite: Story = {
  name: "Pumpkin",
  render: () => (
    <ComparePanel
      title="Pumpkin"
      refSrc="/sprites/sunflower-bud.png"
      refLabel="pumpkin (uses bud crop)"
    >
      <SpriteRow Sprite={Pumpkin} sizes={[28, 44, 72]} variant="grass" />
    </ComparePanel>
  ),
};

export const CornSprite: Story = {
  name: "Corn",
  render: () => (
    <ComparePanel title="Corn" refSrc="/sprites/crop-stalk-5.png" refLabel="corn stalk">
      <SpriteRow Sprite={Corn} sizes={[40, 64, 100]} variant="grass" />
    </ComparePanel>
  ),
};

export const FenceSprite: Story = {
  name: "Fence",
  render: () => (
    <ComparePanel title="Fence" refSrc="/sprites/fence.png" refLabel="wooden fence">
      <SpriteRow Sprite={Fence} sizes={[180, 260, 360]} variant="grass" />
    </ComparePanel>
  ),
};

export const CowSprite: Story = {
  name: "Cow",
  render: () => (
    <ComparePanel title="Cow" refSrc="/sprites/cow.png" refLabel="Holstein cow">
      <SpriteRow Sprite={Cow} sizes={[80, 120, 180]} variant="grass" />
    </ComparePanel>
  ),
};

export const PigSprite: Story = {
  name: "Pig",
  render: () => (
    <ComparePanel title="Pig" refSrc="/sprites/pig.png" refLabel="pink pig">
      <SpriteRow Sprite={Pig} sizes={[70, 110, 160]} variant="grass" />
    </ComparePanel>
  ),
};

export const ChickenSprite: Story = {
  name: "Chicken",
  render: () => (
    <ComparePanel title="Chicken" refSrc="/sprites/chicken.png" refLabel="white chicken">
      <SpriteRow Sprite={Chicken} sizes={[50, 80, 120]} variant="grass" />
    </ComparePanel>
  ),
};

export const WindmillSprite: Story = {
  name: "Windmill",
  render: () => (
    <ComparePanel
      title="Windmill"
      refSrc="/sprites/windmill.png"
      refLabel="windmill tower + blades"
    >
      <SpriteRow Sprite={Windmill} sizes={[80, 140, 220]} variant="grass" />
    </ComparePanel>
  ),
};

export const TractorSprite: Story = {
  name: "Tractor",
  render: () => (
    <ComparePanel title="Tractor" refSrc="/sprites/tractor.png" refLabel="red tractor + farmer">
      <SpriteRow Sprite={Tractor} sizes={[160, 240, 340]} variant="grass" />
    </ComparePanel>
  ),
};

export const HayBaleSprite: Story = {
  name: "Hay bale",
  render: () => (
    <ComparePanel title="HayBale" refSrc="/sprites/hay-bale.png" refLabel="golden hay bale">
      <SpriteRow Sprite={HayBale} sizes={[60, 100, 160]} variant="grass" />
    </ComparePanel>
  ),
};

export const LittleGuySprite: Story = {
  name: "Little guy",
  render: () => (
    <ComparePanel
      title="LittleGuy"
      refSrc="/sprites/sitting-farmer.png"
      refLabel="farmer character"
    >
      <SpriteRow Sprite={LittleGuy} sizes={[60, 90, 130]} variant="grass" />
    </ComparePanel>
  ),
};

export const BushSprite: Story = {
  name: "Bush",
  render: () => (
    <ComparePanel title="Bush" refSrc="/sprites/bush.png" refLabel="green bush">
      <SpriteRow Sprite={Bush} sizes={[60, 90, 130]} variant="grass" />
    </ComparePanel>
  ),
};

export const BushSmallSprite: Story = {
  name: "Bush (small)",
  render: () => (
    <ComparePanel title="BushSmall" refSrc="/sprites/bush-small.png" refLabel="small bush">
      <SpriteRow Sprite={BushSmall} sizes={[40, 60, 90]} variant="grass" />
    </ComparePanel>
  ),
};

export const BushPinkSprite: Story = {
  name: "Bush (pink)",
  render: () => (
    <ComparePanel title="BushPink" refSrc="/sprites/bush-pink.png" refLabel="flowering bush">
      <SpriteRow Sprite={BushPink} sizes={[60, 90, 130]} variant="grass" />
    </ComparePanel>
  ),
};

export const SproutSprite: Story = {
  name: "Sprout",
  render: () => (
    <ComparePanel title="Sprout" refSrc="/sprites/sprout.png" refLabel="young sprout">
      <SpriteRow Sprite={Sprout} sizes={[28, 44, 72]} variant="grass" />
    </ComparePanel>
  ),
};

export const CabbageSprite: Story = {
  name: "Cabbage",
  render: () => (
    <ComparePanel title="Cabbage" refSrc="/sprites/cabbage.png" refLabel="cabbage">
      <SpriteRow Sprite={Cabbage} sizes={[36, 56, 88]} variant="grass" />
    </ComparePanel>
  ),
};

export const CrateSprite: Story = {
  name: "Crate",
  render: () => (
    <ComparePanel title="Crate" refSrc="/sprites/crate-1.png" refLabel="wooden crate">
      <SpriteRow Sprite={Crate} sizes={[40, 60, 90]} variant="grass" />
    </ComparePanel>
  ),
};
