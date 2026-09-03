# Standalone DoenetML Renderer

This workspace contains a standalone DoenetML renderer.

## Usage

Include

```html
<script type="module" src="doenet-standalone.js"></script>
```

in your webpage. The bundle is code-split: the editor stack and individual
component renderers load on demand from the `chunks/` directory published
beside `doenet-standalone.js` (the co-located `doenetml-worker/` and
`locales/` are fetched the same way), so serve the package directory as-is
rather than copying the one file. Served from a CDN under a floating tag
(`@latest`, or no version), the bundle resolves its chunks — like the worker
and message catalogs — at the exact release it was built as, so an
already-cached entry keeps working across releases. A host that needs a truly single file —
for example one that evaluates the bundle from a Blob or `srcdoc` URL, where
relative chunk resolution has no base — can use
`doenet-standalone-inline.js`, which inlines every chunk (it still loads the
core worker from `doenetml-worker/` beside it, or from
`/doenetml-worker/index.js` at the page origin when the bundle URL has no
usable base).

Then you can call the globally-exported function
`renderDoenetViewerToContainer` (or `renderDoenetEditorToContainer` for the
editor), which expects a `<div>` element containing a
`<script type="text/doenetml"></script>` as a child.

For example

```html
<script type="module">
    renderDoenetViewerToContainer(document.querySelector(".doenetml-applet"));
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

To pass attributes to the DoenetML react component, write them in kebob-case
prefixed with `data-doenet` **on the container element** — the same element you
hand to `renderDoenet{Viewer,Editor}ToContainer`. Attributes on the inner
`<script type="text/doenetml">` are part of the source payload and are not read.
For example,

```html
<div class="doenetml-applet" data-doenet-read-only="true">
    <script type="text/doenetml">
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
<div class="doenetml-applet" data-doenet-use-existing-mathjax="true">
    <script type="text/doenetml">
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

## Language

Doenet keeps two languages apart: the language of the **content** and the
language of the **chrome** (buttons, panel headers, diagnostics). They
genuinely differ — a Spanish-speaking student may work a French physics
problem.

| Attribute                       | Prop / config key | Meaning                                                                    |
| ------------------------------- | ----------------- | -------------------------------------------------------------------------- |
| `data-doenet-document-locale`   | `documentLocale`  | BCP-47 tag for the content's language (`es`, `es-MX`). Defaults to `en`.   |
| `data-doenet-ui-locale`         | `uiLocale`        | BCP-47 tag for the chrome's language. Defaults to following `documentLocale`. |

```html
<div class="doenetml-applet" data-doenet-document-locale="es-MX">
    <script type="text/doenetml">
        <p>Hola</p>
    </script>
</div>
```

An authored `<document lang="es-MX">` overrides `documentLocale`: the author
knows what language they wrote in, the host only knows what it would prefer to
receive.

The rendered container always carries a `lang` attribute naming the language
the content was rendered in, so screen readers pronounce it with the right
voice and rules. When neither route declares one, that language is `en` — the
language the core computes such an activity's prose in.

Changing `documentLocale` rebuilds the document, since it changes every string
the core computes; `uiLocale` updates in place.

English is bundled. Every other language is fetched on demand from the
`locales/` directory published beside `doenet-standalone.js` — **serve that
directory next to the bundle** and any language it holds works with nothing
else configured, named by `data-doenet-document-locale` or by a
`<document lang>` in the DoenetML. When the bundle's own URL cannot be resolved
against (an embed that boots it from a blob URL), `/locales/` at the page's
origin is tried instead. If neither is served, those fetches fail quietly and
the language falls back to English.

A host with translations of its own passes them as `localeResources`, supplied
only through the `renderDoenet{Viewer,Editor}ToContainer` config object — they
are FTL sources keyed by locale, too large to ride an HTML attribute. A host's
catalog wins over a bundled or fetched one for the same locale, which is how a
deployment corrects a translation it disagrees with.

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

#### The page going away flushes on its own

A host need not send `flushState` for an ordinary departure. The viewer
flushes whatever the throttle is holding back when its page hides — on
`pagehide` and on a `visibilitychange` to `hidden` — so closing the tab,
typing a new URL, following an external link, or backgrounding a tab on a
phone no longer strands up to a minute of work. The flushed work arrives as
an ordinary `SPLICE.reportScoreAndState` message, so a host that already
persists those saves it with no extra code. Nothing is torn down on the way,
so a page that comes back — a re-foregrounded tab, a back/forward-cache
restore — carries on with its state already saved.

> **Important:** for this to survive a real unload, your listener has to
> persist **synchronously**. The report is handed over by dispatching the
> message event directly rather than posting it, because a document being
> unloaded is destroyed before a posted message is ever delivered — but a
> listener that defers its own write (a `fetch`, a `setTimeout`, an `await`)
> is destroyed just the same. Write from the listener itself, with
> `navigator.sendBeacon` or a synchronous store such as `localStorage`.

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

Quote the `message_id`: a response carrying state is only read by the viewer
whose request it names. Replies reach every viewer in the window, and `cid`
cannot tell two of them apart — it hashes the DoenetML text alone, so a
second attempt at the same document, or that document opened twice on a
page, carries the identical `cid`. An unaddressed answer would be restored
by all of them.

If there is no saved state, no response is needed. To surface a load
failure to the student instead, respond with
`{ subject: "SPLICE.getState.response", error: { code, message } }`,
either quoting the request's `message_id` or leaving it out — an error is
the one reply the viewer will take unaddressed, since the worst it costs is
a notice the next usable answer clears. Prefer quoting it even so: an
unaddressed error is taken by whichever request is open when it lands, on
every viewer on the page, including one a rebuild opened after the error was
sent. A reply quoting a *different* id is ignored, since that id belongs to
some other request.

The `message` is shown to the student **beside** the document, not in place
of it: the request stays open until an answer carries usable state, so an
error can land long after the document is on screen and being worked in, and
what it reports is that the document started without the student's saved
work rather than that there is no document. If no core could be started
either, the viewer says so on its failure pane and adds this message beneath
it, so the two are not mutually erasing.

Two kinds of error reach the student's screen as nothing at all, and both are
logged to the console instead:

- An error carrying no string `message`. The viewer has no text of its own
  worth showing a student here, so send the text you want them to read.
- An error whose `code` is `unsupported_subject`, `unauthorized`,
  `wrong_origin` or `bad_request`. That is Canvas's postMessage vocabulary
  for a subject it does not recognize, not a host's load failure: Canvas
  answers *any* message on *any* of its pages, so a Doenet activity embedded
  in one gets these back for every `SPLICE` message it sends. They mean the
  page is not a host, which is the same to the viewer as no answer at all.
  Do not use these codes to report a genuine load failure.

A request has a single answer: the **first** response carrying state for
this `cid` is the one the viewer reboots from, and every response after
that — errors included — is ignored. A response with no state — or state for a
different `cid` — does not count as that answer, so a listener with nothing
saved cannot shut out one still in flight. Answer once, out of durable
storage: a host that replies from an in-memory cache first and from storage
afterwards keeps the cache's answer. The rule is what makes a page holding
more than one such listener work — see
[COORDINATION.md](https://github.com/Doenet/DoenetML/blob/main/packages/standalone/COORDINATION.md)
for the coordinator beside a book's own persistence layer.

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
