---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

**Breaking:** a reader's saved state is keyed by where a component sits in the document, and state saved by 0.7 is not read.

Saved state was keyed by each component's index in the build. An index is a position in the build, so it moved whenever anything ahead of it changed — and a reader's values then came back on the wrong components, silently. Adding a paragraph above a graph was enough: a point dragged to (3, −5) reloaded at (−5, 1).

Every component a reader can put work into now carries an identifier derived from the document instead:

| what | key |
| --- | --- |
| a named component | `~P`, hung off the nearest *named* ancestor, so unnamed wrappers between them do not matter |
| an unnamed component | its position under its parent |
| a component built from an attribute | `@x`, `@y` — **by attribute name** |
| a composite's replacement | its composite's key, plus which replacement it is |
| a component Doenet inserts to adapt another to where it was written | the adapted component's key, plus which adapter it is |

Keying attributes by name is what closes the last of #1944: `x` and `y` can no longer be handed each other's identifiers, whatever order they are visited in. Hanging a named component off its nearest named ancestor is what lets an author edit elsewhere in a document without discarding the work readers have already done in it.

That last row is worth spelling out, because it is the one a reader can see. A component written where its own type does not fit is shown through one Doenet inserts to adapt it: a `<boolean>` put in a `<graph>` is drawn as a piece of text, and a piece of text in a graph is something the reader can drag. Where they drag it to is their work, and it is saved. Doenet builds that stand-in while the document runs rather than while reading it, so until now it fell back to a build index — and a paragraph added above the graph put the label back where it started. It is now keyed by the component it stands in for.

Two consequences worth stating plainly:

- **Reader state saved by 0.7 is not read by 0.8.** The keys no longer denote the same components, and 0.7's keys were not assigned reliably enough to translate. A reader with an attempt in progress at the upgrade sees that document open fresh. Credit already recorded is unaffected — score is reported separately from state.
- An author *renaming* a component still discards the state saved under the old name, as does any other edit to the document text, because saved state is already gated on a hash of that text.

One piece of dead code went with it. When an update named a component that was not in the tree, `EssentialValueWriter` filed the write against that component's index, to be replayed when it appeared. Nothing replayed it — the map it went into is drained by the new identifier, and the two only ever coincided while that identifier was the index. Nor was there anything to replay onto: every index in such a batch is read off a live component, so the situation the code described could not arise. It now reports a broken invariant on the console and moves on, so that if it ever is reached we hear about it instead of writing to a key nothing reads.

Refs #1944, #1947.
