# Fula viewer chrome: buttons, panel headers, and other UI the reader interacts
# with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for which variety this is, for the hooked letters
# ɓ ɗ ƴ ŋ, and for the suffixed class concord.


## Answer submission

answer-checking = Ina ƴeewtee…
answer-submitting = Ina neldee…
answer-checking-status = Jaabawol ngol ina ƴeewtee
answer-submitting-status = Jaabawol ngol ina neldee
answer-correct = Ko goonga
answer-incorrect = Wonaa goonga
answer-response-saved = Jaabawol Danndaama
answer-percent-credit = { $percent }% e Nataaji
answer-percent-correct = { $percent }% Goonga
answer-percent-short = { $percent } %
max-credit-available = Nataaji ɓurɗi heewde: { $percent }%
attempts-remaining =
    { $count ->
        [0] alaa etagol heddiingol
        [one] etagol { $count } heddiima
       *[other] etagol { $count } heddiima
    }
validation-correct = (Ko goonga)
validation-incorrect = (Wonaa goonga)
validation-partially-correct = (Ko goonga e geɗal)
answer-show-responses =
    { $count ->
        [one] Hollu jaabawol { $count } e { $answerId }
       *[other] Hollu jaabawuuji { $count } e { $answerId }
    }

## Disclosure panels

feedback-heading = Miijooji
collapsible-click-to-open = (ñoƴƴu ngam udditde)
collapsible-click-to-close = (ñoƴƴu ngam uddude)
collapsible-initializing = Ina fuɗɗoo…
footnote-show = Hollu bindol ley
footnote-hide = Suuɗu bindol ley
description-more-information = humpito goɗɗo

## Controls

slider-previous = Ɓennungo
slider-next = Garowo
keyboard-open = Uddit Klawiyee
keyboard-close = Uddu Klawiyee
choice-input-remove-choice = Ittu { $choice }
matrix-remove-row = Ittu diidol
matrix-add-row = Ɓeydu diidol
matrix-remove-column = Ittu kolom
matrix-add-column = Ɓeydu kolom
subset-add-remove-points = Ɓeydu/Ittu toɓɓe
subset-toggle-points-intervals = Waylu toɓɓe e sahaaji
subset-move-points = Dirtin Toɓɓe
subset-clear = Momtu
orbital-add-row = Ɓeydu Diidol
orbital-remove-row = Ittu Diidol
orbital-add-box = Ɓeydu Buwat
orbital-remove-box = Ittu Buwat
orbital-add-up-arrow = Ɓeydu Kure Dow
orbital-add-down-arrow = Ɓeydu Kure Ley
orbital-remove-arrow = Ittu Kure
orbital-row-label = Innde diidol { $row }
pretzel-answer = Jaabawol

## Math input

math-input-preview-region = ƴeewgol adiingol e konngol limtorgal
math-input-preview = Ƴeewgol adiingol
math-input-invalid-expression = Konngol moƴƴaani:

## Document status

viewer-initializing = Ina fuɗɗoo…

## Errors

error-heading = Juumre
error-found-at =
    { $span ->
        [line] Yiyaama e diidol { $startLine }.
       *[lines] Yiyaama e diide { $startLine }–{ $endLine }.
    }
document-contains-errors = Ndee ɗeri ina jogii juumreeji!
diagnostic-heading-error = Juumre
diagnostic-heading-warning = Reentino
diagnostic-heading-information = Humpito
diagnostic-heading-hint = Tinndinoore
accessibility-heading-level-1 = Firtugol WCAG AA e Yettagol
accessibility-heading-level-2 = Reentino yettagol
something-went-wrong = Woodi ko yahaani no haani.
renderer-load-failed = kollirgal waawaa loowde. Tiiɗno loow hello ngoo kadi.
core-start-failed = Kollirgal ɗeri waawaa fuɗɗaade. Tiiɗno loow hello ngoo kadi.
