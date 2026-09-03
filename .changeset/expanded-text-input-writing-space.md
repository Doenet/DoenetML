---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Export an `expanded` `<textInput>` as room to write on, rather than as a one-line blank.

An expanded text input is a text area for a long answer, so on paper it should be blank space, not the short `<fillin>` rule a one-line input exports as. This covers a hand-graded `<answer type="text" handGraded expanded />`, which sugars in such an input. PreTeXt writes that space as a `workspace` attribute on the block the space follows, and only leaves the space inside a printout division — so a document holding an expanded input is exported as a `<handout>`: either the section containing the input, or the whole document when it has no sections. The space is as tall as the input, so `<answer handGraded><textInput expanded height="3in" /></answer>` exports as `workspace="3in"`, and two expanded inputs in one paragraph get room for both.

The space is left where the reader is meant to write. An input written inside a paragraph puts the space after that paragraph; one written outside any paragraph — an `<answer>` on a line of its own — gets a paragraph of its own standing where it stood, so the space stays inside the problem or list item that asked the question rather than after it. Where that input was written among a run of text — as in `<li>Why? <answer type="text" handGraded expanded /></li>`, or beside an expression such as `<m>2+2=</m>` — the new paragraph takes in the run, since a list item holds either a run of text or blocks and never a mix. Only the input itself gives way to the space, so an answer's label still asks its question in front of it.

A document with no expanded input is exported exactly as before. Wrapping it in a printout would change how the page reads — a printout carries its own heading, a print-preview bar, and its own page geometry — so the wrapping only happens where the space is needed. No PreTeXt printout may hold a section, so where the space has nowhere to go — the input's section holds sections of its own, or the input sits outside every section of a document that has them — the input still exports as a `<fillin>`.

In the printed output, that space is now drawn: PreTeXt leaves the height of a workspace to the javascript behind its own print preview, which a printed DoenetML document does not load, so the height is written into the page instead. PreTeXt's print-preview controls, which need that same javascript, are dropped from the page along with the other on-screen navigation.
