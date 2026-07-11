# DoenetML IFrame Renderer

This workspace contains a DoenetML viewer and editor that render inside of an iframe.
This allows DoenetML to be used without affecting the surrounding page.
It also allows multiple versions of DoenetML to be used at the same time.

## DoenetEditor

### Programmatic control of the diagnostics panel

The iframe `<DoenetEditor>` accepts the same `initialOpenTab` prop and
`DoenetEditorHandle` ref API as the in-process `<DoenetEditor>` from
`@doenet/doenetml`. Calls bridge into the iframe via ComLink. If the
ref handle is invoked before the iframe has finished loading, the call
is queued in the outer wrapper and replayed once the iframe is ready —
consumers do not need to coordinate timing.

```tsx
import { useRef } from "react";
import {
    DoenetEditor,
    type DoenetEditorHandle,
} from "@doenet/doenetml-iframe";

function App() {
    const editorRef = useRef<DoenetEditorHandle>(null);
    return (
        <>
            <button
                onClick={() =>
                    editorRef.current?.openDiagnosticsTab("accessibility")
                }
            >
                Show accessibility violations
            </button>
            <DoenetEditor ref={editorRef} doenetML="..." />
        </>
    );
}
```

Mount-time form (panel opens on the requested tab on first paint):

```tsx
<DoenetEditor doenetML="..." initialOpenTab="accessibility" />
```

Valid tab IDs: `"errors" | "warnings" | "info" | "accessibility" | "responses"`.
See the `@doenet/doenetml` README for usage patterns including the lazy-mount
"link in a different panel" scenario.

### Programmatically updating the rendered view

The handle also exposes `updateRenderedView()`, which forwards across the
iframe to "press" the editor's Update button. Pair it with
`diagnosticsSummaryCallback` (which receives the source the viewer
rendered against as its second argument) to ensure diagnostics reflect the
latest editor buffer:

```tsx
<button onClick={() => editorRef.current?.updateRenderedView()}>
    Update viewer
</button>
```

> **Note:** The handle methods are fire-and-forget across the iframe boundary.
> Although they share the same `DoenetEditorHandle` type as the in-process
> editor (so consumers can swap implementations), the iframe variant cannot
> surface a completion signal or error to the caller — failures from the
> underlying ComLink RPC are logged to the console rather than thrown.

## DoenetViewer

### Prop changes and iframe reloads

Changing props on a mounted `<DoenetViewer>` does **not** reload the iframe:
the wrapper pushes changes into the already-loaded iframe as messages, and
the inner viewer applies them with the same semantics as the in-process
`<DoenetViewer>` from `@doenet/doenetml`. In particular:

| Prop change                                                                | Effect                                                                                                      |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `render`, `darkMode`, `flags`, `answerResponseCounts`, callbacks, …         | applied live, no reload (flipping `render` false→true starts the document in the already-loaded realm)       |
| `doenetML`, `activityId`, `docId`, `attemptNumber`, `requestedVariantIndex` | the document's core re-initializes **inside the same iframe realm** — the multi-MB bundle is not re-parsed   |
| `initialState`, `forceDisable` and the other `force*` props, `userId`       | read at (re-)initialization only, exactly like the in-process viewer — change `docId`/`attemptNumber` or remount via `key=` to apply |
| `standaloneUrl`, `cssUrl`, `doenetmlVersion` (or a version change detected in `doenetML`), `useSharedCoreWorker` | a different bundle/realm is required, so the iframe reloads                                                   |

To force a full remount (fresh realm and worker), change the component's
React `key`.

Function props (callbacks) are forwarded across the iframe boundary via
Comlink proxies and always follow the latest identity passed — parents may
pass inline arrow functions freely; identity churn does not re-render the
inner viewer.

> **Note:** in-place updates require a standalone bundle ≥ 0.7.18. When an
> older version is pinned (via `doenetmlVersion` or detected from the
> document's `xmlns`), the wrapper falls back to its historical behavior of
> reloading the iframe on any prop change.

### Windowed mounting (`mountPolicy`)

Pages that embed many viewers (assignment pages, textbook chapters) pay
memory for every mounted iframe, whether or not the student can see it. The
opt-in `mountPolicy` prop bounds this: windowed viewers **start as
placeholders and only create their iframe when they come near the viewport**
(an off-screen viewer never boots at all), simultaneous boots are capped
page-wide, and at most `maxLiveViewers` viewers stay live. Off-screen
viewers beyond the budget are **parked** — their state is flushed (via the
`SPLICE.flushState` machinery) and their iframe is replaced by a placeholder
of the same height, so the page layout doesn't shift. Scrolling a parked
viewer back near the viewport restores it, seeded with the flushed state:
typed work survives the round trip with no user interaction.

```tsx
<DoenetViewer
    doenetML={doenetML}
    flags={{ allowSaveState: true }}
    mountPolicy={{ mode: "windowed", maxLiveViewers: 3 }}
/>
```

- `maxLiveViewers` (default 3) — page-wide budget, shared by every windowed
  viewer (the smallest value wins when viewers disagree). The budget is
  soft: currently-visible viewers are never parked, even over budget.
- `visibleMargin` (default `"1000px"`) — how far outside the viewport a
  viewer still counts as visible (the `IntersectionObserver` rootMargin).
- `parkDelayMs` (default 2000) — how long a viewer must stay off-screen
  before it may be parked (debounce against scroll flicker).
- `flushTimeoutMs` (default 5000) — how long to wait for the pre-park state
  flush to be acknowledged before parking anyway.
- `maxConcurrentBoots` (default 2) — page-wide cap on how many windowed
  viewers may be booting their iframe realm at once (each boot parses the
  multi-MB standalone bundle and starts a core worker). Additional viewers
  wait for a slot, visible-first — this removes the initialization stampede
  when a page with many activities loads.

**Parking requires a persistence path** so no student work can be lost:
either `flags.allowSaveState` (the wrapper snapshots the flushed
`reportScoreAndState` and seeds `initialState` on restore) or
`flags.allowLocalState` (IndexedDB restores on reboot). Windowed viewers
with neither flag always stay live (a console warning points this out).

Notes:

- Eviction is least-recently-visible first.
- While parked, a viewer emits no reports (its state was flushed at park
  time). A host `SPLICE.flushState` broadcast is answered by the wrapper on
  the parked viewer's behalf, so pre-navigation flush round-trips don't
  hang.
- When `requestedVariantIndex` is not specified, windowed viewers pin a
  random variant once per mount so a restore cannot reroll the document.
- Restoring pays a fresh iframe boot (bundle evaluation + core boot, ~1–2 s
  warm). Pair with `useSharedCoreWorker` to make both live and restored
  viewers cheaper.
- `mountPolicy` is read at mount; changing it afterwards is not supported.

### Host message protocol (SPLICE)

The viewer exchanges JSON messages with the host page via `postMessage`.
Viewer → host messages arrive on **your window** (the iframe posts to
`window.parent`, which is your page). Host → viewer requests are posted on
**your own window** too — the wrapper forwards these subjects into the
iframe: `SPLICE.getState.response`, `SPLICE.requestSolutionView.response`,
`SPLICE.submitAllAnswers`, and `SPLICE.flushState`. On a page with several
viewers, every viewer receives a forwarded request; correlate responses by
`activity_id`/`doc_id`/`message_id`.

The messages are documented in the subsections below:

| Subject                                                    | Direction     | Purpose                                        |
| ---------------------------------------------------------- | ------------- | ---------------------------------------------- |
| `SPLICE.reportScoreAndState`                                | viewer → host | periodic score/state saves                     |
| `SPLICE.getState` / `.response`                             | viewer ⇄ host | load saved state at boot                       |
| `SPLICE.flushState` / `.response`                           | host ⇄ viewer | on-demand state flush (lossless unmount)       |
| `SPLICE.submitAllAnswers` / `.response`                     | host ⇄ viewer | submit every answer in the document            |
| `SPLICE.requestSolutionView` / `.response`                  | viewer ⇄ host | permission gate for viewing solutions          |
| `SPLICE.sendEvent`                                          | viewer → host | analytics/event stream                         |

### Saving and restoring state (lossless unmount)

The viewer reports the student's serialized document state to the host as
they work: it posts `SPLICE.reportScoreAndState` messages to the host
window (the wrapper's iframe posts to `window.parent`, which is your page):

```js
window.addEventListener("message", (e) => {
    if (e.data?.subject === "SPLICE.reportScoreAndState") {
        // e.data.state — serialized document state (opaque; store as-is)
        // e.data.score, e.data.activity_id, e.data.doc_id
    }
});
```

To restore, remount the viewer with the saved state:

```tsx
<DoenetViewer
    doenetML={doenetML}
    flags={{ allowLoadState: true }}
    initialState={savedState}
/>
```

**The gap — and `SPLICE.flushState`.** Reports are throttled (one per 60
seconds per viewer), so at any moment the student may have committed work
that no report has delivered yet. A host that unmounts a viewer based on
save events alone silently loses that work. Before unmounting, request a
flush — post on your own window; the wrapper forwards it into the iframe:

```js
window.postMessage(
    { subject: "SPLICE.flushState", message_id: "my-id-123" },
    "*",
);
```

The flush settles in-flight updates and pushes any pending state out through
the **normal `SPLICE.reportScoreAndState` message** (which reaches your page
as shown above) — so a host that already persists those reports saves the
just-flushed state with no extra code. (No report is emitted when nothing is
pending, or when state saving is disabled — there is then nothing to lose.)
The viewer then replies with a stateless acknowledgement (again on your
window):

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
`reportScoreAndState` is current, so unmounting loses nothing — remounting
later with `initialState: <the last saved state>` (and
`flags: { allowLoadState: true }`) restores the document exactly, including
work an earlier report never delivered. `hadState: false` means the viewer
held no state beyond what it was initialized with (e.g. its core has not
booted yet) — equally safe to unmount.

> **Note:** Wrap the round-trip in a retry/timeout — the viewer's listener
> registers on mount, so a request posted moments after mounting can land
> before anyone is listening, and flushing is idempotent so re-posting is
> safe. Every viewer on the page receives a broadcast request and responds
> (correlate by `activity_id`/`doc_id`/`message_id`).

### Loading saved state at boot (`SPLICE.getState`)

With `flags: { allowLoadState: true }` and no `initialState` prop, the
viewer asks the host for saved state when it boots:

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
**reboots seeded with the state** if a response arrives. If you have saved
state for this document (an object previously received from
`reportScoreAndState`, whose `cid` matches the request),
respond:

```js
{ subject: "SPLICE.getState.response", message_id, state }
```

If there is no saved state, no response is needed. To surface a load
failure to the student instead, respond with
`{ subject: "SPLICE.getState.response", error: { code, message } }`
(and no `message_id`).

Passing `initialState` yourself (or `initialState: null` for "start
fresh") skips this request entirely.

### Submitting all answers (`SPLICE.submitAllAnswers`)

Post `{ subject: "SPLICE.submitAllAnswers" }` and the viewer submits every
answer in the document, then responds with
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

## Development

Source code in `src/iframe-viewer-index.ts` and `src/iframe-editor-index.ts`
is pre-compiled and included directly in the generated iframe.
Source code in `src/index.tsx` is compiled into the `DoenetViewer` and `DoenetEditor` components.
