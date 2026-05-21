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

/**
 * Open-farm hero view. Three depth layers:
 *   - back: distant trees + sky props
 *   - mid:  barn cluster, windmill, mid trees
 *   - front: foreground props, animals, crops, character
 *
 * Container fills the viewport. Sprite positions are % of container so the
 * composition stays balanced at any size.
 */
export function Scene() {
  return (
    <div className="scene" role="img" aria-label="bytefarm — open farm at midday">
      <div className="scene__sky" />
      <div className="scene__hills" />
      <div className="scene__grass" />
      <div className="scene__dirt" />

      {/* Drifting clouds */}
      <Cloud className="cloud cloud--a" />
      <Cloud className="cloud cloud--b" />
      <Cloud className="cloud cloud--c" />
      <Cloud className="cloud cloud--d" />

      {/* Logo */}
      <div className="scene__logo">
        <span className="scene__logo-byte">byte</span>
        <span className="scene__logo-farm">farm</span>
        <Leaf className="scene__logo-leaf" />
        <p className="scene__tagline">a little farm growing open source, one byte at a time.</p>
      </div>

      {/* ---------- BACK LAYER ---------- */}
      <TreeOak className="sprite back tree--back-1" />
      <TreeOak className="sprite back tree--back-2" />
      <AppleTree className="sprite back tree--back-3" />

      {/* ---------- MID LAYER ---------- */}
      <AppleTree className="sprite mid tree--mid-1" />
      <Barn className="sprite mid barn" />
      <Silo className="sprite mid silo" />
      <Bush className="sprite mid bush--barn" />
      <BushPink className="sprite mid bush--pink-1" />
      <TreeOak className="sprite mid tree--mid-2" />
      <Windmill className="sprite mid windmill" />

      {/* ---------- FRONT LAYER ---------- */}
      <Fence className="sprite front fence fence--left" />
      <Fence className="sprite front fence fence--right" />

      {/* Animals in the paddock */}
      <Cow className="sprite front cow" />
      <Pig className="sprite front pig" />
      <Chicken className="sprite front chicken--1" />
      <Chicken className="sprite front chicken--2" />

      {/* Crop rows */}
      <Corn className="sprite front corn corn--1" />
      <Corn className="sprite front corn corn--2" />
      <Corn className="sprite front corn corn--3" />
      <Sunflower className="sprite front sunflower" />
      <Cabbage className="sprite front cabbage" />
      <Pumpkin className="sprite front pumpkin" />
      <Sprout className="sprite front sprout--1" />
      <Sprout className="sprite front sprout--2" />

      {/* Foreground props */}
      <HayBale className="sprite front haybale haybale--1" />
      <HayBale className="sprite front haybale haybale--2" />
      <Crate className="sprite front crate" />
      <BushSmall className="sprite front bush--small-1" />
      <BushSmall className="sprite front bush--small-2" />

      {/* Tractor + farmer */}
      <Tractor className="sprite front tractor" />
      <LittleGuy className="sprite front little-guy" />
    </div>
  );
}
