# Changesets

This repository uses Changesets to coordinate version and changelog updates.

## Scope

Changesets are used for version planning only. npm publishing is handled by
the root publish flow in [publish.yml](../.github/workflows/publish.yml).

The following packages are a fixed version group and are always versioned
together:

- `@doenet/doenetml`
- `@doenet/standalone`
- `@doenet/doenetml-iframe`
- `@doenet/v06-to-v07`
