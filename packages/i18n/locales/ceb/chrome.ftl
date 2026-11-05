# Cebuano viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# CLDR gives Cebuano the same two plural categories it gives Filipino, and by
# the same rule: `one` is every number whose Tagalog word ends in a vowel and
# takes the linker `-ng`, `other` is 4, 6 and 9 and anything ending in them.
# **That split does not apply to Cebuano**, because a Cebuano numeral is joined
# to what it counts by the invariable «ka» — «lima ka higayon», «upat ka
# higayon» — which does not change for the numeral in front of it. So the
# counted messages here write one branch and let it catch everything, and a
# `[one]` branch that differed from its `[other]` would be wrong rather than
# merely redundant.
#
# `[0]` is still spelled out where the English wording changes for zero, and
# that is written by number rather than by category: Fluent matches an explicit
# number before it consults the plural rules.


## Answer submission

answer-checking = Gisusi...
answer-submitting = Gipadala...
answer-checking-status = Gisusi ang tubag
answer-submitting-status = Gipadala ang tubag
answer-correct = Husto
answer-incorrect = Sayop
answer-response-saved = Natipigan ang Tubag
answer-percent-credit = { $percent }% nga puntos
answer-percent-correct = { $percent }% husto
answer-percent-short = { $percent }%
max-credit-available = Kinatas-ang puntos nga makuha: { $percent }%
attempts-remaining =
    { $count ->
        [0] wala nay nahibiling higayon
       *[other] nahibilin nga { $count } ka higayon
    }
validation-correct = (Husto)
validation-incorrect = (Sayop)
validation-partially-correct = (Husto ang pipila)
answer-show-responses = Ipakita ang { $count } ka tubag ngadto sa { $answerId }

## Disclosure panels

feedback-heading = Puna
collapsible-click-to-open = (i-klik aron ablihan)
collapsible-click-to-close = (i-klik aron sirad-an)
collapsible-initializing = Nagsugod...
footnote-show = Ipakita ang nota sa tiilan
footnote-hide = Itago ang nota sa tiilan
description-more-information = dugang impormasyon

## Controls

slider-previous = Miagi
slider-next = Sunod
keyboard-open = Ablihi ang keyboard
keyboard-close = Sirad-i ang keyboard
choice-input-remove-choice = Kuhaa ang { $choice }
matrix-remove-row = Kuhaa ang laray
matrix-add-row = Pagdugang ug laray
matrix-remove-column = Kuhaa ang kolum
matrix-add-column = Pagdugang ug kolum
subset-add-remove-points = Pagdugang/Pagkuha ug mga punto
subset-toggle-points-intervals = Ilisan ang mga punto ug interbalo
subset-move-points = Ibalhin ang mga Punto
subset-clear = Hawani
orbital-add-row = Pagdugang ug Laray
orbital-remove-row = Kuhaa ang Laray
orbital-add-box = Pagdugang ug Kahon
orbital-remove-box = Kuhaa ang Kahon
orbital-add-up-arrow = Pagdugang ug Pana Pataas
orbital-add-down-arrow = Pagdugang ug Pana Paubos
orbital-remove-arrow = Kuhaa ang Pana
orbital-row-label = Label sa laray { $row }
pretzel-answer = Tubag

## Math input

math-input-preview-region = pasiuna nga panan-aw sa ekspresyon sa matematika
math-input-preview = Pasiuna nga panan-aw
math-input-invalid-expression = Dili balido nga ekspresyon:

## Document status

viewer-initializing = Nagsugod...

## Errors

error-heading = Sayop
error-found-at =
    { $span ->
        [line] Nakit-an sa linya { $startLine }.
       *[lines] Nakit-an sa mga linya { $startLine }–{ $endLine }.
    }
document-contains-errors = Kini nga dokumento adunay mga sayop!
diagnostic-heading-error = Sayop
diagnostic-heading-warning = Pasidaan
diagnostic-heading-information = Impormasyon
diagnostic-heading-hint = Timailhan
accessibility-heading-level-1 = Paglapas sa aksesibilidad nga WCAG AA
accessibility-heading-level-2 = Pahimangno sa aksesibilidad
something-went-wrong = Adunay nasayop.
renderer-load-failed = adunay renderer nga wala makarga. Palihog i-reload ang panid.
core-start-failed = Wala masugdan ang tigtan-aw sa dokumento. Palihog i-reload ang panid.
