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
declared anything. One tag, two consumers: the core translates into it, and the
viewer puts it in the `lang` attribute on the rendered wrapper, so the DOM never
claims a language the content was not rendered in. An undeclared activity is
labeled `en` — not a guess about what its author wrote, but a report of the
language the core computed its prose in.

That wrapper settles one language for the activity as a whole; a nested
`<document lang>` labels its own subtree on top of it. `<document>`'s
`renderedLang` state variable hands the section renderer a tag only when the
nested document's language differs from the one already in effect around it,
and the renderer emits `lang` only when it is given one. A nested document that
merely restates the surrounding language stays silent, because the DOM already
says it.

`resolveUiLocale` applies the chrome's rule — the configured `uiLocale`,
otherwise the content's language. Both normalize what they return (`ES-mx` →
`es-MX`) and treat a blank tag as unset, so a hand-typed `lang` and a
hand-configured prop negotiate the same way a canonical tag does.

A tag they cannot parse is left alone rather than rejected — `en_US`, the POSIX
spelling, is the usual way a host mis-keys a catalog, and rewriting it would
stop that catalog from being found. So such a tag keys and negotiates like any
other; what it must not do is reach `Intl`, which refuses it outright.
`createTranslator` therefore builds the bundle's formatter under English
whenever the tag is one `Intl` can't parse — otherwise Fluent's
`Intl.PluralRules` throws and the whole message resolves to `{???}` — and
`createDiagnosticFormatter` joins its lists the same way. The host's own words
are kept; only the counting and number conventions fall back.

## Catalog layout

```
locales/<locale>/
  chrome.ftl        # viewer UI (buttons, feedback headers)  — uiLocale
  content.ftl       # worker-generated content               — documentLocale
  diagnostics.ftl   # warnings and errors                    — uiLocale
  editor.ftl        # editor and LSP surfaces                — uiLocale
```

English is the source of truth. Every translation — `am`, `ar`, `as`, `bn`,
`de`, `es`, `fa`, `fr`, `he`, `hi`, `hnj`, `id`, `it`, `ja`, `ko`, `mr`, `my`,
`ne`, `nl`, `pl`, `ps`, `pt`, `ru`, `sd`, `so`, `tr`, `ug`, `ur`, `vi`,
`zh-Hans`, `zh-Hant` — is an **unreviewed machine-generated seed**, which each
file's own header says at the top, and which is what #1521's translation
platform is for. None has been read by a speaker. Correcting one needs no
permission and no coordination: a wrong string is just wrong, and the English
is one key away.

Ten of them are deliberately partial, all in the same place: Somali, Hmong
Njua, Amharic, Assamese, Nepali, Burmese, Pashto, Sindhi, Uyghur and Vietnamese
leave `element-name` and `element-anion-name` out, so those 130 keys fall back
to English and `lint:i18n` reports the gap. The first nine have no settled
chemical nomenclature to seed from, and inventing one would be worse than the
English a student meets in their own textbook. Vietnamese has two, and the
current one is English — school chemistry has moved from the transliterated
names to the IUPAC forms — so the fallback is already what the curriculum uses.

That is a decision per language and not per script: Bangla supplies the names
its schools use, and Assamese, written in the same letters, does not. The same
line runs through the Arabic script — Arabic, Persian and Urdu supply them and
Pashto, Sindhi and Uyghur do not.

A directory is named for a **script** rather than a language only where two
scripts of one language are translated separately, which today is Chinese.
Name that pair `zh-Hans` and `zh-Hant`, never `zh`: filtering negotiation tries
the region-stripped tag before it consults likely-subtags, so a directory named
`zh` answers `zh-TW`, `zh-HK` and `zh-MO` ahead of `zh-Hant` and serves a
Traditional reader Simplified text. Named by script, every tag reaches the
catalog it should, and bare `zh` reaches `zh-Hans` because that is what CLDR
fills it in as. `negotiate.test.ts` holds this.

Keep both complete rather than layering one over the other. A Traditional tag
negotiates to `["zh-Hant", "en"]`, so a key missing there renders in English —
the right outcome, since the wrong script is not a partial translation but a
different one. It is not symmetric: `zh-CN` and `zh-SG` negotiate to
`["zh-Hans", "zh-Hant", "en"]`, since filtering offers every `zh-*` catalog it
has, so a gap in `zh-Hans` can be filled from `zh-Hant` on a page holding both.

A catalog's **comments are in English** whatever it translates into: its
header, its `##` group headings, and the notes explaining a wording choice.
They are addressed to whoever maintains the file, and no one maintaining it
reads them all — a note that cannot be read cannot be checked. Only the text to
the right of `=` is translated.

The split is by **load context**, not topic: the worker never draws chrome and
never renders a diagnostic, so it ships only `content` (`WORKER_NAMESPACES`).
English is inlined into every build via `?raw` imports — the worker cannot
reliably fetch a relative URL across the standalone/iframe/dedicated-worker
variants, so the fallback locale must not depend on the network.

English is the only language inlined. `createChromeTranslator` builds its own
English candidate with `englishResources(namespaces)` and merges host-supplied
`localeResources` over it, the host's copy winning for a locale in both;
`createTranslatorFromLocaleData` builds none, translating out of what reached
the worker and nothing else. Neither has to carry English for the fallback:
`createTranslator` appends the whole English catalog behind every chain.

Every translation is **loaded on demand** — see [Delivery](#delivery). At
roughly 16 KB gzipped for a complete one, inlining a language puts its weight on
every consumer whether or not anyone reads it, and no single language earns
that. English is exempt because every fallback chain ends there: it has to be
present with no network, in every bundling variant.

Note that `content` and `diagnostics` answer to *different* settings —
`documentLocale` and `uiLocale` respectively — which is why `WORKER_NAMESPACES`
is `content` alone. The worker knows only the content locale, and needs only
that: it renders `content` itself, but for a diagnostic it emits a code and the
values that fill the message in and lets the main thread render it. The English
it writes onto each record on the way past comes from the built-in English,
which `createTranslator` appends whole regardless of namespace, so a translated
diagnostics catalog inside the worker would never be read. See
[Diagnostics](#diagnostics) below.

### The roster is not the bundle

Two different questions get asked about locales, and they must be answered from
two different places:

| Question                              | Source of truth                               |
| ------------------------------------- | --------------------------------------------- |
| Which languages does DoenetML have?   | `SUPPORTED_LOCALES` — the `locales/` dirs     |
| Which catalogs are in this JS bundle? | `BUNDLED_LOCALES` — English, and only English |

`SUPPORTED_LOCALES` (`src/generated/supportedLocales.ts`, regenerated by
`codegen` and guarded by `lint:i18n`) is the roster: every locale with a
catalog directory, each with its name in English and in itself, derived at
codegen time from `Intl.DisplayNames` so that adding a language costs no
hand-written prose. The second answer is a delivery decision, and the two lists
have long since diverged: English is the only catalog inlined, and every other
one is fetched or code-split when a document or a reader asks for it (see
[Delivery](#delivery)).

Author-facing surfaces read the **roster**. That is what lets the editor offer
the languages in `<document lang>`'s autocomplete and help panel (via the
attribute's `suggestedValues` in the worker's `Document.js`) and keep offering
them after a locale stops being inlined. Reading `BUNDLED_LOCALES` for that
would offer the author English and nothing else.

Neither list is exhaustive from an author's point of view: a deployment can
hand over catalogs of its own as `localeResources`, which no build-time list
can know about. So the roster *suggests* and never *enforces* — `lang` accepts
any BCP-47 tag, and an unlisted one draws no diagnostic.

## Delivery

A locale that is not inlined still has to reach the browser. `load.ts` does
that, and the viewer calls it for you: `useLocaleCatalogs` (in
`@doenet/doenetml`'s `utils/i18n.tsx`) loads the catalogs for whatever tags are
in play and merges them *under* the host's `localeResources`, so a deployment
correcting a shipped translation still wins. Adding `locales/pt/` and running
`npm run codegen` is therefore the whole job — no list of languages to register
anywhere, and `documentLocale="pt"` and `<document lang="pt">` both work with
nothing configured. (The codegen step is what puts `pt` in `SUPPORTED_LOCALES`,
which is the list `fetchLocaleLoaders` offers by default; `lint:i18n` fails if
it is skipped.)

```ts
// What the viewer does. Returns {} for English, for a locale the caller says
// it already has, and for one nothing offers a catalog for. A served catalog
// that 404s or cannot be reached is {} too; only a code-split chunk that
// fails to load rejects, and `useLocaleCatalogs` catches that and leaves the
// locale on English.
const resources = await loadLocaleResources("de-AT", CATALOG_NAMESPACES);
// → { de: "<all four namespaces, concatenated>" }
```

The tag is negotiated the usual way, so `de-AT` loads `de` and comes back keyed
`de` — the key the fallback chain looks for. Requests are cached by what was
asked for, so N viewers on a page share one fetch.

The viewer asks for all four namespaces because the one map it builds serves
both jobs: the chrome reads three of them and the core, handed the same map as
`LocaleData.resources`, reads `content`. The namespaces stay a parameter
because each costs a request (or a chunk) of its own, so a context that renders
a subset — `WORKER_NAMESPACES`, which is `content` alone — need not move four
catalogs to get one.

Where the catalogs come from depends on the build, and the difference is real
rather than cosmetic:

| Build                     | Mechanism                                              |
| ------------------------- | ------------------------------------------------------ |
| `@doenet/doenetml`        | `import.meta.glob` — one code-split chunk per catalog   |
| `@doenet/standalone`      | `fetch` from `locales/`, served beside the bundle       |
| `@doenet/doenetml-worker` | Neither: it is handed `LocaleData.resources`           |
| `@doenet/doenetml-iframe` | Neither: what renders inside its iframe is a standalone bundle, which loads its own |

The glob is what makes adding a language cost a directory. It is also why the
two single-file builds need a different answer: `inlineDynamicImports` folds
every dynamic import back into the one output file, so code-splitting cannot
keep catalogs out of them — and *being reachable is enough*, whether or not
anything calls it. Both therefore define `__DOENET_CODE_SPLIT_CATALOGS__`
false, which makes the glob dead code. The standalone build then copies
`locales/` into `dist/` (`copyLocaleCatalogsPlugin`) and installs
`fetchLocaleLoaders` against it in `src/index.tsx`; the worker needs no
replacement at all, because the main thread loads its catalog and passes it
across. `packages/standalone/scripts/check-bundle-size.mjs` fails the build if
a served catalog turns up inside an emitted script, and if any locale directory
did not reach `dist/locales/` — the copy is of the whole directory, English
included, so the second half stays meaningful whatever the inlining decision
turns out to be.

Two lists have to agree for any of this to hold, and `lint:i18n` checks that
they do: the locales excluded from the glob in `load.ts` are exactly
`BUNDLED_LOCALES`. A bundled locale left in the glob is imported both
statically and dynamically, never gets its own chunk, and makes Rollup warn on
every build; an unbundled one excluded from it can never be loaded at all.

A host with a translation of its own has two ways in: pass it as
`localeResources` (highest precedence, no loading involved), or serve it and
call `setLocaleLoaders(fetchLocaleLoaders(url, tags))`. The second replaces the
loaders for the whole page rather than adding to them — a standalone bundle
that calls it is no longer reading its own `locales/` — and `tags` is worth
passing whenever the language is not one DoenetML ships, since the default list
is `SUPPORTED_LOCALES`.

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

### In the worker

Prose the core computes — style descriptions today — is content, so it follows
`documentLocale` and is built where the core builds everything else. The
translator arrives as the value of the `translator` dependency, which is a
*factory* keyed by locale rather than a translator: the catalogs are fixed for
a core's lifetime but the locale is not, since a nested `<document lang>` can
differ from the one around it. A definition takes the `locale` of the document
it sits in — an ordinary ancestor dependency, alongside `theme` — and asks the
factory for the matching translator.

Those state variables stay **computed, never essential**, so a locale change
recomputes them and no English is written into saved state.

The wiring is packaged as `returnContentLocaleDependencies` /
`contentTranslator` in the worker's `utils/contentLocale.js`. Bind the
translator to `t` and pass a literal key, or `lint:i18n` cannot see the use:

```js
returnDependencies: () => ({
    value: { dependencyType: "stateVariable", variableName: "value" },
    ...returnContentLocaleDependencies(),
}),
definition({ dependencyValues }) {
    const t = contentTranslator(dependencyValues);
    return { setValue: { text: t("some-key") } };
},
```

An ancestor dependency skips the component it runs on, which is what lets a
nested `<document>` detect that it is nested — so `<document>` itself passes
`{ ownLocale: true }` to read the language it declares rather than the host's.

### Composition, not substitution

`@doenet/utils/style/styleDescriptions.ts` is the worked example of a phrase
that cannot be translated word for word. English writes adjectives before the
noun and inserts an article before "border"; Spanish writes them after and
agrees them with the noun's gender. So each description is assembled by a
message that receives the pieces as arguments plus a `$parts` argument naming
*which* pieces are present, and every adjective is handed `$gender`. An absent
piece selects a different branch rather than substituting an empty string —
that is what lets a translation reorder and re-punctuate each combination on
its own terms.

Gender is not the only thing an adjective has to agree with. Three sets of
words are rendered in two places each — a border's adjectives, the background
colour, and the text colour beside it — once standing alone as a state
variable reports them and once embedded in a clause, and a language that
inflects for case wants a different form in each. So every adjective is handed
`$role` as well, naming the *position* the phrase is going into rather than
the case it takes: which case a position governs is the catalog's business,
exactly as `$gender`'s token set already is. `locales/en/content.ftl` lists the
positions, and German, Russian, Polish, Hindi, Marathi, Urdu and Sindhi are the
catalogs that select on them. Sharing a script does not imply sharing the fork:
Marathi and Hindi both take an oblique adjective before a postposition and
Nepali, written in the same letters, takes none. The same line runs through the
Arabic script — Urdu and Sindhi fork, and Pashto, whose oblique coincides with
its direct in all four positions, does not.

Even the noun is not one string. A regular polygon is "5-sided regular polygon"
in English but "polígono regular … de 5 lados" in Spanish, wrapped around the
adjectives rather than sitting beside them, so `noun-regular-polygon` answers
in two halves (`$part`) and the composing message places each. A noun that
needs no complement leaves the second half empty. The rule generalizes: **a
phrase a language cannot keep contiguous has to be split at the source** —
there is no reaching inside `{ $noun }` from the message that places it, so
split the phrase, not the message that uses it.

Two further Fluent constraints shaped it, and both are easy to rediscover the
hard way:

- **A word that inflects has to be passed in, not referenced.** A *term*
  reference cannot carry a runtime value — `{ -filled(gender: $gender) }` does
  not parse (`E0014 Expected literal`), and `{ -filled }` gets an empty scope
  and always picks its default variant. A *message* reference does inherit the
  caller's arguments, but references never cross a bundle boundary: a locale
  that translates `style-filled` and not `style-filled-word` would render the
  literal `{style-filled-word}` rather than falling back to English. So the
  inflecting word is a message the code looks up and hands over as an
  argument, which is why `style-filled-word` is a key of its own.
- **A multiline pattern keeps its newlines.** Continuing a variant onto a
  further line puts a `\n` in the rendered string — including when that line
  opens a nested select. Keep each variant's content on one line; a select
  nested *within* that line is fine, and is how a message would sub-divide one
  of its variants. The same rule catches a subtler mistake: a `#` line indented
  *under* a message is not a comment, it is more of the pattern above it, so a
  note explaining a wording choice has to sit above the message rather than
  beside the attribute it explains. `lint:i18n` fails on any pattern that
  renders a line break, which is what makes both of these findable before a
  reader meets them.

## Diagnostics

Warnings, errors, info notices and accessibility alerts take a different route
from every other string, because they are produced in one place and read in
another. The worker knows what went wrong; it does not know what language the
person looking at the screen reads, and it shouldn't — a diagnostic follows
`uiLocale`, which a nested `<document lang>` has no say over.

So a diagnostic is not translated where it is raised. It carries a **stable
code** naming the situation, the **arguments** that fill its message in, and
the **English**, and the main thread renders it:

```js
// before
sendDiagnostics.push({
    type: "warning",
    message: "numDimensions mismatch in ray.",
});

// after
sendDiagnostics.push(
    codedDiagnostic({ type: "warning", code: "doenet-w0006" }),
);
```

`codedDiagnostic` lives in `@doenet/utils`, beside the `DiagnosticRecord` it
builds, because the worker is no longer the only place that raises one — the
style-contrast checks in that package do too, and a record assembled two
different ways in two packages is a record whose shape can drift.
`@doenet/doenetml-worker-javascript/src/utils/diagnostics.ts` re-exports it, so
the worker's call sites import it from where they always did. It fills
`message` in from the English catalog, so the English and the catalog cannot
drift and everything that reads `message` inside the worker — the dedupe in
`DiagnosticsManager`, the tests that assert exact strings — sees what it saw
before. `DocViewer` then re-renders `message` through
`createDiagnosticFormatter` before handing the records on, so the editor's
panel, the LSP squiggles and a host's `setDiagnosticsCallback` all show one
consistent set, in the reader's language.

Both shapes are valid records. A record with no code renders its English and
nothing else, which is what lets the ~200 messages still holding a literal
string migrate a few at a time (#1518). `lint:i18n` reports the remaining count
on every run.

### Errors that are thrown, not built

Errors raised while the source is being turned into components don't build a
record at all — they `throw`, the caller catches, and the component becomes an
`_error` whose message `ComponentBuilder` re-raises as the diagnostic. The
record built at the `catch` is discarded on purpose (`DiagnosticsManager`
gathers errors from the dast pass instead), so the `_error` component is the
only thing carrying the diagnostic across, and a bare `Error` arrives with
nothing but an English sentence on it.

```js
// before
throw Error(`Cannot repeat attribute ${attrName}.`);

// after
throw new DiagnosticError({
    code: "doenet-e0003",
    args: { attribute: attrName },
});
```

`DiagnosticError` (in the worker's `utils/diagnostics.ts`, alongside its
re-export of `codedDiagnostic`) is an `Error` subclass whose
`message` comes from the same English catalog, so it drops straight into a
`throw` site: `instanceof Error` still holds and a `catch` reading `e.message`
sees what it saw before. `errorComponentState` puts the code and arguments on
the `_error`'s `state` — every place that builds one of those components out
of something that could be carrying a code uses it — and the builder reads
them back off when it raises the diagnostic. The other places that build an
`_error` compose their own English string, so there is no code for them to
lose; they join this path when those messages migrate.

The sites in between — the two `catch` blocks that build a record from a
caught error, and the `ComponentBuilder` branch that raises one from an
`_error` component — hold no English of their own, so they have nothing to
migrate and no code to name; they spread `diagnosticCodeFrom` to pass along
whatever their source carried. `lint:i18n` counts those as migrated too, since
there is nothing further to do to them.

### Producers that cannot read the catalog

`@doenet/parser` and `@doenet/lsp-tools` raise author-facing diagnostics and
neither can render one. Both are bundled into the DoenetML language server,
which `@doenet/codemirror` embeds verbatim and starts as a blob worker, so
every byte sits on the editor's critical path before the first cursor-help
request can be answered — and the server has no locale to render in anyway.
Reaching the catalog from there pulls in `EN_CATALOG_SOURCE`, every English
namespace joined, plus the Fluent runtime to read it;
`packages/lsp/scripts/check-server-bundle.mjs` fails outright if either
arrives, rather than budgeting for it (see [Bundling](#bundling)).

So these two pass the English **alongside** the code instead of rendering it —
`codedDastError` in `packages/parser/src/coded-dast-error.ts`,
`codedLspDiagnostic` in `packages/lsp-tools/src/coded-lsp-diagnostic.ts`. The
message lives in two places, and each package holds the two together with a
test: `test/coded-dast-errors.test.ts` and `test/coded-schema-violations.test.ts`
run their producer over a corpus of broken DoenetML and assert every coded
diagnostic renders, through the catalog, to exactly the string the producer
wrote. A message edited on one side and not the other fails there, as does a
missing or misnamed argument — one the catalog reads and the producer doesn't
pass renders as `{$name}`, which no hand-written English will match.

`@doenet/i18n` is a **devDependency** in both: `import type` in `src/`, so
every code is still checked against the registry at compile time, and the real
package only in that test. Their `dependencies` stay free of it and the bundle
guard stays green.

The same boundary runs through `@doenet/codemirror`, which draws the tooltip
over a squiggle: it embeds that server and so carries no catalogs either. It
takes a `diagnosticPresentation` instead — a message formatter and a source of
severity headings, supplied by `EditorViewer` from the translator the
Diagnostics tab renders with. The language is the one the **viewer** resolved,
since only there is an authored `<document lang>` known, and the hover and the
tab are showing the same records.

### Codes

A code is a permanent name — what a bug report cites, what a host reading
`setDiagnosticsCallback` can filter on, and the anchor a documentation page
will hang off (#1548). It rides on the record, and on the LSP `code` field for
a positioned diagnostic — with the arguments alongside it in `data.args`, since
a code names a message *template* and it takes both to say which occurrence of
it this is. That pair is how the language server's `dedupeLspDiagnostics`
recognizes two renderings of one diagnostic without comparing their text.
Nothing renders the code itself yet, so the codes earn their keep as an
identifier rather than as UI.

`DIAGNOSTIC_CODES` in `src/diagnostics.ts` maps each to a message id, and
`diagnostic-codes.lock.json` records every code ever issued, so `lint:i18n`
fails if one is renumbered, reused, or dropped from the registry. Retire a code
in place; never recycle it.

The lock is a committed file, not a service, so it enforces the contract only
against the registry — deleting a code's line from *both* files in one change
passes the lint, exactly as deleting a `package-lock.json` entry does. That is
what makes the lock worth reviewing: a diff that removes or edits an existing
line, rather than only adding one at the end, is the thing to refuse.

The letter is part of the name (`w` warning, `e` error, `i` info, `a`
accessibility), recording what the diagnostic was born as. It is not a live
severity — the emitting call site chooses the record's `type`.

Two branches that each claim the next number collide in both the registry and
the lock, which is the intended outcome: neither file can be auto-merged, so
the conflict is resolved by hand. Give the later branch the next free number in
*both* files — the lock is sorted by code, so its entry moves with it, and the
lint passes once the two agree again. Never resolve it by editing a code that
is already on `main`.

The registry is also what makes these messages visible to the lint. They are
reached by code rather than by a literal `t("key")`, which the call-site scan
cannot see, so `lint:i18n` reads the registry as a call site of its own. A
message with no code registered for it fails as an orphan.

The reverse direction is checked too: a registered code that nothing raises
fails. That is the shape a consolidation leaves behind — the last site using a
number moves to another one and the registry entry stays, naming a situation
nothing can produce. When a code genuinely stops being raised, list it in
`RETIRED_DIAGNOSTIC_CODES` beside the registry; it keeps its entry, so the lock
still agrees, and retiring becomes a line in a diff rather than a silent
consequence of deleting the last call site. Putting a code back to work means
dropping it from that list, which the lint also insists on.

Three things `lint:i18n` counts by scanning source text, wherever they appear
and **comments included**: a `type` property naming a severity, a
`codedDiagnostic(` call, and a `code` property naming a diagnostic code. The
first two are the two halves of the migration burn-down — every construction,
and the ones taking their message from the catalog. The third is separate: it
is what proves every registered code is raised somewhere.

So an example written in a doc comment is read as real, and which way it lands
depends on what the example contains: a lone `type: "warning"` adds to the work
remaining, a lone `codedDiagnostic(` subtracts from it, and a `code:` makes a
code nothing raises look raised. The same trap as writing a `t("key")` call in
a comment.

### Lists and agreement

Fluent has no list type, and a list is exactly where hand-written English
grammar hides — the serial comma, the "and", the verb that has to agree with
how many things there are. So a list argument stays a list all the way to
format time:

```js
codedDiagnostic({
    type: "info",
    code: "doenet-i0001",
    args: { attributes: ["slope", "length"] },
});
```

`Intl.ListFormat` joins it in the reader's language, and the message also
receives `attributesCount`, so the catalog can select on it:

```ftl
line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } is ignored when two endpoints are specified
       *[other] { $attributes } are ignored when two endpoints are specified
    }
```

A count the catalog derives itself can never disagree with the list beside it.
Pass `{ list, type: "unit" }` instead of a bare array for a bare enumeration
("x, y, z") rather than a conjunction ("x, y, and z") — English distinguishes
them and other languages distinguish them differently.

## Bundling

`package.json` declares `"sideEffects": false`, and that is load-bearing rather
than tidiness. The English catalogs are `?raw` imports assembled by a
module-level call in `catalogs.ts`; without the declaration a bundler has to
assume that call might do something observable, so it keeps it — and keeping it
keeps all four FTL files — in **any** bundle that reaches this package for any
reason, even one where every function has already been tree-shaken away.

That is not hypothetical — it was measured. When `@doenet/utils` took its
runtime dependency on this package (#1557), the DoenetML language server grew
by 20 KB gzipped of catalog text without gaining a single line of code that
reads it: it imports `@doenet/utils/style` for something unrelated, and the
strings came along. The declaration is what kept that off `main`, and
`packages/lsp/scripts/check-server-bundle.mjs` fails the build if it comes
back.

Nothing here registers globals, patches prototypes, or imports for effect, so
the claim is true today. Anything added that breaks it has to remove the
declaration and pay the cost everywhere.

## Commands

```bash
npm run test     -w @doenet/i18n     # vitest
npm run codegen  -w @doenet/i18n     # regenerate src/generated/{messageKeys,supportedLocales}.ts
npm run lint:i18n -w @doenet/i18n    # CI catalog check (also `npm run lint:i18n` at the root)
```

`lint:i18n` fails on: a catalog that doesn't parse (including entries the Fluent
*runtime* would silently drop as junk), an id defined twice within a locale, a
catalog naming a `numberingSystem` on a Fluent builtin, a message whose value
would render a line break, a translated locale
defining a key English lacks, a stale `messageKeys.ts`, `supportedLocales.ts`,
or `diagnostic-codes.lock.json`, a lazy-catalog glob that no longer excludes
exactly the inlined locales, a call site referencing a key that doesn't exist,
an English key no source file references, a malformed diagnostic code, a code
naming a message English lacks, a code used in source that the registry doesn't
define, a registered code that nothing raises and that is not listed as
retired, and any change to a code already issued. Keys *missing* from a
translation are reported as coverage, not failure — a partial translation is
legitimate and falls back.

Run `codegen` after editing any English catalog, adding a diagnostic code, or
adding a locale directory; the generated `MessageKey` union, the locale roster
and the code lock are all committed.

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
alter answers, not just their presentation. `MATH_NOTATION_LOCALE` in
`src/intl.ts` is where that policy is written down, so a number formatted in
English is a decision with a name rather than an omission.

Prose numbers do localize. Inside a message, that happens for free: Fluent
formats a placeable with `Intl.NumberFormat`, which is why `TranslationArgs`
accepts a real `number` rather than a pre-formatted string. Outside one —
`<intComma>`, whose whole output is a number and which has no sentence around
it — use `formatDecimalString`, which re-punctuates an already-rendered decimal
under the locale's grouping and separator without adding, removing, or rounding
a digit.

### Digits are Latin, separators are not

What localizes is the **punctuation**, never the ten characters. German still
groups with periods, India still groups in twos, and a number still comes back
in `0`–`9` — even under a locale CLDR counts in another script, which today
includes Bangla, Assamese, Marathi, Nepali, Burmese, Persian, Pashto, Sindhi
and Arabic as written in Egypt.

`intlLocale` pins the numbering system, so this holds for every formatter this
package builds and for every one added later: a locale reaches an `Intl`
formatter through that function or it reaches none at all. It applies to
Fluent's `NUMBER()`, to a bare `{ $count }` — which Fluent wraps and formats
identically — to `DATETIME()`, and to `formatDecimalString`. A tag that names a
numbering system itself (`zh-u-nu-hanidec`) is overridden; the policy is one
answer per product, not per tag. `lint:i18n` rejects a catalog that passes
`numberingSystem` to a builtin, which is the only other way back out.

Two reasons, and the second decides it. A number in prose sits beside numbers
that are not prose: a contrast ratio is written `{ ratio }:1` with the `1` a
literal in the catalog, a line number is read off a gutter the editor draws
itself, an author's `styleNumber="3"` is quoted back at them. And mathematics
is Latin-digit regardless — `MATH_NOTATION_LOCALE`, which #1528 keeps that way
while it makes the *separator* configurable. A document whose prose counted in
one script and whose equations counted in another would be worse than either
alone.

For the Arabic script the two halves are not independent: Persian pairs `٬` and
`٫` with its own digits and `,` and `.` with these, so pinning the digits takes
the Latin-digit separators with it. Everywhere else the separator is untouched.

The other half of the rule is on the argument, not the formatter: a value that
is an **identifier** rather than a quantity — a line number, a `styleNumber`, a
`componentIdx`, a section number built out of counters — is passed as a
`string`, so that nothing groups it either. `TranslationArgs` is where that is
written down.

## Direction

`directionOf(tag)` in `src/direction.ts` is the whole rule. It answers for
**any** BCP-47 tag, not only the ones with a catalog: `lang` accepts whatever an
author types, and `<document lang="ar">` has to lay out right-to-left whether or
not `locales/ar/` exists. That is why direction is computed rather than recorded
beside the catalogs — a generated field could only cover the roster, which is
[not the bundle](#the-roster-is-not-the-bundle) and not exhaustive either.

It keys on **script**, because that is what decides: Punjabi is left-to-right in
Gurmukhi and right-to-left in Arabic, Kurdish likewise in Latin and Arabic. A
bare `ar` or `he` resolves through `Intl.Locale`'s `maximize()`. Deliberately
not `Intl.Locale.prototype.getTextInfo()`, which is too new to rely on and
throws on exactly the tags `normalizeLocaleTag` is written to pass through
untouched.

Two roots carry `dir`, for the same reason there are two locales. `DocViewer`
puts the **content's** direction on `.doenet-viewer` beside its `lang`;
`doenetml.tsx` puts the **reader's** on the wrapper around the chrome that sits
outside it. A nested `<document lang>` needs no state variable of its own —
`renderedLang` is set exactly when the language changes, so where it is absent
the direction cannot have changed either.

Chrome drawn *inside* the document is the reader's language in a box declared to
be the content's. `useChromeLangDir()` re-declares it — on the in-document error
box, the feedback heading, the click-to-toggle text on a hint, a solution and a
collapsible section, a pretzel's answer label, the summary-statistics caption,
and the math-input preview's parse-error message — and returns `{}` when the two
directions already agree, so the common case adds no attributes at all. It is
not for anything reading `useContentT`: the check-work widget follows the
document's language by design, so it follows its direction too. Nor for
tooltips, for the opposite reason: Ariakit portals them to `document.body`, so
they are never inside the document's box, and a native `title` attribute is
drawn by the browser rather than by CSS. `DocViewer`'s error banner is built
above the provider the hook reads, so it calls the same rule as the plain
function `chromeLangDir(uiLocale, documentDirection)`.

"The document" there means the *nearest* one, not the activity: a nested
`<document lang>` turns its own subtree around, so `section.tsx` re-mounts
`DocumentDirectionProvider` around whatever it just declared. Otherwise chrome
inside `<document lang="ar">` would compare itself against a left-to-right
activity, find no disagreement, and stay silent in a box running the other way.

### Notation is a left-to-right island

Mathematics reads left-to-right in Arabic and Hebrew as well, so a graph must
not mirror while the prose around it does. The pins are `dir="ltr"` on the
JSXGraph board and the prefigure SVG (both write `text-anchor: start|end`, which
resolves against the computed direction), the MathQuill wrapper (no `direction`
declaration anywhere, inline siblings in source order, physical kerns), the
matrix input (a `<table>` reverses its columns), the slider (a native range
input reverses its track), the number line, the orbital diagram, the math
input's preview (the popover does not portal, and the div that scrolls a long
expression must not become an RTL scroll container, whose `scrollLeft` runs
from the negatives up to zero), and CodeMirror (it renders XML source). The
spreadsheet is the one exception to the attribute: Handsontable reads the
inherited direction through its own `layoutDirection` option, so it is told
rather than styled. MathJax needs nothing: its CHTML output already pins
`direction: ltr` on `mjx-math` — but only on the mathematics itself, which is
why the preview's scroll container still needs its own pin.

A pin on a *block* needs a width with it: an element as wide as its container
aligns its left-to-right contents to the container's left edge, stranding the
widget at the far side of the page from the prose it belongs to.
`ltrIslandProps()` in
`packages/doenetml/src/Viewer/renderers/utils/direction.ts` carries the pair, so
the sizing half cannot be left off by accident. It shrink-wraps by default and
takes a width for a widget the author can size — the slider passes its own,
because a percentage inside a shrink-wrapped box would measure against the box
instead of the column. An inline island, or one whose element already
shrink-wraps, takes a bare `dir="ltr"`.

The keyboard's keys are pinned in `keyboard.css` rather than by attribute,
because `Keyboard` returns a different element per style. The tray *around*
them follows the reader.

Everything else mirrors: the paginator, prose renderers, the feedback and hint
headers, the graph-controls panel, the editor chrome.

### Writing a right-to-left catalog

Seven ship: `ar`, `fa`, `he`, `ur`, `ps`, `sd` and `ug`. Nothing about the file
format changes for any of them. A `.ftl` pattern is a sequence of characters in
**logical** order — the order the text is spoken — and `dir` decides where each
run is drawn, so a translation is written the way it is read and never reordered
by hand to look right in an editor. Brackets, quotes and dashes are the same
characters in every one of these scripts and are written opening-first; the bidi
algorithm turns them around at render time. Digits stay Latin, as
[everywhere else](#digits-are-latin-separators-are-not), which is why an Arabic
sentence and the mathematics beside it count in the same characters.

**Direction is not a language family.** These seven share a writing direction
and almost nothing else, and the catalogs differ from each other far more than
they differ from `de` or `es`:

| | Adjectives | Gender | Plural categories |
| --- | --- | --- | --- |
| `ar` | follow the noun | m/f | six |
| `he` | follow the noun | m/f | three |
| `fa` | follow the noun | none | two |
| `ur`, `ps`, `sd` | precede the noun | m/f | two |
| `ug` | precede the noun | none | two |

`ur` is the outlier worth knowing about: its grammar is `hi`'s, so
`locales/hi` is the closest thing to a parallel text for it and a correction to
one is usually a correction to both. `ug` is Turkic and agrees with nothing.

Three things recur across them, none a property of the direction:

- **Plural categories.** Fluent selects through `Intl.PluralRules`, so an
  Arabic `{ $count -> … }` has `zero`, `one`, `two`, `few`, `many` and `other`
  where English has two branches, and Hebrew has `one`, `two` and `other`. Only
  Arabic has a `zero` category; everywhere else `other` covers none, so a
  message wanting a separate wording for it says `[0]` by number, as the
  English does — Fluent matches an explicit number before consulting the rules.
- **An affix cannot be welded to a placeable.** Arabic attaches «لـ» and «بـ»
  to the word after them and Uyghur attaches its case endings to the word
  before, and in each case there is no word — there is an argument. So a
  message that reads "for `<{ $component }>`" in English names what the
  argument is instead, «للمكوّن { $component }», or reaches for a postposition,
  which is a word of its own and can stand beside one. A select whose variants
  would land against such an affix carries it into each variant: Fluent does
  not care where a select sits inside a pattern, and this is why several
  messages are restructured rather than translated in place.
- **A distinction the source language makes may not exist.** Where English
  separates a singular from a plural only in the verb — "is ignored" against
  "are ignored" — most of these cover both with one form, and the select is
  dropped rather than written out twice identically. The count argument then
  goes unused, which is harmless: it stays in the English message for the
  languages that need it.

### Testing it without a catalog

`en-XB` renders visually identical text to `en-XA` and differs only in
`directionOf` reporting it `rtl`, plus an invisible right-to-left mark against
the outer face of each bracket so that a value's trailing punctuation resolves
the way it would in a real RTL sentence. A difference between the two runs is a
difference in layout and nothing else, and every right-to-left assertion is
runnable before any right-to-left language is translated. It stays useful now
that one is: a layout regression under `en-XB` is legible to a reviewer who
reads no Arabic, so what a screenshot shows is the layout rather than the
words. It is deliberately not a text transform: Android's U+202E override
demonstrates bidi rather than testing a layout, and look-alike glyphs would
cost the accented text its readability and break the hard-coded-English sweep.

## Bidi isolation

An interpolated value that runs the other way from the sentence around it
scrambles that sentence. Unicode's isolates prevent that, and Fluent adds them
per bundle — so `useIsolating` is decided per translator, and the two
translators want opposite answers:

- **`createChromeTranslator` turns it on**, for every language but English.
  What it renders is looked at and discarded.
- **`createTranslatorFromLocaleData` leaves it off.** What the worker renders
  becomes state variables an author interpolates, an `<award>` compares against
  a response, and `answer.js` folds into a SHA-1 of the dependency graph. The
  line is drawn at what is compared, not at what looks like prose.

Isolation is uniform across a fallback chain rather than per catalog: a key the
reader's language has not translated resolves from English and is isolated all
the same, because the chrome around it is still the reader's.

**English is excluded, and the reason is not principled.** Isolation protects a
sentence whose placeable runs the other way, which has nothing to do with
whether the sentence is English — an English UI naming an Arabic answer still
gets none. It is excluded because the assertion corpus compares English chrome
as plain text, and every phase has held English byte-identical to what it
replaced. Turning it on for English later is a mechanical change plus a sweep
of exact-string assertions. Keyed on the primary subtag, so `en-GB` is English
and so are both pseudo-locales.

A test asserting on translated chrome has to strip the marks with
`stripBidiIsolates`. They render as nothing, so a failure diff otherwise shows
two strings that look identical.
