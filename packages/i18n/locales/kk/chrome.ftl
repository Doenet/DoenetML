# Kazakh viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Kazakh counts in two plural categories, `one` and `other`, the same two
# English has, so every `{ $count -> … }` below keeps the shape it had. A noun
# after a numeral stays singular — «2 әрекет», not a plural — so the two
# branches differ in nothing but the number they print.


## Answer submission

answer-checking = Тексерілуде…
answer-submitting = Жіберілуде…
answer-checking-status = Жауап тексерілуде
answer-submitting-status = Жауап жіберілуде
answer-correct = Дұрыс
answer-incorrect = Қате
answer-response-saved = Жауап сақталды
answer-percent-credit = { $percent }% ұпай
answer-percent-correct = { $percent }% дұрыс
answer-percent-short = { $percent } %
max-credit-available = Ең жоғары мүмкін ұпай: { $percent }%
attempts-remaining =
    { $count ->
        [0] әрекет қалмады
        [one] { $count } әрекет қалды
       *[other] { $count } әрекет қалды
    }
validation-correct = (Дұрыс)
validation-incorrect = (Қате)
validation-partially-correct = (Ішінара дұрыс)
answer-show-responses =
    { $count ->
        [one] { $answerId } үшін { $count } жауапты көрсету
       *[other] { $answerId } үшін { $count } жауапты көрсету
    }

## Disclosure panels

feedback-heading = Кері байланыс
collapsible-click-to-open = (ашу үшін басыңыз)
collapsible-click-to-close = (жабу үшін басыңыз)
collapsible-initializing = Дайындалуда…
footnote-show = Сілтемені көрсету
footnote-hide = Сілтемені жасыру
description-more-information = қосымша ақпарат

## Controls

slider-previous = Алдыңғы
slider-next = Келесі
keyboard-open = Пернетақтаны ашу
keyboard-close = Пернетақтаны жабу
choice-input-remove-choice = { $choice } таңдауын алып тастау
matrix-remove-row = Жолды жою
matrix-add-row = Жол қосу
matrix-remove-column = Бағанды жою
matrix-add-column = Баған қосу
subset-add-remove-points = Нүктелерді қосу/жою
subset-toggle-points-intervals = Нүктелер мен аралықтарды ауыстыру
subset-move-points = Нүктелерді жылжыту
subset-clear = Тазалау
orbital-add-row = Жол қосу
orbital-remove-row = Жолды жою
orbital-add-box = Ұяшық қосу
orbital-remove-box = Ұяшықты жою
orbital-add-up-arrow = Жоғары бағытталған көрсеткі қосу
orbital-add-down-arrow = Төмен бағытталған көрсеткі қосу
orbital-remove-arrow = Көрсеткіні жою
orbital-row-label = { $row } жолының белгісі
pretzel-answer = Жауап

## Math input

math-input-preview-region = математикалық өрнекті алдын ала қарау
math-input-preview = Алдын ала қарау
math-input-invalid-expression = Жарамсыз өрнек:

## Document status

viewer-initializing = Дайындалуда…

## Errors

error-heading = Қате
error-found-at =
    { $span ->
        [line] { $startLine } жолында табылды.
       *[lines] { $startLine }–{ $endLine } жолдарында табылды.
    }
document-contains-errors = Бұл құжатта қателер бар!
diagnostic-heading-error = Қате
diagnostic-heading-warning = Ескерту
diagnostic-heading-information = Ақпарат
diagnostic-heading-hint = Кеңес
accessibility-heading-level-1 = WCAG AA қолжетімділік бұзушылығы
accessibility-heading-level-2 = Қолжетімділік хабарламасы
something-went-wrong = Бірдеңе дұрыс болмады.
renderer-load-failed = бейнелеуішті жүктеу мүмкін болмады. Бетті жаңартыңыз.
core-start-failed = Құжат қарау құралын іске қосу мүмкін болмады. Бетті жаңартыңыз.
