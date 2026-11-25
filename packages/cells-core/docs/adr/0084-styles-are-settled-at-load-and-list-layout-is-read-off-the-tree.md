# Styles are settled at load, and a list item's layout is read off the tree

Status: proposed 2026-11-25. From sweep 4 (styles and layout props). Decides
how the cells core reads `<styleDefinition>`, `<stylePalette>`,
`styleNumber` and `selectedStyle`, a division's heading colors and open
state, where a list item's number lines up, and a `<graph>`'s scales.

## Context

The current core keeps a style map per sectioning component
(`authoredStyleDefinitions`, `style.ts`): the default palette (six
presets), or a `<stylePalette>`'s, or the parent section's map, with each
`<styleDefinition>` among its children (or in its `<setup>`) applied over it
in document order. A definition's missing dark-mode colors are derived from
its light ones (`colorAccessibility.ts`: lightened until they clear WCAG
contrast on the dark canvas, or a text and background color inverted), and
its missing words from its values (`colorWords.ts`: the nearest named
family by CIEDE2000). A component's `styleNumber` is its own attribute,
else its parent's or its source composite's, else 1; its `selectedStyle` is
the map's style for that number (cycled through a selected palette, else
the defaults), with the component's own marker, line and fill override
attributes over it. The contrast diagnostics are read off each map. A
section's heading colors follow the same pattern (`sectionTitleColors.js`).

The cells core read `styleNumber` as presentation and had no
`<styleDefinition>`: the viewer kept its own six styles. The user decided
(sweep 4): style definitions are settled at LOAD into a table of
constants, and `selectedStyle` and `styleNumber` read that table;
`setStyleOverrides` and the `styleOverrides` option stay unsupported.

The current core also passes a list item's "lead" down a chain of state
variables (`listItemChild.ts`): an `<li>`, or a section that is an
untitled list item, picks its first child that renders; a wrapper, an
`<answer>` or a `<sideBySide>` forwards it on; the component it reaches
says where the item's number sits. It follows each child's own `hide`.

## Decision

1. **A style table per scope, settled from the source** (`style/`). Before
   anything is planned, the compile walks the DAST (`style::settle`): the
   root and each element whose type is a `style_scope` (the document, a
   section, an aside, a proof) gets the table its own `<styleDefinition>`s
   and `<stylePalette>`s make (among its children, in a `style_holder`'s:
   a `<setup>`, a `<styleDefinitions>` in it), over its parent scope's, as
   `authoredStyleDefinitions` merges them. A scope with none shares its
   parent's table. The values are literals; a reference is warned about and
   ignored, since the table holds no cell. The flags (`style_scope`,
   `style_holder`, `style_definition`, `style_palette`) are declarations, so
   the walk names no type.
2. **Colors as `colord` computes them** (`style/color.rs`): parsing (hex,
   `rgb()`, `hsl()`, `lch()`, the CSS names), HSL and Lab with `colord`'s
   rounding, WCAG contrast after compositing, the dark-mode derivations, and
   the color word, checked against values recorded from `colord` and
   `@doenet/utils` (`color.test.rs`). The built-in palettes are data
   generated from `@doenet/utils`' expansion (`style/palettes.rs`).
3. **A component's style is read, not stored** (`document/styles.rs`):
   `Document::style_number` is the nearest of the component and its
   referents that writes `styleNumber` (a cell, when its type has one, else
   the literal attribute), else its parent's, else 1;
   `Document::selected_style` is the style that number names in the table of
   the component's nearest scope ancestor, with the override attributes its
   type declares as presentation (marker on a point; line on a line, a
   function, a parabola; line and fill on a polygon, a curve, a circle;
   fill on an angle) over it, every key as JSON. The wasm exports both; the
   parity adapter reads `styleNumber` and `selectedStyle` of any type.
4. **The contrast diagnostics are the compile's** (`doenet-a0007`,
   `a0008`, `a0009`), each at the latest `<styleDefinition>` that wrote a
   value it reads, deduplicated across the scopes that inherit a table.
5. **A division's heading colors are settled with the tables**
   (`style/headings.rs`): per completion state, its own color, else
   (dark mode) one derived from its own light color, else its parent
   division's, else the default, with the `doenet-a0006` diagnostics of
   those an author wrote on a boxed or collapsible division. Its
   `collapsible` is a flag (an aside and a proof are collapsible by
   default, the declaration `collapsible`), and it is `open` while not
   collapsible, else by its own state, `startOpen` at first, which the
   bridge's `revealSection` and `closeSection` write.
6. **A list item's layout is read off the tree** (`document/list_items.rs`):
   a type declares the part it plays (`list_item: Item`, `Section`,
   `Wrapper`, `Answer`, `Panels`, `Top`, `Choices`, `Baseline`, `Naming`,
   `Title`; `ListItemRole`), and the document reads the chain when asked
   (`list_item_targets`, `renders_inline_for_list_item`,
   `list_item_inline_alignment`, `first_child_list_item_alignment`,
   `first_visible_child`), a child rendering when its type is drawn and it
   does not hide itself. It is presentation computed from the tree and the
   `hide` cells, so it follows a `hide` a tick changes with no cell of its
   own, as the display settings are (ADR 0071).
7. **A graph's scales are props.** `xScale` and `yScale` are `xmax - xmin`
   and `ymax - ymin` through a new vector operator, `VecOp::Span`, whose
   inverse keeps the midpoint and moves both ends, refusing a scale that is
   not finite and positive. With `identicalAxisScales` and an
   `aspectRatio`, the graph's planner wires each range the author left out
   from those given and the ratio, as `Graph.js` does (which were given is
   known when planning); without an `aspectRatio`, the ratio is
   `xScale / yScale`. A graph inside a graph has its parent's ranges. The
   ranges also answer to the current core's names (`$g.yMax`).

## Consequences

- `styleContrastAccessibility.test.ts` passes but for its numeric `ratio`
  argument (the core's diagnostic arguments are text); `styleOverride`,
  `stylePalette`, `lists`, `sectioning` and `graph` read the new values.
- A graph has three more props (28 more instructions in the golden set,
  all dead); a division four (7 more, dead; its open state the reader's,
  so essential).
- The normalizer's synthesized `_dynamicChildren` inside a `<graph>` is no
  content of an extend (`Reader::is_blank`), as outlining already passed it
  over, so a graph planned by its function copies as before.

## Not done, and why

- **A `styleNumber` given by a reference.** No type declares a
  `styleNumber` cell yet; the reader would take one (`own_style_number`).
  Today such an attribute is the presentation it was.
- **The style descriptions** (`styleDescription`, `textColor`, ... as text
  a reference reads) and the theme: they need text made from the table per
  style number, which a reference may change.
- **The renderer.** The cells viewer keeps its own six styles; sending it
  `selectedStyle` is a viewer change.
- **Reader overrides** (`setStyleOverrides`, `styleOverrides`): out of
  scope, as decided.
- **A graph's `grid`, `xLabel` and `addControls`**, and the layout of
  `<sideBySide>` (`width`, `margins`) and `<tabular>` (`halign`, borders,
  `colSpan`): open; see the sweep's report.
