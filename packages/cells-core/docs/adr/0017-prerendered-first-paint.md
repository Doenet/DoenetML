# A page can arrive prerendered: the server's HTML first, the live viewer in its place

Status: accepted 2026-10-22.

A document can be served as a **prerendered page**: its HTML rendered on a
server, by the same parser, core and React renderers the browser runs, so
the browser paints the document from the page itself before any script or
the core's wasm arrives. The page carries the DoenetML source and the
seed and state it was loaded with; its script loads the same document in
the browser and renders the live viewer into the page's root, which
**replaces** the server's HTML rather than adopting it. A graph is
prerendered as its board's container, sized and empty, and drawn by
JSXGraph once the live viewer comes. What the student did to the page
meanwhile is carried over to the live viewer.

The viewer that loads DoenetML from a page and renders it in the browser
is unchanged: it is the same code, run the same way, and a prerendered
page is that code run earlier, on a server, with its output saved.

## Context

The goal is a document a student can read within 200 to 300 ms of
opening it on a slow phone. The load layer of `packages/benchmark` (its
`load.md`) measures the viewer on calibrated device profiles. On the
slow phone over slow 4G a first visit's document appeared after 5.18 s,
and with the network not slowed after 738 ms. On a second visit the files
come from the cache, and it still took 924 ms.

Almost all of that is code running for the first time, not work on the
document: loading the same document again on the same page, the core's
load took 13 ms where the first took 130, the first board 1.5 ms where it
took 280, React's commit 20 ms where it took 77 (6x CPU throttling,
before calibration). Over a slow network the files dominate: 875 KB on the
wire, the core's wasm 558 KB of it, arriving last at about 4.8 s. No
amount of optimizing the parser, the core or the renderers on the client
gets the first paint to 300 ms, because the first paint waits for all of
them. A page that arrives with the document rendered waits for none.

## Decision

### The page

`packages/cells-viewer/src/prerender/` and `scripts/prerender.mjs`. A
prerendered page is one HTML file per (document, seed, state):

- the viewer's styles, inlined;
- in `<div id="root" data-prerendered>`, the document rendered by
  `renderToString` (`prerender`, `render.tsx`);
- in JSON script elements, the meta (`format`, `seed`, `state`, the viewer
  build it was written for) and the DoenetML source, with every `<`
  escaped so a document cannot end the element;
- an inline script that starts compiling the wasm and records presses in
  the snapshot, and the client entry with its modules as module scripts
  and preloads, which run after the page is parsed and do not hold up the
  first paint.

The server build (`vite.prerender.config.ts`) bundles the renderer for
Node. The page writer reads the client build's hashed files from its
manifest and starts the server's core from the client build's own wasm,
so a page and the core its browser loads are the same build.

### The browser replaces the server's HTML

The client entry (`src/snapshot-entry.tsx`) parses the embedded source,
loads it with the page's seed and state, and renders the viewer into the
root with `createRoot`. React replaces the prerendered HTML in one commit,
and graphs draw into the boxes the server sized, so the page does not
move. The swap is the step `interactive`.

The browser never adopts the server's markup, so the two need not match
byte for byte. A snapshot that is slightly off is replaced, and a page
with no snapshot, or one a viewer build cannot read (its `format`), is
the viewer as before. What must hold is that the server and the browser
load the same document the same way. The benchmark's parity check
(`browser/parity.spec.ts`) guards it: on each prerendered page, every
component's text and box before the swap must equal those after it, and
the swap must not shift the layout. A page whose meta names the wrong
seed fails it.

### The source, not the encoded document

The page carries DoenetML, which the browser parses as the viewer always
has. The binary wire format (ADR 0002) stays internal to a build. Stored
in pages that a host may keep longer than a viewer build lives, it would
become a format to version and keep readable.

### A graph is an empty box until JSXGraph draws it

JSXGraph reads `window` when imported and draws in a layout effect, which
a server does not run. The server build and the tests replace it with a
stand-in (`jsxgraph-stub.ts`), and a graph renders as its board's
container at the board's size.

### What the student did is carried over

`src/prerender/carry.ts`, done in the DOM through the events a student's
own input fires, so the renderers are unchanged:

- typed text in an input the student has left is committed, as leaving it
  would have committed it;
- the input still focused keeps its text, focus and selection,
  uncommitted;
- checkboxes, radio buttons, sliders and opened hints are replayed;
- buttons pressed, which the page's head records from its first moment,
  are pressed again in order;
- the scroll position is kept.

### Renderers must render on a server

A renderer that reads a store value uses `useStoreSnapshot`
(`src/hooks.ts`), which gives React the server snapshot it needs there,
and reads no browser API while rendering. `render-to-html.test.tsx`
renders the core's golden documents, the benchmark's documents and the
dev page's to HTML in Node.

## Measured

The load layer on `homework`, first visit, the reference machine
(`results/runs/2026-10-22-claude-cloud-e7f3dc46d/load.md`). Devices are CPU
classes calibrated by the time of a fixed workload (`src/devices.mjs`);
networks are the DevTools presets, applied per request.

| Device, network | Viewer, readable | Prerendered, readable | Prerendered, usable |
|---|---|---|---|
| slow phone, slow 4G | 5.18 s | **251 ms** | 5.13 s |
| slow phone, 4G | 1.36 s | 150 ms | 1.32 s |
| slow phone, not slowed | 738 ms | 122 ms | 700 ms |
| mid phone, slow 4G | 5.01 s | 220 ms | 4.98 s |
| desktop, not slowed | 214 ms | 56 ms | 201 ms |

Layout shift at the swap was 0 in every scenario. Between readable and
usable, the swap blocks input for 360 ms on the slow phone and 170 ms on
the mid phone.

## Considered options

- **Hydrating the server's HTML.** React adopts the markup instead of
  replacing it, which saves the second render. It requires the server and
  the browser to produce identical markup, and every input to that, now
  and in every later renderer change, to be pinned: seed, state, locale,
  number formatting, ids. It also cannot take over a JSXGraph board, which
  owns its own DOM. Rejected for now; replacing costs the render that
  hydrating would save, and is measured (blocking above).
- **Embedding the encoded document (CDAST) instead of the source.** Saves
  the browser's parse (about 55 KB gzipped of parser and 170 to 210 ms at
  6x CPU, all after the first paint). Rejected for now, for the
  versioning above. A Rust parser in the core's wasm would remove the
  parse without it; both are left to the load layer's time to interactive.
- **Drawing boards on the server with JSXGraph under jsdom.** It works
  (a board with its elements came out as 20 KB of SVG in about 90 ms), but
  jsdom has no layout: text measures as zero, so labels positioned by
  their size shift. Rejected.
- **Drawing boards in a headless Chromium.** Exact, and the page format
  allows it: the box's contents are replaced like the rest. Deferred: it
  needs a browser on the server.
- **A lighter SVG board renderer in place of JSXGraph.** It would shorten
  the time until a graph can be dragged and the bytes a page downloads,
  but is a second renderer to keep with Doenet's look (ADR 0010). Not
  part of this decision.
- **Each input renderer taking carried text from an `initialText` map.**
  Covers typed text only, and changes every input renderer. Replaced by
  carrying in the DOM, which covers every control and changes none.

## Consequences

- The document is readable at the first paint, but usable only once the
  same files have arrived as before: usable times are those of the viewer.
  Shortening them is a matter of bytes and first-run code (a smaller wasm,
  a lighter React, a lighter board renderer), which the load layer now
  measures on both pages.
- The swap is a second render of the document and blocks input while it
  runs: 360 ms on the slow phone.
- A page stays loadable by any viewer build that reads its `format`; the
  source is the stable part. Changing the page's layout means a new
  format, and a viewer build that leaves pages of other formats as they
  are.
- Enter pressed in the snapshot is not carried: the text stays typed and
  uncommitted until Enter or blur.
- Prerendering is one function and a command (`prerenderPage`,
  `scripts/prerender.mjs`). Running it at publish time or on request,
  caching its pages and invalidating them by document, seed, state and
  viewer build is the host's.
