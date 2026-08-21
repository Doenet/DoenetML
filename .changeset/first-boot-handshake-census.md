---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Let the contention-aware watchdog reach a document's first boot attempt.

The page-wide handshake count is cached and refreshed in the background, so every reading is answered by the refresh before it — and a realm's first handshake has none. Its first attempt therefore sized itself as though it were the only boot on the page, and the contention-scaled budget only took effect from the first retry. That inverts the intent: the widening exists for a page where many activities boot at once, and a fresh iframe on such a page is exactly the attempt it never reached.

The census seat a boot already takes now reports the count it was granted against, counted from inside the grant — the boot path gains no suspension point, and the count rides on a lock operation that was happening anyway. Taking a seat is as quick as it ever was; the figure follows a moment later and moves a deadline that is already running, so nothing waits for it. A later reading only ever grants more time, never less, and an explicit `doenetGlobalConfig.coreHandshakeWatchdogMs` still wins outright. A timeout on that first attempt is now attributed to the page it actually ran on, so it comes back with the busy-page wording rather than an unexplained error.
