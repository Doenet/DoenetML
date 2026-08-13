---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Show one `<cascadeMessage>` at a time in a `<cascade>`.

A `<cascadeMessage>` nested inside a section was shown by every held-back
section at once, so a cascade of three problems displayed "finish problem 1"
and "finish problem 2" simultaneously — one of them describing a step the
learner cannot see the point of yet. A message now shows only while its section
is the *next* one, the one that becomes visible as soon as the current section
is completed; sections further down show only their number and title, as a
held-back section with no message of its own already did.

Where an author has put messages in both places, the two placements now
negotiate rather than both appear: a section's own message is the more specific
of the two, so when the next section has one, it is shown and the `<cascade>`'s
own `<cascadeMessage>` children stay hidden for as long as it is. A cascade's
own message continues to serve every gap that the next section does not cover
itself.
