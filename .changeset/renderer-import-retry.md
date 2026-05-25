---
"@doenet/doenetml": patch
---

Retry transient dynamic-import failures when loading viewer renderers, and fall back to an inline error placeholder if the import still fails after retries.

The viewer loads renderer modules via a per-renderer dynamic `import()` in `DocViewer` and `useDoenetRenderer`. Under Cypress component-test runs, Vite's dev server occasionally rejects one of these in-flight chunk fetches with `Failed to fetch dynamically imported module` — most often `section.tsx` or `math.tsx`, the renderers most specs load on demand. Because the existing call sites attached no handler to the per-renderer promise (the loader awaited them serially, so a later promise could reject before any handler was attached), the rejection bubbled to `window` and Cypress failed the spec under its default `uncaught:exception` policy. In production the same rejection on a real network blip would silently leave an empty space where the renderer should be.

The fix passes loader factories into `renderersLoadComponent` instead of pre-started promises, retries each load up to three times with exponential backoff on the transient error phrasings the browsers emit (`Failed to fetch dynamically imported module`, `Importing a module script failed`, `error loading dynamically imported module`), and — if a renderer ultimately fails to load — substitutes a small `RendererLoadFailed` placeholder so the surrounding document still mounts and no unhandled rejection escapes. See issue #1190.
