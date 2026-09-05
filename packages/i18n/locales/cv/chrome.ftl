# Chuvash viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Chuvash resolves a CLDR `zero` category, the fourth catalog here to do so
# after `locales/ar`, `locales/cy` and `locales/lv`. Arabic's and Welsh's fire
# for exactly 0, as Chuvash's does; Latvian's is the one that means something
# else, covering every number ending in 0 and the whole of the teens. Chuvash's
# `one` is exactly 1, so 21 and 101 are `other` where Latvian's are `one`. A
# `zero` category is therefore not a fact about a language family or about a
# script: it is a rule, and the four categories here are three rules sharing a
# name — Arabic's and Welsh's coincide, Latvian's does not.
#
# The consequence for this file is small and worth stating so nobody
# "corrects" it: `attempts-remaining` keeps the explicit `[0]` branch and adds
# no `[zero]`, because `[0]` is matched by number and would win over the
# category anyway. Where English writes no `[0]` — `answer-show-responses` —
# the `[zero]` branch is written out and is genuinely reached.


## Answer submission

answer-checking = Тӗрӗслет…
answer-submitting = Ярать…
answer-checking-status = Хурава тӗрӗслет
answer-submitting-status = Хурава ярать
answer-correct = Тӗрӗс
answer-incorrect = Йӑнӑш
answer-response-saved = Хурав упранчӗ
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% тӗрӗс
answer-percent-short = { $percent } %
max-credit-available = Пулма пултаракан чи пысӑк балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] хӑтланса пӑхмалли юлмарӗ
        [one] { $count } хут хӑтланса пӑхма юлчӗ
       *[other] { $count } хут хӑтланса пӑхма юлчӗ
    }
validation-correct = (Тӗрӗс)
validation-incorrect = (Йӑнӑш)
validation-partially-correct = (Пайӑн-пайӑн тӗрӗс)
answer-show-responses =
    { $count ->
        [zero] { $answerId } валли хурав ҫук
        [one] { $answerId } валли { $count } хурав кӑтартас
       *[other] { $answerId } валли { $count } хурав кӑтартас
    }

## Disclosure panels

feedback-heading = Хирӗҫ калани
collapsible-click-to-open = (уҫма пусӑр)
collapsible-click-to-close = (хупма пусӑр)
collapsible-initializing = Хатӗрленет…
footnote-show = Асӑрхаттарӑва кӑтартас
footnote-hide = Асӑрхаттарӑва пытарас
description-more-information = хушма информаци

## Controls

slider-previous = Малтанхи
slider-next = Тепӗр
keyboard-open = Клавиатурӑна уҫас
keyboard-close = Клавиатурӑна хупас
choice-input-remove-choice = { $choice } суйлавне кӑларас
matrix-remove-row = Йӗркене кӑларас
matrix-add-row = Йӗрке хушас
matrix-remove-column = Юпана кӑларас
matrix-add-column = Юпа хушас
subset-add-remove-points = Пӑнчӑ хушас/кӑларас
subset-toggle-points-intervals = Пӑнчӑсемпе хушӑксене улӑштарас
subset-move-points = Пӑнчӑсене куҫарас
subset-clear = Тасатас
orbital-add-row = Йӗрке хушас
orbital-remove-row = Йӗркене кӑларас
orbital-add-box = Куҫӑ хушас
orbital-remove-box = Куҫӑ кӑларас
orbital-add-up-arrow = Ҫӳлелле йӗппи хушас
orbital-add-down-arrow = Аялалла йӗппи хушас
orbital-remove-arrow = Йӗппе кӑларас
orbital-row-label = { $row } йӗркин палли
pretzel-answer = Хурав

## Math input

math-input-preview-region = математика палӑртӑвне малтан пӑхни
math-input-preview = Малтан пӑхни
math-input-invalid-expression = Тӗрӗс мар палӑрту:

## Document status

viewer-initializing = Хатӗрленет…

## Errors

error-heading = Йӑнӑш
error-found-at =
    { $span ->
        [line] Тупнӑ йӗрке: { $startLine }.
       *[lines] Тупнӑ йӗркесем: { $startLine }–{ $endLine }.
    }
document-contains-errors = Ку документра йӑнӑшсем пур!
diagnostic-heading-error = Йӑнӑш
diagnostic-heading-warning = Асӑрхаттару
diagnostic-heading-information = Информаци
diagnostic-heading-hint = Канаш
accessibility-heading-level-1 = WCAG AA майлӑх пӑсӑлӑвӗ
accessibility-heading-level-2 = Майлӑх пирки хыпар
something-went-wrong = Темӗн йӑнӑш пулса тухрӗ.
renderer-load-failed = ӳкерекеннине тиеме пулмарӗ. Страницӑна ҫӗнетӗр.
core-start-failed = Документ пӑхмалли хатӗре ӗҫлеттерсе яма пулмарӗ. Страницӑна ҫӗнетӗр.
