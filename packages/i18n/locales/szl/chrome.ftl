# Silesian (ślōnskŏ gŏdka) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This file writes the **ślabikŏrzowy szrajbōnek**, the
# spelling Silesian publishing has used since 2010, and its extra letters are
# letters rather than decorated Polish ones:
#   * **«ō»** is the raised o of «gōra», «wielokōnt» — never Polish «ó»;
#   * **«ŏ»** is the *pochylŏne* a of «gŏdka», «czŏrny»;
#   * **«ô»** marks the prothetic w- of «ôdpowiydź», «ôbrŏz»;
#   * **«ã»** and **«õ»** are the nasals, and are not «ą» and «ę».
# A corrector who maps these back onto Polish letters is writing Polish.
#
# **This is not Polish and must not be edited toward it.** `locales/pl` sits
# beside this file and was read while it was written, which makes the two
# expected to look alike — and their agreement is therefore not evidence that
# either is right, the trap `locales/dsb` records for its own pair. Where they
# part company they do so in the commonest words: «niy» for «nie», «bez» for
# «przez», «ino» for «tylko», «kej»/«jak» for «gdy», «ôdpowiydź» for
# «odpowiedź», «feler» for «błąd», «rachtowanie» beside «obliczanie».
#
# **German is the second contact language**, which is where «feler», «dyl»
# and the technical loans come from, and it is why the loanwords here are not
# `locales/pl`'s.
#
# **Number.** CLDR has **no** plural rules for `szl`:
# `Intl.PluralRules("szl")` resolves to the runtime's default locale, so a
# `zero`, `two`, `few` or `many` branch in this file would be selected by
# English's rules — which would be wrong for a language that really does have a
# `few`/`many` split. None appears anywhere; a counted noun is written in the
# one form that reads acceptably across the range, and the gap is recorded
# rather than papered over. `[0]` is matched against the number itself and so
# stays legal.


## Answer submission

answer-checking = Badōm…
answer-submitting = Posyłōm…
answer-checking-status = Badōm ôdpowiydź
answer-submitting-status = Posyłōm ôdpowiydź
answer-correct = Dobrze
answer-incorrect = Źle
answer-response-saved = Ôdpowiydź je spamiyntanŏ
answer-percent-credit = { $percent }% pōnktōw
answer-percent-correct = { $percent }% dobrze
answer-percent-short = { $percent } %
max-credit-available = Nojwiyncyj pōnktōw do dostanio: { $percent }%
# CLDR has no rules for `szl`, so no category branch is written: the genitive
# plural «prōb» reads acceptably across the whole range and is what a
# `few`/`many` split would otherwise have to choose between.
attempts-remaining =
    { $count ->
        [0] niy ma wiyncyj prōb
       *[other] ôstało { $count } prōb
    }
validation-correct = (Dobrze)
validation-incorrect = (Źle)
validation-partially-correct = (Po dyl dobrze)
answer-show-responses = Pokŏż { $count } ôdpowiedzi do { $answerId }

## Disclosure panels

feedback-heading = Kōmyntŏrz
collapsible-click-to-open = (kliknij, coby ôdewrzić)
collapsible-click-to-close = (kliknij, coby zawrzić)
collapsible-initializing = Sztartuje…
footnote-show = Pokŏż przipis
footnote-hide = Skryj przipis
description-more-information = wiyncyj informacyji

## Controls

slider-previous = Piyrwyjszy
slider-next = Nastympny
keyboard-open = Ôdewrzij tastatura
keyboard-close = Zawrzij tastatura
choice-input-remove-choice = Wyciep { $choice }
matrix-remove-row = Wyciep wiersz
matrix-add-row = Przidej wiersz
matrix-remove-column = Wyciep kolumna
matrix-add-column = Przidej kolumna
subset-add-remove-points = Przidej / wyciep pōnkty
subset-toggle-points-intervals = Przeciep miyndzy pōnktami a przedziałami
subset-move-points = Przesuń pōnkty
subset-clear = Wypucuj
orbital-add-row = Przidej wiersz
orbital-remove-row = Wyciep wiersz
orbital-add-box = Przidej kastlik
orbital-remove-box = Wyciep kastlik
orbital-add-up-arrow = Przidej strzałka do gōry
orbital-add-down-arrow = Przidej strzałka na dōł
orbital-remove-arrow = Wyciep strzałka
orbital-row-label = Etyketa do wiersza { $row }
pretzel-answer = Ôdpowiydź

## Math input

math-input-preview-region = pokŏzka matymatycznego wyrażyniŏ
math-input-preview = Pokŏzka
math-input-invalid-expression = Wyrażynie niy je dobre:

## Document status

viewer-initializing = Sztartuje…

## Errors

error-heading = Feler
error-found-at =
    { $span ->
        [line] Znodziōne we wierszu { $startLine }.
       *[lines] Znodziōne we wierszach { $startLine }–{ $endLine }.
    }
document-contains-errors = Tyn dokumynt mŏ w siebie felery!
diagnostic-heading-error = Feler
diagnostic-heading-warning = Ôstrzeżynie
diagnostic-heading-information = Informacyjŏ
diagnostic-heading-hint = Rada
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Przekroczynie WCAG AA za przistympnŏść
accessibility-heading-level-2 = Ôstrzeżynie ô przistympnŏści
something-went-wrong = Coś poszło źle.
renderer-load-failed = moduł do pokŏzowaniŏ sie niy zaladowoł. Zaladuj strōna zaś.
core-start-failed = Tyn dokumynt sie niy dŏł ôdpalić. Zaladuj strōna zaś.
core-start-failed-busy = Tyn dokumynt sie niy dŏł ôdpalić. Wiyncyj dokumyntōw sztartowało naroz, a na wolniyjszyj maszinie to może trwać dużyj. Zaladowanie strōny zaś może pōmōc, jak inksze dokumynta skōńczōm.
core-start-failed-retry = Tyn dokumynt sie niy dŏł ôdpalić.
core-start-failed-busy-retry = Tyn dokumynt sie niy dŏł ôdpalić. Wiyncyj dokumyntōw sztartowało naroz, a na wolniyjszyj maszinie to może trwać dużyj.
core-start-retry = Sprōbuj zaś
saved-state-unavailable = Twoja spamiyntanŏ robota sie niy dała zaladować.
