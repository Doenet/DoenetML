/**
 * Re-exports the `@doenet/doenetml-iframe` components from a standalone module.
 *
 * `doenet.tsx` loads this module via `next/dynamic` with `ssr: false`. Keeping the
 * `@doenet/doenetml-iframe` import in its own file means it is only pulled into the
 * lazily-loaded client chunk. A `next/dynamic` import of the package directly fails
 * webpack's `exports`-map resolution, so the dynamic import must target a local file.
 */
export { DoenetViewer, DoenetEditor } from "@doenet/doenetml-iframe";
