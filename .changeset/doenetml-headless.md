---
"@doenet/doenetml-headless": patch
---

New package, `@doenet/doenetml-headless`: runs DoenetML in plain Node, with no browser. `gradeState(doenetML, variantIndex, savedState)` loads a state the viewer reported and returns, per answer, the credit recomputed from the stored inputs (`creditAchievedIfSubmit`) beside the stored `creditAchieved` and `numSubmissions`, and the document's own credit; it refuses a state in another `data_format_version`, or written for another document source, variant or (when one is given) attempt. `check(doenetML)` returns every diagnostic (errors, warnings, infos and accessibility), the answers with their stable keys and those without one, and the number of variants. `setInput` and `submit` drive inputs with raw values (LaTeX for a `<mathInput>`, choice positions for a `<choiceInput>`, and so on) for tests and content checks. A `doenet-headless` command runs `check` and `grade` from the command line.

The result of `gradeState` is the credit the document assigns to the stored state, not evidence of what the student did: the state comes from the student's browser and can be changed there. See the package's README.

Closes #2499.
