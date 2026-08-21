---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Let the contention-aware watchdog reach a document's first boot attempt.

The page-wide handshake count is cached and refreshed in the background, so every reading is answered by the refresh before it — and a realm's first handshake has none. Its first attempt therefore sized itself as though it were the only boot on the page, and the contention-scaled budget only took effect from the first retry. That inverts the intent: the widening exists for a page where many activities boot at once, and a fresh iframe on such a page is exactly the attempt it never reached.

The census seat a boot already takes now reports the count it was granted against, read from inside the grant. That reading arrives a few milliseconds after the handshake starts, so the watchdog widens its deadline in flight rather than anything waiting for the count — the boot path gains no suspension point and no extra lock operation. A later reading only ever grants more time, never less, and an explicit `doenetGlobalConfig.coreHandshakeWatchdogMs` still wins outright. A timeout on that first attempt is now attributed to the page it actually ran on, so it comes back with the busy-page wording rather than an unexplained error.
