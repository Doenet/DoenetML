---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add `<parsons>`, a Parsons problem: the reader arranges candidate `<block>`s into a solution area in the right order and leaves the distractors unused.

```xml
<parsons name="p" solutionLabel="Correct steps" unusedLabel="Unused steps">
  <label>Simplify the expression</label>
  <statement><m>[a-(b-c)] \div d</m></statement>
  <block><m>…</m></block>
  <block><m>…</m></block>
  <block isDistractor><m>…</m></block>
</parsons>
```

The correct order is the document order of the non-distractor blocks; a `<statement>` is the fixed first row of the solution. The unused pile is shuffled per variant (`shuffleOrder`, on by default, and `requestedVariantIndex` reproduces it, with every permutation a distinct unique variant). Blocks move by pointer drag, by the Move to solution / Move up / Move down / Remove buttons on each block, or from the keyboard on a focused block (Enter or Space switches area, Alt with an arrow reorders), and every move is announced to a screen reader. Full credit needs exactly the correct blocks in order; grading is all-or-nothing in this version, and `matchPartial` is accepted but has no effect yet. `solutionLabel` and `unusedLabel` rename the two areas and default to "Solution" and "Unused blocks" in the document's language; `weight`, `maxNumAttempts`, `disableAfterCorrect`, `handGraded` and the other answer-grading attributes work as on `<answer>`. Authors can read `currentResponses`, `submittedResponses`, `blockOrder`, `correctOrder`, `numBlocks` and `numDistractors`.

A `<parsons>` with no `<label>` or `<shortDescription>` is reported as an accessibility violation, since the reader operates real controls; one with no blocks, or with only distractors, is reported as a warning.
