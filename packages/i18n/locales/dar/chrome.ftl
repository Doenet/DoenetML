# Dargwa viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Dargwa is a group of varieties, not one language, and this catalog is the
# Akusha-based literary standard.** Akusha (Акуша) is what Dagestan's schools
# teach, what the republic's Dargwa-language press is set in, and what a bare
# `dar` maximizes to — `dar-Cyrl-RU`. A reader from Kajtag, Kubachi, Itsari,
# Chirag, Megeb or Sirhwa will find words here that their own variety does not
# use, and some of those varieties are far enough from Akusha to be counted as
# separate languages; this file is not addressed to them and does not claim to
# be.
#
# Written in Cyrillic with the palochka Ӏ, which is a letter of the alphabet —
# not a Latin capital I and not a digit 1. A file that spells «хатӀа» with
# either has quietly stopped being Dargwa.
#
# Dargwa counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape English gave it. A noun after a
# numeral stays in the singular, so the two branches differ in nothing but the
# number they print — that is Dargwa grammar, not a copy-paste slip.
#
# Nothing in this file agrees with a noun class. Dargwa has one — see
# `content.ftl`, where the whole of the class question is worked out — but the
# words here are not the kind that carry a class prefix.
#
# Least certain in this file: «гьаргдеш» for *accessibility* is a transparent
# coinage from «гьаргси» (open) rather than an attested term, and «балахъни»
# for *warning* is a stretch of «балахъес» (to announce). The technical nouns
# are the Russian ones written Dargwa uses in practice — «клавиатура»,
# «клетка», «стрелка», «столбец», «интервал».


## Answer submission

answer-checking = Ахтарбирули…
answer-submitting = Бархьули…
answer-checking-status = Жаваб ахтарбирули
answer-submitting-status = Жаваб бархьули
answer-correct = Бархьси
answer-incorrect = Бархьси ахӀен
answer-response-saved = Жаваб мяхӀкамбарибси
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% бархьси
answer-percent-short = { $percent } %
max-credit-available = БегӀлара халаси балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] кализурти попыткаби агара
        [one] { $count } попытка кализурли саби
       *[other] { $count } попытка кализурли саби
    }
validation-correct = (Бархьси)
validation-incorrect = (Бархьси ахӀен)
validation-partially-correct = (БутӀала бархьси)
# «{ $answerId } жаваблис» — the value is followed by a word this catalog
# writes, so no case ending is welded onto something the catalog never sees.
answer-show-responses =
    { $count ->
        [one] { $answerId } жаваблис { $count } жаваб чебаахъа
       *[other] { $answerId } жаваблис { $count } жаваб чебаахъа
    }

## Disclosure panels

feedback-heading = Пикри
collapsible-click-to-open = (абхьес кабяхъа)
collapsible-click-to-close = (кӀапӀбарес кабяхъа)
collapsible-initializing = ХӀядурбирули…
footnote-show = Удибси белкӀ чебаахъа
footnote-hide = Удибси белкӀ кӀапӀбара
description-more-information = имцӀаси хабар

## Controls

slider-previous = Гьалаб
slider-next = ГӀергъи
keyboard-open = Клавиатура абхьа
keyboard-close = Клавиатура кӀапӀбара
choice-input-remove-choice = { $choice } ардука
matrix-remove-row = Жерге ардука
matrix-add-row = Жерге кабихьа
matrix-remove-column = Столбец ардука
matrix-add-column = Столбец кабихьа
subset-add-remove-points = Точкаби кадихьес/ардукес
subset-toggle-points-intervals = Точкаби ва интервалуни дарсдарес
subset-move-points = Точкаби гечдара
subset-clear = Умубара
orbital-add-row = Жерге кабихьа
orbital-remove-row = Жерге ардука
orbital-add-box = Клетка кабихьа
orbital-remove-box = Клетка ардука
orbital-add-up-arrow = Чедиси стрелка кабихьа
orbital-add-down-arrow = Удиси стрелка кабихьа
orbital-remove-arrow = Стрелка ардука
orbital-row-label = { $row } жергела лишан
pretzel-answer = Жаваб

## Math input

math-input-preview-region = математикала выражение гьалаб чебаахъни
math-input-preview = Гьаларла хӀер
math-input-invalid-expression = Бархьси ахӀенси выражение:

## Document status

viewer-initializing = ХӀядурбирули…

## Errors

error-heading = ХатӀа
error-found-at =
    { $span ->
        [line] Баргибси жерге: { $startLine }.
       *[lines] Даргибти жергни: { $startLine }–{ $endLine }.
    }
document-contains-errors = Иш документлизир хатӀаби лер!
diagnostic-heading-error = ХатӀа
diagnostic-heading-warning = Балахъни
diagnostic-heading-information = Хабар
diagnostic-heading-hint = Гьанбушни
accessibility-heading-level-1 = WCAG AA гьаргдешла дохни
accessibility-heading-level-2 = Гьаргдешла хӀекьлизибси балахъни
something-went-wrong = СекӀал бархьли хӀебакӀиб.
renderer-load-failed = сурат бирнила модуль хӀебилцӀун. БяхӀ гьатӀира абхьа.
core-start-failed = Иш документ бехӀбихьес хӀебирар. БяхӀ гьатӀира абхьа.
core-start-failed-busy = Иш документ бехӀбихьес хӀебирар. Цали цала гӀергъи дахъал документуни бехӀбирхьули сарри, гьалакли хӀебирути машинабазиб иш замана имцӀали бетарар. ЦархӀилти документуни таманбиубли гӀергъи бяхӀ гьатӀира абхьалли, кумек бетарес асубирар.
core-start-failed-retry = Иш документ бехӀбихьес хӀебирар.
core-start-failed-busy-retry = Иш документ бехӀбихьес хӀебирар. Цали цала гӀергъи дахъал документуни бехӀбирхьули сарри, гьалакли хӀебирути машинабазиб иш замана имцӀали бетарар.
core-start-retry = ГьатӀира бара
saved-state-unavailable = ХӀела мяхӀкамбарибси хӀянчи касес хӀебирар.
