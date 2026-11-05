# Baoulé viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# See `content.ftl`'s header for orthography, plural-category behaviour, the
# Akan/Twi agreement comparison, the chemistry-table omission, and what a
# speaker should check first.
#
# The source-code line this catalog's diagnostics-adjacent messages mention is
# «layin», an English/French loan, kept distinct from «liɲ», the geometric
# line `content.ftl` builds descriptions around.


## Answer submission

answer-checking = Be nian i su...
answer-submitting = Be fa i kɔ...
answer-checking-status = Be nian tɛlɛ'n su
answer-submitting-status = Be fa tɛlɛ'n kɔ
answer-correct = I ti kpa
answer-incorrect = I timan kpa
answer-response-saved = Be fa tɛlɛ'n sieli
answer-percent-credit = Nsɛkyerɛ { $percent }%
answer-percent-correct = I ti kpa { $percent }%
answer-percent-short = { $percent } %
max-credit-available = Nzuɛn kpanngban be kwla ɲɛn i: { $percent }%
# Baoulé has only `one` and `other` (see `content.ftl`), and «wafa» "attempt"
# keeps one shape in both, so the categories collapse to a single wording; the
# `[0]` branch stays because it is matched by exact value, not by category.
attempts-remaining =
    { $count ->
        [0] wafa fi w'a to-man
       *[other] wafa { $count } yɛ w'a to-man ɔn
    }
validation-correct = (I ti kpa)
validation-incorrect = (I timan kpa)
validation-partially-correct = (I ti kpa wie)
answer-show-responses = Kyerɛ tɛlɛ { $count } mɔ be fali i mannin { $answerId }

## Disclosure panels

feedback-heading = Ndɛ
collapsible-click-to-open = (fa i bɔ i wun kle wɔ)
collapsible-click-to-close = (fa i kata i)
collapsible-initializing = Be bo i bo su...
footnote-show = Kyerɛ ndɛ ng'ɔ o ase'n
footnote-hide = Fa ndɛ ng'ɔ o ase'n sie
description-more-information = ndɛ uflɛ mun

## Controls

slider-previous = Osu
slider-next = Ɲɛ
keyboard-open = Kle mmuaeɛ-fa-kɛtɛ
keyboard-close = Kata mmuaeɛ-fa-kɛtɛ
choice-input-remove-choice = Yi { $choice } i wun
matrix-remove-row = Yi layin nun
matrix-add-row = Fa layin uflɛ gua su
matrix-remove-column = Yi kolɔn nun
matrix-add-column = Fa kolɔn uflɛ gua su
subset-add-remove-points = Fa pwɛn gua su annzɛ yi i nun
subset-toggle-points-intervals = Kaci pwɛn nin ndɛ-tɛtɛ
subset-move-points = Kaci Pwɛn Be Osu
subset-clear = Yi be kwlaa
orbital-add-row = Fa layin uflɛ gua su
orbital-remove-row = Yi layin nun
orbital-add-box = Fa adaka uflɛ gua su
orbital-remove-box = Yi adaka nun
orbital-add-up-arrow = Fa fanngo mɔ ɔ kɔ soro'n gua su
orbital-add-down-arrow = Fa fanngo mɔ ɔ tɔ fam'n gua su
orbital-remove-arrow = Yi fanngo'n i nun
orbital-row-label = Layin { $row } i dunman
pretzel-answer = Tɛlɛ

## Math input

math-input-preview-region = akontabuo ndɛ i yilɛ ng'ɔ o kɛ i sɔ'n
math-input-preview = Yilɛ
math-input-invalid-expression = Akontabuo ndɛ nga w'i su:

## Document status

viewer-initializing = Be bo i bo su...

## Errors

error-heading = Sa tɛ
error-found-at =
    { $span ->
        [line] Be wunnin i layin { $startLine } su.
       *[lines] Be wunnin i layin { $startLine } lele { $endLine } su.
    }
document-contains-errors = Fluwa nga sa tɛ o nun!
diagnostic-heading-error = Sa tɛ
diagnostic-heading-warning = Kɔkɔlɛ
diagnostic-heading-information = Ndɛ
diagnostic-heading-hint = Ndɛ ɲrɛnnɛn
accessibility-heading-level-1 = WCAG AA mmara mɔ be buman i su
accessibility-heading-level-2 = Kɔkɔlɛ mɔ ɔ fata be nyian i akunndan
something-went-wrong = Sa kun timan kpa.
renderer-load-failed = kyerɛfoɛ kun w'a kwlaman w'a ba. Yaci fluwa'n san kan bio.
core-start-failed = Fluwa'n kyerɛlɛ dilɛ w'a kwlaman w'a bo i bo. Yaci fluwa'n san kan bio.
