---
name: changesets
description: Rules for creating and editing changeset files in .changeset/ — which @doenet/* packages to list, packages that must never appear, one-directional propagation, the private-flag trap, and changeset file format. Use whenever adding or editing a .changeset/*.md file.
---

# Changesets Skill

Use this skill when **creating or editing files in `.changeset/`** (typically `.changeset/<some-name>.md`). It covers which `@doenet/*` packages a changeset should list, how version propagation works, and which packages must never appear.

Configuration lives in `.changeset/config.json`. The version-packages PR (`changeset-release/main` branch) is maintained by `.github/workflows/changesets-version-pr.yml`; npm publication is handled separately by `.github/workflows/publish.yml`.

## Fixed Group (synchronized versioning)

Six packages version together:

- `@doenet/doenetml`
- `@doenet/standalone`
- `@doenet/doenetml-iframe`
- `@doenet/v06-to-v07`
- `@doenet/vscode-extension`
- `doenet-vscode-extension`

Bump any one of these and Changesets bumps all six. Listing or omitting a fixed-group member only controls which package's CHANGELOG the entry lands in — not whether it gets a version bump.

## Independent Versioning

`@doenet/prefigure` is published but **never listed in any changeset**. Its npm
version is manually pinned to match the bundled `prefig` Python wheel version
(e.g. `0.6.7`) so consumers can see which upstream Python runtime they are
running. It lives in the `ignore` list in `.changeset/config.json`. When
bumping the prefig wheel, update `packages/prefigure/package.json` directly
following the instructions in `packages/prefigure/README.md`.

## Never Versioned

Most `@doenet/*` packages are **internal**: their source is bundled into `@doenet/doenetml`, so a change to any of them rides out under `@doenet/doenetml`'s version. **Never list an internal package in a changeset** — not even when the files that changed are its own.

Rather than enumerate them — the list grows — invert it. **Exactly six packages are published**, and every other `@doenet/*` package is internal:

- `@doenet/doenetml`
- `@doenet/standalone`
- `@doenet/doenetml-iframe`
- `@doenet/v06-to-v07`
- `@doenet/vscode-extension` / `doenet-vscode-extension`
- `@doenet/prefigure` (published, but never listed in a changeset — see above)

So `@doenet/i18n`, `@doenet/utils`, `@doenet/parser`, `@doenet/ui-components`, `@doenet/static-assets`, `@doenet/lsp-tools`, `@doenet/lsp`, `@doenet/codemirror`, `@doenet/virtual-keyboard`, `@doenet/doenetml-worker`, `@doenet/doenetml-worker-javascript`, `@doenet/debug-hooks` and the rest never appear in a changeset. A change to any of them is a change to `@doenet/doenetml`.

Don't infer "never published" from `"private": true` alone, and don't infer "published" from its absence. Most packages in this repo — including every published one (`@doenet/doenetml`, `@doenet/standalone`, `@doenet/doenetml-iframe`, `@doenet/v06-to-v07`, `@doenet/prefigure`) — carry `"private": true` at the root and are published anyway, because their Vite build runs `scripts/transform-package-json.ts` to emit a `dist/package.json` with no `private` flag at all.

**The two reliable signals**, either of which settles it:

1. The package's `vite.config.ts` runs `scripts/transform-package-json.ts`. Internal packages have no such step.
2. The package appears in the publish targets in `.github/workflows/publish.yml` (`npm run build -w packages/doenetml -w packages/standalone -w packages/doenetml-iframe -w packages/v06-to-v07`, plus `@doenet/vscode-extension`), or has a publish workflow of its own (`publish-prefigure.yml`).

Check one of those before adding an unfamiliar package to a changeset — the enumeration above is a convenience, and new packages land as internal by default.

## Which packages to list

Propagation is **one-directional — forward to consumers that re-bundle or re-render the change, never back to dependencies of the changed package.** Include a package iff:

1. Its own source changed in this branch (and the package is published), OR
2. It bundles, re-exports, or embeds the changed source, and the change is something that package's users will notice. Example: a change in `packages/doenetml/src` is visible to `@doenet/standalone` (bundles `@doenet/doenetml`), `@doenet/doenetml-iframe` (bundles `@doenet/standalone`), and `@doenet/vscode-extension` / `doenet-vscode-extension` (embed the editor) — list those alongside `@doenet/doenetml`. Look at recent changesets in the same area for the conventional set.

### The doenetml → standalone → doenetml-iframe chain (always propagate)

`@doenet/standalone` incorporates all of `@doenet/doenetml`, and `@doenet/doenetml-iframe` users see `@doenet/standalone` as the product. So any change that lands in one of these flows forward down the chain — never list an upstream member without its downstream consumers:

- A changeset listing **`@doenet/doenetml`** must also list **`@doenet/standalone`** and **`@doenet/doenetml-iframe`**.
- A changeset listing **`@doenet/standalone`** must also list **`@doenet/doenetml-iframe`**.

This applies whether the change is to `packages/doenetml/src` directly or to something `@doenet/doenetml` bundles — if it surfaces in `@doenet/doenetml`, it surfaces in `@doenet/standalone` and `@doenet/doenetml-iframe` too.

Do **not** include a package just because the changed code imports from it. `@doenet/doenetml` depends on `@doenet/lsp-tools` and `@doenet/static-assets`, which makes them tempting to add to an editor changeset — but they're covered by the rule above: never listed.

Fixed-group members all version together regardless of whether they're listed, but listing controls which package's CHANGELOG the entry lands in — list a fixed-group member only when its users would care to read the entry. Editor/viewer changes typically skip `@doenet/v06-to-v07` for this reason, even though v06-to-v07 versions along with the group.

## Bump type

While the repo is < 1.0, default to `patch` for every package in every changeset — even for new API or larger-feeling changes. Revisit this convention once the first 1.0 release is on the horizon.

## File format

Each changeset is a Markdown file in `.changeset/` with YAML frontmatter listing the packages and bump types, followed by the body text that goes into the CHANGELOG:

```markdown
---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: <one-line summary of the user-visible change>.

<Optional longer prose: why, what changed, edge cases.>

Closes #1234.
```

Filename is conventionally a short kebab-case slug of the change (e.g. `context-help-array-index-aliases.md`).
