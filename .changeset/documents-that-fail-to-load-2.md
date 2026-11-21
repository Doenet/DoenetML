---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Two more kinds of document that failed to load now load (DIAG-5).

- **A `<document>` with an attribute it doesn't have loads.** `<document foo="bar">` and `<document uniqueVariants="false">` failed with an internal error, because the error for an unknown attribute replaces the component it is on, and the document can't be replaced. The attribute is now ignored, with that error (`doenet-e0004`) marked at the attribute, and the rest of the document renders. A repeated attribute on the `<document>` is the same: `doenet-e0003` at the second one, and the first is kept.
- **A composite before a section can read the section's number.** `<conditionalContent>`, `<select>`, `<repeat>` and other composites written before the section `s` that read `$s.sectionNumber` (or `$s.title`) stopped the document with a circular dependency, because the section's number waited for every composite before it to expand, in case it made more sections.
  - A composite that, by the DoenetML, can't make a section is no longer waited for: one whose cases, options or template hold no section, and whose references can't bring one, a `<collect>` of a tag that is no section (`<collect componentType="p">`), or a reference to a property, such as `$pg.vertices` of a polygon whose vertex reads the number. The document loads, with the section numbered among the sections before it. Nor is one written as a section, such as `<section extend="$r[$s.sectionNumber]"/>`, which makes exactly one and is counted as one.
  - One that may make a section, such as `<repeatForSequence to="$s.sectionNumber"><section/></repeatForSequence>`, is a genuine cycle. It is now found at load: the reference is a circular-dependency error (`doenet-e0005`) where it is written, and the rest of the document renders. So is a `<collect>` before the section that collects from such a composite after it, and a reference before the section into a composite after it that reads the number to expand, or into an iteration of a repeat holding such a composite (`$cc.hidden`, `$r[1]`), as the reference waits for it to expand. A reference to an item whose content only shows the number still loads, whether by index (`$r[1]` of a repeat of `<p>see $s.sectionNumber</p>`) or through a name in the cases of a `<conditionalContent>` or the options of a `<select>` (`$cc.q`, `$sel[1].q`). This also covers a `<part>` in a `<problem>`, a `<problem>` in `<problems>`, the number of a section inside `s`, and composites in a `<div>` before the section.
