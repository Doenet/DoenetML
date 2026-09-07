# Urhobo viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Urhobo (Southwestern Edoid, Volta-Niger, Niger-Congo) is spoken in Delta
# State, Nigeria, by roughly 1.1 million people. It is paired in this batch
# with `locales/bin` (Bini/Edo), the sibling Edoid language this seed leans on
# for structural comparison: both are noun-initial languages with a small
# closed adjective class and effectively no adjective-noun class agreement to
# mark — unlike the Bantu languages elsewhere in this repository, Urhobo has
# no noun-class concord system that a `$gender`-style placeable would need to
# select on. `noun-gender` is therefore `neuter` throughout, exactly as it is
# for Yoruba and Bini.
#
# Online lexical coverage for Urhobo is thin (no CLDR data, a sparse Glosbe
# dictionary, one published Urhobo-English dictionary). Everyday words
# (numbers, basic colors, "true") are drawn from that material; the technical
# and UI vocabulary this catalog needs mostly is not attested anywhere online,
# so those terms are rendered as English loanwords fit to Urhobo spelling
# conventions — the same code-switching a Delta State classroom already uses
# for "check", "submit", "triangle", and the like, since Nigerian secondary
# education (like the science curriculum — see `content.ftl`) is
# English-medium. A speaker reviewing this seed should treat the loanwords as
# the first thing to replace with settled Urhobo usage, if a better one exists.


## Answer submission

answer-checking = Ọ yẹn chek…
answer-submitting = Ọ yẹn sọmit…
answer-checking-status = Ọ yẹn chek ẹkpahọnphiyọ
answer-submitting-status = Ọ yẹn sọmit ẹkpahọnphiyọ
answer-correct = Ọ rugba
answer-incorrect = Ọ rugba-e
answer-response-saved = A vwo sevu ẹkpahọnphiyọ na
answer-percent-credit = { $percent }% kirediti
answer-percent-correct = { $percent }% rugba
answer-percent-short = { $percent } %
max-credit-available = Kirediti ro kpo họhọ: { $percent }%
attempts-remaining =
    { $count ->
        [0] i vwo utuja ọvo-o
        [one] utuja { $count } che dje
       *[other] utuja { $count } che dje
    }
validation-correct = (Ọ rugba)
validation-incorrect = (Ọ rugba-e)
validation-partially-correct = (Ọ rugba vwẹ ẹkpọvo)
answer-show-responses =
    { $count ->
        [one] Djro ẹkpahọnphiyọ { $count } rẹ { $answerId }
       *[other] Djro ẹkpahọnphiyọ { $count } rẹ { $answerId }
    }

## Disclosure panels

feedback-heading = Ota
collapsible-click-to-open = (te kẹ e vwo ke)
collapsible-click-to-close = (te kẹ e vwo vọnrẹ)
collapsible-initializing = Ọ yẹn tọtọre…
footnote-show = Djro ẹbe-egodo
footnote-hide = Vọnrẹ ẹbe-egodo
description-more-information = odjekọ vwe je

## Controls

slider-previous = Ọsiẹvwin
slider-next = Ọrhirie
keyboard-open = Ke Kibọdi
keyboard-close = Vọnrẹ Kibọdi
choice-input-remove-choice = Werhie { $choice } phrẹ
matrix-remove-row = Werhie eka phrẹ
matrix-add-row = Kobọrọ eka
matrix-remove-column = Werhie ọfẹ phrẹ
matrix-add-column = Kobọrọ ọfẹ
subset-add-remove-points = Kobọrọ/Werhie ẹkpo phrẹ
subset-toggle-points-intervals = Nrhirhie ẹkpo vẹ ẹkẹ
subset-move-points = Werhie Ẹkpo
subset-clear = Ye Ovwan
orbital-add-row = Kobọrọ Eka
orbital-remove-row = Werhie Eka phrẹ
orbital-add-box = Kobọrọ Bọkisi
orbital-remove-box = Werhie Bọkisi phrẹ
orbital-add-up-arrow = Kobọrọ Arọ ro Kpo Ubru
orbital-add-down-arrow = Kobọrọ Arọ ro Kpo Otọ
orbital-remove-arrow = Werhie Arọ phrẹ
orbital-row-label = Odẹ kẹ eka { $row }
pretzel-answer = Ẹkpahọnphiyọ

## Math input

math-input-preview-region = odjro rẹ mathematiki
math-input-preview = Odjro
math-input-invalid-expression = Otọfa ro fioma:

## Document status

viewer-initializing = Ọ yẹn tọtọre…

## Errors

error-heading = Otọfa
error-found-at =
    { $span ->
        [line] A mrẹ o vwẹ layin { $startLine }.
       *[lines] A mrẹ o vwẹ eyin layin { $startLine }–{ $endLine }.
    }
document-contains-errors = Ẹbe nana vwo otọfa!
diagnostic-heading-error = Otọfa
diagnostic-heading-warning = Ophariẹ
diagnostic-heading-information = Odjekọ
diagnostic-heading-hint = Uphiudu
accessibility-heading-level-1 = Ophariẹ WCAG AA
accessibility-heading-level-2 = Ophariẹ rẹ Iruemu-erhirhie
something-went-wrong = Ihwo dje otọfa.
renderer-load-failed = odjro-oma na vwo tobọ ke-e. Djovwo vwẹ ẹbe na.
core-start-failed = A sa vwo se odjro rẹ ẹbe na-a. Djovwo vwẹ ẹbe na.
