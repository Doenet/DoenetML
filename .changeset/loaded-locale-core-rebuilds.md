---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Stop a language switch from discarding the reader's work, and give a nested `<document lang>` the catalog it needs.

Two problems with loading catalogs on demand, both invisible while every language in use was inlined.

Changing `uiLocale` rebuilt the core. The catalogs for the reader's chrome and for the document's content live in one map, and the core was rebuilt whenever anything in that map changed — so a reader switching language pulled down a chrome catalog the core never reads, and lost every answer they had typed. The rebuild is now gated on the catalogs the core actually renders from: the content's. Switching the reader's language re-translates the chrome in place, as it always did for a language that happened to be inlined. The gate reacts only to a catalog *arriving*, so an activity whose `<document lang>` disagrees with the host's `documentLocale` — or a host that changes `documentLocale` mid-session — builds its core once rather than twice.

A nested `<document lang="es">` inside an activity written in another language never had its catalog requested, so its subtree rendered in English however long you waited. The languages a source declares are now read from the source itself, which is where an author wrote them — so the catalog is on its way before the core is built, rather than after the core has already computed that subtree's prose. `lang` takes a plain string and nothing else, so reading it this way finds every language the core could have rendered in. The exception is content that is not in the source yet: a `<document lang>` inside DoenetML pulled in by an external reference still falls back to English until the core is rebuilt with its catalog on hand.

Both applied to every language that is not inlined, which today is every language but English.
