---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix the German and Russian style descriptions that were inflected for the wrong position, and add Portuguese, Turkish, Polish, Hindi and Amharic catalogs.

Style descriptions handed adjectives one token, the gender of the noun they describe. That is enough while a phrase is rendered in one place, but three of them are rendered in two — a border's adjectives, the background colour, and the text colour beside it — and a language that inflects for case needs a different form in each. German and Russian had one token to spend, so each fork came out right in one position and wrong in the other:

- `borderStyleDescription` read `dicken` and `толстой` instead of `dicker` and `толстая`
- `textStyleDescription` read `roter auf gelber Hintergrund` instead of `rot auf gelbem Hintergrund`, and `красный на жёлтый фоне` instead of `красный на жёлтом фоне`

Descriptions now carry the syntactic position alongside the gender, so a catalog can select on both. A language with no case ignores the new argument, so English, Spanish, French, Italian, Dutch, Chinese, Japanese, Korean, Vietnamese, Indonesian, Somali and Hmong Njua are byte-identical.

Five catalogs join, each covering all four namespaces. Portuguese is Brazilian, which is what a bare `pt` means; `pt-AO` and `pt-MZ` reach it too, and a European `pt-PT` could be added later without disturbing it. Its border is feminine where Spanish's is masculine, so the border clause reads `com uma borda grossa`. Turkish inflects none of this — its suffixes attach to the noun rather than to the adjectives in front of it — and a noun counted by a numeral stays singular.

Polish and Hindi are the two that needed the new argument. Polish style words land in three different cases, so from one set of words it now renders `grube`, `z grubym obramowaniem` and `czerwony na żółtym tle`. Hindi's marked adjectives — the ones ending in -ा — take the oblique before a postposition, so a border reads `मोटा` alone and `मोटे किनारे के साथ` in the clause, while unmarked ones like लाल never change.

Amharic is written in the Ge'ez script, which runs left to right, so it needs none of the right-to-left support DoenetML lacks. It leaves the element and anion names untranslated, as Somali and Hmong Njua do and for the same reason — there is no settled Amharic chemical nomenclature to seed from — so those names fall back to English and `lint:i18n` reports the gap.

Like the others, every one of the five is an **unreviewed machine-generated seed** and says so in every file's header.
