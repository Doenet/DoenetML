---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: give each autocomplete suggestion a meaningful, color-coded icon in the dropdown's left column.

CodeMirror renders that icon from each completion's `type` string, and the editor was passing the lowercased LSP `CompletionItemKind` name straight through. That left the column showing accidental glyphs — a box for components, a union sign (`∪`, easily misread as a stray "u") for attributes — and nothing at all for snippets, attribute values, and references, since those `type` names aren't in CodeMirror's built-in icon set.

Completions are now assigned distinct, intentional types and a small theme defines a colored glyph for each DoenetML category: components (`◈`), attribute names (`=`), attribute values (`"`), references (`$`), reference properties (`.`), and snippets (`❏`). Components, reference properties, and closing tags share one LSP kind (`Property`) but are split apart for icon purposes using signal the items already carry — no LSP `kind` values change, so the language-server output and its tests are unaffected.
