---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: keep suggesting a hyphenated snippet name across its hyphens.

Nine of the ten completion snippets have hyphenated names, and the menu emptied on the hyphen: typing `<answer` offered `answer-labeled`, and typing the `-` that comes next offered nothing at all. The same happened to `<multiple-`, `<table-`, `<video-` and `<if-`. The suggestions now survive the hyphen, so a snippet can be reached by typing its name straight through.

More generally, a tag name is now recognized as one whatever character it ends on — `.` and `:` behaved like `-` — so the context-help panel no longer describes the enclosing element while a name is being typed.
