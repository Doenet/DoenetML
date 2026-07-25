---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Translate the viewer's own interface, and ship Spanish.

Buttons, panel headers, and screen-reader announcements — "Correct", "Response Saved", "Max credit available: 80%", "1 attempt remaining", "Show footnote", the solution panel's "(click to open)", the "This document contains errors!" banner, the matrix input's row and column controls, the ⓘ tooltip on an input's description, the virtual keyboard's labels — now come from message catalogs instead of being written into the code. Setting `uiLocale="es"` (or `data-doenet-ui-locale="es"` on a standalone container) renders all of it in Spanish, with no other configuration. An activity that declares `<document lang="es">` gets the Spanish interface automatically, since the interface follows the content's language unless a host says otherwise.

Counts are pluralized by the rules of the language being rendered rather than by English's, so Spanish says "queda 1 intento" and "quedan 2 intentos" where English says "1 attempt remaining" and "2 attempts remaining".

Hosts can supply their own catalogs through `localeResources` to add a language or correct a bundled translation. With no locale configured, the interface is unchanged.
