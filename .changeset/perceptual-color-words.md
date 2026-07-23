---
"@doenet/utils": patch
---

Improve the hex/rgb-to-color-word algorithm used for style descriptions.

`resolveColorWord` (used to name colors in core-computed style descriptions such
as "thick red line") previously matched inputs against curated anchors using raw
RGB Euclidean distance, which misnamed many author-supplied colors that were
nowhere near an edge case — e.g. `#0072b2` (blue) became "cyan", `#c22047`
(crimson) became "brown", and `#a99d96` (warm gray) became "yellow".

Matching now happens in a perceptual space: near-neutral (low-chroma) colors are
classified as black/gray/white by lightness before any hue matching, and the
remaining colors are matched against the anchors using the CIEDE2000
color-difference metric. A few gap-filling anchors (crimson, wine, mid/sky blue,
mid cyan, muted purple) were added. Because color words feed the accessibility
descriptions read by screen-reader and colorblind users, this makes those
descriptions substantially more accurate for author-supplied colors.

The built-in palettes previously pinned explicit `*Word` descriptors to work
around the old matcher. With the improved matcher, 221 of those overrides are now
redundant (the matcher derives the identical word) and have been removed; every
palette's fully expanded style definitions still resolve to the identical color
word for every key (the only difference is key ordering, irrelevant for a
field-keyed object). The
overrides that remain are those where the canonical twelve-word vocabulary is too
coarse for the intended name (e.g. "olive", "teal", "gold", "indigo", "magenta")
or where the matcher rounds a borderline hue to a neighbouring family.
