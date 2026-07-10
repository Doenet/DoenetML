# Standalone DoenetML Renderer

This workspace contains a standalone DoenetML renderer.

## Usage

Include

```html
<script type="module" src="doenet-standalone.js"></script>
```

in your webpage. Then you can call the globally-exported function `renderDoenetToContainer`, which expects
a `<div>` element containing a `<source type="text/doenetml"></source>` as a child.

For example

```html
<script type="module">
    renderDoenetToContainer(document.querySelector(".doenetml-applet"));
</script>

<div class="doenetml-applet">
    <script type="text/doenetml">
        <p>Use this to test DoenetML</p>
        <graph showNavigation="false">

          <line through="(-8,8) (9,6)" />
          <line through="(0,4)" slope="1/2" styleNumber="2" />

          <line equation="y=2x-8" styleNumber="3" />
          <line equation="x=-6" styleNumber="4" />

        </graph>
    </script>
</div>
```

To pass attributes to the DoenetML react component, you may write them in kebob-case prefixed with `data-doenet`.
For example,

```html
<div class="doenetml-applet">
    <script type="text/doenetml" data-doenet-read-only="true">
        <graph showNavigation="false">
          <line equation="x=-6" styleNumber="4" />
        </graph>
    </script>
</div>
```

## MathJax

The renderer uses MathJax to typeset math. It **coexists** with a MathJax that
the host page already provides:

- If the page already has a live MathJax engine, the renderer reuses it and
  never overwrites `window.MathJax`.
- If a MathJax `<script>` is already on the page (including a deferred one that
  has not executed yet), the renderer waits for it instead of loading a second
  copy.
- Only when the page provides no MathJax does the renderer load its own.

This avoids the double-loaded / clobbered MathJax that could otherwise break
embeds in pages that ship their own MathJax (e.g. PreTeXt books).

Two `data-doenet` attributes (or `renderDoenet{Viewer,Editor}ToContainer`
config keys / React props) control this:

| Attribute                             | Prop                 | Meaning                                                                                       |
| ------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------- |
| `data-doenet-mathjax-url`             | `mathjaxUrl`         | URL of the MathJax script to load when the page provides none.                               |
| `data-doenet-use-existing-mathjax`    | `useExistingMathjax` | Force reuse of a host MathJax even when it is not yet detectable (host loads it after Doenet). |

```html
<div class="doenetml-applet">
    <script
        type="text/doenetml"
        data-doenet-use-existing-mathjax="true"
    >
        <p>$x^2 + y^2$</p>
    </script>
</div>
```

Because a page shares a single MathJax, when several activities are embedded
only the first one to mount decides which MathJax is loaded.

**Supported versions:** Doenet renders with MathJax 4 and loads that version
when injecting its own copy. When reusing a host-provided engine, the host's
version governs typesetting; MathJax 3.x–4.x are supported for reuse (they
share the typesetting API Doenet relies on). MathJax 2 is not supported.

## Editor control handle

`renderDoenetEditorToContainer` (also exposed as a global) returns a small
control handle so the host page can drive the editor's diagnostics/responses
panel. Calls made before the editor finishes mounting are queued and replayed
on first commit.

```html
<script type="module">
    const handle = renderDoenetEditorToContainer(
        document.querySelector(".doenetml-editor"),
    );
    document
        .querySelector("#open-accessibility")
        .addEventListener("click", () =>
            handle.openDiagnosticsTab("accessibility"),
        );
    document
        .querySelector("#close-panel")
        .addEventListener("click", () => handle.closeDiagnosticsPanel());
    document
        .querySelector("#update-viewer")
        .addEventListener("click", () => handle.updateRenderedView());
</script>
```

Valid tab IDs: `"errors" | "warnings" | "info" | "accessibility" | "responses"`.

`handle.updateRenderedView()` programmatically presses the editor's "Update"
button: it flushes any pending edits to the viewer so the next
`diagnosticsSummaryCallback` reflects the current editor buffer. It's a
no-op when nothing has changed, and warns when there is no viewer
(`showViewer={false}`).

## Development

Run

```bash
npm run dev
```

to start a `vite` dev server that serves the test viewer and navigate to the indicated URL. By default
`index.html` is served. You can instead navigate to `index-inline-worker.html` to view the same page but
with the inlined version of the DoenetML web worker.
