---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
---

Number the pages of a book the way PreTeXt does.

- A new `numberingPrefix` flag lets the hosting page set a prefix for the numbers a document shows, without editing it. With `flags={{ numberingPrefix: "3.2" }}` (or `data-doenet-numbering-prefix="3.2"` on the standalone container), figures and tables read "Figure 3.2.1" and "Table 3.2.2", numbered equations "(3.2.1)", and refs to them say the same. It's meant for a page of a book whose place is section 3.2. The default, `null`, means no prefix, so documents look as before.
- A new `blockNumbering` attribute on `<document>`. With `blockNumbering="document"`, examples, definitions, notes, theorems and problems that aren't items of a list are numbered through the whole document, on the same count as figures and tables ("Example 3.2.1", "Figure 3.2.2", "Example 3.2.3", with the prefix above). The default, `"division"`, keeps numbering them among the divisions beside them, starting again in each section. Sections, and the items of `<problems>`/`<exercises>` lists, are numbered as before.
