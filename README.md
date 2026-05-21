<div align="center">
  <p><strong>The marketing site for <a href="https://github.com/thebytefarm">thebytefarm</a> — a little farm growing open source, one byte at a time.</strong></p>

<a href="https://bytefarm.dev"><img src="https://img.shields.io/badge/site-bytefarm.dev-1a1a1a" alt="bytefarm.dev" /></a>
<a href="https://github.com/thebytefarm/bytefarm.dev/blob/main/LICENSE"><img src="https://img.shields.io/github/license/thebytefarm/bytefarm.dev" alt="License" /></a>

</div>

## About

This repo is the source for [bytefarm.dev](https://bytefarm.dev) — the front door for thebytefarm and the open source we ship there ([`zpress`](https://github.com/thebytefarm/zpress), [`kidd`](https://github.com/thebytefarm/kidd), [`marxml`](https://github.com/thebytefarm/marxml), and more).

It's a pnpm + Turborepo monorepo. The site itself lives in `apps/website` (TanStack Start + Nitro + Tailwind), with shared UI in `packages/ui`.

## Develop

```bash
pnpm install
pnpm dev
```

The site runs on `http://localhost:3000`.

## Validate

```bash
pnpm validate   # typecheck + lint + format + test
```

## Layout

```
apps/
  website/          # the bytefarm.dev site (TanStack Start)
packages/
  ui/               # shared React components
  typescript-config # shared tsconfig presets
```

## License

[MIT](./LICENSE) © thebytefarm
