---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Viewer: don't stay permanently blank when the browser reports the not-yet-rendered viewer as off-page.

The viewer starts hidden and unhides once an IntersectionObserver sees its
wrapper on the page (a guard that keeps JSXGraph from initializing while
actually hidden). But while hidden the viewer renders nothing, so the observed
wrapper has zero height — and some browsers (observed in branded Chrome 149,
with activities embedded in a same-origin iframe as in PreTeXt books) report a
zero-area target as non-intersecting even with the observer's huge rootMargin.
The viewer then deadlocked as a silent blank box: hidden ⇒ zero height ⇒
reported off-page ⇒ stays hidden.

A zero-area element that still generates a layout box cannot meaningfully be
off the page, so it now counts as on-page; `display: none` — the state the
guard exists to detect — generates no layout boxes and still keeps the viewer
hidden.
