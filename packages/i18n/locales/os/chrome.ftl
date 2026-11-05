# Ossetian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Ossetian counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape it had. A noun after a numeral stays
# singular, so the two branches differ in nothing but the number they print.


## Answer submission

answer-checking = Бæрæг кæны…
answer-submitting = Арвиты…
answer-checking-status = Дзуапп бæрæг кæны
answer-submitting-status = Дзуапп арвиты
answer-correct = Раст
answer-incorrect = Раст нæу
answer-response-saved = Дзуапп бавæрд
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% раст
answer-percent-short = { $percent } %
max-credit-available = Райсæн ис фылдæр балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] фæлварæн нал баззад
        [one] { $count } фæлварæн баззад
       *[other] { $count } фæлварæн баззад
    }
validation-correct = (Раст)
validation-incorrect = (Раст нæу)
validation-partially-correct = (Хайыл раст)
answer-show-responses =
    { $count ->
        [one] { $answerId }-мæ { $count } дзуапп равдисын
       *[other] { $answerId }-мæ { $count } дзуапп равдисын
    }

## Disclosure panels

feedback-heading = Фæстæмæ дзуапп
collapsible-click-to-open = (байгом кæнынæн ныххæц)
collapsible-click-to-close = (æхгæнынæн ныххæц)
collapsible-initializing = Цæттæ кæны…
footnote-show = Фиппаинаг равдисын
footnote-hide = Фиппаинаг бамбæхсын
description-more-information = фылдæр информаци

## Controls

slider-previous = Разæй
slider-next = Дарддæр
keyboard-open = Клавиатурæ байгом кæнын
keyboard-close = Клавиатурæ æхгæнын
choice-input-remove-choice = { $choice } æвзарæн аппарын
matrix-remove-row = Рæнхъ аппарын
matrix-add-row = Рæнхъ бафтауын
matrix-remove-column = Цæджындз аппарын
matrix-add-column = Цæджындз бафтауын
subset-add-remove-points = Стъæлф бафтауын/аппарын
subset-toggle-points-intervals = Стъæлфытæ æмæ интервалтæ ивын
subset-move-points = Стъæлфытæ аивын
subset-clear = Ссыгъдæг кæнын
orbital-add-row = Рæнхъ бафтауын
orbital-remove-row = Рæнхъ аппарын
orbital-add-box = Клеткæ бафтауын
orbital-remove-box = Клеткæ аппарын
orbital-add-up-arrow = Уæлæмæ фат бафтауын
orbital-add-down-arrow = Дæлæмæ фат бафтауын
orbital-remove-arrow = Фат аппарын
orbital-row-label = { $row } рæнхъы нысан
pretzel-answer = Дзуапп

## Math input

math-input-preview-region = математикон æвдисæны разæй фенын
math-input-preview = Разæй фенын
math-input-invalid-expression = Раст нæу æвдисæн:

## Document status

viewer-initializing = Цæттæ кæны…

## Errors

error-heading = Рæдыд
error-found-at =
    { $span ->
        [line] Ссард рæнхъ: { $startLine }.
       *[lines] Ссард рæнхъытæ: { $startLine }–{ $endLine }.
    }
document-contains-errors = Ацы документы рæдыдтытæ ис!
diagnostic-heading-error = Рæдыд
diagnostic-heading-warning = Фæдзæхст
diagnostic-heading-information = Информаци
diagnostic-heading-hint = Амынд
accessibility-heading-level-1 = WCAG AA бахæццæйы халд
accessibility-heading-level-2 = Бахæццæйы тыххæй хъусынгæнинаг
something-went-wrong = Исты раст нæ рауад.
renderer-load-failed = нывгæнæг æрбавгæрдын нæ бантыст. Фарс ногæй байгом кæн.
core-start-failed = Документы уынæг сыздæхын нæ бантыст. Фарс ногæй байгом кæн.
