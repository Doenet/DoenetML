# Bashkir viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Bashkir counts in two plural categories, `one` and `other`, the same two
# English has, so every `{ $count -> … }` below keeps the shape it had. A noun
# after a numeral stays singular — «2 омтылыш», not a plural — so the two
# branches differ in nothing but the number they print.


## Answer submission

answer-checking = Тикшерелә…
answer-submitting = Ебәрелә…
answer-checking-status = Яуап тикшерелә
answer-submitting-status = Яуап ебәрелә
answer-correct = Дөрөҫ
answer-incorrect = Яңылыш
answer-response-saved = Яуап һаҡланды
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% дөрөҫ
answer-percent-short = { $percent } %
max-credit-available = Мөмкин булған иң юғары балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] омтылыш ҡалманы
        [one] { $count } омтылыш ҡалды
       *[other] { $count } омтылыш ҡалды
    }
validation-correct = (Дөрөҫ)
validation-incorrect = (Яңылыш)
validation-partially-correct = (Өлөшләтә дөрөҫ)
answer-show-responses =
    { $count ->
        [one] { $answerId } өсөн { $count } яуапты күрһәтеү
       *[other] { $answerId } өсөн { $count } яуапты күрһәтеү
    }

## Disclosure panels

feedback-heading = Кире бәйләнеш
collapsible-click-to-open = (асыу өсөн баҫығыҙ)
collapsible-click-to-close = (ябыу өсөн баҫығыҙ)
collapsible-initializing = Әҙерләнә…
footnote-show = Иҫкәрмәне күрһәтеү
footnote-hide = Иҫкәрмәне йәшереү
description-more-information = өҫтәмә мәғлүмәт

## Controls

slider-previous = Алдағы
slider-next = Киләһе
keyboard-open = Клавиатураны асыу
keyboard-close = Клавиатураны ябыу
choice-input-remove-choice = { $choice } һайлауын алып ташлау
matrix-remove-row = Юлды алып ташлау
matrix-add-row = Юл өҫтәү
matrix-remove-column = Бағананы алып ташлау
matrix-add-column = Бағана өҫтәү
subset-add-remove-points = Нөктә өҫтәү/алып ташлау
subset-toggle-points-intervals = Нөктәләр менән аралыҡтарҙы алмаштырыу
subset-move-points = Нөктәләрҙе күсереү
subset-clear = Таҙартыу
orbital-add-row = Юл өҫтәү
orbital-remove-row = Юлды алып ташлау
orbital-add-box = Күҙәнәк өҫтәү
orbital-remove-box = Күҙәнәкте алып ташлау
orbital-add-up-arrow = Өҫкә уҡ өҫтәү
orbital-add-down-arrow = Аҫҡа уҡ өҫтәү
orbital-remove-arrow = Уҡты алып ташлау
orbital-row-label = { $row } юлының билдәһе
pretzel-answer = Яуап

## Math input

math-input-preview-region = математик аңлатманың алдан ҡарашы
math-input-preview = Алдан ҡараш
math-input-invalid-expression = Дөрөҫ булмаған аңлатма:

## Document status

viewer-initializing = Әҙерләнә…

## Errors

error-heading = Хата
error-found-at =
    { $span ->
        [line] Табылған юл: { $startLine }.
       *[lines] Табылған юлдар: { $startLine }–{ $endLine }.
    }
document-contains-errors = Был документта хаталар бар!
diagnostic-heading-error = Хата
diagnostic-heading-warning = Иҫкәртеү
diagnostic-heading-information = Мәғлүмәт
diagnostic-heading-hint = Кәңәш
accessibility-heading-level-1 = WCAG AA ҡулайлылыҡ боҙоуы
accessibility-heading-level-2 = Ҡулайлылыҡ хәбәре
something-went-wrong = Ниҙер дөрөҫ булманы.
renderer-load-failed = һүрәтләүсене йөкләп булманы. Битте яңыртығыҙ.
core-start-failed = Документ ҡарағысын эшләтеп ебәреп булманы. Битте яңыртығыҙ.
