# Xhosa viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Xhosa has two plural categories, and a noun marks number with a class prefix
# rather than a suffix: «ilinge elinye», «amalinge amahlanu». So the selects
# are kept and the noun changes shape inside them.
#
# A numeral takes the «ngu-» copulative against a noun, which is why several
# counted messages write «angu-{ $count }» — the prefix is on a word this
# catalog writes and never welded to the value itself.


## Answer submission

answer-checking = Iyajonga...
answer-submitting = Iyangenisa...
answer-checking-status = Ijonga impendulo
answer-submitting-status = Ingenisa impendulo
answer-correct = Ichanekile
answer-incorrect = Ayichanekanga
answer-response-saved = Impendulo Igciniwe
answer-percent-credit = Amanqaku angu-{ $percent }%
answer-percent-correct = { $percent }% Ichanekile
answer-percent-short = { $percent }%
max-credit-available = Amanqaku aphezulu afumanekayo: { $percent }%
attempts-remaining =
    { $count ->
        [0] akukho malinge ashiyekileyo
        [one] kushiyeke ilinge elingu-{ $count }
       *[other] kushiyeke amalinge angu-{ $count }
    }
validation-correct = (Ichanekile)
validation-incorrect = (Ayichanekanga)
validation-partially-correct = (Ichaneke ngokuyinxenye)
answer-show-responses =
    { $count ->
        [one] Bonisa impendulo engu-{ $count } ku-{ $answerId }
       *[other] Bonisa iimpendulo ezingu-{ $count } ku-{ $answerId }
    }

## Disclosure panels

feedback-heading = Ingxelo
collapsible-click-to-open = (cofa ukuze uvule)
collapsible-click-to-close = (cofa ukuze uvale)
collapsible-initializing = Iyaqalisa...
footnote-show = Bonisa inqaku elingezantsi
footnote-hide = Fihla inqaku elingezantsi
description-more-information = ulwazi olungakumbi

## Controls

slider-previous = Emva
slider-next = Phambili
keyboard-open = Vula Ikhibhodi
keyboard-close = Vala Ikhibhodi
choice-input-remove-choice = Susa { $choice }
matrix-remove-row = Susa umqolo
matrix-add-row = Yongeza umqolo
matrix-remove-column = Susa ikholam
matrix-add-column = Yongeza ikholam
subset-add-remove-points = Yongeza/Susa amanqaku
subset-toggle-points-intervals = Tshintsha phakathi kwamanqaku nezithuba
subset-move-points = Shukumisa Amanqaku
subset-clear = Sula
# A `box` here is one orbital, drawn as a square: ibhokisi.
orbital-add-row = Yongeza Umqolo
orbital-remove-row = Susa Umqolo
orbital-add-box = Yongeza Ibhokisi
orbital-remove-box = Susa Ibhokisi
orbital-add-up-arrow = Yongeza Utolo Olujonge Phezulu
orbital-add-down-arrow = Yongeza Utolo Olujonge Ezantsi
orbital-remove-arrow = Susa Utolo
orbital-row-label = Ilebhile yomqolo { $row }
pretzel-answer = Impendulo

## Math input

math-input-preview-region = ukubona kwangaphambili kwentetho yezibalo
math-input-preview = Bona Kwangaphambili
math-input-invalid-expression = Intetho engasebenziyo:

## Document status

viewer-initializing = Iyaqalisa...

## Errors

error-heading = Impazamo
error-found-at =
    { $span ->
        [line] Ifunyenwe kumgca { $startLine }.
       *[lines] Ifunyenwe kwimigca { $startLine }–{ $endLine }.
    }
document-contains-errors = Olu xwebhu luneempazamo!
diagnostic-heading-error = Impazamo
diagnostic-heading-warning = Isilumkiso
diagnostic-heading-information = Ulwazi
diagnostic-heading-hint = Icebiso
accessibility-heading-level-1 = Ukwaphulwa Kokufikeleleka kwe-WCAG AA
accessibility-heading-level-2 = Isilumkiso sokufikeleleka
something-went-wrong = Kukho into engahambanga kakuhle.
renderer-load-failed = esinye isibonisi asikwazanga ukulayisha. Nceda ulayishe iphepha kwakhona.
core-start-failed = Isibonisi soxwebhu asikwazanga ukuqaliswa. Nceda ulayishe iphepha kwakhona.
