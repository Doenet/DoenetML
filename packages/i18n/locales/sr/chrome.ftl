# Serbian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic and in the Ekavian standard; see the header of
# `content.ftl` for what that means for a reader arriving under `sr-Latn`.
#
# Serbian counts in three plural categories — `one`, `few` and `other` — so
# every `{ $count -> … }` below has three branches where English has two. `few`
# covers 2 to 4; `other` covers 5 and up as well as the teens. `one` catches 21
# and 101 as well as 1 and misses 11, which is why the wording for zero is
# spelled out in `[0]` rather than left to a category.
#
# Register: the second-person plural imperative — «Поново учитајте страницу».


## Answer submission

answer-checking = Провера…
answer-submitting = Слање…
answer-checking-status = Провера одговора
answer-submitting-status = Слање одговора
answer-correct = Тачно
answer-incorrect = Нетачно
answer-response-saved = Одговор је сачуван
answer-percent-credit = { $percent }% поена
answer-percent-correct = { $percent }% тачно
answer-percent-short = { $percent } %
max-credit-available = Највише могућих поена: { $percent }%
attempts-remaining =
    { $count ->
        [0] нема више покушаја
        [one] преостаје { $count } покушај
        [few] преостају { $count } покушаја
       *[other] преостаје { $count } покушаја
    }
validation-correct = (Тачно)
validation-incorrect = (Нетачно)
validation-partially-correct = (Делимично тачно)
answer-show-responses =
    { $count ->
        [one] Прикажи { $count } одговор на { $answerId }
        [few] Прикажи { $count } одговора на { $answerId }
       *[other] Прикажи { $count } одговора на { $answerId }
    }

## Disclosure panels

feedback-heading = Повратна информација
collapsible-click-to-open = (кликните да отворите)
collapsible-click-to-close = (кликните да затворите)
collapsible-initializing = Покретање…
footnote-show = Прикажи фусноту
footnote-hide = Сакриј фусноту
description-more-information = више информација

## Controls

slider-previous = Назад
slider-next = Напред
keyboard-open = Отвори тастатуру
keyboard-close = Затвори тастатуру
choice-input-remove-choice = Уклони { $choice }
matrix-remove-row = Уклони ред
matrix-add-row = Додај ред
matrix-remove-column = Уклони колону
matrix-add-column = Додај колону
subset-add-remove-points = Додај/уклони тачке
subset-toggle-points-intervals = Пребаци између тачака и интервала
subset-move-points = Помери тачке
subset-clear = Очисти
orbital-add-row = Додај ред
orbital-remove-row = Уклони ред
orbital-add-box = Додај поље
orbital-remove-box = Уклони поље
orbital-add-up-arrow = Додај стрелицу нагоре
orbital-add-down-arrow = Додај стрелицу надоле
orbital-remove-arrow = Уклони стрелицу
orbital-row-label = Ознака за ред { $row }
pretzel-answer = Одговор

## Math input

math-input-preview-region = преглед математичког израза
math-input-preview = Преглед
math-input-invalid-expression = Неисправан израз:

## Document status

viewer-initializing = Покретање…

## Errors

error-heading = Грешка
error-found-at =
    { $span ->
        [line] Пронађена у реду { $startLine }.
       *[lines] Пронађена у редовима { $startLine }–{ $endLine }.
    }
document-contains-errors = Овај документ садржи грешке!
diagnostic-heading-error = Грешка
diagnostic-heading-warning = Упозорење
diagnostic-heading-information = Информација
diagnostic-heading-hint = Савет
accessibility-heading-level-1 = Кршење приступачности према WCAG AA
accessibility-heading-level-2 = Упозорење о приступачности
something-went-wrong = Нешто је пошло наопако.
renderer-load-failed = модул за приказ није успео да се учита. Поново учитајте страницу.
core-start-failed = Прегледач документа није могао да се покрене. Поново учитајте страницу.
