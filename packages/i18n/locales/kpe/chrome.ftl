# Kpelle viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `kpe` is Kpelle (Kpɛlɛwoo), South Mande — the same subgroup as Loma, whose
# catalog (`locales/lom`) was seeded alongside this one; see that file's
# header for the shared grammar (no gender, no article, no case, so `$gender`
# and `$role` go unused; no adjective-agreement marking either, so a
# description precedes the noun it modifies). `Intl.PluralRules('kpe')` has
# no dedicated data in Node's ICU build and falls back to the generic
# `one`/`other` categories, the same two categories `lom` and English use, so
# the `[one]`/`*[other]` branches below are shaped the same way as the rest of
# this batch.
#
# Kpelle is even less digitized than Loma: this seed found no comparable
# published word list to draw from (no equivalent of Loma's Sadler grammar or
# Omniglot page), so almost nothing here is directly attested. The strategy
# instead is to lean on the two things this seed can lean on: (1) the
# grammatical particles Kpelle and Loma plausibly share as close Southwestern
# Mande relatives — `ka`, `ma`, `bɛ`, `kɛ` ("to do/become", attested for
# Kpelle in Welmers's grammar), the `gaa`/`si … gaa` negation pattern, the
# `-lɛ`/`-i` result-state marking — reused here from `locales/lom` under that
# cognate assumption rather than verified word-by-word, and (2) a handful of
# vocabulary items with enough independent confidence to swap in on top of
# that base: the numerals `tao` "one", `feere` "two", `saba` "three" (shared
# Mande loan), and `naa` "four"; `kɛ` "do/become"; and, for register no
# published source covers (accessibility, technical UI verbs), an English
# loanword rather than a coined Kpelle term — English being Kpelle speakers'
# dominant contact language in Liberia, unlike Loma's Guinean-side contact
# with Maninka/French. Everything else — color terms, the plural shape
# `-ŋa`, and most content vocabulary — is a calque built the same way Loma's
# was, and should be treated as no more than a starting guess pending a
# speaker's correction; this catalog deserves at least as much scrutiny as
# `locales/lom`, which the batch already flags as its least certain.
#
# `Intl.DisplayNames` has no entry for `kpe` either, so `LOCALE_NAME_FALLBACKS`
# needs a manual English name; "Kpelle" is correct and unambiguous.


## Answer submission

answer-checking = A bɛi kɔlɔ-taa…
answer-submitting = A bɛi ci-taa…
answer-checking-status = Jaabi kɔlɔ-taa
answer-submitting-status = Jaabi ci-taa
answer-correct = A tɔɔ
answer-incorrect = A tɔɔ gaa
answer-response-saved = Jaabi marala
answer-percent-credit = { $percent }% pɔn
answer-percent-correct = { $percent }% tɔɔ
answer-percent-short = { $percent } %
max-credit-available = Pɔn gbɛtɛ mu wa sɔrɔ ma: { $percent }%
attempts-remaining =
    { $count ->
        [0] kɛcogo he to gaa
        [one] kɛcogo { $count } to
       *[other] kɛcogo { $count } to
    }
validation-correct = (A tɔɔ)
validation-incorrect = (A tɔɔ gaa)
validation-partially-correct = (A tɔɔ yɔrɔ dɔ ma)
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
subset-add-remove-points = Kɛlɛ-ŋa fa/bɔ
subset-toggle-points-intervals = Kɛlɛ-ŋa nda tila-yɔrɔ-ŋa falɛ
subset-move-points = Kɛlɛ-ŋa lamaga
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
math-input-invalid-expression = Kuma sɔsɔi:

## Document status

viewer-initializing = A bɛi damina-taa…

## Errors

error-heading = Fele
error-found-at =
    { $span ->
        [line] A sɔrɔla laa { $startLine } ma.
       *[lines] A sɔrɔla laa { $startLine }–{ $endLine } ma.
    }
document-contains-errors = Sɛbɛ nin fele-ŋa bɛ a la!
diagnostic-heading-error = Fele
diagnostic-heading-warning = Kɔlɔyaa
diagnostic-heading-information = Kunnafoni
diagnostic-heading-hint = Nɔnabɔli
accessibility-heading-level-1 = WCAG AA aksɛsibiliti tɛmɛli
accessibility-heading-level-2 = Aksɛsibiliti kɔlɔyaa
something-went-wrong = Fɛn dɔ tɔɔ gaa.
renderer-load-failed = jirala se gaa ka wuli. Ɲɛ nin segin.
core-start-failed = Sɛbɛ-jirala se gaa ka damina. Ɲɛ nin segin.
