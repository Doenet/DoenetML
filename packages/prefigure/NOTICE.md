Upstream provenance and attribution for @doenet/prefigure

This package is licensed under the GNU Affero General Public License, version 3
or later (AGPL-3.0-or-later).

Portions of this package were adapted from the PreFigure project:

- Upstream repository: https://github.com/davidaustinm/prefigure
- Project website: https://prefigure.org

In particular, the browser/Pyodide worker integration in this package was
adapted from the PreFigure playground implementation in the upstream repository,
including code derived from files under:

- website/packages/playground/src/worker/compiler.ts
- website/packages/playground/src/worker/index.ts
- website/packages/playground/src/worker/compat-api.ts
- website/packages/playground/src/worker/liblouis/easy-api.ts
- website/packages/playground/src/worker/liblouis/index.ts

Those upstream-derived portions remain subject to the PreFigure project's AGPL
licensing terms, along with any modifications made in this package.

Package integration work in this package includes standalone packaging,
CDN/browser distribution, build integration, publication workflow, wheel-sync
checks, and runtime initialization flow.