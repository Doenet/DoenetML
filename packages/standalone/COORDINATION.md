# Coordinating many DoenetML activities on one page

Static host pages that embed many DoenetML activities as same-origin iframes
— the model PreTeXt uses for its generated `…-if.html` interactive pages —
historically paid for every activity at once: N parallel multi-MB bundle
parses and N dedicated ~100 MB core workers at load, and all N stayed in
memory forever (Active Calculus pages have been measured at 1.7–3.6 GB).

`coordinator.js`, published alongside the bundle in `@doenet/standalone`,
fixes this with **one script tag on the host page**:

```html
<script src="https://cdn.jsdelivr.net/npm/@doenet/standalone@<version>/coordinator.js"></script>
```

The activity pages themselves need **no changes**: the coordinator marks
each activity iframe's URL with a fragment token, and the standalone bundle
the activity already loads detects that token and cooperates.

## What it does

- **Lazy boot with a concurrency cap.** Activity iframes are detached up
  front and only load when they come near the viewport AND a boot slot is
  free (default: 2 at a time, visible-first). An activity the reader never
  scrolls to never boots at all.
- **Park / restore.** At most `maxLiveViewers` (default 3) activities stay
  live. When the reader scrolls on, off-screen activities beyond the budget
  are *parked*: the coordinator flushes their state (`SPLICE.flushState`),
  warehouses the final `SPLICE.reportScoreAndState`, and detaches the
  iframe (`about:blank`) — the element, and therefore the page layout,
  stays. Scrolling back restores the activity; the rebooting viewer asks
  for its state (`SPLICE.getState`) and the coordinator answers from the
  warehouse, so **the reader's work survives** with no interaction.
- **Shared core workers** (opt-in, `data-shared-core-workers="true"`):
  activities obtain their document cores from a coordinator-owned worker
  pool instead of each booting a dedicated worker — the dominant per-
  activity memory cost on multi-activity pages.

## Configuration

Options are read from the script tag's `data-` attributes:

```html
<script
    src="…/coordinator.js"
    data-max-live-viewers="3"
    data-max-concurrent-boots="2"
    data-visible-margin="1000px"
    data-park-delay-ms="2000"
    data-flush-timeout-ms="5000"
    data-shared-core-workers="true"
    data-iframe-selector="iframe[src$='-if.html']"
></script>
```

For programmatic control, set `data-doenet-manual-init` on the script tag
and call `window.initializeDoenetCoordinator({ maxLiveViewers: 3, … })`
yourself (same option names, camelCase).

`window.doenetCoordinatorStats()` returns live diagnostics
(`{ activities, byState, booting, bootQueue, sharedCorePool }`).

## Requirements and behavior notes

- Activity iframes must be **same-origin** with the host page (the
  activity *page*, not the CDN bundle it loads — PreTeXt's layout). The
  default selector targets `…-if.html` URLs plus any iframe with a
  `data-doenet-coordinate` attribute.
- Activities should have an explicit `height` (PreTeXt sets one): the
  iframe element stays in the layout while parked, so no reflow occurs.
- Parked activities' state lives in the coordinator's in-page warehouse.
  Navigating away from the host page discards it, exactly as it discards
  live activities' state — pair with a persistence backend (Runestone,
  etc.) if state must survive navigation; the coordinator's flushes ride
  the normal `SPLICE.reportScoreAndState` channel such a backend already
  consumes.
- Activities running a standalone bundle older than the coordinator
  protocol boot normally but are managed conservatively (a 90 s watchdog
  stands in for their missing boot-complete signal, and their state cannot
  be warehoused; they still lazy-load).
- The coordinator manages iframes present at initialization
  (DOMContentLoaded); dynamically inserted activities are not yet managed.
