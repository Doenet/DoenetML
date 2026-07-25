# `@doenet/i18n`

Message catalogs and translation utilities shared by every DoenetML surface:
the viewer chrome, the web worker, and the language server.

This package is **never published**. Its `vite.config.ts` has no
`transform-package-json` step and it is absent from the publish targets in
`.github/workflows/publish.yml`, so its source rides out inside
`@doenet/doenetml` (and from there `@doenet/standalone` and
`@doenet/doenetml-iframe`). Never list it in a changeset — see
[`.github/skills/changesets/SKILL.md`](../../.github/skills/changesets/SKILL.md).

## The two locales

DoenetML separates the language of the *content* from the language of the
*chrome*, because they genuinely differ: a Spanish-speaking student may work a
French physics problem, and a French activity embedded in an English course
should still say "thick red line" in French.

| Setting          | Selects                                                 | Namespaces                |
| ---------------- | ------------------------------------------------------- | ------------------------- |
| `documentLocale` | Prose the core computes into the document               | `content`                 |
| `uiLocale`       | Everything addressed to whoever is looking at the screen | `chrome`, `diagnostics`, `editor` |

`<document lang>` wins over the `documentLocale` prop, which falls back to
`"en"`. `uiLocale` defaults to `documentLocale`, so a fully Spanish activity is
fully Spanish without the host configuring anything.

`resolveDocumentLocale` applies that rule and supplies `"en"` when nobody
declared anything; `declaredDocumentLocale` applies the same rule but returns
`undefined` in that case. The viewer uses the second for the `lang` attribute
on the rendered wrapper: an activity whose language nobody stated inherits the
embedding page's, rather than asserting English over a host that said
`<html lang="es">`. `resolveUiLocale` applies the chrome's rule — the
configured `uiLocale`, otherwise the content's language.

All three normalize what they return (`ES-mx` → `es-MX`) and treat a blank tag
as unset, so a hand-typed `lang` and a hand-configured prop negotiate the same
way a canonical tag does.

## Catalog layout

```
locales/<locale>/
  chrome.ftl        # viewer UI (buttons, feedback headers)  — uiLocale
  content.ftl       # worker-generated content               — documentLocale
  diagnostics.ftl   # warnings and errors                    — uiLocale
  editor.ftl        # editor and LSP surfaces                — uiLocale
```

The split is by **load context**, not topic: the worker never draws chrome, so
it ships only `content` + `diagnostics` (`WORKER_NAMESPACES`). English is
inlined into every build via `?raw` imports — the worker cannot reliably fetch
a relative URL across the standalone/iframe/dedicated-worker variants, so the
fallback locale must not depend on the network.

Spanish chrome is inlined the same way, so `uiLocale="es"` works with no host
configuration. That does not scale, and additional locales are still meant to
arrive as modules the host loads and passes in as `localeResources`, which
`createChromeTranslator` merges over the bundled ones (the host's copy wins for
a locale that exists in both). Revisit the inlining when the count reaches a
handful.

Note that the two namespaces the worker loads answer to *different* settings:
`content` to `documentLocale`, `diagnostics` to `uiLocale`. `LocaleData` carries
only the content locale today, so the phase that moves diagnostics into the
worker has to start sending both tags.

## Keys

Keys are Fluent identifiers — lower-kebab-case, optionally with a single
`.attribute` suffix:

```ftl
submit-button = Submit
color =
    .blue = blue
    .red = red
```

`t("submit-button")` and `t("color.blue")` both resolve. Fluent identifiers
cannot contain `.`, so a key with more than one dot can never name anything and
always falls through to its English fallback.

Namespaces share one bundle per context, so ids must be unique across the
catalogs a context loads. `lint:i18n` enforces that.

## Call sites

```ts
import { createTranslator, negotiateLocales } from "@doenet/i18n";

const t = createTranslator(negotiateLocales(["es-MX"], available), resources);
t("submit-button", undefined, "Submit");
```

Resolution order is the negotiated chain → the bundled English catalogs → the
`fallback` argument → the key itself. A missing key degrades; it never throws.

**The key must be a string literal**, and the translator must be named `t` or
`translate`. `lint:i18n` matches exactly that shape; a computed key
(`t(makeKey(x))`) is invisible to the lint and will silently miss at runtime.

### In the viewer

React chrome does not call `createTranslator` directly. `@doenet/doenetml`
mounts a provider (`src/utils/i18n.tsx`) over `createChromeTranslator`, and
renderers read it with `useT()`:

```tsx
const t = useT();
return <button>{t("slider-next", undefined, "Next")}</button>;
```

Always pass the English fallback. It is what renders if a catalog is somehow
missing the key, and it keeps the English visible next to the call site.

The provider is mounted twice on purpose. `doenetml.tsx` mounts one from the
props alone, covering chrome that sits outside the document — the virtual
keyboard today, the variant selector once its strings move. `DocViewer` nests a
second one inside it, because only there is an authored `<document lang>`
known, and the chrome follows the content's language by default.

A few strings — the "document contains errors" banner, the message shown while
the core boots, the error boundary's fallback — render outside both providers,
or from a class component that cannot call a hook at all, and so reach the
translator directly rather than through `useT()`. Bind it to a local `t` or
`translate` first (`const { translate } = this.props`); `lint:i18n` recognizes
no other name and no member expression, and a key it cannot see reads as an
orphan and fails the build.

The virtual keyboard tray is the exception: it renders into its own React root
shared by every viewer on the page, which context cannot cross, so it takes a
`translate` prop the same way it already takes `theme`.

## Commands

```bash
npm run test     -w @doenet/i18n     # vitest
npm run codegen  -w @doenet/i18n     # regenerate src/generated/messageKeys.ts
npm run lint:i18n -w @doenet/i18n    # CI catalog check (also `npm run lint:i18n` at the root)
```

`lint:i18n` fails on: a catalog that doesn't parse (including entries the Fluent
*runtime* would silently drop as junk), an id defined twice within a locale, a
translated locale defining a key English lacks, a stale `messageKeys.ts`, a call
site referencing a key that doesn't exist, and an English key no source file
references. Keys *missing* from a translation are reported as coverage, not
failure — a partial translation is legitimate and falls back.

Run `codegen` after editing any English catalog; the generated `MessageKey`
union is committed.

## Pseudo-localization

`pseudoLocalize(ftlSource)` generates the `en-XA` catalog:

```
greeting = Hello there   →   greeting = »Ĥéļļó ţĥéřé···«
```

Load it as a locale and look at the app. Anything that renders **unaccented**
is a string that never went through the catalogs — the class of bug no
key-based lint can see. Anything with a **missing `«`** is a layout that only
fits English. Message ids, term ids (`-brand`), placeables (`{ $count }`), and
select expressions are left untouched, so the output is a working catalog.

## Number formatting

Math-context numbers keep `.` as the decimal separator regardless of locale,
until the deferred math-notation phase decides otherwise; changing it would
alter answers, not just their presentation. Only prose counts localize, via
Fluent's `Intl.NumberFormat` integration — which is why `TranslationArgs`
accepts a real `number` rather than a pre-formatted string.

## Bidi isolation

`createTranslator` defaults `useIsolating` to **false**. Fluent otherwise wraps
every placeable in U+2068/U+2069, which is right for free-form UI text but makes
output non-byte-identical to the English it replaces and corrupts strings that
are later compared or hashed — and Doenet compares response text. Turn it on per
translator for a surface that genuinely mixes RTL and LTR runs.
