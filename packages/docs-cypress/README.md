# @doenet/docs-cypress

Cypress accessibility tests for the DoenetML documentation site.

Tests use [cypress-axe](https://github.com/component-driven/cypress-axe) to
run automated WCAG 2.x accessibility checks against live documentation pages
in both light and dark mode.

## Running the tests

Build the static docs export first:

```bash
export NODE_OPTIONS="--max_old_space_size=6114"
npm run build:docs-prereqs && npm run build:docs
```

Then serve the generated `packages/docs-nextra/out/` directory in a separate
terminal:

```bash
npx serve -l 3000 packages/docs-nextra/out/
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
