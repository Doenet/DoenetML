---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Load large documents faster by no longer recomputing every component's name each time a composite expands.

Each time a composite such as `<repeat>` or a copied `<module>` expanded, the document recomputed the name of every component and sent the whole list from the Rust core to JavaScript. Loading a document triggers many expansions, so this cost grew with the square of the document's size. It took about a quarter of the load time for a page with four 50-point dot plots. Now only the names that change are sent, and when components are added, only the new components' names are found. On that page, the time spent on names fell from about 5.8 s to under 0.1 s.

Closes #2023.
