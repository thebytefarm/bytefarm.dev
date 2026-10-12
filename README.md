![bytefarm](https://raw.githubusercontent.com/thebytefarm/.github/main/assets/banner.png)

<div align="center">

The public homepage for [thebytefarm](https://github.com/thebytefarm) - a little farm growing open source, one byte at a time.

<a href="https://bytefarm.dev"><img src="https://img.shields.io/badge/live-bytefarm.dev-1a1a1a" alt="bytefarm.dev" /></a>
<a href="https://github.com/thebytefarm/bytefarm.dev/blob/main/LICENSE"><img src="https://img.shields.io/github/license/thebytefarm/bytefarm.dev" alt="License" /></a>
<a href="https://github.com/thebytefarm/bytefarm.dev/stargazers"><img src="https://img.shields.io/github/stars/thebytefarm/bytefarm.dev?style=flat" alt="Stars" /></a>

</div>

<br>

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) to run the site locally.

## ASCII art

Run `pnpm dev` and open `/ascii` for the leaf, original wordmark, and an animated
farm illustration. The scene uses 320 columns and 64 colours, with drifting
clouds and swaying foreground grass. Animation lives in
`apps/website/src/components/barn-reference-art.ts` and uses
[`ascii.rest/kit`](https://ascii.rest/docs/kit/).

```sh
pnpm ascii:preview # Terminal preview; reloads when the piece changes
pnpm ascii:logo    # Preview the original logo as ASCII
pnpm ascii:leaf    # Preview the leaf as ASCII
pnpm ascii:export  # Regenerate brand art and farm SVG/text exports
```

The scene loops every sixty seconds. The leaf and wordmark glint every six seconds.
Exports live in `apps/website/public/brand/`: light/dark animated SVGs and plain-text
art. Browser art pauses off screen and respects reduced motion. Use Node 24 or newer
for the CLI.

## License

[MIT](./LICENSE) © thebytefarm
