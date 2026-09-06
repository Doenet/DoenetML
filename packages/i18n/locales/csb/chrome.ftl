# Kashubian (kaszëbsczi) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This file writes the standard Kashubian alphabet, and its
# extra letters are letters of that alphabet rather than decorated Polish ones:
#   * **«ë»** is the *szwa*, the reduced vowel of «kaszëbsczi», «lëchi»,
#     «wëbrac» — it is never Polish «y» and never Polish «e»;
#   * **«ò»** and **«ù»** mark the diphthongal onset, the ⁿo̯/ᵘo̯ glide of
#     «òdpòwiésc», «òtemkni», «ùkòsny» — they are not «o» and «u»;
#   * **«ã»** is the nasal of the instrumental singular «z rantã»;
#   * **«é»**, **«ó»** and **«ô»** are three distinct vowels («òdpòwiésc»,
#     «pòdób», «czôrny») and none of them is Polish «ó».
# A corrector who maps these back onto Polish letters is writing Polish.
#
# **This is not Polish and must not be edited toward it.** `locales/pl` sits
# beside this file and was read while it was written, which makes the two
# expected to look alike — and their agreement is therefore not evidence that
# either is right, the trap `locales/dsb` records for its own pair. Where they
# part company they do so in the commonest words: «nié» for the bare no,
# «òdpòwiésc» for «odpowiedź», «bëlno»/«bëlny» for «dobrze»/
# «dobry», «lëchi» for «zły», «jinaczi» for «inaczej», «réżka» for «wiersz»,
# «miono» for «nazwa», «ôrt» for «rodzaj», «wôrtnota» for «wartość», and the
# adjective «kaszëbsczi» itself, whose «-sczi» is not Polish «-ski».
#
# **German is the second contact language** — Kashubian sat inside Prussian
# Pomerania — which is where «fela» (Fehler), «felowac», «ôrt» (Art),
# «bùchsztôw» (Buchstabe) and the technical loans come from, and it is why the
# loanwords here are not `locales/pl`'s.
#
# **Number.** CLDR has **no** plural rules for `csb`:
# `Intl.PluralRules("csb")` resolves to the runtime's default locale, so a
# `zero`, `two`, `few` or `many` branch in this file would be selected by
# English's rules — which would be wrong for a language that really does have a
# `few`/`many` split. None appears anywhere; a counted noun is written in the
# one form that reads acceptably across the range, and the gap is recorded
# rather than papered over. `[0]` is matched against the number itself and so
# stays legal.


## Answer submission

answer-checking = Sprôwdzóm…
answer-submitting = Wësélóm…
answer-checking-status = Sprôwdzóm òdpòwiésc
answer-submitting-status = Wësélóm òdpòwiésc
answer-correct = Bëlno
answer-incorrect = Lëchò
answer-response-saved = Òdpòwiésc je zapisónô
answer-percent-credit = { $percent }% pùnktów
answer-percent-correct = { $percent }% bëlno
answer-percent-short = { $percent } %
max-credit-available = Nôwicy pùnktów do dostaniô: { $percent }%
# CLDR has no rules for `csb`, so no category branch is written: the genitive
# plural «prób» reads acceptably across the whole range and is what a
# `few`/`many` split would otherwise have to choose between.
attempts-remaining =
    { $count ->
        [0] ni ma wicy prób
       *[other] òstało { $count } prób
    }
validation-correct = (Bëlno)
validation-incorrect = (Lëchò)
validation-partially-correct = (Pò dzélu bëlno)
answer-show-responses = Pòkażë { $count } òdpòwiescy do { $answerId }

## Disclosure panels

feedback-heading = Kòmentôrz
collapsible-click-to-open = (klëkni, żebë òtemknąc)
collapsible-click-to-close = (klëkni, żebë zamknąc)
collapsible-initializing = Zaczinóm…
footnote-show = Pòkażë przëpisk
footnote-hide = Zakrëj przëpisk
description-more-information = wicy wiadłów

## Controls

slider-previous = Nazôd
slider-next = Dali
keyboard-open = Òtemkni klawiaturã
keyboard-close = Zamkni klawiaturã
choice-input-remove-choice = Rëmôj { $choice }
matrix-remove-row = Rëmôj réżkã
matrix-add-row = Dodôj réżkã
matrix-remove-column = Rëmôj kòlumnã
matrix-add-column = Dodôj kòlumnã
subset-add-remove-points = Dodôj / rëmôj pùnktë
subset-toggle-points-intervals = Przełącz midzë pùnktama a przedzélama
subset-move-points = Przesuni pùnktë
subset-clear = Wëczëszczë
orbital-add-row = Dodôj réżkã
orbital-remove-row = Rëmôj réżkã
orbital-add-box = Dodôj kastã
orbital-remove-box = Rëmôj kastã
orbital-add-up-arrow = Dodôj strzélkã w górã
orbital-add-down-arrow = Dodôj strzélkã w dół
orbital-remove-arrow = Rëmôj strzélkã
orbital-row-label = Etikéta do réżczi { $row }
pretzel-answer = Òdpòwiésc

## Math input

math-input-preview-region = pòdzérk matematicznégò wërażeniô
math-input-preview = Pòdzérk
math-input-invalid-expression = Wërażenié nie je bëlné:

## Document status

viewer-initializing = Zaczinóm…

## Errors

error-heading = Fela
error-found-at =
    { $span ->
        [line] Nalazłé w réżce { $startLine }.
       *[lines] Nalazłé w réżkach { $startLine }–{ $endLine }.
    }
document-contains-errors = Nen dokùment mô w se felë!
diagnostic-heading-error = Fela
diagnostic-heading-warning = Òstrzedżenié
diagnostic-heading-information = Wiadło
diagnostic-heading-hint = Rada
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Przekroczenié WCAG AA za przëstãpnosc
accessibility-heading-level-2 = Òstrzedżenié ò przëstãpnoscë
something-went-wrong = Cos poszło lëchò.
renderer-load-failed = mòduł do pòkazowaniô sã nie zaladowôł. Zaladuj stronã znowa.
core-start-failed = Nen dokùment sã nie dôł zapùscëc. Zaladuj stronã znowa.
core-start-failed-busy = Nen dokùment sã nie dôł zapùscëc. Wicy dokùmentów zaczinało naraz, a na wòlniészi maszinie to mòże trwac dłëżi. Zaladowanié stronë znowa mòże pòmòc, jak jinszé dokùmentë skùńczą.
core-start-failed-retry = Nen dokùment sã nie dôł zapùscëc.
core-start-failed-busy-retry = Nen dokùment sã nie dôł zapùscëc. Wicy dokùmentów zaczinało naraz, a na wòlniészi maszinie to mòże trwac dłëżi.
core-start-retry = Spróbùj znowa
saved-state-unavailable = Twòja zapisónô robòta sã nie dała zaladowac.
