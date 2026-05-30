---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Improve the editor's context-sensitive help and make Ctrl+Space work between tags.

- Component help now leads with the component name and its one-line summary on a single line, and the `<tag>` name is a link to the component's reference page (the footer link stays too).
- Reference help for `$name` and `$name.property` now explains what a reference is and links to a new References page, rather than showing the referenced component's summary and page. The help is identical wherever the cursor sits in a `$a.b` chain — the whole reference is treated as one unit. A cursor on a reference inside an attribute value (e.g. `extend="$m"`) now gets reference help rather than help for the enclosing attribute.
- An invalid reference like `$bad` (or a failing member chain like `$m.sub` or `$s2.m`) now explains the problem — "No referent found" or "Multiple referents found" when the resolver can say so definitively, and a hedged message when it can't — instead of falling back to the default panel text. The message is reported against the whole reference and is the same wherever the cursor sits in the chain, including inside attribute values like `copy="$s2.m"`.
- When the cursor is in an element's body or in empty top-level space, the panel now surfaces a short list of components to try (instead of going blank), and points to Ctrl+Space for the full list. The same shared ranking — per-container hand-picks (including ones keyed by an abstract ancestor like `_sectioningComponent`) first, then a global "favorites" tier, then how directly the child is allowed (adapter-only children dropped unless picked), with alphabetical as the tiebreak — also drives the autocomplete dropdown's order, so the two surfaces stay in lockstep. Snippets cluster with their element in the dropdown.
- Containers that take no children (e.g. `<variantControl>`) or only text now say so plainly instead of inviting Ctrl+Space; containers that accept both text and components note that text is allowed.
- Pressing Ctrl+Space between tags (or in empty top-level space) now opens the element-completion menu and inserts the leading `<` for you; previously you had to type `<` first. The cursor position right between adjacent open and close tags (e.g. `<mathInput>|</mathInput>`, where the autocompleter parks the cursor after inserting a tag pair) is now recognized as the body rather than as the tag itself.
- Adds a References page to the documentation covering `$name`, `$name.property`, and referencing repeat iterations.
