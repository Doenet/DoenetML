---
"@doenet/doenetml-iframe": patch
---

Windowed mounting (`mountPolicy`) improvements for embedding hosts:

- Hosts that consume state reports through the `reportScoreAndStateCallback`
  prop (which suppresses the `SPLICE.reportScoreAndState` message the park
  snapshot was captured from) are now fully supported — the wrapper captures
  the flushed report before forwarding it to the callback, so parking stays
  lossless.
- New dynamic `keepLive` prop: treat a windowed viewer as visible — boot it
  eagerly (still subject to the page-wide boot cap) and never park it while
  set. For hosts that know a hidden viewer is about to be shown, e.g. a
  paginator prefetching the pages adjacent to the current one.
- Parking is now gated on the selected standalone bundle being new enough to
  acknowledge `SPLICE.flushState` (v0.7.21+; custom `standaloneUrl`s are
  assumed modern). Previously, parking a viewer pinned to an older
  `doenetmlVersion` timed out the flush and could lose up to a
  report-throttle interval of work; such viewers now stay live (they still
  mount lazily and obey the boot cap).
- The windowed-without-persistence console warning fires once per page
  instead of once per viewer.
