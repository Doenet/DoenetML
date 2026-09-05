# Chechen viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The palochka Ӏ is a letter of the alphabet, not a Latin I and not a digit 1.
#
# Chechen counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape it had. A noun after a numeral stays
# singular, so the two branches differ in nothing but the number they print.
# Nothing in this file agrees with a noun class — see `content.ftl`, which is
# where the class fork lives.


## Answer submission

answer-checking = Талло…
answer-submitting = ДӀадоьхуьйту…
answer-checking-status = Жоп талло
answer-submitting-status = Жоп дӀадоьхуьйту
answer-correct = Нийса
answer-incorrect = Нийса дац
answer-response-saved = Жоп Ӏалашдина
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% нийса
answer-percent-short = { $percent } %
max-credit-available = Схьаэца тарлун сов баккхий балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] гӀорт йисина яц
        [one] { $count } гӀорт йисина
       *[other] { $count } гӀорт йисина
    }
validation-correct = (Нийса)
validation-incorrect = (Нийса дац)
validation-partially-correct = (Дакъош нийса)
answer-show-responses =
    { $count ->
        [one] { $answerId } тӀе { $count } жоп гайта
       *[other] { $answerId } тӀе { $count } жоп гайта
    }

## Disclosure panels

feedback-heading = ЮхаӀаткъам
collapsible-click-to-open = (даста тӀетаӀае)
collapsible-click-to-close = (дӀакъовла тӀетаӀае)
collapsible-initializing = Кечдо…
footnote-show = Билгалдар гайта
footnote-hide = Билгалдар къайладаккха
description-more-information = тӀетоьхна хаам

## Controls

slider-previous = Хьалха
slider-next = ТӀаьхьа
keyboard-open = Клавиатура даста
keyboard-close = Клавиатура дӀакъовла
choice-input-remove-choice = { $choice } харжам дӀабаккха
matrix-remove-row = МогӀа дӀабаккха
matrix-add-row = МогӀа тӀетоха
matrix-remove-column = Багана дӀаяккха
matrix-add-column = Багана тӀетоха
subset-add-remove-points = ТӀадам тӀетоха/дӀабаккха
subset-toggle-points-intervals = ТӀадамаш а, юкъамаш а хийца
subset-move-points = ТӀадамаш дӀадаха
subset-clear = ЦӀандан
orbital-add-row = МогӀа тӀетоха
orbital-remove-row = МогӀа дӀабаккха
orbital-add-box = Клетка тӀетоха
orbital-remove-box = Клетка дӀаяккха
orbital-add-up-arrow = Лакхарчу тӀам тӀетоха
orbital-add-down-arrow = Лахарчу тӀам тӀетоха
orbital-remove-arrow = ТӀам дӀабаккха
orbital-row-label = { $row } могӀанан хьаьрк
pretzel-answer = Жоп

## Math input

math-input-preview-region = математически билгалдаккхаран хьалхара хьажар
math-input-preview = Хьалхара хьажар
math-input-invalid-expression = Нийса доцу билгалдаккхар:

## Document status

viewer-initializing = Кечдо…

## Errors

error-heading = ГӀалат
error-found-at =
    { $span ->
        [line] Каро могӀа: { $startLine }.
       *[lines] Каро могӀанаш: { $startLine }–{ $endLine }.
    }
document-contains-errors = ХӀокху документехь гӀалаташ ду!
diagnostic-heading-error = ГӀалат
diagnostic-heading-warning = Тергамча
diagnostic-heading-information = Хаам
diagnostic-heading-hint = Хьехам
accessibility-heading-level-1 = WCAG AA кхачаран дохор
accessibility-heading-level-2 = Кхачаран хьокъехь хаам
something-went-wrong = ХӀума нийса ца хилла.
renderer-load-failed = сурт диллархо чуялийта ца делира. АгӀо керлаян.
core-start-failed = Документан хьажархо болийта ца делира. АгӀо керлаян.
