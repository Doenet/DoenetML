# Mapudungun viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Alfabeto Mapuche Unificado. That choice is not neutral —
# Azümchefe and Raguileo are both in use — and `content.ftl`'s header says why
# this one, and where the boundary between inherited words and Spanish loans
# falls.
#
# Mapudungun marks the plural with the free word «pu» before the noun rather than
# with a suffix, and drops it after a numeral. So a counted message has one form
# and its select is dropped, keeping the `[0]` wording that names none — a
# different sentence rather than a different form.
#
# The postposition «mew» does the work English's prepositions do, and it is a
# separate word, so nothing in these catalogs is welded to a value.


## Answer submission

answer-checking = Adkintungey…
answer-submitting = Werkülelu…
answer-checking-status = Adkintungey ti llowdungun
answer-submitting-status = Werkülelu ti llowdungun
answer-correct = Rüf
answer-incorrect = Rüfnolu
answer-response-saved = Elkünungey ti llowdungun
answer-percent-credit = { $percent }% falin
answer-percent-correct = { $percent }% rüf
answer-percent-short = { $percent } %
max-credit-available = Doy fütra falin: { $percent }%
# No select: «pepilun» takes no plural marker after a numeral, so both English
# categories render the same words. The count still arrives and is still
# formatted. `[0]` stays, because "none left" is its own sentence.
attempts-remaining =
    { $count ->
        [0] chemnorume pepilun mülewelay
       *[other] { $count } pepilun mülewey
    }
validation-correct = (Rüf)
validation-incorrect = (Rüfnolu)
validation-partially-correct = (Pichin rüf)
# No select, for the reason given above. The answer is named with «pingelu» —
# "the one called" — which is a whole word rather than an affix on `$answerId`.
answer-show-responses = Pengelnge { $count } llowdungun, { $answerId } pingelu

## Disclosure panels

feedback-heading = Wüñoldungun
collapsible-click-to-open = (rütrünge nülakünuam)
collapsible-click-to-close = (rütrünge nürükünuam)
collapsible-initializing = Llitulelu…
footnote-show = Pengelnge ti minche wirin
footnote-hide = Ellkanenge ti minche wirin
description-more-information = doy kimeltun

## Controls

slider-previous = Wüne
slider-next = Inan
keyboard-open = Nülange ti wirintukupeyüm
keyboard-close = Nürüfnge ti wirintukupeyüm
choice-input-remove-choice = Nentunge { $choice }
matrix-remove-row = Nentunge kiñe wirin
matrix-add-row = Yomümnge kiñe wirin
matrix-remove-column = Nentunge kiñe witran
matrix-add-column = Yomümnge kiñe witran
subset-add-remove-points = Yomümnge/Nentunge troy
subset-toggle-points-intervals = Kañpüle elnge troy ka rangiñtu
subset-move-points = Nengümnge ti troy
subset-clear = Liftunge
orbital-add-row = Yomümnge kiñe wirin
orbital-remove-row = Nentunge kiñe wirin
orbital-add-box = Yomümnge kiñe kaxa
orbital-remove-box = Nentunge kiñe kaxa
orbital-add-up-arrow = Yomümnge kiñe pülki wenu
orbital-add-down-arrow = Yomümnge kiñe pülki naq
orbital-remove-arrow = Nentunge kiñe pülki
orbital-row-label = Ti wirin { $row } üy
pretzel-answer = Llowdungun

## Math input

math-input-preview-region = rakin dungu wüne pengelün
math-input-preview = Wüne pengelün
math-input-invalid-expression = Weda dungu:

## Document status

viewer-initializing = Llitulelu…

## Errors

error-heading = Welulkan
error-found-at =
    { $span ->
        [line] Peñgey ti wirin { $startLine } mew.
       *[lines] Peñgey ti wirin { $startLine }–{ $endLine } mew.
    }
document-contains-errors = Tüfachi chillka niey welulkan!
diagnostic-heading-error = Welulkan
diagnostic-heading-warning = Gülamtun
diagnostic-heading-information = Kimeltun
diagnostic-heading-hint = Kellun
accessibility-heading-level-1 = WCAG AA konpeyüm welulkan
accessibility-heading-level-2 = Konpeyüm gülamtun
something-went-wrong = Kiñe dungu rüfngelay.
renderer-load-failed = kiñe pengelfe puwlay. Wüñokünunge ti chillka.
core-start-failed = Ti chillka pengelfe pepi llitulay. Wüñokünunge ti chillka.
