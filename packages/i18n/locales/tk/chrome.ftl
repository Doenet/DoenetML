# Turkmen viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Turkmen counts in two plural categories, `one` and `other`, the same two
# English has, so every `{ $count -> … }` below keeps the shape it had. A noun
# after a numeral stays singular — «2 synanyşyk», not a plural — so the two
# branches differ in nothing but the number they print.


## Answer submission

answer-checking = Barlanýar…
answer-submitting = Iberilýär…
answer-checking-status = Jogap barlanýar
answer-submitting-status = Jogap iberilýär
answer-correct = Dogry
answer-incorrect = Nädogry
answer-response-saved = Jogap saklandy
answer-percent-credit = { $percent }% bal
answer-percent-correct = { $percent }% dogry
answer-percent-short = { $percent } %
max-credit-available = Mümkin bolan iň ýokary bal: { $percent }%
attempts-remaining =
    { $count ->
        [0] synanyşyk galmady
        [one] { $count } synanyşyk galdy
       *[other] { $count } synanyşyk galdy
    }
validation-correct = (Dogry)
validation-incorrect = (Nädogry)
validation-partially-correct = (Bölekleýin dogry)
answer-show-responses =
    { $count ->
        [one] { $answerId } üçin { $count } jogaby görkez
       *[other] { $answerId } üçin { $count } jogaby görkez
    }

## Disclosure panels

feedback-heading = Seslenme
collapsible-click-to-open = (açmak üçin basyň)
collapsible-click-to-close = (ýapmak üçin basyň)
collapsible-initializing = Taýýarlanýar…
footnote-show = Belligi görkez
footnote-hide = Belligi gizle
description-more-information = goşmaça maglumat

## Controls

slider-previous = Öňki
slider-next = Indiki
keyboard-open = Klawiaturany aç
keyboard-close = Klawiaturany ýap
choice-input-remove-choice = { $choice } saýlawyny aýyr
matrix-remove-row = Setiri aýyr
matrix-add-row = Setir goş
matrix-remove-column = Sütüni aýyr
matrix-add-column = Sütün goş
subset-add-remove-points = Nokat goş/aýyr
subset-toggle-points-intervals = Nokatlar bilen aralyklaryň arasynda çalyş
subset-move-points = Nokatlary geçir
subset-clear = Arassala
orbital-add-row = Setir goş
orbital-remove-row = Setiri aýyr
orbital-add-box = Öýjük goş
orbital-remove-box = Öýjügi aýyr
orbital-add-up-arrow = Ýokary ok goş
orbital-add-down-arrow = Aşak ok goş
orbital-remove-arrow = Oky aýyr
orbital-row-label = { $row } setiriniň belgisi
pretzel-answer = Jogap

## Math input

math-input-preview-region = matematiki aňlatmanyň deslapky görnüşi
math-input-preview = Deslapky görnüş
math-input-invalid-expression = Nädogry aňlatma:

## Document status

viewer-initializing = Taýýarlanýar…

## Errors

error-heading = Ýalňyşlyk
error-found-at =
    { $span ->
        [line] { $startLine } setirde tapyldy.
       *[lines] { $startLine }–{ $endLine } setirlerde tapyldy.
    }
document-contains-errors = Bu resminamada ýalňyşlyklar bar!
diagnostic-heading-error = Ýalňyşlyk
diagnostic-heading-warning = Duýduryş
diagnostic-heading-information = Maglumat
diagnostic-heading-hint = Maslahat
accessibility-heading-level-1 = WCAG AA elýeterlilik bozulmasy
accessibility-heading-level-2 = Elýeterlilik habary
something-went-wrong = Bir zat nädogry gitdi.
renderer-load-failed = şekillendirijini ýüklemek başartmady. Sahypany täzeläň.
core-start-failed = Resminama görkezijisini işe girizmek başartmady. Sahypany täzeläň.
