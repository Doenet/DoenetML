# Viewer chrome: buttons, panel headers, and other UI the reader interacts
# with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Bini (Edo State, Nigeria) is Edoid, Niger-Congo, Volta-Niger — the same
# higher branch as Yoruba (see `locales/yo`), but a different primary branch
# within it (Edoid vs. Defoid). Like Yoruba, Edo has no grammatical gender or
# noun-class agreement, and describing words are mostly stative verbs
# («ọ maan» — "it is good/correct" — rather than an agreeing adjective) or a
# small closed set of true adjectives that never change shape for the noun
# they sit beside. So wherever the English source forks on `$gender` or
# `$role` (see `content.ftl`), this catalog resolves to one non-forking
# translation, the same call Yoruba makes.
#
# Unlike Yoruba, `Intl.PluralRules('bin')` reports two categories, `one` and
# `other`, not one — so a countable message here genuinely needs the
# `[one]`/`*[other]` branches Yoruba's header says it can drop. `attempts-remaining`
# below is graded on that: bin distinguishes "attempt" singular from "attempts"
# plural where Yoruba's single-category rule let one line cover every count.
# The noun itself still is not marked for number by a numeral standing next to
# it — «ighiẹnrhan { $count }» — the split lives entirely in the accompanying
# word choice, not in noun morphology.
#
# Bini/Edo has no settled digital-interface vocabulary that this seed could
# draw on the way Yoruba orthographic and educational materials exist for
# "table" or "figure". Rather than leaving those words untranslated, this
# catalog renders the newer technical/UI nouns (submit, credit, variant,
# accessibility, and the like) as English loanwords written in ordinary Latin
# spelling, which is how such words are actually said in Benin City speech
# today; a fluent reviewer is expected to replace many of these with a native
# coinage or a more established loan spelling. This mirrors, in spirit, how
# this batch documents the `element-name`/`element-anion-name` omission in
# `content.ftl` — an honest placeholder rather than an invented fact.


## Answer submission

answer-checking = A gha miẹn ọre...
answer-submitting = A gha rhie ọre...
answer-checking-status = A gha miẹn ọre
answer-submitting-status = A gha rhie ọre
answer-correct = Ọ maan
answer-incorrect = Ọ i maan
answer-response-saved = A rhie ọre ye efe
answer-percent-credit = Kirediti { $percent }%
answer-percent-correct = { $percent }% Ọ maan
answer-percent-short = { $percent } %
max-credit-available = Kirediti nọ khẹke sẹ: { $percent }%
attempts-remaining =
    { $count ->
        [0] ighiẹnrhan i ke rre
        [one] ighiẹnrhan { $count } keghi rre
       *[other] ighiẹnrhan { $count } keghi rre
    }
validation-correct = (Ọ maan)
validation-incorrect = (Ọ i maan)
validation-partially-correct = (Ọ maan vbe ọkpa fua)
answer-show-responses =
    { $count ->
        [one] Rhie ọre { $count } ne { $answerId } miẹn
       *[other] Rhie ọre { $count } ne { $answerId } miẹn
    }

## Disclosure panels

feedback-heading = Erhuanren
collapsible-click-to-open = (kie ne u wa a)
collapsible-click-to-close = (kie ne u mudia a)
collapsible-initializing = A gha ghi hia...
footnote-show = Rhie ẹkpotọ nkoko miẹn
footnote-hide = Fian ẹkpotọ nkoko
description-more-information = ikuẹdẹ eso ke odaro

## Controls

slider-previous = Ọni
slider-next = Ọvbehe
keyboard-open = Wa Kiboọdi
keyboard-close = Mudia Kiboọdi
# `$choice` — the choice's own text — is not translated.
choice-input-remove-choice = Fian { $choice }
matrix-remove-row = Fian ẹfẹ
matrix-add-row = Gie ẹfẹ
matrix-remove-column = Fian ọwagbe
matrix-add-column = Gie ọwagbe
subset-add-remove-points = Gie/Fian akoto
subset-toggle-points-intervals = Ghee vbe akoto kevbe ẹvba
subset-move-points = Gele akoto
subset-clear = Fian hia
orbital-add-row = Gie Ẹfẹ
orbital-remove-row = Fian Ẹfẹ
orbital-add-box = Gie Ẹkpẹtin
orbital-remove-box = Fian Ẹkpẹtin
orbital-add-up-arrow = Gie Ọfa Ye Odukhunmwu
orbital-add-down-arrow = Gie Ọfa Ye Otọ
orbital-remove-arrow = Fian Ọfa
orbital-row-label = Uni ne ẹfẹ { $row }
pretzel-answer = Ọre

## Math input

math-input-preview-region = uhunmwu ẹdẹ ọfoworhọ
math-input-preview = Uhunmwu
math-input-invalid-expression = Ọfoworhọ nọ i maan:

## Document status

viewer-initializing = A gha ghi hia...

## Errors

error-heading = Efian
error-found-at =
    { $span ->
        [line] A miẹn ẹre vbe ẹfẹ { $startLine }.
       *[lines] A miẹn ẹre vbe efe { $startLine }–{ $endLine }.
    }
document-contains-errors = Ekhọe rre vbe akọsile nan!
diagnostic-heading-error = Efian
diagnostic-heading-warning = Ivbieka
diagnostic-heading-information = Ikuẹdẹ
diagnostic-heading-hint = Ọtọ
accessibility-heading-level-1 = Efian WCAG AA vbe abọ nọ khẹke
accessibility-heading-level-2 = Ivbieka vbe abọ nọ khẹke
something-went-wrong = Emwin ọkpa i rre vbe odẹ.
renderer-load-failed = ọkpa ke ihe ọfoworhọ i rre. Gie ọdẹ mudia ọni ọwagbe.
core-start-failed = Ihe akọsile i sẹtin ghi. Gie ọdẹ mudia ọni ọwagbe.
