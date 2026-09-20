# Nahuatl viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Central Nahuatl, in the orthography Mexico's SEP and INALI
# materials use. That is a written standard over a wide spread of varieties — a
# Huasteca or a Guerrero reader will want their own — so it is the `locales/sc`
# case: a deployment wanting one supplies its own catalog as `localeResources`
# rather than correcting this one toward it sentence by sentence.
#
# Where Nahuatl has no term, the Spanish loan Nahuatl-language school materials
# actually use is written rather than a coinage. That is a decision about
# register; a purist correction is a legitimate correction, and this note is here
# so whoever makes it knows which they are making.
#
# **`nah` is the first locale in the roster that CLDR has no name for in either
# language.** `supportedLocales.ts` asks `Intl.DisplayNames` for the name in
# English and in the language itself, and gets the tag back both times, so
# `<document lang>`'s autocomplete offers "nah" and nothing else. That is the
# documented fallback for a tag ICU does not know, and nothing here hand-writes
# around it — the same rule that makes `locales/co` read "Corsican" twice. It is
# a gap in CLDR, and until it closes, the label is the tag.
#
# Number is the optional plural, marked only on animates and on a handful of
# nouns; the inanimate nouns these messages count take no plural at all. So a
# counted message has one form and its select is dropped, keeping the `[0]`
# wording that names none — a different sentence rather than a different form.


## Answer submission

answer-checking = Motta…
answer-submitting = Motitlani…
answer-checking-status = Motta in tlanānquilīlli
answer-submitting-status = Motitlani in tlanānquilīlli
answer-correct = Cualli
answer-incorrect = Ahmo cualli
answer-response-saved = Ōmopix in tlanānquilīlli
answer-percent-credit = { $percent }% ipatiuh
answer-percent-correct = { $percent }% cualli
answer-percent-short = { $percent } %
max-credit-available = Ipatiuh in tlein ōmpa cah: { $percent }%
# No select: «tlayehyecōlli» is inanimate and takes no plural, so both English
# categories render the same words. The count still arrives and is still
# formatted. `[0]` stays, because "none left" is its own sentence.
attempts-remaining =
    { $count ->
        [0] ahmo ōc mocāhua tlayehyecōlli
       *[other] mocāhua { $count } tlayehyecōlli
    }
validation-correct = (Cualli)
validation-incorrect = (Ahmo cualli)
validation-partially-correct = (Achi cualli)
# No select, for the reason given above. The answer is named rather than
# possessed: the possessive prefix would have to be «ī-» or «īn-» according to
# what follows it, and what follows it is a value this catalog never sees.
answer-show-responses = Xicnēxti { $count } tlanānquilīlli, in ītōcā { $answerId }

## Disclosure panels

feedback-heading = Tlacuepcāyōtl
collapsible-click-to-open = (xictzōtzona inic motlapōz)
collapsible-click-to-close = (xictzōtzona inic motzacuāz)
collapsible-initializing = Pēhua…
footnote-show = Xicnēxti in tlatzintlān tlahcuilōlli
footnote-hide = Xictlāti in tlatzintlān tlahcuilōlli
description-more-information = occequi tlamachiliztli

## Controls

slider-previous = Yehuā
slider-next = Niman
keyboard-open = Xictlapo in tlatzotzonalōni
keyboard-close = Xictzacua in tlatzotzonalōni
choice-input-remove-choice = Xicquīxti { $choice }
matrix-remove-row = Xicquīxti cē tlamelāuhcāyōtl
matrix-add-row = Xicaxilti cē tlamelāuhcāyōtl
matrix-remove-column = Xicquīxti cē tlaquetzalli
matrix-add-column = Xicaxilti cē tlaquetzalli
subset-add-remove-points = Xicaxilti/Xicquīxti tlīltzintli
subset-toggle-points-intervals = Xicpatla tlīltzintli īhuān tlanepantlah
subset-move-points = Xicolīni tlīltzintli
subset-clear = Xicpohpōhua
orbital-add-row = Xicaxilti cē tlamelāuhcāyōtl
orbital-remove-row = Xicquīxti cē tlamelāuhcāyōtl
orbital-add-box = Xicaxilti cē pehpechtli
orbital-remove-box = Xicquīxti cē pehpechtli
orbital-add-up-arrow = Xicaxilti cē mītl ahcopa
orbital-add-down-arrow = Xicaxilti cē mītl tlanipa
orbital-remove-arrow = Xicquīxti cē mītl
orbital-row-label = Ītōcā in tlamelāuhcāyōtl { $row }
pretzel-answer = Tlanānquilīlli

## Math input

math-input-preview-region = tlapōhualiztli tlahtōlli achto tlachiyaliztli
math-input-preview = Achto tlachiyaliztli
math-input-invalid-expression = Tlahtōlli ahmo cualli:

## Document status

viewer-initializing = Pēhua…

## Errors

error-heading = Tlahtlacōlli
error-found-at =
    { $span ->
        [line] Ōmottac ipan tlamelāuhcāyōtl { $startLine }.
       *[lines] Ōmottac ipan tlamelāuhcāyōtl { $startLine }–{ $endLine }.
    }
document-contains-errors = Inin āmoxtli quipiya tlahtlacōlli!
diagnostic-heading-error = Tlahtlacōlli
diagnostic-heading-warning = Tlanahuatīlli
diagnostic-heading-information = Tlamachiliztli
diagnostic-heading-hint = Tlapalēhuīlli
accessibility-heading-level-1 = WCAG AA tlahtlacōlli ipan calaquiliztli
accessibility-heading-level-2 = Tlanahuatīlli ipan calaquiliztli
something-went-wrong = Itlah ahmo cualli ōmochīuh.
renderer-load-failed = cē tlanēxtiāni ahmo ōhuālla. Mā xicyancuīli in āmoxpechtli.
core-start-failed = In āmoxtlachiyalōni ahmo ōhuel pēuh. Mā xicyancuīli in āmoxpechtli.
