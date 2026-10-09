---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

New `<drill>` component for timed practice. Its contents are a template for one question. After Start, the drill asks the question, checks the answer, briefly shows whether it was right, and then asks again with new random values. It stops when `numRequired` questions have been answered correctly or when `timeLimit` seconds have passed; Try again begins a new attempt with new questions.

Each round is a new copy of the template, so `<select>`, `<selectFromSequence>` and `shuffleOrder` inside it choose again, the same way for the same variant. Names in the template are local to the drill. `wrongAnswerBehavior="retry"` stays on a question until it is answered correctly.

The drill is scored as one item, with credit 1 once an attempt succeeds; the answers inside it don't count on their own. `maxNumAttempts` limits the number of attempts. Its `phase`, `numCorrect`, `numAnswered`, `bestNumCorrect`, `attemptNumber`, `roundNumber`, `timeRemaining` and `expired` properties can be referenced, and `triggerWith` on the drill runs when an attempt ends. The clock keeps counting across a reload, and an answer checked after the deadline doesn't count.
