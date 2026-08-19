---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Size the core-worker watchdog to the contention it actually faces.

An Active Calculus reader on a 2020 dual-core MacBook Air saw every Doenet activity in a Runestone section fail with "The document viewer could not be started". The handshake budget was a fixed 15 s, measured on developer hardware where the handshake "stays bounded under CPU pressure". On that machine it is not bounded: a page starting many documents at once pushes a perfectly healthy handshake past 15 s, and the watchdog then makes the document unloadable on exactly the contended machines the guard exists for.

The budget now scales with handshakes-per-core, read page-wide from a shared Web Lock that every realm mid-handshake holds, and is capped so a genuine hang is still recovered from. The census gates nothing and is independent of any boot scheduling, so it works on pages whose host schedules boots itself — which is where cores can share a worker thread and contention matters most. `doenetGlobalConfig.coreHandshakeWatchdogMs` still overrides the budget outright, for a deployment whose handshake is slow for reasons contention cannot explain (one using `fetchExternalDoenetML`, say).

Retries back off exponentially with jitter instead of re-piling a fresh multi-MB worker 250 ms after one just failed, which was positive feedback exactly when the machine could least afford it.

A timeout on a demonstrably contended page no longer reports the worker as wedged. In shared-core mode that suspicion quarantines the host worker, killing cores that belong to other documents which were merely slow.

A failure attributable to contention now says so — that the page was starting several documents at once, and may take longer on a slower device — instead of presenting an unexplained error. The general failure message is reworded to match: "This document could not be started", where it said "The document viewer could not be started".
