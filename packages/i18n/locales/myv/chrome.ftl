# Erzya viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Erzya counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape it had. A noun after a numeral stays
# singular, so the two branches differ in nothing but the number they print.


## Answer submission

answer-checking = Ваннови…
answer-submitting = Кучови…
answer-checking-status = Каршо валось ваннови
answer-submitting-status = Каршо валось кучови
answer-correct = Виде
answer-incorrect = А виде
answer-response-saved = Каршо валось ванстозь
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% виде
answer-percent-short = { $percent } %
max-credit-available = Саемс маштови сехте покш балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] снартнема арась
        [one] { $count } снартнема кадовсь
       *[other] { $count } снартнема кадовсь
    }
validation-correct = (Виде)
validation-incorrect = (А виде)
validation-partially-correct = (Пельксэнь коряс виде)
answer-show-responses =
    { $count ->
        [one] { $answerId } лангс { $count } каршо вал невтемс
       *[other] { $answerId } лангс { $count } каршо вал невтемс
    }

## Disclosure panels

feedback-heading = Мекев ёвтамо
collapsible-click-to-open = (панжомга лепштик)
collapsible-click-to-close = (пекстамга лепштик)
collapsible-initializing = Анокстави…
footnote-show = Тешкстамонть невтемс
footnote-hide = Тешкстамонть кекшемс
description-more-information = поладкс тевпаро

## Controls

slider-previous = Икелень
slider-next = Сы
keyboard-open = Клавиатуранть панжомс
keyboard-close = Клавиатуранть пекстамс
choice-input-remove-choice = { $choice } кочкамонть саемс
matrix-remove-row = Рядонть саемс
matrix-add-row = Ряд поладомс
matrix-remove-column = Баганонть саемс
matrix-add-column = Баган поладомс
subset-add-remove-points = Точка поладомс/саемс
subset-toggle-points-intervals = Точкатнень ды юткотнень полавтомс
subset-move-points = Точкатнень ютавтомс
subset-clear = Ванськавтомс
orbital-add-row = Ряд поладомс
orbital-remove-row = Рядонть саемс
orbital-add-box = Клетка поладомс
orbital-remove-box = Клетканть саемс
orbital-add-up-arrow = Верев нал поладомс
orbital-add-down-arrow = Алов нал поладомс
orbital-remove-arrow = Налонть саемс
orbital-row-label = { $row } рядонь тешкс
pretzel-answer = Каршо вал

## Math input

math-input-preview-region = математикань ёвтамонь икелькс ваномась
math-input-preview = Икелькс ваномась
math-input-invalid-expression = А виде ёвтамо:

## Document status

viewer-initializing = Анокстави…

## Errors

error-heading = Ильведевкс
error-found-at =
    { $span ->
        [line] Муезь ряд: { $startLine }.
       *[lines] Муезь рядт: { $startLine }–{ $endLine }.
    }
document-contains-errors = Те документсэнть улить ильведевкст!
diagnostic-heading-error = Ильведевкс
diagnostic-heading-warning = Икелев пелькстамо
diagnostic-heading-information = Тевпаро
diagnostic-heading-hint = Невтевкске
accessibility-heading-level-1 = WCAG AA пачкодемань коламо
accessibility-heading-level-2 = Пачкодемадо тевпаро
something-went-wrong = Мезеяк а виде лиссь.
renderer-load-failed = артыцянть аволь саевсь. Лопанть одкстомтык.
core-start-failed = Документэнь ваныцянть аволь ушодовсь. Лопанть одкстомтык.
