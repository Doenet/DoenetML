# Releasing

How DoenetML ships, how the two release lines relate, and how to open the next one.

Nothing in this repo creates a git tag or a GitHub Release. A person does, and that
is what starts a production release.

## The line model

At any time there is one **current line**, developed on `main`, and at most one
**maintenance line**, on a branch named after it.

| | current line | maintenance line |
|---|---|---|
| branch | `main` | `0.7` |
| takes | everything | patch-only backports |
| stable tag | `latest` | `0.7-stable` |
| prerelease tag | `dev`, on every green CI run | `0.7-dev`, on demand only |
| VS Code extension | published | **not** published |
| PyPI `doenetml-to-pretext` | published | published |
| `@doenet/prefigure` | published from here | never |
| docs site | built and deployed from here | not deployed |

Pre-1.0, a **minor** bump is the breaking-change marker: `0.7` → `0.8` is what
`1.0` → `2.0` will be later. Breaking changes accumulate on `main` and ship
together when a line opens, rather than each opening one of its own.

The older `0.6` line still exists as a branch and holds the `legacy` dist-tag. It
is not maintained.

## What triggers a release

| event | runs | publishes |
|---|---|---|
| push to `main`, CI green | `publish.yml` → `dev-release` | `X.Y.Z-dev.<run>` under `dev` |
| push to `main`, CI green | `publish.yml` → `dev-vscode-extension` | a Marketplace and Open VSX **pre-release**, versioned `X.Y.<run + 10000>` |
| GitHub Release on `main` | `publish.yml` → `production-release` | `X.Y.Z` under `latest`, plus the stable extension on both registries |
| GitHub Release on `0.7` | `publish.yml` → `production-release` | `0.7.Z` under `0.7-stable`; no extension |
| GitHub Release on either | `publish-doenetml-to-pretext-python.yml` | the PyPI wheel |
| `packages/prefigure/package.json` version changes on `main` | `publish-prefigure.yml` | `@doenet/prefigure` under `latest` |
| manual dispatch on `0.7` | `publish.yml` → `dev-release` | `0.7.Z-dev.<run>` under `0.7-dev` |

**Which branch's workflow file runs is not obvious, and it differs by event.**

- A **`release`** event runs the workflow file **from the tagged commit**. This is
  why the `0.7` branch can own its own `publish.yml` and have it be what executes
  for a `v0.7.x` tag. (Confirmed on real runs: a `release`-triggered run reports
  `head_branch` as the tag name and `head_sha` as the tagged commit.)
- A **`workflow_run`** event always runs the workflow file from the **default
  branch**, whatever branch the triggering run was on. This is why the maintenance
  line's dev channel is dispatch-only: a `workflow_run` copy on that branch could
  never be the thing that executes.

## npm dist-tags

`latest` and `dev` always belong to the **current** line. A maintenance line gets
qualified tags. When a new line opens, `latest`/`dev` move to it and the outgoing
line takes its own pair.

**npm refuses any dist-tag name that parses as a semver range.** `0.7`, `v0.7` and
`0.7.x` are all ranges (`semver.validRange("0.7")` is `>=0.7.0 <0.8.0`), so none of
them can ever be a dist-tag. That is why the maintenance tags carry a suffix:
`0.7-stable`, `0.7-dev`.

### How consumers should pin

Tell people to pin with a **semver range**, not a dist-tag:

```
https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7/doenet-standalone.js
```

npm and jsDelivr both resolve `@0.7` to the newest 0.7.x. It works for any line,
needs no dist-tag, and is what `doenetmlVersion="0.7"` generates in
`@doenet/doenetml-iframe`. The dist-tags exist for the release machinery — so a
publish can never fall through to `latest` — and to name prerelease channels,
which ranges cannot address.

Every floating form is its own CDN cache entry with a 12-hour TTL, so a release
must purge each one it wants fresh. `purge-jsdelivr.sh <dist-tag> [version]
[extra-spec…]` waits on the registry dist-tag and then purges the tag plus each
extra spec; `production-release` derives the line from the version it is
publishing and passes it. A **prerelease** version gets the dist-tag alone — no
semver range matches a prerelease, so no range URL tracks one.

## Cutting a stable release

1. Merge the open **"chore: version packages"** PR. That is what applies the
   accumulated changesets, bumps the six fixed-group manifests and writes the
   CHANGELOGs.
2. Create a **GitHub Release** tagged `vX.Y.Z` on that merge commit, targeting the
   right branch. Nothing automates this.
3. Watch `publish.yml` → `production-release`. It is gated on the `production`
   environment, so it waits for an approval; the step clock starts when the step
   starts, not when the job is queued, so a slow approval does not eat a timeout.

Guards that run before anything is published, and what they mean if they fail:

| guard | means |
|---|---|
| `verify-ci.mjs` | CI has not succeeded for that exact commit. It waits out a run still in progress, so a genuine failure here is a red or absent CI run. |
| `validate-tag-versions.mjs` | the tag does not match all **six** manifests (four npm packages plus both VS Code manifests) |
| "tag commit is on `<branch>`" | the tag was cut from somewhere that branch cannot reach |

## Backporting to the maintenance line

**Upstream-first, always.** Land the fix on `main`, then cherry-pick to `0.7`.
Never fix on the maintenance line and merge forward — that is how a bug gets fixed
in 0.7 and regresses in the current line. The only exception is a fix that
genuinely does not apply to `main`.

**What qualifies:** crashes, data loss or corruption, security issues, and
regressions that break live course content. Not features, not refactors, not
performance work.

**How:**

1. Label the `main` PR `backport-0.7`.
2. After it merges, `git cherry-pick -x <sha>` onto a branch off `0.7` and open a
   PR **into `0.7`**. `-x` records the source SHA, which makes "is this in 0.7?"
   answerable with `git log --grep`.
3. The cherry-pick brings the original `.changeset/*.md` with it. **Its bump type
   is the one part that stops being true on the way across** — a `minor` on `main`
   must become `patch` here. CI enforces this (`check-changeset-bumps.mjs`); a
   `minor` on the maintenance line would compute the next line's version and
   collide with `main`.
4. Merge, let the `changeset-release/0.7` version PR accumulate, and release when
   there is enough to warrant one.

## Opening a new line

When `main` accumulates breaking changes and you decide to ship them:

1. **Release the current line one last time** from `main`, the ordinary way.
2. **Cut the maintenance branch** from `main` at that point — not from the release
   tag, if `main` has moved on only in ways that do not ship (release plumbing,
   CI). Cutting from `main` lets the branch inherit those fixes instead of needing
   cherry-picks. Name it for the line (`0.8`), with **no slash**: `ci.yml`'s
   `pull_request: branches: ["*"]` glob does not match `/`, so **no pull request
   into a branch named `release/0.8` would run CI** and every backport would land
   unreviewed by it. Pushes to the branch would still be covered, since the
   `push:` list names it literally — which is exactly what makes the gap easy to
   miss.
3. **Protect the branch** like `main`.
4. **Apply the branch-local changes** (below) in a PR into the new branch.
5. **Land the `minor` on `main`.** Usually this rides along with the first breaking
   PR rather than being its own changeset.
6. **Retire the oldest line** — stop backporting, and say so.

### The version collision, which is easy to miss

Between cutting the branch and landing the `minor` on `main`, **both lines compute
the same next version**. If both publish it, the second gets npm's "cannot publish
over" refusal — which `npm-publish-with-retry.mjs` treats as already-published and
reports as **success**, then points its dist-tag at whichever tree landed first. A
maintenance-line tag would end up serving `main`'s code, with a green step.

So: **do not cut a release from `main` between the branch cut and the `minor`
landing.** The window closes for good once `main` is on the new line's numbers.

### What a maintenance branch changes

These live only on the maintenance branch. They are never merged back, and a
cherry-picked backport touches none of them, so the lines do not contend.

- **Each of the four npm line packages pins `--tag <line>-stable`** in its
  `publish` script, and a parallel `publish:dev` pins `<line>-dev`; the root
  `publish:dev` fans out to all four. This is the primary guard: a bare
  `npm publish` applies `latest`, so without it a backport could move `latest`
  from a laptop as easily as from CI.
- **`packages/prefigure`'s `publish` script is replaced by a refusal** that
  prints why and exits 1, rather than being pinned. The line never raises
  prefigure, so there is no maintenance-line version to tag — the script route
  is closed instead of redirected.
- `.changeset/config.json` → `"baseBranch": "<line>"`.
- `ci.yml` → `push: branches: ["<line>"]`, plus the patch-only changeset guard.
- `changesets-version-pr.yml` → pushes on that branch; its concurrency group must
  be keyed on `github.ref` or a push to one branch cancels the other's version PR.
- `publish.yml` → no `workflow_run` trigger, no VS Code extension jobs or steps,
  the branch's own name in the "tag commit is on" guard, and its own dist-tags.
  The dev build also drops the `VITE_PREFIGURE_MODULE_URL: …@latest` override,
  which would otherwise pull a current-line prefigure into an old-line bundle.
- `publish-doenetml-to-pretext-python.yml` → the branch's name in its guard.
- `publish-prefigure.yml` → **deleted**. Nothing on the line releases prefigure,
  and a dispatch of it here starts from the wrong footing: the job's condition
  begins `github.event_name == 'workflow_dispatch' ||`, which skips the
  `check-version-changed` job (and with it the comparison against `main`'s
  prefigure version) entirely, and its `npm_tag` input defaults to `latest`. Its
  "Verify target still matches main" step would still stop the run — on the
  dispatch path that step requires `HEAD` to be reachable from `origin/main`,
  which a maintenance-branch commit is not — so deleting the file removes a
  confusing button rather than the only thing standing in the way.
- `gh-pages-docs.yml` → manual only. The docs site is a single unversioned build
  from `main`.
- The branch also carries its own copies of `AGENTS.md`, this repo's changesets
  skill and `packages/vscode-extension/README.md`, each amended to say what is
  different here. Read those on the branch rather than `main`'s.
- The VS Code manifests stay in the changesets `fixed` group even though nothing
  publishes them, because `validate-tag-versions.mjs` requires all six to match
  the tag.

## Things that surprise people

- **`npm run publish -- --tag X` from the repo root does not put `--tag X` in the
  package script's argv.** `npm run` appends the arguments to the script's command
  line, and the root `publish` script *is* an `npm run` — so the inner npm consumes
  `--tag X` as configuration instead of passing it on, and it arrives as
  `npm_config_tag`. (Run directly in a package, where the script is not itself an
  npm command, the same flag does land in argv and `npm_config_tag` is unset.)
  `getExplicitPublishTag` in `npm-publish-with-retry.mjs` reads the environment
  only as a starting value and lets an explicit argv `--tag` override it — so a
  script that pins a tag wins over the flag you thought you passed through the
  root. Give each channel its own script instead. Relatedly, npm omits
  `npm_config_tag` entirely when the value equals its own default, so `--tag latest`
  is indistinguishable from passing nothing.
- **The VS Code Marketplace and Open VSX carry two independent streams**, stable
  and pre-release, each ascending on its own. The *stable* stream is why an old
  line cannot publish the extension after a newer line has: the version would be
  lower. Until the newer line's first stable release, though, an old-line version
  is still ascending and would be accepted.
- **npm will not imply `latest`** when a published version is higher than *or equal
  to* the one being sent (`semver.gte`, not `gt`), and refuses outright to publish
  over a version already on the registry. Both are useful backstops, but neither
  is a substitute for pinning the tag.
- **`@doenet/prefigure` versions independently** of everything else and is pinned
  by exact CDN URL in `packages/doenetml/src/Viewer/renderers/utils/prefigureConfig.ts`.
  A line that needs a newer one bumps the pin to a version already published from
  `main`; it never mints a prefigure release of its own.
- **The docs site is unversioned.** It is a single build from `main`, and its
  embedded examples render against the `dev` dist-tag. Once `main` is a new line,
  the published docs describe that line only, with no counterpart for the
  maintenance line.

## Where things are

| | |
|---|---|
| release workflow | `.github/workflows/publish.yml` |
| CI gate | `.github/scripts/verify-ci.mjs` |
| tag/version check | `.github/scripts/validate-tag-versions.mjs` |
| publish wrapper | `.github/scripts/npm-publish-with-retry.mjs` |
| CDN purge | `.github/scripts/purge-jsdelivr.sh`, `jsdelivr-purge-lib.sh` |
| changeset rules | [`.github/skills/changesets/SKILL.md`](../.github/skills/changesets/SKILL.md) |
