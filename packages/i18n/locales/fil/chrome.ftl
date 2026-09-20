# Filipino viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Controls take the bare imperative Filipino puts on a button — «Buksan ang
# keyboard» — which is what a reader expects from software.
#
# Filipino counts in two plural categories, and they are not singular and
# plural: a noun's plural is the separate word «mga», not an ending. What CLDR
# splits Filipino on is the linker a numeral takes — `one` is every number
# whose Tagalog word ends in a vowel (isa, lima, pito) and takes `-ng`, and
# `other` is 4, 6, 9 and anything ending in them (apat, anim, siyam), which
# take the separate word `na`. A digit cannot carry a suffixed `-ng`, so the
# `[one]` branch writes the numeral bare and `[other]` writes the `na`.
#
# A message that wants a singular therefore says `[1]` by number, the way `[0]`
# is written: Fluent matches an explicit number before it consults the plural
# rules.


## Answer submission

answer-checking = Sinusuri...
answer-submitting = Ipinapasa...
answer-checking-status = Sinusuri ang sagot
answer-submitting-status = Ipinapasa ang sagot
answer-correct = Tama
answer-incorrect = Mali
answer-response-saved = Nai-save ang Sagot
answer-percent-credit = { $percent }% na Puntos
answer-percent-correct = { $percent }% Tama
answer-percent-short = { $percent }%
max-credit-available = Pinakamataas na puntos na maaaring makuha: { $percent }%
# The noun stays as it is whatever the count; the two branches differ only in
# the linker the numeral takes, as `answer-show-responses` below does. `[0]` is
# written by number rather than by category, exactly as the English is.
attempts-remaining =
    { $count ->
        [0] wala nang natitirang pagsubok
        [one] { $count } pagsubok na lang ang natitira
       *[other] { $count } na pagsubok na lang ang natitira
    }
validation-correct = (Tama)
validation-incorrect = (Mali)
validation-partially-correct = (Bahagyang tama)
answer-show-responses =
    { $count ->
        [one] Ipakita ang { $count } sagot sa { $answerId }
       *[other] Ipakita ang { $count } na sagot sa { $answerId }
    }

## Disclosure panels

feedback-heading = Puna
collapsible-click-to-open = (i-click para buksan)
collapsible-click-to-close = (i-click para isara)
collapsible-initializing = Sinisimulan...
footnote-show = Ipakita ang talababa
footnote-hide = Itago ang talababa
description-more-information = higit pang impormasyon

## Controls

slider-previous = Nakaraan
slider-next = Susunod
keyboard-open = Buksan ang Keyboard
keyboard-close = Isara ang Keyboard
choice-input-remove-choice = Alisin ang { $choice }
matrix-remove-row = Alisin ang hanay
matrix-add-row = Magdagdag ng hanay
matrix-remove-column = Alisin ang kolum
matrix-add-column = Magdagdag ng kolum
subset-add-remove-points = Magdagdag/Mag-alis ng mga punto
subset-toggle-points-intervals = Magpalit sa pagitan ng mga punto at agwat
subset-move-points = Ilipat ang mga Punto
subset-clear = Burahin
# A `box` here is one orbital, drawn as a square: kahon.
orbital-add-row = Magdagdag ng Hanay
orbital-remove-row = Alisin ang Hanay
orbital-add-box = Magdagdag ng Kahon
orbital-remove-box = Alisin ang Kahon
orbital-add-up-arrow = Magdagdag ng Pataas na Arrow
orbital-add-down-arrow = Magdagdag ng Pababang Arrow
orbital-remove-arrow = Alisin ang Arrow
orbital-row-label = Label para sa hanay { $row }
pretzel-answer = Sagot

## Math input

math-input-preview-region = preview ng ekspresyong matematikal
math-input-preview = Preview
math-input-invalid-expression = Di-wastong ekspresyon:

## Document status

viewer-initializing = Sinisimulan...

## Errors

error-heading = Error
error-found-at =
    { $span ->
        [line] Natagpuan sa linya { $startLine }.
       *[lines] Natagpuan sa mga linya { $startLine }–{ $endLine }.
    }
document-contains-errors = May mga error ang dokumentong ito!
diagnostic-heading-error = Error
diagnostic-heading-warning = Babala
diagnostic-heading-information = Impormasyon
diagnostic-heading-hint = Pahiwatig
accessibility-heading-level-1 = Paglabag sa Accessibility ng WCAG AA
accessibility-heading-level-2 = Babala sa accessibility
something-went-wrong = May nagkamali.
renderer-load-failed = may renderer na hindi na-load. Mangyaring i-reload ang pahina.
core-start-failed = Hindi masimulan ang tagatanaw ng dokumento. Mangyaring i-reload ang pahina.
