# Buryat viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Buryat counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape it had. A noun after a numeral stays
# singular, so the two branches differ in nothing but the number they print.


## Answer submission

answer-checking = Шалгагдажа байна…
answer-submitting = Эльгээгдэжэ байна…
answer-checking-status = Харюу шалгагдажа байна
answer-submitting-status = Харюу эльгээгдэжэ байна
answer-correct = Зүб
answer-incorrect = Буруу
answer-response-saved = Харюу хадагалагдаба
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% зүб
answer-percent-short = { $percent } %
max-credit-available = Абажа болохо эгээ ехэ балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] оролдолго үлэбэгүй
        [one] { $count } оролдолго үлэбэ
       *[other] { $count } оролдолго үлэбэ
    }
validation-correct = (Зүб)
validation-incorrect = (Буруу)
validation-partially-correct = (Хубиингаа зүб)
answer-show-responses =
    { $count ->
        [one] { $answerId } дээрэ { $count } харюу харуулха
       *[other] { $answerId } дээрэ { $count } харюу харуулха
    }

## Disclosure panels

feedback-heading = Хариу дуулгалга
collapsible-click-to-open = (нээхын тулада дарагты)
collapsible-click-to-close = (хаахын тулада дарагты)
collapsible-initializing = Бэлдэгдэжэ байна…
footnote-show = Тэмдэглэл харуулха
footnote-hide = Тэмдэглэл нюуха
description-more-information = нэмэлтэ мэдээсэл

## Controls

slider-previous = Урдахи
slider-next = Дараахи
keyboard-open = Хабтагай нээхэ
keyboard-close = Хабтагай хааха
choice-input-remove-choice = { $choice } шэлэлгые усадхаха
matrix-remove-row = Мүр усадхаха
matrix-add-row = Мүр нэмэхэ
matrix-remove-column = Багана усадхаха
matrix-add-column = Багана нэмэхэ
subset-add-remove-points = Сэг нэмэхэ/усадхаха
subset-toggle-points-intervals = Сэгүүд ба забһарнуудые һэлгэхэ
subset-move-points = Сэгүүдые зөөхэ
subset-clear = Арилгаха
orbital-add-row = Мүр нэмэхэ
orbital-remove-row = Мүр усадхаха
orbital-add-box = Нүхэн нэмэхэ
orbital-remove-box = Нүхэн усадхаха
orbital-add-up-arrow = Дээшээ һомо нэмэхэ
orbital-add-down-arrow = Доошоо һомо нэмэхэ
orbital-remove-arrow = Һомо усадхаха
orbital-row-label = { $row } мүрэй тэмдэг
pretzel-answer = Харюу

## Math input

math-input-preview-region = математическа илэрхэйлэлгын урьдшалан харалга
math-input-preview = Урьдшалан харалга
math-input-invalid-expression = Буруу илэрхэйлэлгэ:

## Document status

viewer-initializing = Бэлдэгдэжэ байна…

## Errors

error-heading = Алдуу
error-found-at =
    { $span ->
        [line] Олдоһон мүр: { $startLine }.
       *[lines] Олдоһон мүрнүүд: { $startLine }–{ $endLine }.
    }
document-contains-errors = Энэ бэшэг соо алдуунууд бии!
diagnostic-heading-error = Алдуу
diagnostic-heading-warning = Һэргылэмжэ
diagnostic-heading-information = Мэдээсэл
diagnostic-heading-hint = Заабари
accessibility-heading-level-1 = WCAG AA хүрэхэ аргын эбдэлгэ
accessibility-heading-level-2 = Хүрэхэ аргын тухай мэдээсэл
something-went-wrong = Юуншьеб буруу болобо.
renderer-load-failed = зурагшые ашаалжа шадабагүй. Нюур шэнэлэгты.
core-start-failed = Бэшэг харагшые эхилжэ шадабагүй. Нюур шэнэлэгты.
