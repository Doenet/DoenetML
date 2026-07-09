---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: coexist with a MathJax that the host page already provides.

`DoenetViewer` / `DoenetEditor` previously wrapped content in
`better-react-mathjax`'s `MathJaxContext`, which unconditionally assigned
`window.MathJax = config` and appended its own MathJax `<script>` — with no
check for a MathJax the host page had already loaded. When a Doenet activity was
embedded in a page that loads its own MathJax (e.g. PreTeXt books), this clobbered
the host's live engine with a plain config object and/or raced a second engine,
causing intermittent, load-order-dependent failures to render.

Doenet now loads MathJax through a coexisting loader: if a live MathJax engine
is already present it is reused and `window.MathJax` is never overwritten; if a
MathJax `<script>` is already on the page (including a deferred one) Doenet waits
for it instead of injecting a second copy; only when no MathJax is present does
Doenet load its own. This also removes the duplicate engine (and its extra
worker) that was previously loaded per embedded activity.

Two new controls are exposed on `DoenetViewer` / `DoenetEditor` (and, for the
standalone build, as `data-doenet-mathjax-url` / `data-doenet-use-existing-mathjax`
attributes and `renderDoenet*ToContainer` config keys):

- `mathjaxUrl` — the MathJax script URL to load when the page provides none.
- `useExistingMathjax` — force reuse of a host-provided MathJax even when it is
  not yet detectable (e.g. the host loads it after Doenet mounts).

Reusing a host engine means the host's MathJax version governs typesetting;
MathJax 3.x–4.x are supported for reuse.

Closes #1433.
