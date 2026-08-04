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

answer-correct = To‘g‘ri
answer-incorrect = Noto‘g‘ri

answer-response-saved = Javob saqlandi

answer-percent-credit = { $percent }% ball
answer-percent-correct = { $percent }% to‘g‘ri
answer-percent-short = { $percent } %

max-credit-available = Mumkin bo‘lgan eng yuqori ball: { $percent }%

attempts-remaining =
    { $count ->
        [0] urinish qolmadi
        [one] { $count } urinish qoldi
       *[other] { $count } urinish qoldi
    }

validation-correct = (To‘g‘ri)
validation-incorrect = (Noto‘g‘ri)
validation-partially-correct = (Qisman to‘g‘ri)

answer-show-responses =
    { $count ->
        [one] { $answerId } uchun { $count } javobni ko‘rsatish
       *[other] { $answerId } uchun { $count } javobni ko‘rsatish
    }


## Disclosure panels

feedback-heading = Fikr-mulohaza

collapsible-click-to-open = (ochish uchun bosing)
collapsible-click-to-close = (yopish uchun bosing)

collapsible-initializing = Tayyorlanmoqda…

footnote-show = Izohni ko‘rsatish
footnote-hide = Izohni yashirish

description-more-information = qo‘shimcha ma’lumot


## Controls

slider-previous = Oldingi
slider-next = Keyingi

keyboard-open = Klaviaturani ochish
keyboard-close = Klaviaturani yopish

choice-input-remove-choice = { $choice } tanlovini olib tashlash

matrix-remove-row = Qatorni o‘chirish
matrix-add-row = Qator qo‘shish
matrix-remove-column = Ustunni o‘chirish
matrix-add-column = Ustun qo‘shish

subset-add-remove-points = Nuqta qo‘shish/o‘chirish
subset-toggle-points-intervals = Nuqtalar va oraliqlar orasida almashtirish
subset-move-points = Nuqtalarni ko‘chirish
subset-clear = Tozalash

orbital-add-row = Qator qo‘shish
orbital-remove-row = Qatorni o‘chirish
orbital-add-box = Katak qo‘shish
orbital-remove-box = Katakni o‘chirish
orbital-add-up-arrow = Yuqoriga strelka qo‘shish
orbital-add-down-arrow = Pastga strelka qo‘shish
orbital-remove-arrow = Strelkani o‘chirish

orbital-row-label = { $row } qatorining yorlig‘i

pretzel-answer = Javob

summary-statistics-caption = { $column } ustunining yakuniy statistikasi


## Math input

math-input-preview-region = matematik ifodani oldindan ko‘rish
math-input-preview = Oldindan ko‘rish
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
diagnostic-heading-information = Ma’lumot
diagnostic-heading-hint = Maslahat

accessibility-heading-level-1 = WCAG AA foydalanuvchanlik buzilishi
accessibility-heading-level-2 = Foydalanuvchanlik bildirishnomasi

something-went-wrong = Nimadir noto‘g‘ri ketdi.

renderer-load-failed = tasvirlagichni yuklab bo‘lmadi. Sahifani yangilang.

core-start-failed = Hujjat ko‘ruvchisini ishga tushirib bo‘lmadi. Sahifani yangilang.
