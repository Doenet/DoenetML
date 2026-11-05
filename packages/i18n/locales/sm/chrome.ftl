# Samoan viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The koma liliu «ʻ» and the faʻamamafa are part of the spelling. Where this
# seed has left one out it is an error to fix, not a style to keep.
#
# A Samoan noun is not marked for number by an ending, so a count in front of
# one changes nothing about it and the counted messages here need no selection
# even though CLDR gives Samoan two plural categories. Samoan *does* mark
# plural — on the article, and by reduplication in a family of adjectives and
# verbs («tele» → «tetele») — but every description these messages build is
# about a single thing, so the singular form is the right one throughout.


## Answer submission

answer-checking = O loʻo siaki...
answer-submitting = O loʻo lafo...
answer-checking-status = O loʻo siaki le tali
answer-submitting-status = O loʻo lafo le tali
answer-correct = Saʻo
answer-incorrect = Sesē
answer-response-saved = Ua sefe le tali
answer-percent-credit = { $percent }% o togi
answer-percent-correct = { $percent }% saʻo
answer-percent-short = { $percent }%
max-credit-available = O togi sili e mafai ona maua: { $percent }%
attempts-remaining =
    { $count ->
        [0] ua leai se taumafaiga o totoe
       *[other] o totoe { $count } taumafaiga
    }
validation-correct = (Saʻo)
validation-incorrect = (Sesē)
validation-partially-correct = (Saʻo se vaega)
answer-show-responses = Faʻaali tali e { $count } i le { $answerId }

## Disclosure panels

feedback-heading = Manatu faʻaalia
collapsible-click-to-open = (kiliki e tatala)
collapsible-click-to-close = (kiliki e tapuni)
collapsible-initializing = O loʻo amata...
footnote-show = Faʻaali le faʻamatalaga i lalo
footnote-hide = Nātia le faʻamatalaga i lalo
description-more-information = faʻamatalaga atili

## Controls

slider-previous = Muamua
slider-next = Sosoʻo
keyboard-open = Tatala le kipoti
keyboard-close = Tapuni le kipoti
choice-input-remove-choice = Aveʻese { $choice }
matrix-remove-row = Aveʻese le laina
matrix-add-row = Faʻaopoopo se laina
matrix-remove-column = Aveʻese le koluma
matrix-add-column = Faʻaopoopo se koluma
subset-add-remove-points = Faʻaopoopo/Aveʻese poini
subset-toggle-points-intervals = Sui va o poini ma vaitaimi
subset-move-points = Siitia poini
subset-clear = Faʻamamā
orbital-add-row = Faʻaopoopo se laina
orbital-remove-row = Aveʻese le laina
orbital-add-box = Faʻaopoopo se pusa
orbital-remove-box = Aveʻese le pusa
orbital-add-up-arrow = Faʻaopoopo se aū i luga
orbital-add-down-arrow = Faʻaopoopo se aū i lalo
orbital-remove-arrow = Aveʻese le aū
orbital-row-label = Igoa mo le laina { $row }
pretzel-answer = Tali

## Math input

math-input-preview-region = vaʻaiga muamua o le faʻamatalaga matematika
math-input-preview = Vaʻaiga muamua
math-input-invalid-expression = Faʻamatalaga lē saʻo:

## Document status

viewer-initializing = O loʻo amata...

## Errors

error-heading = Mea sesē
error-found-at =
    { $span ->
        [line] Na maua i le laina { $startLine }.
       *[lines] Na maua i laina { $startLine }–{ $endLine }.
    }
document-contains-errors = O loʻo iai ni mea sesē i lenei pepa!
diagnostic-heading-error = Mea sesē
diagnostic-heading-warning = Lapataʻiga
diagnostic-heading-information = Faʻamatalaga
diagnostic-heading-hint = Fautuaga
accessibility-heading-level-1 = Solitulafono i avanoa faigofie WCAG AA
accessibility-heading-level-2 = Lapataʻiga i avanoa faigofie
something-went-wrong = Sa iai se mea na sesē.
renderer-load-failed = e leʻi uta se tagata faʻaali. Faʻamolemole toe uta le itulau.
core-start-failed = E leʻi mafai ona amata le tagata vaʻai pepa. Faʻamolemole toe uta le itulau.
