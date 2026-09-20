# Loma viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `lom` is Loma (Löömàgòòi in Liberia, called Toma in Guinea), South Mande —
# the same subgroup as Kpelle, whose catalog (`locales/kpe`) was seeded
# alongside this one. Loma has no grammatical gender, no article and no case,
# so `$gender` and `$role` go unused exactly as they do in `locales/bm`,
# `locales/dyu` and `locales/mnk`; unlike those three it has no qualifier
# suffix or definite suffix either — Southwestern Mande adjectives simply
# follow the noun with no marking of their own, which `content.ftl`'s header
# says more about.
#
# Loma is a far smaller written language than its Manding neighbors in this
# batch: there is no comparable body of digitized text to draw this seed from,
# so the vocabulary here leans on the handful of published word lists (Sadler's
# grammar, Omniglot's phrase list) for the words they attest — «ɔɔi» yes, «bha»
# no, «e mama» thank you — and on cautious calques built the same way for
# everything else. A speaker should treat this catalog as the least certain of
# the batch and check it first.


## Answer submission

answer-checking = A bɛi kɔlɔ-taa…
answer-submitting = A bɛi ci-taa…
answer-checking-status = Jaabi kɔlɔ-taa
answer-submitting-status = Jaabi ci-taa
answer-correct = A mɛni
answer-incorrect = A mɛni gaa
answer-response-saved = Jaabi marala
answer-percent-credit = { $percent }% pɔn
answer-percent-correct = { $percent }% mɛni
answer-percent-short = { $percent } %
max-credit-available = Pɔn gbɛtɛ mu wa sɔrɔ ma: { $percent }%
attempts-remaining =
    { $count ->
        [0] kɛcogo he to gaa
        [one] kɛcogo { $count } to
       *[other] kɛcogo { $count } to
    }
validation-correct = (A mɛni)
validation-incorrect = (A mɛni gaa)
validation-partially-correct = (A mɛni yɔrɔ dɔ ma)
answer-show-responses =
    { $count ->
        [one] Jaabi { $count } jira { $answerId } ma
       *[other] Jaabi { $count } jira { $answerId } ma
    }

## Disclosure panels

feedback-heading = Kɔlɔyaa-jaabi
collapsible-click-to-open = (a digi ka a wulo)
collapsible-click-to-close = (a digi ka a tugu)
collapsible-initializing = A bɛi damina-taa…
footnote-show = Duguma-sɛbɛ jira
footnote-hide = Duguma-sɛbɛ dogo
description-more-information = kunnafoni gbɛtɛ

## Controls

slider-previous = Kɔrɔ
slider-next = Nata
keyboard-open = Klaviye wulo
keyboard-close = Klaviye tugu
choice-input-remove-choice = { $choice } bɔ
matrix-remove-row = Laa bɔ
matrix-add-row = Laa fa
matrix-remove-column = Kolo bɔ
matrix-add-column = Kolo fa
subset-add-remove-points = Kɛlɛ-nu fa/bɔ
subset-toggle-points-intervals = Kɛlɛ-nu nun tila-yɔrɔ-nu falɛ
subset-move-points = Kɛlɛ-nu lamaga
subset-clear = Bɛɛ bɔ
orbital-add-row = Laa fa
orbital-remove-row = Laa bɔ
orbital-add-box = Kɛsu fa
orbital-remove-box = Kɛsu bɔ
orbital-add-up-arrow = Sanfɛ-bin fa
orbital-add-down-arrow = Dugumafɛ-bin fa
orbital-remove-arrow = Bin bɔ
orbital-row-label = Laa { $row } tɔgɔ
pretzel-answer = Jaabi

## Math input

math-input-preview-region = jate-kuma ɲɛfɔli
math-input-preview = Ɲɛfɔli
math-input-invalid-expression = Kuma sɔsɔlen:

## Document status

viewer-initializing = A bɛi damina-taa…

## Errors

error-heading = Fele
error-found-at =
    { $span ->
        [line] A sɔrɔla laa { $startLine } ma.
       *[lines] A sɔrɔla laa { $startLine }–{ $endLine } ma.
    }
document-contains-errors = Sɛbɛ nin fele-nu bɛ a la!
diagnostic-heading-error = Fele
diagnostic-heading-warning = Kɔlɔyaa
diagnostic-heading-information = Kunnafoni
diagnostic-heading-hint = Nɔnabɔli
accessibility-heading-level-1 = WCAG AA sekokɔrɔ tɛmɛli
accessibility-heading-level-2 = Sekokɔrɔ kɔlɔyaa
something-went-wrong = Fɛn dɔ mɛni gaa.
renderer-load-failed = jirala se gaa ka wuli. Ɲɛ nin segin.
core-start-failed = Sɛbɛ-jirala se gaa ka damina. Ɲɛ nin segin.
