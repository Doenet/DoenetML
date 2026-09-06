Upstream provenance and attribution for @doenet/prefigure-rust

This package is licensed under the GNU Affero General Public License, version 3
or later (AGPL-3.0-or-later).

This package vendors, as a git submodule at `upstream/`, the Rust source of
the PreFigure project:

- Upstream repository: https://github.com/davidaustinm/prefigure
- Project website: https://prefigure.org
- Upstream license: GNU General Public License, version 3 or later
  (GPL-3.0-or-later)

The wasm build consumed here comes from the upstream `packages/prefig-wasm`
crate (built with the `ratex` Cargo feature, selecting the pure-Rust RaTeX
math-rendering backend), which itself depends on the upstream
`packages/prefig-rust/prefig-core` crate.

GPL-3.0-or-later is compatible with, and a subset of the restrictions
imposed by, AGPL-3.0-or-later, so distributing this vendored/derived work
under AGPL-3.0-or-later (matching the convention already used by
`packages/prefigure` for its own upstream-derived code) is compliant.

Package integration work in this package (the `src/index.ts` wrapper, the
`wasm-pack`/Vite build pipeline, and the submodule vendoring/pinning setup)
is original to this package and is also distributed under
AGPL-3.0-or-later.
