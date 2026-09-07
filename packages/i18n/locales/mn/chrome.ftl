# Mongolian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Mongolian counts in two plural categories, `one` and `other`, the same two
# English has, so every `{ $count -> … }` below keeps the shape it had. A noun
# after a numeral stays singular — «2 оролдлого», not a plural — so the two
# branches differ in nothing but the number they print.
#
# A Mongolian case ending harmonizes with the word it attaches to, so none is
# welded to a placeable: «{ $answerId } хариултад» puts the dative on a noun
# this catalog writes. The invariant ordinal «-р» on a line number is the one
# affix that may sit directly against a value.


## Answer submission

answer-checking = Шалгаж байна…
answer-submitting = Илгээж байна…
answer-checking-status = Хариултыг шалгаж байна
answer-submitting-status = Хариултыг илгээж байна
answer-correct = Зөв
answer-incorrect = Буруу
answer-response-saved = Хариулт хадгалагдлаа
answer-percent-credit = { $percent }% оноо
answer-percent-correct = { $percent }% зөв
answer-percent-short = { $percent } %
max-credit-available = Авах боломжтой дээд оноо: { $percent }%
attempts-remaining =
    { $count ->
        [0] оролдлого үлдсэнгүй
        [one] { $count } оролдлого үлдлээ
       *[other] { $count } оролдлого үлдлээ
    }
validation-correct = (Зөв)
validation-incorrect = (Буруу)
validation-partially-correct = (Хэсэгчлэн зөв)
answer-show-responses =
    { $count ->
        [one] { $answerId } хариултад өгсөн { $count } хариултыг харуулах
       *[other] { $answerId } хариултад өгсөн { $count } хариултыг харуулах
    }

## Disclosure panels

feedback-heading = Санал хүсэлт
collapsible-click-to-open = (нээхийн тулд товшино уу)
collapsible-click-to-close = (хаахын тулд товшино уу)
collapsible-initializing = Бэлтгэж байна…
footnote-show = Тайлбарыг харуулах
footnote-hide = Тайлбарыг нуух
description-more-information = нэмэлт мэдээлэл

## Controls

slider-previous = Өмнөх
slider-next = Дараах
keyboard-open = Гарыг нээх
keyboard-close = Гарыг хаах
choice-input-remove-choice = { $choice } сонголтыг хасах
matrix-remove-row = Мөр хасах
matrix-add-row = Мөр нэмэх
matrix-remove-column = Багана хасах
matrix-add-column = Багана нэмэх
subset-add-remove-points = Цэг нэмэх/хасах
subset-toggle-points-intervals = Цэг ба завсрын хооронд сэлгэх
subset-move-points = Цэгүүдийг зөөх
subset-clear = Цэвэрлэх
orbital-add-row = Мөр нэмэх
orbital-remove-row = Мөр хасах
orbital-add-box = Нүд нэмэх
orbital-remove-box = Нүд хасах
orbital-add-up-arrow = Дээш сум нэмэх
orbital-add-down-arrow = Доош сум нэмэх
orbital-remove-arrow = Сум хасах
orbital-row-label = { $row } мөрийн шошго
pretzel-answer = Хариулт

## Math input

math-input-preview-region = математик илэрхийллийн урьдчилсан харагдац
math-input-preview = Урьдчилсан харагдац
math-input-invalid-expression = Буруу илэрхийлэл:

## Document status

viewer-initializing = Бэлтгэж байна…

## Errors

error-heading = Алдаа
error-found-at =
    { $span ->
        [line] { $startLine }-р мөрөөс олдлоо.
       *[lines] { $startLine }–{ $endLine }-р мөрүүдээс олдлоо.
    }
document-contains-errors = Энэ баримт бичигт алдаа байна!
diagnostic-heading-error = Алдаа
diagnostic-heading-warning = Анхааруулга
diagnostic-heading-information = Мэдээлэл
diagnostic-heading-hint = Зөвлөмж
accessibility-heading-level-1 = WCAG AA хүртээмжийн зөрчил
accessibility-heading-level-2 = Хүртээмжийн мэдэгдэл
something-went-wrong = Ямар нэг зүйл буруу боллоо.
renderer-load-failed = дүрслэгчийг ачаалж чадсангүй. Хуудсыг дахин ачаална уу.
core-start-failed = Баримт бичиг үзүүлэгчийг эхлүүлж чадсангүй. Хуудсыг дахин ачаална уу.
