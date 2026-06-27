# @doenet/docs-cypress

Cypress accessibility tests for the DoenetML documentation site.

Tests use [cypress-axe](https://github.com/component-driven/cypress-axe) to
run automated WCAG 2.x accessibility checks against live documentation pages
in both light and dark mode.

## Running the tests

The documentation site must be running before you start Cypress.  Start it
in a separate terminal:

```bash
npm run dev -w packages/docs-nextra
```

Then, from the repo root, run the tests headlessly:

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
