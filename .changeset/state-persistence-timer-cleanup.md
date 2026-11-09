---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Worker: state saves no longer leave timers behind. A submission's immediate save now cancels the one-second save debounce an edit just before it had armed, instead of dropping its handle and letting it fire a second, redundant save a second later. Terminating a core now clears the save debounce and the 60-second database throttle its final save arms, and arms no new ones, so a terminated core is no longer kept in memory by its own timers and a Node process that runs many cores can exit.
