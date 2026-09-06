# Kapampangan viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Latin orthography of Kapampangan publishing.
#
# Kapampangan marks no number on the noun: plurality is carried by «deng» and a
# noun after a numeral stays as it is. So a `{ $count -> … }` whose two English
# branches differ only in the noun renders one string here and the select is
# dropped; the count still arrives and is still formatted. A `[0]` branch stays
# wherever English has one.
#
# The **linker** is this catalog's one unresolved problem, and it is the
# Ilocano one seen from the other end. Kapampangan joins an adjective to what it
# describes with «a» after a consonant and the enclitic «-ng» welded onto a
# vowel-final word — and which is right is decided by the word *before* it. So
# where the preceding word is a placeable, this catalog writes the free «a»,
# which is right after a consonant and which a vowel-final word would want as
# «-ng». `content.ftl`'s header says where that bites and why it cannot be
# written any other way.


## Answer submission

answer-checking = Sisiyasat…
answer-submitting = Ipapadala…
answer-checking-status = Sisiyasat ya ing pakibat
answer-submitting-status = Ipapadala ne ing pakibat
answer-correct = Tama
answer-incorrect = Ali tama
answer-response-saved = Meimbak ne ing pakibat
answer-percent-credit = { $percent }% a kredito
answer-percent-correct = { $percent }% a tama
answer-percent-short = { $percent } %
max-credit-available = Kamaragulan a kreditong makakuha: { $percent }%
# No select: «subuk» is the same word for one and for many. The `[0]` branch
# stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] alang natad a subuk
       *[other] { $count } a subuk ing natad
    }
validation-correct = (Tama)
validation-incorrect = (Ali tama)
validation-partially-correct = (Tama king dake)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Ipakit ing { $count } a pakibat para king { $answerId }

## Disclosure panels

feedback-heading = Komento
collapsible-click-to-open = (i-klik ban mabuklat)
collapsible-click-to-close = (i-klik ban masara)
collapsible-initializing = Migsisimula…
footnote-show = Ipakit ing footnote
footnote-hide = Isalikut ing footnote
description-more-information = dagdag a impormasyon

## Controls

slider-previous = Milabas
slider-next = Tutuki
keyboard-open = Buklat ing teklado
keyboard-close = Isara ing teklado
choice-input-remove-choice = Alilan ing { $choice }
matrix-remove-row = Alilan ing gulis
matrix-add-row = Dagdagan pang gulis
matrix-remove-column = Alilan ing haligi
matrix-add-column = Dagdagan pang haligi
subset-add-remove-points = Pagdagdag/Pag-alis da reng punto
subset-toggle-points-intervals = Pamalit da reng punto at interbalo
subset-move-points = Igalo la reng punto
subset-clear = Linisan
orbital-add-row = Dagdagan pang gulis
orbital-remove-row = Alilan ing gulis
orbital-add-box = Dagdagan pang kaha
orbital-remove-box = Alilan ing kaha
orbital-add-up-arrow = Dagdagan pang panang paitas
orbital-add-down-arrow = Dagdagan pang panang palalam
orbital-remove-arrow = Alilan ing pana
orbital-row-label = Etiketa para king gulis { $row }
pretzel-answer = Pakibat

## Math input

math-input-preview-region = mumunang pamanakit king ekspresyon a matematika
math-input-preview = Mumunang pamanakit
math-input-invalid-expression = Ali balido a ekspresyon:

## Document status

viewer-initializing = Migsisimula…

## Errors

error-heading = Kamalian
error-found-at =
    { $span ->
        [line] Mekit king gulis { $startLine }.
       *[lines] Mekit karing gulis { $startLine }–{ $endLine }.
    }
document-contains-errors = Atin kamalian ining dokumento!
diagnostic-heading-error = Kamalian
diagnostic-heading-warning = Babala
diagnostic-heading-information = Impormasyon
diagnostic-heading-hint = Giya
accessibility-heading-level-1 = Pamanlabag king aksesibilidad a WCAG AA
accessibility-heading-level-2 = Babala tungkul king aksesibilidad
something-went-wrong = Atin bageng mekamali.
renderer-load-failed = atin renderer a ali me-load. Pakisuyung i-reload ing bulung.
core-start-failed = Ali me-umpisan ing pamanakit king dokumento. Pakisuyung i-reload ing bulung.
