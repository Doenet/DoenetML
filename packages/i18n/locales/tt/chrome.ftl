# Tatar viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Tatar counts in two plural categories, `one` and `other`, the same two English
# has, so every `{ $count -> … }` below keeps the shape it had. A noun after a
# numeral stays singular — «2 омтылыш», not a plural — so the two branches
# differ in nothing but the number they print.


## Answer submission

answer-checking = Тикшерелә…
answer-submitting = Җибәрелә…
answer-checking-status = Җавап тикшерелә
answer-submitting-status = Җавап җибәрелә
answer-correct = Дөрес
answer-incorrect = Ялгыш
answer-response-saved = Җавап сакланды
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% дөрес
answer-percent-short = { $percent } %
max-credit-available = Мөмкин булган иң югары балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] омтылыш калмады
        [one] { $count } омтылыш калды
       *[other] { $count } омтылыш калды
    }
validation-correct = (Дөрес)
validation-incorrect = (Ялгыш)
validation-partially-correct = (Өлешчә дөрес)
answer-show-responses =
    { $count ->
        [one] { $answerId } өчен { $count } җавап күрсәтү
       *[other] { $answerId } өчен { $count } җавап күрсәтү
    }

## Disclosure panels

feedback-heading = Кире бәйләнеш
collapsible-click-to-open = (ачу өчен басыгыз)
collapsible-click-to-close = (ябу өчен басыгыз)
collapsible-initializing = Әзерләнә…
footnote-show = Искәрмәне күрсәтү
footnote-hide = Искәрмәне яшерү
description-more-information = өстәмә мәгълүмат

## Controls

slider-previous = Алдагы
slider-next = Киләсе
keyboard-open = Клавиатураны ачу
keyboard-close = Клавиатураны ябу
choice-input-remove-choice = { $choice } сайлавын бетерү
matrix-remove-row = Юлны бетерү
matrix-add-row = Юл өстәү
matrix-remove-column = Баганны бетерү
matrix-add-column = Баган өстәү
subset-add-remove-points = Нокта өстәү/бетерү
subset-toggle-points-intervals = Нокталар белән аралыклар арасында алмаштыру
subset-move-points = Нокталарны күчерү
subset-clear = Чистарту
orbital-add-row = Юл өстәү
orbital-remove-row = Юлны бетерү
orbital-add-box = Күзәнәк өстәү
orbital-remove-box = Күзәнәкне бетерү
orbital-add-up-arrow = Өскә ук өстәү
orbital-add-down-arrow = Аска ук өстәү
orbital-remove-arrow = Укны бетерү
orbital-row-label = { $row } юлының тамгасы
pretzel-answer = Җавап

## Math input

math-input-preview-region = математик аңлатманың алдан каралышы
math-input-preview = Алдан каралыш
math-input-invalid-expression = Дөрес булмаган аңлатма:

## Document status

viewer-initializing = Әзерләнә…

## Errors

error-heading = Хата
error-found-at =
    { $span ->
        [line] Табылган юл: { $startLine }.
       *[lines] Табылган юллар: { $startLine }–{ $endLine }.
    }
document-contains-errors = Бу документта хаталар бар!
diagnostic-heading-error = Хата
diagnostic-heading-warning = Кисәтү
diagnostic-heading-information = Мәгълүмат
diagnostic-heading-hint = Киңәш
accessibility-heading-level-1 = WCAG AA үтемлелек бозуы
accessibility-heading-level-2 = Үтемлелек хәбәре
something-went-wrong = Нәрсәдер дөрес булмады.
renderer-load-failed = сурәтләүчене йөкләп булмады. Битне яңартыгыз.
core-start-failed = Документ карагычын эшләтеп җибәреп булмады. Битне яңартыгыз.
