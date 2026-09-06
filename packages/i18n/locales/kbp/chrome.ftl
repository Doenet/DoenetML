# Kabiyè viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the class-suffix table, for how it sits
# against the other two Gur catalogs and against `locales/kg`, and for what a
# speaker should check first.


## Answer submission

answer-checking = Pɩmaɣzɩɣ…
answer-submitting = Pɩtiyiɣ…
answer-checking-status = Pɛwɛɛ pamaɣzɩɣ cosuu
answer-submitting-status = Pɛwɛɛ patiyiɣ cosuu
answer-correct = Pɩtʋʋ fɛyɩ
answer-incorrect = Pɩtɩtʋʋzɩ
answer-response-saved = Pasɩɣ Cosuu
answer-percent-credit = { $percent }% Kɩɖɛʋ
answer-percent-correct = { $percent }% Pɩtʋʋ fɛyɩ
answer-percent-short = { $percent } %
max-credit-available = Kɩɖɛʋ sɔsɔʋ ŋgʋ ŋpɩzɩɣ ŋhiɣ yɔ: { $percent }%
attempts-remaining =
    { $count ->
        [0] maɣzʋʋ natʋyʋ tɩkazɩ
        [one] maɣzʋʋ { $count } kazɩ
       *[other] maɣzʋʋ { $count } kazɩ
    }
validation-correct = (Pɩtʋʋ fɛyɩ)
validation-incorrect = (Pɩtɩtʋʋzɩ)
validation-partially-correct = (Pɩtʋʋ fɛyɩ pazɩ)
answer-show-responses =
    { $count ->
        [one] Wɩlɩ cosuu { $count } ŋgʋ kɩwɛ { $answerId } taa yɔ
       *[other] Wɩlɩ cosuu { $count } weyi ɩwɛ { $answerId } taa yɔ
    }

## Disclosure panels

feedback-heading = Cosuu
collapsible-click-to-open = (mabɩ nɛ kɩtʋlɩ)
collapsible-click-to-close = (mabɩ nɛ kɩtɔlɩ)
collapsible-initializing = Pɩpaɣzɩɣ…
footnote-show = Wɩlɩ tɛɛ takayaɣ
footnote-hide = Mɛsɩ tɛɛ takayaɣ
description-more-information = tɔm lɛɛtʋ

## Controls

slider-previous = Ŋgʋ kɩɖɛwa yɔ
slider-next = Ŋgʋ kɩkɔŋ yɔ
keyboard-open = Tʋlɩ Klaviye
keyboard-close = Tɔlɩ Klaviye
choice-input-remove-choice = Lɩzɩ { $choice }
matrix-remove-row = Lɩzɩ ñɔʋ
matrix-add-row = Sʋsɩ ñɔʋ
matrix-remove-column = Lɩzɩ kolonjɩ
matrix-add-column = Sʋsɩ kolonjɩ
subset-add-remove-points = Sʋsɩ/Lɩzɩ yʋsasɩ
subset-toggle-points-intervals = Lɛɣzɩ yʋsasɩ nɛ alɩwaatɩŋ
subset-move-points = Ñɔɔzɩ Yʋsasɩ
subset-clear = Hɩzɩ
orbital-add-row = Sʋsɩ Ñɔʋ
orbital-remove-row = Lɩzɩ Ñɔʋ
orbital-add-box = Sʋsɩ Aɖakaɣ
orbital-remove-box = Lɩzɩ Aɖakaɣ
orbital-add-up-arrow = Sʋsɩ Yʋsaɣ Ŋga Kɩwɛɛ Ɖoo Yɔ
orbital-add-down-arrow = Sʋsɩ Yʋsaɣ Ŋga Kɩwɛɛ Tɛɛ Yɔ
orbital-remove-arrow = Lɩzɩ Yʋsaɣ
orbital-row-label = Ñɔʋ { $row } hɩɖɛ
pretzel-answer = Cosuu

## Math input

math-input-preview-region = maɣzɩm tɔm kɩcalʋʋ naʋ
math-input-preview = Naʋ kɩcalʋʋ
math-input-invalid-expression = Tɔm kɩdɛkɛdɩtʋ:

## Document status

viewer-initializing = Pɩpaɣzɩɣ…

## Errors

error-heading = Kɩwɛɛkɩm
error-found-at =
    { $span ->
        [line] Panawa ñɔʋ { $startLine } yɔɔ.
       *[lines] Panawa ñɔŋ { $startLine }–{ $endLine } yɔɔ.
    }
document-contains-errors = Takayaɣ kanɛ kɛwɛnɩ kɩwɛɛkɩm!
diagnostic-heading-error = Kɩwɛɛkɩm
diagnostic-heading-warning = Paɣtʋ
diagnostic-heading-information = Tɔm
diagnostic-heading-hint = Sɩnʋʋ
accessibility-heading-level-1 = WCAG AA Talʋʋ Paɣtʋ Yɔɔ Maʋ
accessibility-heading-level-2 = Talʋʋ paɣtʋ
something-went-wrong = Nabʋyʋ tɩɖɔ camɩyɛ.
renderer-load-failed = wɩlɩyʋ nɔɔyʋ tɩkɔɔ. Ɖɩwakɩ-ŋ nɛ ŋtasɩ hɔɔlʋʋ ñʋʋ tʋlʋʋ.
core-start-failed = Takayaɣ wɩlɩyʋ tɩpɩzɩ nɛ ɛpaɣzɩ. Ɖɩwakɩ-ŋ nɛ ŋtasɩ hɔɔlʋʋ ñʋʋ tʋlʋʋ.
