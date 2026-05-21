import {
  AppleTree,
  Barn,
  Bush,
  Cabbage,
  Chicken,
  Cloud,
  Corn,
  Cow,
  Fence,
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
 * Scene container is a 2.5:1 banner matching the reference image's aspect
 * ratio. All sprite positions are percentages of the container so the
 * composition remains pixel-aligned with the reference at any width.
 */
export function Scene() {
  return (
    <div className="scene" role="img" aria-label="ByteFarm — animated pixel farm scene">
      {/* Background placeholders — user-provided BG components replace these */}
      <div className="scene__bg-sky" />
      <div className="scene__bg-grass" />
      <div className="scene__bg-dirt" />

      {/* Clouds */}
      <Cloud className="cloud cloud--1" />
      <Cloud className="cloud cloud--2" />
      <Cloud className="cloud cloud--3" />
      <Cloud className="cloud cloud--4" />

      {/* Logo */}
      <div className="scene__logo">
        <span className="scene__logo-byte">byte</span>
        <span className="scene__logo-farm">farm</span>
        <Leaf className="scene__logo-leaf" />
      </div>

      {/* Left grove */}
      <TreeOak className="sprite tree--left" />
      <AppleTree className="sprite tree--apple" />

      {/* Farm cluster */}
      <Barn className="sprite barn" />
      <Silo className="sprite silo" />
      <Bush className="sprite bush--barn" />

      {/* Crops between farm and tractor */}
      <Pumpkin className="sprite pumpkin--1" />
      <Sprout className="sprite sprout--1" />

      {/* Tractor */}
      <Tractor className="sprite tractor" />

      {/* Middle corn field */}
      <Corn className="sprite corn corn--1" />
      <Corn className="sprite corn corn--2" />
      <Corn className="sprite corn corn--3" />
      <Sunflower className="sprite sunflower--1" />
      <Cabbage className="sprite cabbage--1" />

      {/* Fence + animals */}
      <Fence className="sprite fence" />
      <Cow className="sprite cow" />
      <Pig className="sprite pig" />
      <Chicken className="sprite chicken" />

      {/* Right grove */}
      <TreeOak className="sprite tree--right" />
      <Windmill className="sprite windmill" />
      <LittleGuy className="sprite little-guy" />
    </div>
  );
}
