# DoenetML Docs

This site is built with [Nextra 4](https://nextra.site) on the Next.js App Router.

- `content/` holds the MDX pages and their `_meta.ts` sidebar/ordering files. The route
  for a page is its path under `content/`.
- `app/` holds the App Router shell: `layout.tsx` (the theme configuration that Nextra 3
  kept in `theme.config.tsx`) and `[[...mdxPath]]/page.tsx` (the catch-all route that
  renders a page out of `content/`).
- `mdx-components.tsx` supplies the components every MDX page renders with.
- `components/` holds the DoenetML-specific React components the MDX pages import by
  relative path (`../../components`).

### Dev Instructions

Make sure that `packages/doenetml` and `packages/standalone` have been built. Their assets are needed.
Changes to the docs-nextra files require their own build. New .mdx documents (e.g, in the 'content/reference' folder) require inclusion  in the _meta.ts file to support indexing.  Note: the file name in the .ts file must literally match the filename in the same folder. New components need to be listed in the 'componentTypes.mdx' file.

Then, if you update 'componentTypes.mdx', then be sure to update the static assets so to generate the indexing needed:

```
cd packages/static-assets
npm run build:schema
```

Then rebuild the documentation and test it:

```
cd packages/docs-nextra 
npm run build
npm run dev
```

This will then allow the current version of the documentation to be reviewed in the browser.

### Search

Search is [Pagefind](https://pagefind.app), which indexes the **built HTML**. The index is
produced by the `postbuild` script (`pagefind --site out --output-path out/_pagefind`),
which npm runs automatically after `npm run build`.

Because the index comes from built HTML rather than from the MDX source, everything the
schema-driven components render — component summaries, attribute and property names and
their descriptions — is searchable without any extra wiring.

`npm run dev` serves pages from memory and never writes `out/`, so the search box reports
"Failed to load search index." in dev. Run `npm run build` and serve `out/` to exercise
search.

### Schema history

`generated/schema-history.json` records which release each schema element, attribute and
property first appeared in — `since`, plus `removedIn` for things that went away. It is
derived by `scripts/generate-schema-history.ts`, which reads the committed
`doenet-schema.json` at every release tag and diffs the snapshots, and it runs as part of
`build:pre`.

It is generated rather than committed, deliberately. The index is a pure function of the
release tags, so a stored copy could only ever be *stale* — after a release, until someone
remembered to regenerate it — and never more correct. Deriving it at build time means
there is no freshness check to run and no step in the release flow to forget.

Two consequences:

- **The build needs the release tags.** A shallow or tagless clone cannot derive the
  index, and the generator throws rather than emitting an empty one — an empty index would
  silently mark all 19,000-odd schema keys as unreleased. CI asks for the tags with
  `fetch-depth: 0` and `filter: blob:none`; locally, `git fetch --tags` is enough.
- **There is no diff to read after a release.** `npm run report:schema-changes` replaces
  it, and reports any release rather than only the most recent:

  ```
  npm run report:schema-changes -w packages/docs-nextra            # newest release
  npm run report:schema-changes -w packages/docs-nextra -- 0.7.21  # a specific one
  npm run report:schema-changes -w packages/docs-nextra -- --all   # every release
  ```

Read it through `scripts/schema-history-keys.ts`, which holds the key space
(`el:<element>`, `at:<element>.<attr>`, `pr:<element>.<prop>`,
`va:<element>.<attr>.<value>`), the helpers that build
those keys and the index's type — and nothing else, so a client component can import it.
`schema-history.ts` next to it reads git, so importing *that* one from a component fails
the build on `node:child_process`.

Two rules worth knowing before reading a value out of the index. `since` is the start of a
key's *latest contiguous run of presence*, not its first-ever appearance — keys get
removed and names get reused, so a rename reads as the old spelling gaining `removedIn`
and the new one gaining its own `since`. And the index covers *released* versions only, so
a key in the working-tree schema with no entry is by definition unreleased.

### Version badges

The reference pages mark schema items — components, attributes, properties, and the
individual values an enumerated attribute accepts — with the release they arrived in.
`scripts/schema-since.ts` turns the history index into the one value a page needs,
`scripts/compute-optimized-schema.ts` threads it through beside `groupName`/`highlighted`,
and `components/since-badge.tsx` renders it.

Most items carry no badge, which is the point — the schema's 19,697 keys marked would say
nothing to anyone. Two rules drop them:

- An item that arrived with the item enclosing it says nothing; that badge already covers
  it. `<chart>` arrived in 0.7.27 with 70 keys and reads as one new component, not as a
  badge on each of its 30 attributes and 39 properties as well — and the same rule one
  level down keeps a new enumerated attribute from repeating itself once per keyword in
  its value table.
- An element present in the oldest release the index covers says nothing either. The
  snapshots cannot tell "arrived in 0.7.0" from "arrived earlier", and there is no version
  below it for a reader to select.

Of the ~1,900 badges left, the default view shows only the ones reading **In development** —
in the working-tree schema, in no release. Those are the ones an author cannot act on yet,
and the docs site deploys from every push to `main`, so they are always present. Values
matter here out of proportion to their number: `type` on `<selectRandomNumbers>` is as old
as the schema and so carries no badge of its own, which would otherwise leave its table
listing `logNormal` as though an author could write it.

The rest read "Added in X", ship in the DOM, and are hidden by `app/style.css`. Each carries
its version in `data-since`, on both the badge and the item around it, which is what lets a
"my version" selector reveal and dim by CSS alone with no re-render. They also carry
`data-pagefind-filter="version:…"`, which Pagefind collects per page, so a *search* can be
narrowed to the pages carrying an item from a given release, or one still in development.
`data-pagefind-ignore` alongside keeps the badge's own words out of result excerpts while
still collecting the filter.

### zod is pinned to 4.3 in the root `overrides`

Nextra 4.6.1 validates its `<Layout>` props with `z.custom()` schemas that carry no
explicit `.optional()`. zod 4.4.0 changed what a *missing* key on such a schema does —
it used to parse as `undefined`, and now raises `Invalid input: expected nonoptional,
received undefined`. `<Layout>` destructures `children` out of its props before
validating the rest, so with zod >= 4.4 every page fails to render on that one field.
The root `package.json` therefore pins `"zod": "~4.3.6"` in `overrides`. Nothing else in
this repository depends on zod, so the pin is scoped in practice to Nextra. Remove it
once Nextra marks those schema fields optional.

Please commit all changes to the repository...
