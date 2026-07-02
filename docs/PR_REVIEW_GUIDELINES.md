Perform a thorough review of this PR. Look for ways in which the code can be made more concise, redundancy can be eliminated, and the codebase can be made easier to maintain. Look for simplifications of the code that could perform the same functions. Abstract repeated code to helper functions if that will increase readability. Prefer conventions established in AGENTS.md.

Review all the documentation and comments for consistency, clarity of intent, and accuracy. Add additional doc strings to functions or code blocks if they would help clarify the intent and make the code easier to maintain.

## Schema freshness

If the PR adds or modifies any component class (files under `packages/doenetml-worker-javascript/src/components/`) — including new state variables, attributes, or component types — regenerate the schema and commit the result:

```bash
npm run build:schema -w packages/static-assets
git add packages/static-assets/src/generated/
```

The CI job `schema-freshness` will fail if the committed schema files are out of date with the component source. Running `build:schema` locally and staging any changed files in `packages/static-assets/src/generated/` prevents that failure.

## Test coverage

Review whether the PR includes adequate tests:

- New behavior or bug fixes should have at least one Vitest unit test (in `*.test.ts`) **or** a Cypress e2e test (in `cypress/e2e/**/*.cy.js`), as appropriate for the change.
- If the PR modifies existing behavior, confirm that any existing tests covering that behavior have been updated to reflect the new expected behavior.
- Check that the tests actually exercise the scenario described in the PR — not just adjacent or unrelated scenarios.

## Documentation

Review whether the PR updates or adds documentation as needed:

- If the PR changes user-visible behavior (new features, changed defaults, renamed attributes, etc.), check whether the corresponding page(s) in `packages/docs-nextra/` need updating.
- If the PR adds a new component, ensure a reference page exists or is created under `packages/docs-nextra/src/pages/reference/`.
- If the PR changes how an existing component behaves (e.g. new attribute, changed default, fixed edge case), update the relevant reference or guide page.
- Documentation changes are not required for purely internal refactors or fixes with no user-visible effect.
