# Contributing

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
  website/            # the bytefarm.dev site (TanStack Start + Nitro)
packages/
  ui/                 # shared React components
  typescript-config/  # shared tsconfig presets
```
