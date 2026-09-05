# Kyrgyz viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Kyrgyz counts in two plural categories, `one` and `other`, the same two
# English has, so every `{ $count -> … }` below keeps the shape it had. A noun
# after a numeral stays singular — «2 аракет», not a plural — so the two
# branches differ in nothing but the number they print.


## Answer submission

answer-checking = Текшерилүүдө…
answer-submitting = Жөнөтүлүүдө…
answer-checking-status = Жооп текшерилүүдө
answer-submitting-status = Жооп жөнөтүлүүдө
answer-correct = Туура
answer-incorrect = Ката
answer-response-saved = Жооп сакталды
answer-percent-credit = { $percent }% упай
answer-percent-correct = { $percent }% туура
answer-percent-short = { $percent } %
max-credit-available = Мүмкүн болгон эң жогорку упай: { $percent }%
attempts-remaining =
    { $count ->
        [0] аракет калган жок
        [one] { $count } аракет калды
       *[other] { $count } аракет калды
    }
validation-correct = (Туура)
validation-incorrect = (Ката)
validation-partially-correct = (Жарым-жартылай туура)
answer-show-responses =
    { $count ->
        [one] { $answerId } үчүн { $count } жоопту көрсөтүү
       *[other] { $answerId } үчүн { $count } жоопту көрсөтүү
    }

## Disclosure panels

feedback-heading = Кайтарым байланыш
collapsible-click-to-open = (ачуу үчүн басыңыз)
collapsible-click-to-close = (жабуу үчүн басыңыз)
collapsible-initializing = Даярдалууда…
footnote-show = Шилтемени көрсөтүү
footnote-hide = Шилтемени жашыруу
description-more-information = кошумча маалымат

## Controls

slider-previous = Мурунку
slider-next = Кийинки
keyboard-open = Тергичти ачуу
keyboard-close = Тергичти жабуу
choice-input-remove-choice = { $choice } тандоосун алып салуу
matrix-remove-row = Сапты өчүрүү
matrix-add-row = Сап кошуу
matrix-remove-column = Мамычаны өчүрүү
matrix-add-column = Мамыча кошуу
subset-add-remove-points = Чекиттерди кошуу/өчүрүү
subset-toggle-points-intervals = Чекиттер менен аралыктарды алмаштыруу
subset-move-points = Чекиттерди жылдыруу
subset-clear = Тазалоо
orbital-add-row = Сап кошуу
orbital-remove-row = Сапты өчүрүү
orbital-add-box = Уяча кошуу
orbital-remove-box = Уячаны өчүрүү
orbital-add-up-arrow = Өйдө караган жебе кошуу
orbital-add-down-arrow = Ылдый караган жебе кошуу
orbital-remove-arrow = Жебени өчүрүү
orbital-row-label = { $row } сабынын белгиси
pretzel-answer = Жооп

## Math input

math-input-preview-region = математикалык туюнтманын алдын ала көрүнүшү
math-input-preview = Алдын ала көрүнүш
math-input-invalid-expression = Жараксыз туюнтма:

## Document status

viewer-initializing = Даярдалууда…

## Errors

error-heading = Ката
error-found-at =
    { $span ->
        [line] { $startLine } сабынан табылды.
       *[lines] { $startLine }–{ $endLine } саптарынан табылды.
    }
document-contains-errors = Бул документте каталар бар!
diagnostic-heading-error = Ката
diagnostic-heading-warning = Эскертүү
diagnostic-heading-information = Маалымат
diagnostic-heading-hint = Кеңеш
accessibility-heading-level-1 = WCAG AA жеткиликтүүлүк бузуусу
accessibility-heading-level-2 = Жеткиликтүүлүк билдирүүсү
something-went-wrong = Бир нерсе туура эмес болду.
renderer-load-failed = чагылдыргычты жүктөө мүмкүн болбоду. Бетти жаңыртыңыз.
core-start-failed = Документти карап көрүү куралын иштетүү мүмкүн болбоду. Бетти жаңыртыңыз.
