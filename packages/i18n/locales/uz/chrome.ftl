# Uzbek viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Uzbek counts in two plural categories, `one` and `other`, the same two English
# has, so every `{ $count -> … }` below keeps the shape it had. A noun after a
# numeral stays singular — «2 urinish», not a plural — so the two branches
# differ in nothing but the number they print.


## Answer submission

answer-checking = Tekshirilmoqda…
answer-submitting = Yuborilmoqda…
answer-checking-status = Javob tekshirilmoqda
answer-submitting-status = Javob yuborilmoqda
answer-correct = Toʻgʻri
answer-incorrect = Notoʻgʻri
answer-response-saved = Javob saqlandi
answer-percent-credit = { $percent }% ball
answer-percent-correct = { $percent }% toʻgʻri
answer-percent-short = { $percent } %
max-credit-available = Mumkin boʻlgan eng yuqori ball: { $percent }%
attempts-remaining =
    { $count ->
        [0] urinish qolmadi
        [one] { $count } urinish qoldi
       *[other] { $count } urinish qoldi
    }
validation-correct = (Toʻgʻri)
validation-incorrect = (Notoʻgʻri)
validation-partially-correct = (Qisman toʻgʻri)
answer-show-responses =
    { $count ->
        [one] { $answerId } uchun { $count } javobni koʻrsatish
       *[other] { $answerId } uchun { $count } javobni koʻrsatish
    }

## Disclosure panels

feedback-heading = Fikr-mulohaza
collapsible-click-to-open = (ochish uchun bosing)
collapsible-click-to-close = (yopish uchun bosing)
collapsible-initializing = Tayyorlanmoqda…
footnote-show = Izohni koʻrsatish
footnote-hide = Izohni yashirish
description-more-information = qoʻshimcha maʼlumot

## Controls

slider-previous = Oldingi
slider-next = Keyingi
keyboard-open = Klaviaturani ochish
keyboard-close = Klaviaturani yopish
choice-input-remove-choice = { $choice } tanlovini olib tashlash
matrix-remove-row = Qatorni oʻchirish
matrix-add-row = Qator qoʻshish
matrix-remove-column = Ustunni oʻchirish
matrix-add-column = Ustun qoʻshish
subset-add-remove-points = Nuqta qoʻshish/oʻchirish
subset-toggle-points-intervals = Nuqtalar va oraliqlar orasida almashtirish
subset-move-points = Nuqtalarni koʻchirish
subset-clear = Tozalash
orbital-add-row = Qator qoʻshish
orbital-remove-row = Qatorni oʻchirish
orbital-add-box = Katak qoʻshish
orbital-remove-box = Katakni oʻchirish
orbital-add-up-arrow = Yuqoriga strelka qoʻshish
orbital-add-down-arrow = Pastga strelka qoʻshish
orbital-remove-arrow = Strelkani oʻchirish
orbital-row-label = { $row } qatorining yorligʻi
pretzel-answer = Javob

## Math input

math-input-preview-region = matematik ifodani oldindan koʻrish
math-input-preview = Oldindan koʻrish
math-input-invalid-expression = Yaroqsiz ifoda:

## Document status

viewer-initializing = Tayyorlanmoqda…

## Errors

error-heading = Xato
error-found-at =
    { $span ->
        [line] { $startLine }-qatorda topildi.
       *[lines] { $startLine }–{ $endLine }-qatorlarda topildi.
    }
document-contains-errors = Bu hujjatda xatolar bor!
diagnostic-heading-error = Xato
diagnostic-heading-warning = Ogohlantirish
diagnostic-heading-information = Maʼlumot
diagnostic-heading-hint = Maslahat
accessibility-heading-level-1 = WCAG AA foydalanuvchanlik buzilishi
accessibility-heading-level-2 = Foydalanuvchanlik bildirishnomasi
something-went-wrong = Nimadir notoʻgʻri ketdi.
renderer-load-failed = tasvirlagichni yuklab boʻlmadi. Sahifani yangilang.
core-start-failed = Hujjat koʻruvchisini ishga tushirib boʻlmadi. Sahifani yangilang.
