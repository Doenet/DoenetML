# Kalmyk viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Read the confidence note at the top of `content.ftl` before this file: this
# is the least certain catalog in its batch and says so in its own header.
#
# Kalmyk counts in two plural categories, `one` and `other`, and a noun after a
# numeral stays singular, so the two branches of every `{ $count -> … }` below
# differ in nothing but the number they print.


## Answer submission

answer-checking = Шинҗлгдҗәнә…
answer-submitting = Илгәгдҗәнә…
answer-checking-status = Хәрү шинҗлгдҗәнә
answer-submitting-status = Хәрү илгәгдҗәнә
answer-correct = Зөв
answer-incorrect = Буру
answer-response-saved = Хәрү хадһлгдв
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% зөв
answer-percent-short = { $percent } %
max-credit-available = Авч болх хамгин ик балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] эрлһн үлдсн уга
        [one] { $count } эрлһн үлдв
       *[other] { $count } эрлһн үлдв
    }
validation-correct = (Зөв)
validation-incorrect = (Буру)
validation-partially-correct = (Хүвәр зөв)
answer-show-responses =
    { $count ->
        [one] { $answerId } деер { $count } хәрү үзүлх
       *[other] { $answerId } деер { $count } хәрү үзүлх
    }

## Disclosure panels

feedback-heading = Хәрү медәллт
collapsible-click-to-open = (секхин төлә даргтн)
collapsible-click-to-close = (хаахин төлә даргтн)
collapsible-initializing = Белдгдҗәнә…
footnote-show = Темдг үзүлх
footnote-hide = Темдг нүүх
description-more-information = немр медәлл

## Controls

slider-previous = Өмнк
slider-next = Дару
keyboard-open = Клавиатур секх
keyboard-close = Клавиатур хаах
choice-input-remove-choice = { $choice } суңһврыг уга кех
matrix-remove-row = Мөр уга кех
matrix-add-row = Мөр немх
matrix-remove-column = Багана уга кех
matrix-add-column = Багана немх
subset-add-remove-points = Цег немх/уга кех
subset-toggle-points-intervals = Цегүд болн зәәс сольх
subset-move-points = Цегүдиг нүүлһх
subset-clear = Цеврлх
orbital-add-row = Мөр немх
orbital-remove-row = Мөр уга кех
orbital-add-box = Нүкн немх
orbital-remove-box = Нүкн уга кех
orbital-add-up-arrow = Өөдән сумн немх
orbital-add-down-arrow = Дор сумн немх
orbital-remove-arrow = Сумн уга кех
orbital-row-label = { $row } мөрин темдг
pretzel-answer = Хәрү

## Math input

math-input-preview-region = математическ илдкврин урдаснь үзлт
math-input-preview = Урдаснь үзлт
math-input-invalid-expression = Буру илдквр:

## Document status

viewer-initializing = Белдгдҗәнә…

## Errors

error-heading = Эндү
error-found-at =
    { $span ->
        [line] Олгдсн мөр: { $startLine }.
       *[lines] Олгдсн мөрмүд: { $startLine }–{ $endLine }.
    }
document-contains-errors = Эн бичгт эндүс бәәнә!
diagnostic-heading-error = Эндү
diagnostic-heading-warning = Селвг
diagnostic-heading-information = Медәлл
diagnostic-heading-hint = Зәәсн
accessibility-heading-level-1 = WCAG AA күрх аргин эвдлт
accessibility-heading-level-2 = Күрх аргин тускар медәлл
something-went-wrong = Юмн буру болв.
renderer-load-failed = зурачиг ачлҗ чадсн уга. Халхциг шинрүлтн.
core-start-failed = Бичг үзгчиг эклҗ чадсн уга. Халхциг шинрүлтн.
