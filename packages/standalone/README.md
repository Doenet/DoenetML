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

## Coordinating many activities on one page

Pages embedding many activities as same-origin iframes (the PreTeXt model)
can add `coordinator.js` — published alongside this bundle — to lazy-load,
cap, park, and restore activities so memory tracks what the reader can see
instead of how many activities the page embeds, optionally serving all
activities from a shared core-worker pool. One script tag on the host page;
the activity pages need no changes. See
[COORDINATION.md](https://github.com/Doenet/DoenetML/blob/main/packages/standalone/COORDINATION.md).

## Host message protocol (SPLICE)

The viewer exchanges JSON messages with its host via `postMessage`.
Viewer → host messages go to the page's own `window`, or to `window.parent`
when the container has `data-doenet-message-parent="true"` (the pattern
iframe-per-activity pages use). Host → viewer requests are posted to the
window the viewer lives in. On a page with several viewers, every viewer
receives a broadcast request; correlate responses by
`activity_id`/`doc_id`/`message_id`.

(Consumers of the in-process React components from `@doenet/doenetml` can
pass callback props — e.g. `reportScoreAndStateCallback` — instead; the
corresponding message is only posted when the prop is absent.)

| Subject                                    | Direction     | Purpose                                  |
| ------------------------------------------ | ------------- | ---------------------------------------- |
| `SPLICE.reportScoreAndState`               | viewer → host | periodic score/state saves               |
| `SPLICE.getState` / `.response`            | viewer ⇄ host | load saved state at boot                 |
| `SPLICE.flushState` / `.response`          | host ⇄ viewer | on-demand state flush (lossless unmount) |
| `SPLICE.submitAllAnswers` / `.response`    | host ⇄ viewer | submit every answer in the document      |
| `SPLICE.requestSolutionView` / `.response` | viewer ⇄ host | permission gate for viewing solutions    |
| `SPLICE.sendEvent`                         | viewer → host | analytics/event stream                   |
| `lti.frameResize`                          | page → parent | content height for iframe sizing         |

### Listing the available style palettes

The bundle exposes its built-in style palettes so a page can render a
palette picker — with swatches — whose choices match the DoenetML version
it loaded:

```js
const palettes = window.getDoenetStylePalettes();
// [{ name: "default", description: "...", styles: { "1": {...}, ... } }, ...]
const grayscale = window.getDoenetStylePalette("grayscale");
```

Each style entry is a fully-resolved style definition: `lineColor`,
`markerColor`, `fillColor`, `textColor` and their `*DarkMode` variants for
swatches in either theme, plus `lineWidth`, `lineStyle`, `markerStyle`, and
`markerSize`, and the `*Word` fields (e.g. `"blue"`) for accessible swatch
labels. Every palette has at least four styles, keyed contiguously from
`"1"`. Pass a chosen palette name back in as the `palette` field of the
viewer's `styleOverrides` config to render the document with it.

### Saving and restoring state (lossless unmount)

As the student works, the viewer posts `SPLICE.reportScoreAndState`
messages carrying the serialized document state — to the page's own
`window`, or to `window.parent` when the container has
`data-doenet-message-parent="true"` (the pattern iframe-per-activity pages
use). Store `e.data.state` opaquely; to restore, render a fresh viewer with
it:

```js
renderDoenetViewerToContainer(container, doenetMLSource, {
    flags: { allowLoadState: true },
    initialState: savedState,
});
```

**The gap — and `SPLICE.flushState`.** Reports are throttled (one per 60
seconds per viewer), so work committed since the last report would be
silently lost if the viewer's page were torn down based on save events
alone. Before tearing down, request a flush by posting to the window the
viewer lives in:

```js
viewerWindow.postMessage(
    { subject: "SPLICE.flushState", message_id: "my-id-123" },
    "*",
);
```

The flush settles in-flight updates and pushes any pending state out through
the **normal `SPLICE.reportScoreAndState` message** — so a host that already
persists those reports saves the just-flushed state with no extra code, and
need not even know a flush occurred. (No report is emitted when nothing is
pending, or when state saving is disabled — there is then nothing to lose.)
The viewer then replies with a stateless acknowledgement (delivered like its
other messages — same window, or the parent per `data-doenet-message-parent`):

```js
{
    subject: "SPLICE.flushState.response",
    message_id: "my-id-123",   // echoed from the request
    activity_id, doc_id,       // to correlate on multi-viewer pages
    success: true,
    hadState: true,            // false ⇒ nothing beyond initialization
}
```

The acknowledgement is the completion signal: once it arrives, every saved
`reportScoreAndState` is current, so tearing the viewer down loses nothing —
rendering later with `initialState: <the last saved state>` (and
`flags: { allowLoadState: true }`) restores the document exactly.
`hadState: false` means the viewer held no state beyond what it was
initialized with (e.g. its core was never created) — equally safe to tear
down.

This split suits a host topology where the party managing lifecycle (which
sends `flushState` and waits for the acknowledgement) is not the party
persisting state (which just saves `reportScoreAndState`): for example a
coordinator unmounting off-screen viewers on a page whose saved state is
owned by a separate host.

> **Note:** Wrap the round-trip in a retry/timeout — the viewer's listener
> registers on mount, and flushing is idempotent, so re-posting is safe.
> Every viewer in the target window receives a broadcast request and
> responds (correlate by `activity_id`/`doc_id`/`message_id`).

### Loading saved state at boot (`SPLICE.getState`)

With `flags: { allowLoadState: true }` and no `initialState` in the config,
the viewer asks its host for saved state when it boots:

```js
{
    subject: "SPLICE.getState",
    message_id,
    cid,                 // content id of the DoenetML source
    domain_id: "Doenet",
    activity_id, doc_id, attempt_number, user_id,
}
```

The viewer does not block on a reply — it boots fresh immediately and
**reboots seeded with the state** if a response arrives. If the host has
saved state for this document (an object previously received from
`reportScoreAndState`, whose `cid` matches the request), respond:

```js
{ subject: "SPLICE.getState.response", message_id, state }
```

If there is no saved state, no response is needed. To surface a load
failure to the student instead, respond with
`{ subject: "SPLICE.getState.response", error: { code, message } }`
(and no `message_id`).

Passing `initialState` in the config (or `initialState: null` for "start
fresh") skips this request entirely.

### Submitting all answers (`SPLICE.submitAllAnswers`)

Post `{ subject: "SPLICE.submitAllAnswers" }` to the viewer's window and it
submits every answer in the document, then responds with
`{ subject: "SPLICE.submitAllAnswers.response", success }`.

> **Note:** this pair carries no correlation id — on a page with several
> viewers, every viewer submits and responds, and the responses cannot be
> told apart. Use it with a single viewer per page (its original use case)
> or treat it as fire-and-forget.

### Solution-view permission (`SPLICE.requestSolutionView`)

With `flags: { solutionDisplayMode: "buttonRequirePermission" }`, a student
opening a solution triggers a permission request to the host:

```js
{
    subject: "SPLICE.requestSolutionView",
    message_id,
    activity_id, doc_id, attempt_number, user_id,
    component_idx,       // the solution component being opened
}
```

Decide and respond — note the response echoes the id as **`messageId`**
(camelCase), unlike the snake_case request field:

```js
{ subject: "SPLICE.requestSolutionView.response", messageId, allowView: true }
```

The solution is revealed only when `allowView` is `true`.

### Event stream (`SPLICE.sendEvent`)

With `flags: { allowSaveEvents: true }`, the viewer emits an analytics
event for student interactions (answers submitted, solutions viewed,
content experienced, …). Fire-and-forget; no response is expected:

```js
{
    subject: "SPLICE.sendEvent",
    message_id,
    name,                // mirrors data.verb
    data: {
        activityId, cid, docId, attemptNumber, variantIndex,
        verb,            // e.g. "answered", "experienced"
        object,          // JSON string: the component acted on
        result,          // JSON string: the outcome
        context,         // JSON string: additional context
        timestamp,       // "YYYY-MM-DD HH:MM:SS"
        version,
    },
}
```

### Frame resizing (`lti.frameResize`)

When the container has `data-doenet-send-resize-events="true"`, the page
posts its content height to `window.parent` after the viewer has rendered
and on every size change:

```js
{ subject: "lti.frameResize", height }
```

Hosts that embed the page in an iframe use it to size the frame. The
message is deliberately withheld until the first render completes, so a
still-booting viewer never collapses the host's iframe. (The
`@doenet/doenetml-iframe` wrapper consumes this message internally.)

## Development

Run

```bash
npm run dev
```

to start a `vite` dev server that serves the test viewer and navigate to the indicated URL. By default
`index.html` is served. You can instead navigate to `index-inline-worker.html` to view the same page but
with the inlined version of the DoenetML web worker.
