---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<group copy>` now shows the same random values as its source inside the option a `<select>` chose, when the `<select>` sits inside another element of the copied group, as in `<group name="g"><div><select>…</select></div></group>` with `<group copy="$g"/>`. Before, the copy chose the same option, but the random values inside it, such as that of a `<selectFromSequence>`, could be different. This also holds for a `<select>` inside the chosen option of another `<select>`.
