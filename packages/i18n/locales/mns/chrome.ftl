# Mansi viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `mns` is Mansi (Vogul; мāньси лāтыӈ to its speakers), Ob-Ugric — with Khanty
# (`locales/kca`, seeded beside this one) the nearest living relative of
# Hungarian. Nothing in `locales/hu` helps write this file: the split is
# thousands of years deep, and Hungarian's vocabulary, its orthography and its
# whole technical register are of no use here.
#
# Written towards the **Sosva (Northern)** literary norm, the one Mansi
# schoolbooks and the Луима сэрипос newspaper use and the only one with a
# continuing published output. Upper Lozva, Konda and Pelym Mansi differ enough
# that a Konda reader will find this catalog foreign in places; ISO 639-3 gives
# them all a single `mns`, so a single catalog is what this repository can
# offer.
#
# THIS IS AMONG THE LEAST CERTAIN CATALOGS IN THE ROSTER, alongside
# `locales/kca`, `locales/xal` and `locales/lom`, and a speaker should read it
# early. Mansi is severely endangered, its written output is small, and none of
# the editor and diagnostics register exists in any published Mansi text. A
# good deal of the vocabulary below is therefore **coined**, not attested — see
# `content.ftl`'s header for the list of coinages and the loan policy.
#
# Mansi counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape it had. A noun after a numeral stays
# singular, so the two branches differ in nothing but the number they print.


## Answer submission

answer-checking = Сунсавē…
answer-submitting = Кēтавē…
answer-checking-status = Ювле лāтыӈ сунсавē
answer-submitting-status = Ювле лāтыӈ кēтавē
answer-correct = Ёмас
answer-incorrect = Ат ёмас
answer-response-saved = Ювле лāтыӈ хӯльтвēс
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% ёмас
answer-percent-short = { $percent } %
max-credit-available = Вуӈкве рōвнэ яныг балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] щёс ат хӯльтыс
        [one] { $count } щёс хӯльтыс
       *[other] { $count } щёс хӯльтыс
    }
validation-correct = (Ёмас)
validation-incorrect = (Ат ёмас)
validation-partially-correct = (Пēлыт ёмас)
answer-show-responses =
    { $count ->
        [one] { $answerId } палт { $count } ювле лāтыӈ нāӈктаӈкве
       *[other] { $answerId } палт { $count } ювле лāтыӈ нāӈктаӈкве
    }

## Disclosure panels

feedback-heading = Ювле лāтыӈ
collapsible-click-to-open = (пӯнсуӈкве щёлката)
collapsible-click-to-close = (пантуӈкве щёлката)
collapsible-initializing = Лēщатавē…
footnote-show = Пāс нāӈктаӈкве
footnote-hide = Пāс тӯйтуӈкве
description-more-information = мōт нōмт

## Controls

slider-previous = Ювле
slider-next = Ēлаль
keyboard-open = Клавиатура пӯнсуӈкве
keyboard-close = Клавиатура пантуӈкве
choice-input-remove-choice = { $choice } уртнэ вāрмаль кон вуӈкве
matrix-remove-row = Строка кон вуӈкве
matrix-add-row = Строка пинуӈкве
matrix-remove-column = Столбец кон вуӈкве
matrix-add-column = Столбец пинуӈкве
subset-add-remove-points = Пāс пинуӈкве/кон вуӈкве
subset-toggle-points-intervals = Пāс ос кӯтюв пēлы вēлтуӈкве
subset-move-points = Пāсыт ēлаль тотуӈкве
subset-clear = Щистаӈкве
orbital-add-row = Строка пинуӈкве
orbital-remove-row = Строка кон вуӈкве
orbital-add-box = Сӯп пинуӈкве
orbital-remove-box = Сӯп кон вуӈкве
orbital-add-up-arrow = Нуми нёл пинуӈкве
orbital-add-down-arrow = Ёлы нёл пинуӈкве
orbital-remove-arrow = Нёл кон вуӈкве
orbital-row-label = { $row } строка нам
pretzel-answer = Ювле лāтыӈ

## Math input

math-input-preview-region = математика лāтыӈ овыл сунсуӈкве пēлы
math-input-preview = Овыл сунсуӈкве
math-input-invalid-expression = Ат ёмас лāтыӈ:

## Document status

viewer-initializing = Лēщатавē…

## Errors

error-heading = Ошибка
error-found-at =
    { $span ->
        [line] Хōнтвēс строка: { $startLine }.
       *[lines] Хōнтвēсыт строкат: { $startLine }–{ $endLine }.
    }
document-contains-errors = Ты документ кӣвырт ошибкат ōлēгыт!
diagnostic-heading-error = Ошибка
diagnostic-heading-warning = Ӯргалан лāтыӈ
diagnostic-heading-information = Нōмт
diagnostic-heading-hint = Нётнэ лāтыӈ
accessibility-heading-level-1 = WCAG AA ёхтуӈкве рōвнэ вāрмаль сакватам
accessibility-heading-level-2 = Ёхтуӈкве рōвнэ вāрмаль урыл нōмт
something-went-wrong = Матыр ат ёмасыг ēмтыс.
renderer-load-failed = хансын вāрмаль ат вувēс. Страница ёт-выл пӯнсэн.
core-start-failed = Документ сунсын вāрмаль ат тāратвēс. Страница ёт-выл пӯнсэн.

core-start-failed-busy = Ты документ ат тāратвēс. Аква порат сав документ тāратавēсыт, ос мāнь машина палт тыи хоса мины. Мōт документыт лēщатахтыт ке, страница ёт-выл пӯнсуӈкве нётуӈкве рōви.
core-start-failed-retry = Ты документ ат тāратвēс.
core-start-failed-busy-retry = Ты документ ат тāратвēс. Аква порат сав документ тāратавēсыт, ос мāнь машина палт тыи хоса мины.
core-start-retry = Мōт щёс
saved-state-unavailable = Хӯльтум рӯпата ат вувēс.
