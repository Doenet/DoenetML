# Kimbundu viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the connective table, for the two comparisons
# that cut in opposite directions — `locales/umb` next door and `locales/kg` a
# thousand kilometres away — and for what a speaker should check first.


## Answer submission

answer-checking = Mu kutala…
answer-submitting = Mu kutuma…
answer-checking-status = O kitambwijilu kya mu talwa
answer-submitting-status = O kitambwijilu kya mu tumwa
answer-correct = Kya bhonga
answer-incorrect = Ki kya bhonga ko
answer-response-saved = O Kitambwijilu Kya Lengejelwa
answer-percent-credit = { $percent }% ya Mbandu
answer-percent-correct = { $percent }% Kya bhonga
answer-percent-short = { $percent } %
max-credit-available = Mbandu ya dikota i utena kutambula: { $percent }%
attempts-remaining =
    { $count ->
        [0] ki kwala kilongelu ko
        [one] kilongelu { $count } kya sala
       *[other] ilongelu { $count } ya sala
    }
validation-correct = (Kya bhonga)
validation-incorrect = (Ki kya bhonga ko)
validation-partially-correct = (Kya bhonga mu kitangana)
answer-show-responses =
    { $count ->
        [one] Londekesa kitambwijilu { $count } kya { $answerId }
       *[other] Londekesa itambwijilu { $count } ya { $answerId }
    }

## Disclosure panels

feedback-heading = Kitambwijilu
collapsible-click-to-open = (kwata phala kujikula)
collapsible-click-to-close = (kwata phala kujika)
collapsible-initializing = Mu kumatekesa…
footnote-show = Londekesa kisonekenu kya boxi
footnote-hide = Sweka kisonekenu kya boxi
description-more-information = ijimbwete ya mukwa

## Controls

slider-previous = Ya bhitile
slider-next = Ya kaya
keyboard-open = Jikula o Kiteka
keyboard-close = Jika o Kiteka
choice-input-remove-choice = Katula { $choice }
matrix-remove-row = Katula o nlonji
matrix-add-row = Bhakela nlonji
matrix-remove-column = Katula o koluna
matrix-add-column = Bhakela koluna
subset-add-remove-points = Bhakela/Katula jimbanza
subset-toggle-points-intervals = Sokolola jimbanza ni jitembu
subset-move-points = Kunanguna Jimbanza
subset-clear = Katula yoso
orbital-add-row = Bhakela Nlonji
orbital-remove-row = Katula Nlonji
orbital-add-box = Bhakela Kaxa
orbital-remove-box = Katula Kaxa
orbital-add-up-arrow = Bhakela Seta ya Bhulu
orbital-add-down-arrow = Bhakela Seta ya Boxi
orbital-remove-arrow = Katula Seta
orbital-row-label = Dijina dya nlonji { $row }
pretzel-answer = Kitambwijilu

## Math input

math-input-preview-region = kutala kwa dyanga o kizwelu kya matematika
math-input-preview = Tala dyanga
math-input-invalid-expression = Kizwelu ki kyabhonga ko:

## Document status

viewer-initializing = Mu kumatekesa…

## Errors

error-heading = Kibhengelu
error-found-at =
    { $span ->
        [line] Kya sangwa mu nlonji { $startLine }.
       *[lines] Kya sangwa mu jinlonji { $startLine }–{ $endLine }.
    }
document-contains-errors = O divulu didi dyala ni ibhengelu!
diagnostic-heading-error = Kibhengelu
diagnostic-heading-warning = Kidimbu
diagnostic-heading-information = Kijimbwete
diagnostic-heading-hint = Kikwatekesu
accessibility-heading-level-1 = Kubhengela kwa WCAG AA mu Kubhixila
accessibility-heading-level-2 = Kidimbu kya kubhixila
something-went-wrong = Kima kya mukwa ki kya bhonga ko.
renderer-load-failed = o mulondekesi umoxi ki weza ko. Tu ku bhinga, vutulula o kibhamba.
core-start-failed = O mulondekesi wa divulu ki wa tenene kumatekesa ko. Tu ku bhinga, vutulula o kibhamba.
