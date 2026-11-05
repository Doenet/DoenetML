---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Saved reader state is keyed by an identifier a rebuild reproduces, so a reload no longer restores values into the wrong components.

Saved state is keyed by each component's `stateId`, which for most components was simply its position in the build. Two things made that position move between builds of the same document:

- An element's attributes were walked in the iteration order of a Rust `HashMap`, which Rust deliberately randomizes. The indices minted along that walk went to the components built from the attributes, so `<point x="0" y="1" />` handed `x` and `y` different identifiers from one build to the next. A point the reader had dragged came back with its coordinates swapped roughly a third of the time — silently, with no error. Attributes are now walked in the order they were written.
- `<sort>`, `<shuffle>` and `<collect>` were the only composites that did not give their replacements an identifier of their own, so those also fell back to a build position. They now mint one the way every other composite already does.

Any element with two or more attributes that become components could have its saved values swapped this way; a point is simply the case where a reader can see it.

Reader state already saved under the old identifiers is not migrated. In practice there is nothing to migrate: the identifiers that move are exactly the ones that were never assigned reliably.

Closes #1944.
