---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: make the selection unmistakable, and give the two hints that were competing with it channels of their own.

The editor paints three things around text — the selection, the other occurrences of the selected text, and the tag pair under the cursor — and off the shelf all three were fills of nearly the same strength on the dark canvas: the selection at 1.32:1 against the canvas, the tag pair at 1.51:1, the occurrences at 4.51:1. The loudest was the one that mattered least, and authors reported the selection as effectively invisible and as getting lost against the tag-pair highlight.

The selection is now 3.48:1 against the dark canvas — 3.27:1 on the line holding the cursor, where the active-line tint is painted over it, so it clears WCAG's 3:1 for non-text contrast either way — and 1.96:1 against the white one, up from 1.28:1. What was holding it down is that the fill is painted *behind* syntax-colored text that has to stay readable on top of it, which capped how far it could move before the dimmest token fell below WCAG AA. Selected text now gets a single high-contrast color of its own, the way a native selection in any other input on the page does (white on dark at 5.39:1, near-black on light at 9.64:1), so the palette no longer sets the ceiling. Light mode also stops using the neutral gray the gutter is painted in, so the selection no longer reads as editor chrome.

Occurrences of the selected text used to be marked in CodeMirror's stock `#99ff7780` green, which shouted over the selection it was echoing and, on the dark canvas, dropped every syntax token to between 1.35:1 and 3.5:1 — under AA. They are now a quiet blue drawn from the selection color, at 1.18:1 light and 1.47:1 dark, with every token clearing AA on top. The dark comment gray is a shade lighter (`#8b949e` → `#9ba4ad`) so that tint can register at all and still keep comments readable on it; comments stay plainly quieter than body content.

The tag pair the cursor sits in is now outlined rather than filled, in a channel neither fill can be mistaken for, with the outline clearing 3:1 against the canvas in both modes.

Ctrl+D (select-next-occurrence) used to blank out every occurrence mark on the first press — `highlightSelectionMatches` returns nothing at all once the selection holds more than one range, so the guidance disappeared exactly when a multi-cursor edit was relying on it. It is replaced by an equivalent that keeps marking whatever copies have not been taken yet, so each press visibly moves one occurrence from the hint color into the selection. Selections of a single character, or of nothing but whitespace, no longer mark anything.

Also fixes the editor canvas in dark mode outside `EditorViewer`: `@uiw/react-codemirror` appended a theme of its own after ours whose only rule painted the editor white, leaving a dark-mode editor sitting on white anywhere the app's own belt-and-suspenders CSS override did not reach.
