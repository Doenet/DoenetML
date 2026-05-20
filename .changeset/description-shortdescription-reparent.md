---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Re-parent `<description>` and `<shortDescription>` to appropriate base components, removing irrelevant inherited attributes.

`<description>` previously extended the scored-section base used by `<div>`, exposing attributes (`aggregateScores`, `weight`, `sectionWideCheckWork`, `showCorrectness`, `colorCorrectness`, `forceIndividualAnswerColoring`, `submitLabel`, `submitLabelNoCorrectness`, `displayDigitsForCreditAchieved`) and properties (`creditAchieved`, `percentCreditAchieved`) that have no meaning for a description. It also appeared as a valid generic block child everywhere in the schema, causing spurious autocompletion. It now extends `BlockComponent` and is schema-valid only where a `description`/`descriptions` child group is declared.

`<shortDescription>` previously extended `<text>`, exposing graph-placement attributes (`draggable`, `layer`, `anchor`, `positionFromAnchor`) and `isLatex`, along with `math`/`number` adapters — none of which apply, since a `shortDescription` is never visually rendered. It now extends the non-graphical inline base used by `<title>`. Its accessibility diagnostic that warns when a short description contains math is rewritten to inspect the inline children directly.

The dropped attributes are registered as deprecated-and-ignored in the DAST deprecation registry (#1144), so existing documents that used them produce a warning instead of an "invalid attribute" error.

`<blockQuote>` gains `canDisplayChildErrors` and `includeBlankStringChildren` to match the other arbitrary-content block containers (`<description>`, `<p>`, `<div>`): blank-string children between inline children are preserved, and a child component that is an error renders its error inline.
