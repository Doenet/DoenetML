---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A mistake in one element no longer blanks the whole document.

- An index into a list that is empty or short right now renders as nothing and
  fills in later, instead of stopping the page. `$myList[$myChoices.selectedIndex]`
  before anything is selected is the common way to meet this.
- A `<function>` whose formula cannot be differentiated reports no extrema, and
  `<derivative>` of one gives an empty derivative, rather than the document
  failing to build. `<function><math>1</math><numberList>3 1 2</numberList></function>`
  is one such formula.
- A `<select>` builds when a `<setup>`, `<sort>` or `<collect>` sits beside its
  options. For a `<select>` of plain `<option>`s, which option a seeded activity shows
  is unchanged. Where the extra child itself contains something that produces variants
  — a `<select>` inside a `<setup>`, say — seeded selection used to give up and fall
  back; it now works, so such an activity can show a different option than before.
- `<substitute>` reads its `type` the same way everywhere. `type="TEXT"` and
  `type=" text "` are the `text` they look like, and a value the element cannot
  use — misspelled, or empty — is reported once, saying what it was treated as,
  instead of twice with two different answers and a blank page.

When a document genuinely cannot be built, the failure now says what broke
instead of offering a retry and a reload that cannot help.
