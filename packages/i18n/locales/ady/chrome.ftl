# Adyghe (West Circassian) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic with Ӏ (palochka), the orthography Adygea's schools and
# publishing use. The palochka is a letter, not a Latin I and not a digit 1:
# УплъэкӀун, ӀэпыӀэгъу and ЗэшӀохыгъ are ordinary words, and spelling any of
# them with `I` or `1` breaks them silently.
#
# Adyghe counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape it had. A noun after a numeral stays
# singular in Adyghe — and the numeral follows the noun, «попыткэ 3» — so the
# two branches differ in nothing but the number they print, and both were
# still written out rather than collapsed.
#
# Adyghe has no gender and no noun class, so nothing here or in `content.ftl`
# forks on `$gender`. See `content.ftl`'s header for the word order the style
# descriptions use and for the colour terms, neither of which this file
# touches.
#
# Two vocabularies are borrowed rather than coined, and a speaker should
# expect to revisit both: the interface words the Russian-language software an
# Adyghe reader already uses supplies — «клавиатурэ», «таблицэ», «попыткэ»,
# «стрелкэ» — and «доступность» for accessibility, which has no settled
# Adyghe equivalent this seed could check.


## Answer submission

answer-checking = УплъэкӀун…
answer-submitting = ГъэкӀон…
answer-checking-status = Джэуапыр уплъэкӀун
answer-submitting-status = Джэуапыр гъэкӀон
answer-correct = Тэрэз
answer-incorrect = Мытэрэз
answer-response-saved = Джэуапыр къэгъэнагъ
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% тэрэз
answer-percent-short = { $percent } %
max-credit-available = Балл нахьыбэ дэдэу пшӀошӀыщтыр: { $percent }%
attempts-remaining =
    { $count ->
        [0] къэнэжьыгъэ попыткэ щыӀэп
        [one] попыткэ { $count } къэнэжьыгъ
       *[other] попыткэ { $count } къэнэжьыгъ
    }
validation-correct = (Тэрэз)
validation-incorrect = (Мытэрэз)
validation-partially-correct = (ӀахькӀэ тэрэз)
answer-show-responses =
    { $count ->
        [one] { $answerId } иджэуап { $count } къэгъэлъэгъон
       *[other] { $answerId } иджэуап { $count } къэгъэлъэгъон
    }


## Disclosure panels

feedback-heading = ГущыӀэ къэгъэзэжь
collapsible-click-to-open = (къызэӀухыным фэшӀ тепӀытӀ)
collapsible-click-to-close = (зэфэшӀыжьыным фэшӀ тепӀытӀ)
collapsible-initializing = Егъэхьазыры…
footnote-show = ЧӀэгърыт тхыгъэр къэгъэлъэгъон
footnote-hide = ЧӀэгърыт тхыгъэр гъэбылъын
description-more-information = нахьыбэ къэбар


## Controls

slider-previous = Ыпэрэ
slider-next = Ыужырэ
keyboard-open = Клавиатурэр къызэӀухын
keyboard-close = Клавиатурэр зэфэшӀыжьын
choice-input-remove-choice = { $choice } хэгъэкӀын
matrix-remove-row = Сатыр хэгъэкӀын
matrix-add-row = Сатыр хэгъэхьан
matrix-remove-column = Колонкэ хэгъэкӀын
matrix-add-column = Колонкэ хэгъэхьан
subset-add-remove-points = Точкэхэр хэгъэхьан/хэгъэкӀын
subset-toggle-points-intervals = Точкэхэмрэ интервалхэмрэ зэблэхъун
subset-move-points = Точкэхэр гъэкӀотэн
subset-clear = Гъэкъэбзэн
orbital-add-row = Сатыр хэгъэхьан
orbital-remove-row = Сатыр хэгъэкӀын
orbital-add-box = Клеткэ хэгъэхьан
orbital-remove-box = Клеткэ хэгъэкӀын
orbital-add-up-arrow = ДэкӀоерэ стрелкэ хэгъэхьан
orbital-add-down-arrow = Къехырэ стрелкэ хэгъэхьан
orbital-remove-arrow = Стрелкэ хэгъэкӀын
orbital-row-label = Сатыр { $row } ыцӀэ
pretzel-answer = Джэуап


## Math input

math-input-preview-region = математическэ выражением иапэрэ теплъ
math-input-preview = Апэрэ теплъ
math-input-invalid-expression = Выражение мытэрэз:


## Document status

viewer-initializing = Егъэхьазыры…


## Errors

error-heading = Щыуагъ
error-found-at =
    { $span ->
        [line] Къыщагъотыгъ: сатыр { $startLine }.
       *[lines] Къыщагъотыгъэх: сатырхэр { $startLine }–{ $endLine }.
    }
document-contains-errors = Мы документым щыуагъэхэр хэтых!
diagnostic-heading-error = Щыуагъ
diagnostic-heading-warning = Гъэсакъ
diagnostic-heading-information = Къэбар
diagnostic-heading-hint = ӀэпыӀэгъу
accessibility-heading-level-1 = WCAG AA доступностым икъутэныгъ
accessibility-heading-level-2 = Доступностым ехьылӀэгъэ гъэсакъ
something-went-wrong = Зыгорэ тэрэзэу хъугъэп.
renderer-load-failed = рендерерым къытӀэпӀыгъэп. НэкӀубгъор джыри къэгъэлъэгъожь.
core-start-failed = Мы документыр рагъэжьэшъугъэп. НэкӀубгъор джыри къэгъэлъэгъожь.
core-start-failed-busy = Мы документыр рагъэжьэшъугъэп. Документыбэ зэдырагъэжьагъ, ащ къыхэкӀэу компьютер щэрыончъэм нахьыбэрэ фэхьы. АдрэхэмкӀэ аухыгъэ ужым нэкӀубгъор джыри къэгъэлъэгъожьыныр шӀуагъэ къытын.
core-start-failed-retry = Мы документыр рагъэжьэшъугъэп.
core-start-failed-busy-retry = Мы документыр рагъэжьэшъугъэп. Документыбэ зэдырагъэжьагъ, ащ къыхэкӀэу компьютер щэрыончъэм нахьыбэрэ фэхьы.
core-start-retry = Джыри зэ
saved-state-unavailable = УиӀоф къэгъэнэжьыгъэр къэтӀэпӀыгъэп.
