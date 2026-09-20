# Rusyn (русиньскый язык) viewer chrome: the buttons, panel headers and other
# UI the reader interacts with. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This file writes the **Prešov (Pryashiv) codification** of
# 1995, the norm taught and published in Slovakia, in Cyrillic. Its alphabet
# has letters English readers will want to "fix" and must not:
#   * **«ы»** is a letter of its own — «русиньскый», «жовтый», «вшыткы» — and
#     is not a mis-typed «и»;
#   * **«ї»** is soft «i» — «лінїя», «тлї» — and is not always where Ukrainian
#     puts one;
#   * **«ё»** is a letter of the alphabet, not a decorated «е»;
#   * **«ь»** is a letter in its own right, and «ґ» is distinct from «г».
#
# Rusyn is codified more than once, and this file writes **one** codification
# rather than mixing them: the Prešov norm here, not the Lemko norm of Poland
# (which has no «ї») and not a Transcarpathian norm. That is the same trade
# `locales/sc` and `locales/rm` record — a standard chosen over a spread of
# varieties, so that one document reads as one language. A corrector should
# move a word within the Prešov norm rather than toward another one.
#
# **This is a language of its own and must not be edited toward Ukrainian or
# Slovak.** Both sit beside it — `locales/uk` in the same script, `locales/sk`
# in the same state — and the pull of each is the thing to resist. The words
# that give it away: «што» (uk «що», sk «čo»), «лем» 'only' (uk «лише»), «кідь»
# 'if, when' (uk «якщо»), «вецей» 'more' (uk «більше»), «тот/тота/тото» (uk
# «цей/ця/це»), «жебы» (uk «щоб», sk «aby»), «холем» 'at least' (uk
# «щонайменше»), and the split reflexive «іґнорує ся» where Ukrainian writes
# «ігнорується». The feminine instrumental ends in **«-ов»** — «з чорнов
# рамков» — not Ukrainian «-ою».
#
# **Direction.** Left to right, like every other Cyrillic catalog here.
# `direction.ts` needs no entry for `rue`.
#
# **Number.** CLDR has **no** plural rules for `rue`:
# `Intl.PluralRules("rue")` resolves to the runtime's default locale, so a
# `zero`, `two`, `few` or `many` branch in this file would be selected by
# English's rules. That matters more here than it would for a Germanic
# language: Rusyn really does have a `few`/`many` split — «дві пробы» against
# «пять проб» — and nothing in the runtime could select between them. None
# appears anywhere; a counted noun is written in the one form that reads
# acceptably across the range, and the gap is recorded rather than papered
# over. `[0]` is matched against the number itself and so stays legal.


## Answer submission

answer-checking = Провірям…
answer-submitting = Посылам…
answer-checking-status = Провірям одповідь
answer-submitting-status = Посылам одповідь
answer-correct = Добрі
answer-incorrect = Хыбно
answer-response-saved = Одповідь є заховала
answer-percent-credit = { $percent }% бодів
answer-percent-correct = { $percent }% добрі
answer-percent-short = { $percent } %
max-credit-available = Найвеце бодів до здобытя: { $percent }%
# CLDR has no rules for `rue`, so no category branch is written: the genitive
# plural «проб» reads acceptably across the whole range and is what a
# `few`/`many` split would otherwise have to choose between.
attempts-remaining =
    { $count ->
        [0] не зістало жадных проб
       *[other] зістало { $count } проб
    }
validation-correct = (Добрі)
validation-incorrect = (Хыбно)
validation-partially-correct = (Часточно добрі)
answer-show-responses = Указати { $count } одповідей на { $answerId }

## Disclosure panels

feedback-heading = Одозва
collapsible-click-to-open = (клікнийте, жебы отворити)
collapsible-click-to-close = (клікнийте, жебы заперти)
collapsible-initializing = Стартує…
footnote-show = Указати помітку
footnote-hide = Сховати помітку
description-more-information = вецей інформацій

## Controls

slider-previous = Попереднїй
slider-next = Наступный
keyboard-open = Отворити клавесницю
keyboard-close = Заперти клавесницю
choice-input-remove-choice = Одобрати { $choice }
matrix-remove-row = Одобрати рядок
matrix-add-row = Придати рядок
matrix-remove-column = Одобрати стовпець
matrix-add-column = Придати стовпець
subset-add-remove-points = Придати / одобрати точкы
subset-toggle-points-intervals = Переключити точкы а інтервалы
subset-move-points = Пересунути точкы
subset-clear = Вычистити
orbital-add-row = Придати рядок
orbital-remove-row = Одобрати рядок
orbital-add-box = Придати клїтку
orbital-remove-box = Одобрати клїтку
orbital-add-up-arrow = Придати стрілку горі
orbital-add-down-arrow = Придати стрілку долов
orbital-remove-arrow = Одобрати стрілку
orbital-row-label = Назва про рядок { $row }
pretzel-answer = Одповідь

## Math input

math-input-preview-region = передоглядка математічного выразу
math-input-preview = Передоглядка
math-input-invalid-expression = Неправилный выраз:

## Document status

viewer-initializing = Стартує…

## Errors

error-heading = Хыба
error-found-at =
    { $span ->
        [line] Найдене на рядку { $startLine }.
       *[lines] Найдене на рядках { $startLine }–{ $endLine }.
    }
document-contains-errors = Тот документ мать в собі хыбы!
diagnostic-heading-error = Хыба
diagnostic-heading-warning = Варованя
diagnostic-heading-information = Інформація
diagnostic-heading-hint = Порада
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Порушіня приступности WCAG AA
accessibility-heading-level-2 = Варованя о приступности
something-went-wrong = Дашто пішло хыбно.
renderer-load-failed = модул про указованя ся не начітав. Начітайте сторінку зась.
core-start-failed = Тот документ ся не дав спустити. Начітайте сторінку зась.
core-start-failed-busy = Тот документ ся не дав спустити. Вецей документів стартовало нараз, а на помалшім приладї то може тырвати довше. Кідь другы документы скінчать, начітаня сторінкы може помочі.
core-start-failed-retry = Тот документ ся не дав спустити.
core-start-failed-busy-retry = Тот документ ся не дав спустити. Вецей документів стартовало нараз, а на помалшім приладї то може тырвати довше.
core-start-retry = Спробуйте зась
saved-state-unavailable = Ваша захована робота ся не дала начітати.
