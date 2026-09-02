---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An expanded `<textInput>` is sized by its `width` and `height` again.

The textarea an expanded input renders had dropped both dimensions from its
style, so it fell back to the browser's default box — about twenty columns and
two rows — no matter what was authored, and `width` and `height` did nothing.

An expanded input now also takes a relative width: `width="50%"` is half the
column it sits in, where before a percentage resolved against the input's own
shrink-to-fit row and produced an arbitrary size. Its default width is now 100%
rather than 600 pixels, and it never grows wider than the column even when an
absolute width asks for more, so it shrinks to fit a narrow window. The width of
a word-sized (not `expanded`) input is unchanged.

On a `<graph>` a text input is drawn as a one-line field however it is written,
so `expanded` no longer changes its size there: it is the same width as any
other input on the graph.

The reference table and the help panel now name the two defaults, and say that
`height` applies only to an expanded input.
