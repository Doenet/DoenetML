---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Stop reporting the core's broken invariants as diagnostics.

Fourteen messages raised when something inside the core does not add up — a
state variable that should exist and doesn't, an array index past the end of
its own array, a parent that vanished before its children were added — no
longer reach the diagnostics list. They name state variables and component
indices, never anything in the document, and there is nothing an author can do
about one. They are now plain English lines on the console, worded exactly as
before.

Two of them named something an author had written, and those become translated
warnings that say only that part: an index that cannot be applied now reads
``Cannot reference index `$p.styleDescription[1]` ``, and a `<callAction>`
whose `actionName` the target does not have now reads
``Cannot call submitAnswer on component `$p` `` rather than quoting a component
index no author has seen.
