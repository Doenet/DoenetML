---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

New `<timer>` component: a countdown of `duration` seconds that shows the time left (as `1:30`, or in whole seconds with `format="s"`), with Start/Pause and Reset buttons beside it (`showControls="false"` hides them). The clock follows real time rather than the screen, so it keeps the right time in a background tab, and by default (`reloadBehavior="continue"`) it keeps counting while the page is closed, so reloading neither pauses nor restarts it; `reloadBehavior="reset"` returns it to the full duration on every load. Its `timeRemaining`, `elapsed`, `expired`, `paused` and `text` properties can be referenced, and `running` can also be set to start or pause it. An action with `triggerWith` on the timer runs once, when time runs out, and not when the timer starts or pauses. Its actions are `start` (which starts over after time has run out), `pause`, `reset` and `restart`. `autoStart` starts it once, the first time the page loads. A screen reader announces only when time runs out, not each second.
