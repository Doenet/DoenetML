# Belarusian viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Belarusian counts in four plural categories — `one`, `few`, `many` and
# `other` — so every `{ $count -> … }` below has four branches where English
# has two. `many` covers five and up, the teens and the round tens, and it
# takes the genitive plural: «5 спроб», not «5 спробы».
#
# Zero falls to `many` as well, which is why the wording for zero is spelled
# out in `[0]` rather than left to a category: the English changes more than
# the noun there.
#
# Register: the second-person plural imperative — «Перазагрузіце старонку».


## Answer submission

answer-checking = Праверка…
answer-submitting = Адпраўка…
answer-checking-status = Праверка адказу
answer-submitting-status = Адпраўка адказу
answer-correct = Правільна
answer-incorrect = Няправільна
answer-response-saved = Адказ захаваны
answer-percent-credit = { $percent }% балаў
answer-percent-correct = { $percent }% правільна
answer-percent-short = { $percent } %
max-credit-available = Найбольшая магчымая колькасць балаў: { $percent }%
attempts-remaining =
    { $count ->
        [0] спроб не засталося
        [one] засталася { $count } спроба
        [few] засталося { $count } спробы
        [many] засталося { $count } спроб
       *[other] засталося { $count } спробы
    }
validation-correct = (Правільна)
validation-incorrect = (Няправільна)
validation-partially-correct = (Часткова правільна)
answer-show-responses =
    { $count ->
        [one] Паказаць { $count } адказ на { $answerId }
        [few] Паказаць { $count } адказы на { $answerId }
        [many] Паказаць { $count } адказаў на { $answerId }
       *[other] Паказаць { $count } адказы на { $answerId }
    }

## Disclosure panels

feedback-heading = Зваротная сувязь
collapsible-click-to-open = (націсніце, каб адкрыць)
collapsible-click-to-close = (націсніце, каб закрыць)
collapsible-initializing = Ініцыялізацыя…
footnote-show = Паказаць зноску
footnote-hide = Схаваць зноску
description-more-information = больш звестак

## Controls

slider-previous = Назад
slider-next = Наперад
keyboard-open = Адкрыць клавіятуру
keyboard-close = Закрыць клавіятуру
choice-input-remove-choice = Выдаліць { $choice }
matrix-remove-row = Выдаліць радок
matrix-add-row = Дадаць радок
matrix-remove-column = Выдаліць слупок
matrix-add-column = Дадаць слупок
subset-add-remove-points = Дадаць/выдаліць пункты
subset-toggle-points-intervals = Пераключыць паміж пунктамі і інтэрваламі
subset-move-points = Перамясціць пункты
subset-clear = Ачысціць
orbital-add-row = Дадаць радок
orbital-remove-row = Выдаліць радок
orbital-add-box = Дадаць ячэйку
orbital-remove-box = Выдаліць ячэйку
orbital-add-up-arrow = Дадаць стрэлку ўверх
orbital-add-down-arrow = Дадаць стрэлку ўніз
orbital-remove-arrow = Выдаліць стрэлку
orbital-row-label = Подпіс для радка { $row }
pretzel-answer = Адказ

## Math input

math-input-preview-region = папярэдні прагляд матэматычнага выразу
math-input-preview = Прагляд
math-input-invalid-expression = Няправільны выраз:

## Document status

viewer-initializing = Ініцыялізацыя…

## Errors

error-heading = Памылка
error-found-at =
    { $span ->
        [line] Знойдзена ў радку { $startLine }.
       *[lines] Знойдзена ў радках { $startLine }–{ $endLine }.
    }
document-contains-errors = Гэты дакумент змяшчае памылкі!
diagnostic-heading-error = Памылка
diagnostic-heading-warning = Папярэджанне
diagnostic-heading-information = Звесткі
diagnostic-heading-hint = Падказка
accessibility-heading-level-1 = Парушэнне даступнасці паводле WCAG AA
accessibility-heading-level-2 = Паведамленне пра даступнасць
something-went-wrong = Нешта пайшло не так.
renderer-load-failed = не ўдалося загрузіць модуль адлюстравання. Перазагрузіце старонку.
core-start-failed = Не ўдалося запусціць прагляднік дакумента. Перазагрузіце старонку.
