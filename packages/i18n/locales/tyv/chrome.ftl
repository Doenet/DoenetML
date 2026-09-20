# Tuvan viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Tuvan counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape it had — and, as in Bashkir and
# Tatar, a noun after a numeral stays singular, so the two branches differ in
# nothing but the number they print. `locales/sah` beside it is the Turkic
# catalog where ICU reports only one category at all, which is worth knowing
# before anyone assumes the family decides this.


## Answer submission

answer-checking = Хынап турар…
answer-submitting = Чорудуп турар…
answer-checking-status = Харыыны хынап турар
answer-submitting-status = Харыыны чорудуп турар
answer-correct = Шын
answer-incorrect = Меге
answer-response-saved = Харыы шыгжаттынган
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% шын
answer-percent-short = { $percent } %
max-credit-available = Ап болур эң улуг балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] оралдажыышкын арталбаан
        [one] { $count } оралдажыышкын арткан
       *[other] { $count } оралдажыышкын арткан
    }
validation-correct = (Шын)
validation-incorrect = (Меге)
validation-partially-correct = (Кезии-биле шын)
answer-show-responses =
    { $count ->
        [one] { $answerId } дээш { $count } харыыны көргүзер
       *[other] { $answerId } дээш { $count } харыыны көргүзер
    }

## Disclosure panels

feedback-heading = Дедир харыы
collapsible-click-to-open = (ажарда базыңар)
collapsible-click-to-close = (хаарда базыңар)
collapsible-initializing = Белеткенип турар…
footnote-show = Демдеглелди көргүзер
footnote-hide = Демдеглелди чажырар
description-more-information = немелде медээ

## Controls

slider-previous = Мурнунда
slider-next = Дараазында
keyboard-open = Клавиатураны ажар
keyboard-close = Клавиатураны хаар
choice-input-remove-choice = { $choice } шилилгезин ужулдурар
matrix-remove-row = Одуругну ужулдурар
matrix-add-row = Одуруг немээр
matrix-remove-column = Баганны ужулдурар
matrix-add-column = Баган немээр
subset-add-remove-points = Точка немээр/ужулдурар
subset-toggle-points-intervals = Точкалар биле аразын солуштурар
subset-move-points = Точкаларны шимчедир
subset-clear = Арыглаар
orbital-add-row = Одуруг немээр
orbital-remove-row = Одуругну ужулдурар
orbital-add-box = Куду немээр
orbital-remove-box = Кудуну ужулдурар
orbital-add-up-arrow = Өрү согун немээр
orbital-add-down-arrow = Куду согун немээр
orbital-remove-arrow = Согунну ужулдурар
orbital-row-label = { $row } одуругнуң демдээ
pretzel-answer = Харыы

## Math input

math-input-preview-region = математиктиг илередиишкинниң мурнунда көрүүшкүнү
math-input-preview = Мурнунда көрүүшкүн
math-input-invalid-expression = Шын эвес илередиишкин:

## Document status

viewer-initializing = Белеткенип турар…

## Errors

error-heading = Частырыг
error-found-at =
    { $span ->
        [line] Тывылган одуруг: { $startLine }.
       *[lines] Тывылган одуруглар: { $startLine }–{ $endLine }.
    }
document-contains-errors = Бо документиде частырыглар бар!
diagnostic-heading-error = Частырыг
diagnostic-heading-warning = Сагындырыг
diagnostic-heading-information = Медээ
diagnostic-heading-hint = Сүме
accessibility-heading-level-1 = WCAG AA ажыглаар аргазының үрелиишкини
accessibility-heading-level-2 = Ажыглаар арга дугайында медээ
something-went-wrong = Бир-ле чүве шын эвес болган.
renderer-load-failed = чуруктаарны чүдүрүп шыдаваан. Арынны катап ажыдыңар.
core-start-failed = Документ көрүкчүзүн эгелеп шыдаваан. Арынны катап ажыдыңар.
