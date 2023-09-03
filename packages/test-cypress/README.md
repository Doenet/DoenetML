# Test Cypress

This workspace contains a test-cypress viewer that imports from `@doenet/doenetml`. The `packages/doenetml` workspace
must be built before this test-cypress can be built.

## Running

Run

```bash
npm run preview
```

to start a server that the cypress tests will point to. Then, in another terminal, run a command such as

```bash
npm run test-cypress
npm run test-cypress-all
```

to run the cypress tests.
