# Khanty viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `kca` is Khanty (Ostyak; хӑнты ясӑӈ to its speakers), Ob-Ugric — with Mansi
# (`locales/mns`, seeded beside this one) the nearest living relative of
# Hungarian. Nothing in `locales/hu` helps write this file: the split is
# thousands of years deep, and Hungarian's vocabulary, its orthography and its
# whole technical register are of no use here.
#
# Written towards the **Kazym** literary norm, the one with the largest
# published output and the one Khanty schoolbooks in Beloyarsky and Kazym use.
# Khanty's other norms — Shuryshkary, Surgut, Vakh — differ enough that a
# Surgut reader will find this catalog foreign in places; ISO 639-3 gives them
# all a single `kca`, so a single catalog is what this repository can offer.
#
# THIS IS AMONG THE LEAST CERTAIN CATALOGS IN THE ROSTER, alongside
# `locales/mns`, `locales/xal` and `locales/lom`, and a speaker should read it
# early. Khanty is severely endangered, its written output is small, and none
# of the editor and diagnostics register exists in any published Khanty text.
# A good deal of the vocabulary below is therefore **coined**, not attested —
# see `content.ftl`'s header for the list of coinages and the loan policy.
#
# Khanty counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape it had. A noun after a numeral stays
# singular, so the two branches differ in nothing but the number they print.


## Answer submission

answer-checking = Вантԓа…
answer-submitting = Китԓа…
answer-checking-status = Вошты ясӑӈ вантԓа
answer-submitting-status = Вошты ясӑӈ китԓа
answer-correct = Ям
answer-incorrect = Ям ӑнтөм
answer-response-saved = Вошты ясӑӈ пунса
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% ям
answer-percent-short = { $percent } %
max-credit-available = Ўты рӑхты мєт вөн балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] пўш ӑнт хӑщӑс
        [one] { $count } пўш хӑщӑс
       *[other] { $count } пўш хӑщӑс
    }
validation-correct = (Ям)
validation-incorrect = (Ям ӑнтөм)
validation-partially-correct = (Пєлӑкӑн ям)
answer-show-responses =
    { $count ->
        [one] { $answerId } хуща { $count } вошты ясӑӈ вантӑԓты
       *[other] { $answerId } хуща { $count } вошты ясӑӈ вантӑԓты
    }

## Disclosure panels

feedback-heading = Йухԓы ясӑӈ
collapsible-click-to-open = (пўншты ԓапӑта)
collapsible-click-to-close = (пєнтты ԓапӑта)
collapsible-initializing = Ԓєщӑтԓа…
footnote-show = Пас вантӑԓты
footnote-hide = Пас ԓўкӑтты
description-more-information = па нөмӑс

## Controls

slider-previous = Оԓӑӈмет
slider-next = Кимет
keyboard-open = Клавиатура пўншты
keyboard-close = Клавиатура пєнтты
choice-input-remove-choice = { $choice } вўштаԓӑм ким ўты
matrix-remove-row = Строка ким ўты
matrix-add-row = Строка пунты
matrix-remove-column = Столбец ким ўты
matrix-add-column = Столбец пунты
subset-add-remove-points = Пас пунты/ким ўты
subset-toggle-points-intervals = Пас па кўт вєԓщӑты
subset-move-points = Пасӑт нух-мӑнты
subset-clear = Ԓәщӑтты
orbital-add-row = Строка пунты
orbital-remove-row = Строка ким ўты
orbital-add-box = Ԓыпӑс пунты
orbital-remove-box = Ԓыпӑс ким ўты
orbital-add-up-arrow = Нух нёԓ пунты
orbital-add-down-arrow = Иԓ нёԓ пунты
orbital-remove-arrow = Нёԓ ким ўты
orbital-row-label = { $row } строка нєм
pretzel-answer = Вошты ясӑӈ

## Math input

math-input-preview-region = математика ясӑӈ оԓӑӈ вантты пєлӑк
math-input-preview = Оԓӑӈ вантты
math-input-invalid-expression = Ям ӑнтөм ясӑӈ:

## Document status

viewer-initializing = Ԓєщӑтԓа…

## Errors

error-heading = Ошибка
error-found-at =
    { $span ->
        [line] Вөйӑтса строка: { $startLine }.
       *[lines] Вөйӑтса строкаӑт: { $startLine }–{ $endLine }.
    }
document-contains-errors = Тӑм документ ԓыпийн ошибкаӑт вөԓӑт!
diagnostic-heading-error = Ошибка
diagnostic-heading-warning = Ԓавӑԓты ясӑӈ
diagnostic-heading-information = Нөмӑс
diagnostic-heading-hint = Нётты ясӑӈ
accessibility-heading-level-1 = WCAG AA юхӑтты рӑхты вєр кӑшӑԓӑм
accessibility-heading-level-2 = Юхӑтты рӑхты вєр оԓӑӈӑн нөмӑс
something-went-wrong = Муԓты ям ӑнтөм вєрӑс.
renderer-load-failed = хӑншты вєр ӑнт ўса. Страница па пўнша.
core-start-failed = Документ вантты вєр ӑнт ԓәԓӑс. Страница па пўнша.

core-start-failed-busy = Тӑм документ ӑнт ԓәԓӑс. Ит пўш ар документ ԓәԓты питсӑт, ай ԓәхӑп машина хуща щи вєр хўв мӑнԓ. Па документӑт ԓәԓты хӑтԓ, страница па пўншты нётты рӑхӑԓ.
core-start-failed-retry = Тӑм документ ӑнт ԓәԓӑс.
core-start-failed-busy-retry = Тӑм документ ӑнт ԓәԓӑс. Ит пўш ар документ ԓәԓты питсӑт, ай ԓәхӑп машина хуща щи вєр хўв мӑнԓ.
core-start-retry = Па пўш
saved-state-unavailable = Пунӑм рупата ӑнт ўса.
