---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A YouTube video watched all the way through now gives a `fractionWatched` of exactly 1, so credit awarded for watching it, including through `<answer type="videoWatched">`, reaches 100%. Watching without pausing used to leave it a fraction of a second short, such as 0.9993, because only the start of a segment was rounded to the beginning of the video, never also its end.

`fractionWatched` now also counts the video as fully watched when the part left unwatched is at most 2 seconds and at most 1% of the video, never exceeds 1, and is 0 rather than `NaN` or `Infinity` before the video's duration is known.
