---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Remove two unreachable plural branches from the Khmer catalog and stop any
catalog from gaining another.

Khmer has a single plural category, so the `[one]` branches in its
`attempts-remaining` and `answer-show-responses` could never be selected. Both
were byte-identical to the default beside them, so nothing rendered
differently; what changes is that the dead text is gone.

`lint:i18n` now fails on any catalog that names a plural category its own
locale cannot select — whether because CLDR gives the locale no such category,
or because CLDR has no data for the tag at all and the branch would be chosen
by the runtime's default language.
