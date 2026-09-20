# Tajik viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Tajik counts in two plural categories, `one` and `other`, the same two English
# has, so every `{ $count -> … }` below keeps the shape it had. A noun after a
# numeral stays singular — «2 кӯшиш», not a plural — so the two branches differ
# in nothing but the number they print. Persian counts zero with the singular
# and Tajik's rule is the same, which is why `[0]` is written out by number
# rather than left to a category.


## Answer submission

answer-checking = Санҷида мешавад…
answer-submitting = Фиристода мешавад…
answer-checking-status = Ҷавоб санҷида мешавад
answer-submitting-status = Ҷавоб фиристода мешавад
answer-correct = Дуруст
answer-incorrect = Нодуруст
answer-response-saved = Ҷавоб нигоҳ дошта шуд
answer-percent-credit = { $percent }% холҳо
answer-percent-correct = { $percent }% дуруст
answer-percent-short = { $percent } %
max-credit-available = Холи аз ҳама баланди имконпазир: { $percent }%
attempts-remaining =
    { $count ->
        [0] кӯшиш намондааст
        [one] { $count } кӯшиш мондааст
       *[other] { $count } кӯшиш мондааст
    }
validation-correct = (Дуруст)
validation-incorrect = (Нодуруст)
validation-partially-correct = (Қисман дуруст)
answer-show-responses =
    { $count ->
        [one] Нишон додани { $count } ҷавоб ба { $answerId }
       *[other] Нишон додани { $count } ҷавоб ба { $answerId }
    }

## Disclosure panels

feedback-heading = Бозхонд
collapsible-click-to-open = (барои кушодан пахш кунед)
collapsible-click-to-close = (барои пӯшидан пахш кунед)
collapsible-initializing = Омода мешавад…
footnote-show = Нишон додани эзоҳ
footnote-hide = Пинҳон кардани эзоҳ
description-more-information = маълумоти иловагӣ

## Controls

slider-previous = Қаблӣ
slider-next = Навбатӣ
keyboard-open = Кушодани клавиатура
keyboard-close = Пӯшидани клавиатура
choice-input-remove-choice = Хориҷ кардани { $choice }
matrix-remove-row = Хориҷ кардани сатр
matrix-add-row = Илова кардани сатр
matrix-remove-column = Хориҷ кардани сутун
matrix-add-column = Илова кардани сутун
subset-add-remove-points = Илова/хориҷ кардани нуқтаҳо
subset-toggle-points-intervals = Иваз кардани нуқтаҳо ва фосилаҳо
subset-move-points = Ҷойивазкунии нуқтаҳо
subset-clear = Тоза кардан
orbital-add-row = Илова кардани сатр
orbital-remove-row = Хориҷ кардани сатр
orbital-add-box = Илова кардани хона
orbital-remove-box = Хориҷ кардани хона
orbital-add-up-arrow = Илова кардани тири боло
orbital-add-down-arrow = Илова кардани тири поён
orbital-remove-arrow = Хориҷ кардани тир
orbital-row-label = Нишонаи сатри { $row }
pretzel-answer = Ҷавоб

## Math input

math-input-preview-region = пешнамоиши ифодаи математикӣ
math-input-preview = Пешнамоиш
math-input-invalid-expression = Ифодаи нодуруст:

## Document status

viewer-initializing = Омода мешавад…

## Errors

error-heading = Хато
error-found-at =
    { $span ->
        [line] Дар сатри { $startLine } ёфт шуд.
       *[lines] Дар сатрҳои { $startLine }–{ $endLine } ёфт шуд.
    }
document-contains-errors = Ин ҳуҷҷат хатоҳо дорад!
diagnostic-heading-error = Хато
diagnostic-heading-warning = Огоҳӣ
diagnostic-heading-information = Маълумот
diagnostic-heading-hint = Маслиҳат
accessibility-heading-level-1 = Вайронкунии дастрасии WCAG AA
accessibility-heading-level-2 = Огоҳиномаи дастрасӣ
something-went-wrong = Чизе нодуруст рафт.
renderer-load-failed = тасвиргарро бор кардан нашуд. Лутфан саҳифаро нав кунед.
core-start-failed = Тамошобини ҳуҷҷатро оғоз кардан нашуд. Лутфан саҳифаро нав кунед.
