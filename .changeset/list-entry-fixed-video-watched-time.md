---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A reference to one list entry written among the children of a list, a `<sort>` or a `<shuffle>` (`<mathList>$ml[1] $ml[2]</mathList>`, `<sort>$ml[1]</sort>`) now makes an entry that is fixed, and fixed in place, when the entry it references is, for every list type, as a `<pointList>` already did. So is a list holding such a list (`<sort>$l2</sort>`, `<mathList extend="$l2"/>`), and an entry that references a property (`$P.x` of a fixed point), an entry of a `<sequence>` or an entry of a fixed list.

A YouTube video's watched time is no longer lost when the browser polls the player late, as it does in a background tab, or when the video plays faster than normal speed: a change of position is counted as a seek only when it is more than the video could have played in the time since the last poll. A seek the player reports no event for is now recorded, rather than counted as watched or dropped. A video whose player reported a duration of 0 when it became ready now takes the duration it reports later, so its `fractionWatched` is no longer stuck at 0, and a positive duration already known (taken from playback on an earlier visit) is not replaced by a ready report of 0. When the video's source changes, its `duration` is cleared along with its watched time, until the new video reports one.
