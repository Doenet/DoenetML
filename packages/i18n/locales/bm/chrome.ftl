# Bambara viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# CLDR gives Bambara one plural category. Bambara does mark plural, with the
# suffix `-w`, but not after a numeral: «sɛbɛnnisɛn fila», never «sɛbɛnnisɛnw
# fila». So a counted noun in these messages is invariable, the selects are
# dropped, and a `[one]` differing from its `[other]` would be wrong rather
# than merely redundant. `attempts-remaining` keeps its `[0]` branch, which is
# an exact-value match rather than a plural category and says «si tɛ» instead
# of counting to zero.


## Answer submission

answer-checking = A bɛ sɛgɛsɛgɛ...
answer-submitting = A bɛ ci...
answer-checking-status = Jaabi bɛ sɛgɛsɛgɛ
answer-submitting-status = Jaabi bɛ ci
answer-correct = A bɛnna
answer-incorrect = A ma bɛn
answer-response-saved = Jaabi Marala
answer-percent-credit = Nɔgɔya { $percent }%
answer-percent-correct = { $percent }% Bɛnnen
answer-percent-short = { $percent } %
max-credit-available = Nɔgɔya belebele min bɛ sɔrɔ: { $percent }%
attempts-remaining =
    { $count ->
        [0] cɛsiri si tɛ yen tugun
       *[other] cɛsiri { $count } tora
    }
validation-correct = (A bɛnna)
validation-incorrect = (A ma bɛn)
validation-partially-correct = (A bɛnna dɔɔni)
answer-show-responses = { $answerId } ka jaabi { $count } jira

## Disclosure panels

feedback-heading = Kɔsegin
collapsible-click-to-open = (digi walasa k'a da wuli)
collapsible-click-to-close = (digi walasa k'a datugu)
collapsible-initializing = A bɛ daminɛ...
footnote-show = Duguma-sɛbɛnni jira
footnote-hide = Duguma-sɛbɛnni dogo
description-more-information = kunnafoni wɛrɛw

## Controls

slider-previous = Kɔfɛta
slider-next = Nata
keyboard-open = Kilabɔri Da Wuli
keyboard-close = Kilabɔri Datugu
choice-input-remove-choice = { $choice } bɔ
matrix-remove-row = Layini bɔ
matrix-add-row = Layini fara
matrix-remove-column = Kolɔni bɔ
matrix-add-column = Kolɔni fara
subset-add-remove-points = Pɔnw fara/bɔ
subset-toggle-points-intervals = Pɔnw ni ɛntɛrɛvaliw falen-falen
subset-move-points = Pɔnw Yɛlɛma
subset-clear = Jɔsi
# A `box` here is one orbital, drawn as a square: «kɛsu».
orbital-add-row = Layini Fara
orbital-remove-row = Layini Bɔ
orbital-add-box = Kɛsu Fara
orbital-remove-box = Kɛsu Bɔ
orbital-add-up-arrow = Sanfɛ-Bina Fara
orbital-add-down-arrow = Dugumafɛ-Bina Fara
orbital-remove-arrow = Bina Bɔ
orbital-row-label = Layini { $row } tɔgɔ
pretzel-answer = Jaabi

## Math input

math-input-preview-region = matematiki fɔcogo ɲɛfɔli
math-input-preview = Ɲɛfɔli
math-input-invalid-expression = Fɔcogo tɛ ɲɛ:

## Document status

viewer-initializing = A bɛ daminɛ...

## Errors

error-heading = Fili
error-found-at =
    { $span ->
        [line] A sɔrɔla liɲi { $startLine } kan.
       *[lines] A sɔrɔla liɲi { $startLine }–{ $endLine } kan.
    }
document-contains-errors = Filiw bɛ nin sɛbɛn kɔnɔ!
diagnostic-heading-error = Fili
diagnostic-heading-warning = Lasɔmini
diagnostic-heading-information = Kunnafoni
diagnostic-heading-hint = Ladilikan
accessibility-heading-level-1 = WCAG AA Sɔrɔliya Tiɲɛni
accessibility-heading-level-2 = Sɔrɔliya lasɔmini
something-went-wrong = Fɛn dɔ ma taa a cogo la.
renderer-load-failed = jirali fɛn kelen ma se ka don. Aw ka sɛbɛnnisɛn lasegin.
core-start-failed = Sɛbɛn jirala ma se ka daminɛ. Aw ka sɛbɛnnisɛn lasegin.
