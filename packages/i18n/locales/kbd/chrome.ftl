# Kabardian (East Circassian) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Cyrillic literary standard of Kabardino-Balkaria and
# Karachay-Cherkessia, which is what those republics' schools and publishing
# use and what CLDR fills a bare `kbd` in as. This is the eastern Circassian
# standard; `locales/ady` is the western one.
#
# The palochka Ӏ is a letter of the alphabet, not a Latin capital I and not a
# digit 1. U+04C0 is used throughout, inside lowercase words as well.
#
# Kabardian counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape English gives it. A noun after a
# numeral does not take a plural ending, and the numeral *follows* the noun —
# «гъэунэхуныгъэ 3», three attempts — so the two branches differ in nothing but
# the number they print, and the counted messages read noun-first.
#
# Kabardian has no grammatical gender and no noun classes, so nothing in this
# catalog agrees with anything. See `content.ftl` for the whole of that
# reasoning and for the adjective-after-noun order the descriptions use.
#
# Nothing here welds a case ending onto a placeable: Kabardian's oblique is
# «-м» after a vowel and «-ым» after a consonant, so its shape depends on a
# word the catalog never sees. Where a case would have fallen on a value the
# sentence is built around a free word instead.
#
# Two verb choices a speaker should look at first. Progressive states —
# "Checking...", "Initializing..." — are written as masdars in -н, which is the
# citation form and reads as a label rather than as a report; a speaker may
# prefer the finite present. And «ЖыӀэгъуэ» for `feedback-heading` is the
# weakest word in the file: Kabardian has no settled term for feedback in this
# sense, and this one merely says "remark".


## Answer submission

answer-checking = Къэпщытэн…
answer-submitting = Егъэхьын…
answer-checking-status = Жэуапыр къэпщытэн
answer-submitting-status = Жэуапыр егъэхьын
answer-correct = Тэмэмщ
answer-incorrect = Тэмэмкъым
answer-response-saved = Жэуапыр хъумащ
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% тэмэм
answer-percent-short = { $percent } %
max-credit-available = Къэпхьыфыну балл нэхъыбэр: { $percent }%
attempts-remaining =
    { $count ->
        [0] гъэунэхуныгъэ къэнакъым
        [one] гъэунэхуныгъэ { $count } къэнащ
       *[other] гъэунэхуныгъэ { $count } къэнащ
    }
validation-correct = (Тэмэмщ)
validation-incorrect = (Тэмэмкъым)
validation-partially-correct = (Ӏыхьэу тэмэмщ)
answer-show-responses =
    { $count ->
        [one] { $answerId } и жэуап { $count } къэгъэлъэгъуэн
       *[other] { $answerId } и жэуап { $count } къэгъэлъэгъуэн
    }

## Disclosure panels

feedback-heading = ЖыӀэгъуэ
collapsible-click-to-open = (Ӏухын папщӀэ къытеӀуэ)
collapsible-click-to-close = (зэхуэщӀын папщӀэ къытеӀуэ)
collapsible-initializing = Къызэгъэпэщын…
footnote-show = ЩӀэт тхыгъэр къэгъэлъэгъуэн
footnote-hide = ЩӀэт тхыгъэр гъэпщкӀун
description-more-information = хъыбар нэхъыбэ

## Controls

slider-previous = Ипэрей
slider-next = КӀэлъыкӀуэ
keyboard-open = Клавиатурэр Ӏухын
keyboard-close = Клавиатурэр зэхуэщӀын
choice-input-remove-choice = { $choice } хэгъэкӀын
matrix-remove-row = Сатыр хэгъэкӀын
matrix-add-row = Сатыр хэгъэхьэн
matrix-remove-column = Столбец хэгъэкӀын
matrix-add-column = Столбец хэгъэхьэн
subset-add-remove-points = Точкэ хэгъэхьэн/хэгъэкӀын
subset-toggle-points-intervals = Точкэхэмрэ интервалхэмрэ зэхъуэкӀын
subset-move-points = Точкэхэр гъэӀэпхъуэн
subset-clear = Гъэкъэбзэн
orbital-add-row = Сатыр хэгъэхьэн
orbital-remove-row = Сатыр хэгъэкӀын
orbital-add-box = Клеткэ хэгъэхьэн
orbital-remove-box = Клеткэ хэгъэкӀын
orbital-add-up-arrow = Стрелкэ дэкӀуей хэгъэхьэн
orbital-add-down-arrow = Стрелкэ ех хэгъэхьэн
orbital-remove-arrow = Стрелкэ хэгъэкӀын
orbital-row-label = Сатыр { $row } и фӀэщыгъэцӀэ
pretzel-answer = Жэуап

## Math input

math-input-preview-region = математикэ къэгъэлъэгъуэныгъэм и япэ теплъэ
math-input-preview = Япэ теплъэ
math-input-invalid-expression = Къэгъэлъэгъуэныгъэ мытэмэм:

## Document status

viewer-initializing = Къызэгъэпэщын…

## Errors

error-heading = Щыуагъэ
error-found-at =
    { $span ->
        [line] Къыщагъуэтар: сатыр { $startLine }.
       *[lines] Къыщагъуэтар: сатыр { $startLine }–{ $endLine }.
    }
document-contains-errors = Мы документым щыуагъэхэр хэтщ!
diagnostic-heading-error = Щыуагъэ
diagnostic-heading-warning = Гъэсакъыныгъэ
diagnostic-heading-information = Хъыбар
diagnostic-heading-hint = Чэнджэщ
accessibility-heading-level-1 = WCAG AA Ӏэрыхуагъэм и къутэныгъэ
accessibility-heading-level-2 = Ӏэрыхуагъэм теухуа гъэсакъыныгъэ
something-went-wrong = Зыгуэр тэмэму екӀуэкӀакъым.
renderer-load-failed = къэгъэлъэгъуакӀуэр къэхьын хъуакъым. НапэкӀуэцӀыр къэгъэщӀэрэщӀэж.
core-start-failed = Мы документыр къэгъэлэжьэн хъуакъым. НапэкӀуэцӀыр къэгъэщӀэрэщӀэж.
core-start-failed-busy = Мы документыр къэгъэлэжьэн хъуакъым. Зэуэ документ куэд къыщӀидзащ, аращ компьютер хуэмым зэман нэхъыбэ щӀытрагъэкӀуадэр. НэгъуэщӀ документхэр къызэгъэпэща нэужь напэкӀуэцӀыр къэбгъэщӀэрэщӀэжмэ, сэбэп хъунщ.
core-start-failed-retry = Мы документыр къэгъэлэжьэн хъуакъым.
core-start-failed-busy-retry = Мы документыр къэгъэлэжьэн хъуакъым. Зэуэ документ куэд къыщӀидзащ, аращ компьютер хуэмым зэман нэхъыбэ щӀытрагъэкӀуадэр.
core-start-retry = Иджыри зэ епщытэж
saved-state-unavailable = Уи лэжьыгъэ хъумар къэхьын хъуакъым.
