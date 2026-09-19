---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/v06-to-v07": patch
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
  options. Which option a seeded activity shows is unchanged.
- A misspelled `type` on `<substitute>` is reported once, saying what the value
  was treated as, instead of twice with two different answers and a blank page.

When a document genuinely cannot be built, the failure now says what broke
instead of offering a retry and a reload that cannot help.
