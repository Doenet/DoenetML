---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Answer: stop a partial-credit `<feedback>` from briefly flashing on screen when a section-wide check-work button submits multiple answers at once.

`submitAllAnswers` submits each enclosed answer with `skipRendererUpdate: true` so the renderer only updates once, on the final `numSubmissions` bump. However, `performUpdate` forced a renderer fan-out whenever the update carried a `recordItemSubmission` instruction (every answer submission does), ignoring `skipRendererUpdate`. That pushed the renderer mid-loop while the section's aggregated `creditAchieved` was at an intermediate partial value, so feedback gated on a partial-credit condition flashed and then disappeared. The renderer fan-out now honors `skipRendererUpdate`; normal single submissions still render via their trailing `triggerChainedActions` flush.
