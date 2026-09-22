# @doenet/docs-cypress

Cypress tests for the DoenetML documentation site.

The accessibility tests use
[cypress-axe](https://github.com/component-driven/cypress-axe) to run automated
WCAG 2.x checks against live documentation pages in both light and dark mode.
The search tests query the site's [Pagefind](https://pagefind.app) index.

Both suites are meant to run against the *built* site. The search suite requires
it: Pagefind's index lives at `out/_pagefind`, which the docs package's
`postbuild` script generates, and `next dev` never writes `out/`.

## Running the tests

Build the static docs export first:

```bash
export NODE_OPTIONS="--max_old_space_size=6114"
npm run build:docs-prereqs && npm run build:docs
```

Then serve the generated `packages/docs-nextra/out/` directory in a separate
terminal:

```bash
npm exec serve -- --no-port-switching -l 3000 packages/docs-nextra/out/
```

From the repo root, run the tests headlessly:

```bash
npm run test:docs-cypress
```

Or open the Cypress UI for interactive development:

```bash
cd packages/docs-cypress
npx cypress open --config baseUrl=http://localhost:3000
```

## Test coverage

| File | What it tests |
|------|---------------|
| `cypress/e2e/accessibility/docsAccessibility.cy.js` | axe WCAG 2.x rules on key pages in light mode and dark mode; includes a regression test for issue #1368 (attribute pill contrast in dark mode) |
| `cypress/e2e/search/docsSearch.cy.js` | the Pagefind search box returns results, including for attribute text that only the schema-driven components render (issue #2001) |
