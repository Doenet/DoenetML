# Udmurt viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Udmurt counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape it had. A noun after a numeral stays
# singular — «2 выремлык», not a plural — so the two branches differ in nothing
# but the number they print.


## Answer submission

answer-checking = Эскериське…
answer-submitting = Ыстӥське…
answer-checking-status = Ответ эскериське
answer-submitting-status = Ответ ыстӥське
answer-correct = Шонер
answer-incorrect = Янгыш
answer-response-saved = Ответ утемын
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% шонер
answer-percent-short = { $percent } %
max-credit-available = Басьтыны луонлыко бадӟым балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] выремлык кылемын ӧвӧл
        [one] { $count } выремлык кылемын
       *[other] { $count } выремлык кылемын
    }
validation-correct = (Шонер)
validation-incorrect = (Янгыш)
validation-partially-correct = (Люкетэн шонер)
answer-show-responses =
    { $count ->
        [one] { $answerId } понна { $count } ответэз возьматыны
       *[other] { $answerId } понна { $count } ответэз возьматыны
    }

## Disclosure panels

feedback-heading = Берыктэт
collapsible-click-to-open = (усьтон понна зӥбе)
collapsible-click-to-close = (ворсан понна зӥбе)
collapsible-initializing = Дасяське…
footnote-show = Пусъёнэз возьматыны
footnote-hide = Пусъёнэз ватыны
description-more-information = ватсаса ивортэт

## Controls

slider-previous = Азьло
slider-next = Собере
keyboard-open = Клавиатураез усьтыны
keyboard-close = Клавиатураез ворсаны
choice-input-remove-choice = { $choice } быръёнэз палэнтыны
matrix-remove-row = Чурез палэнтыны
matrix-add-row = Чур ватсаны
matrix-remove-column = Юбоез палэнтыны
matrix-add-column = Юбо ватсаны
subset-add-remove-points = Пус ватсаны/палэнтыны
subset-toggle-points-intervals = Пусъёсты но кусыпъёсты воштыны
subset-move-points = Пусъёсты выретыны
subset-clear = Сузяны
orbital-add-row = Чур ватсаны
orbital-remove-row = Чурез палэнтыны
orbital-add-box = Клетка ватсаны
orbital-remove-box = Клеткаез палэнтыны
orbital-add-up-arrow = Вылӥе ньӧл ватсаны
orbital-add-down-arrow = Улӥе ньӧл ватсаны
orbital-remove-arrow = Ньӧлэз палэнтыны
orbital-row-label = { $row } чурлэн пусэз
pretzel-answer = Ответ

## Math input

math-input-preview-region = математической валэктонлэн азьло учконэз
math-input-preview = Азьло учкон
math-input-invalid-expression = Янгыш валэктон:

## Document status

viewer-initializing = Дасяське…

## Errors

error-heading = Янгыш
error-found-at =
    { $span ->
        [line] Шедьтэм чур: { $startLine }.
       *[lines] Шедьтэм чуръёс: { $startLine }–{ $endLine }.
    }
document-contains-errors = Та документын янгышъёс вань!
diagnostic-heading-error = Янгыш
diagnostic-heading-warning = Сак кариськон
diagnostic-heading-information = Ивортэт
diagnostic-heading-hint = Юрттэт
accessibility-heading-level-1 = WCAG AA вуонлык тӥян
accessibility-heading-level-2 = Вуонлык сярысь ивортэт
something-went-wrong = Мар ке янгыш потӥз.
renderer-load-failed = суредасез пыртыны ӧз луы. Бамез выльдэ.
core-start-failed = Документэз учконэз кутскытыны ӧз луы. Бамез выльдэ.
