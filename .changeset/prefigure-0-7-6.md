---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Upgrade the bundled PreFigure runtime from 0.6.7 to 0.7.6.

Nothing a Doenet author writes behaves differently. The upgrade was checked
against the parts of PreFigure the renderers actually depend on, and they are
unchanged: every element and attribute the graph and chart renderers emit is
still accepted, `alignment_displacement` — which fixes where a label or legend
sits relative to its anchor — is byte-identical, and the legend's geometry
(`outer_padding`, `vertical-skip`, the key width and the box width formula) is
the same. The `fill-pattern` vocabulary is unchanged, so patterned fills keep
their meaning.

What is new upstream is mostly elsewhere: circuit diagrams, an adapter schema,
and `hticks`/`vticks` for controlling tick marks, none of which Doenet emits
yet. Two changes are worth having. `annotations.py` now skips comments and
processing instructions rather than trying to annotate them, which is a class
of crash rather than a cosmetic fix. And the MathJax label extraction now
resolves its XPath in the XHTML namespace, which is how labels are found at
all when the label tree carries one.

Two schema definitions were also relaxed: `coordinates` and `group` moved from
an interleave of element groups to a free choice of them, which permits the
mixed ordering our diagrams already emit.

The chart and graph renderers reserve their margins from measurements taken
against a real PreFigure render — how wide a legend's key is drawn, how wide a
character is at 14px. Those measurements were taken at 0.6.7 and none of the
constants behind them moved in 0.7.6, so no margin needed recalibrating. The
opt-in live suites (`RUN_LIVE_PREFIGURE_VALIDATION=1`) measure the drawn
geometry rather than predicting it, and are the check to run against the build
service once it is upgraded to match.
