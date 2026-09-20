# Dyula viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for what separates this catalog from `locales/bm`,
# for the qualifier suffix, and for what a speaker should check first.


## Answer submission

answer-checking = Lajɛli bɛ kɛ…
answer-submitting = Cili bɛ kɛ…
answer-checking-status = Jaabi bɛ lajɛ
answer-submitting-status = Jaabi bɛ ci
answer-correct = A ka ɲi
answer-incorrect = A man ɲi
answer-response-saved = Jaabi maralen don
answer-percent-credit = { $percent }% pɔnw
answer-percent-correct = { $percent }% ka ɲi
answer-percent-short = { $percent } %
max-credit-available = Pɔn caman minnu bɛ sɔrɔ: { $percent }%
attempts-remaining =
    { $count ->
        [0] kɛcogo si ma to
        [one] kɛcogo { $count } tora
       *[other] kɛcogo { $count } tora
    }
validation-correct = (A ka ɲi)
validation-incorrect = (A man ɲi)
validation-partially-correct = (A ka ɲi yɔrɔ dɔ la)
answer-show-responses =
    { $count ->
        [one] Jaabi { $count } jira { $answerId } kan
       *[other] Jaabi { $count } jira { $answerId } kan
    }

## Disclosure panels

feedback-heading = Ladilikan
collapsible-click-to-open = (a digi walisa ka a da wuli)
collapsible-click-to-close = (a digi walisa ka a datugu)
collapsible-initializing = Damina bɛ kɛ…
footnote-show = Duguma sɛbɛnni jira
footnote-hide = Duguma sɛbɛnni dogo
description-more-information = kunnafoni wɛrɛw

## Controls

slider-previous = Tɛmɛnen
slider-next = Nata
keyboard-open = Klaviye Da Wuli
keyboard-close = Klaviye Datugu
choice-input-remove-choice = { $choice } bɔ
matrix-remove-row = Layini bɔ
matrix-add-row = Layini fara
matrix-remove-column = Kolɔni bɔ
matrix-add-column = Kolɔni fara
subset-add-remove-points = Pɔnw fara/bɔ
subset-toggle-points-intervals = Pɔnw ni tilayɔrɔw falen
subset-move-points = Pɔnw Lamaga
subset-clear = Bɛɛ bɔ
orbital-add-row = Layini Fara
orbital-remove-row = Layini Bɔ
orbital-add-box = Kɛsu Fara
orbital-remove-box = Kɛsu Bɔ
orbital-add-up-arrow = Sanfɛ Bin Fara
orbital-add-down-arrow = Dugumafɛ Bin Fara
orbital-remove-arrow = Bin Bɔ
orbital-row-label = Layini { $row } tɔgɔ
pretzel-answer = Jaabi

## Math input

math-input-preview-region = jatebɔ kuma ɲɛfɔli
math-input-preview = Ɲɛfɔli
math-input-invalid-expression = Kuma jugu:

## Document status

viewer-initializing = Damina bɛ kɛ…

## Errors

error-heading = Fili
error-found-at =
    { $span ->
        [line] A sɔrɔla layini { $startLine } kan.
       *[lines] A sɔrɔla layini { $startLine }–{ $endLine } kan.
    }
document-contains-errors = Sɛbɛn in filiw bɛ a la!
diagnostic-heading-error = Fili
diagnostic-heading-warning = Lasɔmini
diagnostic-heading-information = Kunnafoni
diagnostic-heading-hint = Nɔnabɔli
accessibility-heading-level-1 = WCAG AA sekokɔrɔ tɛmɛ
accessibility-heading-level-2 = Sekokɔrɔ lasɔmini
something-went-wrong = Fɛn dɔ ma ɲɛ.
renderer-load-failed = jirala ma se. Aw ye ɲɛ in segin.
core-start-failed = Sɛbɛn jirala ma damina. Aw ye ɲɛ in segin.
