---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Save a reader's most recent work when the page goes away, not just when the viewer unmounts.

The core throttles its state reports to a host at sixty seconds, so a host's copy of a reader's work can be a minute behind what is on screen. That was fine while every departure ran through the viewer's unmount, which flushes — but a page can go away without unmounting: the tab is closed, a new URL is typed, an external link is followed, a backgrounded mobile tab is discarded. A React effect cleanup runs for none of those, and up to a minute of answers could be lost. Documents that keep no local copy — the default for embeds, and what a graded assignment on doenet.org uses — had nothing to fall back on.

The viewer now flushes whatever the throttle is holding back when the page hides, on both `pagehide` and a `visibilitychange` to hidden (a backgrounded tab can be discarded without firing anything else). The work reaches the host through the ordinary state-report channel, so a host saves it exactly as it saves a routine autosave.

Getting the payload out in time is the whole difficulty: `pagehide` can end the document as soon as the handler returns. That is no budget for a round trip into the worker that holds the state, so the core now mirrors each throttled payload out to the page as it is built and the viewer keeps it in hand. Nor is it budget for a posted message, which only queues work an unloading document is destroyed before it does; the report is delivered to a host's listeners directly instead, in the same shape a posted one arrives in. Nothing is torn down on the way, so a page that comes back — returning to a backgrounded tab, or a back/forward-cache restore — carries on with its core intact and its work already saved.
