# Karachay-Balkar viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Cyrillic alphabet Karachay-Cherkessia and Kabardino-Balkaria
# use in school and in print, and what CLDR fills a bare `krc` in as
# (`krc-Cyrl-RU`). The digraphs къ, гъ, нг and дж are single letters of that
# alphabet; a catalog that spells «къара» as «кара» has quietly written
# something else.
#
# Karachay and Balkar are two literary norms of one language over a shared
# standard. This catalog writes the **Karachay** norm, which is why дж- stands
# where a Balkar reader expects ж- («джууап», not «жууап»). Nothing else in
# the file turns on the choice, and swapping the initial is the whole of what
# a Balkar reading would change here.
#
# Karachay-Balkar counts in two plural categories, `one` and `other`, the same
# two English has, so every `{ $count -> … }` below keeps the shape it had. A
# noun after a numeral stays singular — «2 сынау», never a plural — so the two
# branches differ in nothing but the number they print.
#
# Nothing in this file agrees with a gender or a noun class: the language is
# Turkic and has neither. See `content.ftl`, where that is stated once for the
# whole catalog.


## Answer submission

answer-checking = Тергеледи…
answer-submitting = Джибериледи…
answer-checking-status = Джууап тергеледи
answer-submitting-status = Джууап джибериледи
answer-correct = Тюз
answer-incorrect = Терс
answer-response-saved = Джууап сакъланды
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% тюз
answer-percent-short = { $percent } %
max-credit-available = Алыргъа боллукъ эм уллу балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] сынау къалмады
        [one] { $count } сынау къалды
       *[other] { $count } сынау къалды
    }
validation-correct = (Тюз)
validation-incorrect = (Терс)
validation-partially-correct = (Кесеклей тюз)
answer-show-responses =
    { $count ->
        [one] { $answerId } ючюн { $count } джууапны кёргюзюу
       *[other] { $answerId } ючюн { $count } джууапны кёргюзюу
    }

## Disclosure panels

feedback-heading = Кери байланыу
collapsible-click-to-open = (ачар ючюн басыгъыз)
collapsible-click-to-close = (джабар ючюн басыгъыз)
collapsible-initializing = Хазырланады…
footnote-show = Тюп джазыуну кёргюзюу
footnote-hide = Тюп джазыуну джашырыу
description-more-information = къошакъ билдириу

## Controls

slider-previous = Алгъыннгы
slider-next = Келлик
keyboard-open = Клавиатураны ачыу
keyboard-close = Клавиатураны джабыу
choice-input-remove-choice = { $choice } сайлауну кетериу
matrix-remove-row = Тизгинни кетериу
matrix-add-row = Тизгин къошуу
matrix-remove-column = Багъананы кетериу
matrix-add-column = Багъана къошуу
subset-add-remove-points = Нокъта къошуу/кетериу
subset-toggle-points-intervals = Нокъталаны эм аралыкъланы алмаштырыу
subset-move-points = Нокъталаны кёчюрюу
subset-clear = Тазалау
orbital-add-row = Тизгин къошуу
orbital-remove-row = Тизгинни кетериу
orbital-add-box = Къуту къошуу
orbital-remove-box = Къутуну кетериу
orbital-add-up-arrow = Ёрге окъ къошуу
orbital-add-down-arrow = Тёбенге окъ къошуу
orbital-remove-arrow = Окъну кетериу
orbital-row-label = { $row } тизгинни белгиси
pretzel-answer = Джууап

## Math input

math-input-preview-region = математика ангылатманы алгъадан кёрюу
math-input-preview = Алгъадан кёрюу
math-input-invalid-expression = Тюз болмагъан ангылатма:

## Document status

viewer-initializing = Хазырланады…

## Errors

error-heading = Халат
error-found-at =
    { $span ->
        [line] Табылгъан тизгин: { $startLine }.
       *[lines] Табылгъан тизгинле: { $startLine }–{ $endLine }.
    }
document-contains-errors = Бу документде халатла бардыла!
diagnostic-heading-error = Халат
diagnostic-heading-warning = Эсгертиу
diagnostic-heading-information = Билдириу
diagnostic-heading-hint = Ишара
accessibility-heading-level-1 = WCAG AA джетимлилик бузукълукъ
accessibility-heading-level-2 = Джетимлилик эсгертиу
something-went-wrong = Бир зат тюз болмады.
renderer-load-failed = кёргюзтюучюню джюклерге болмады. Бетни джангыртыгъыз.
core-start-failed = Бу документни ишлетирге болмады. Бетни джангыртыгъыз.
core-start-failed-busy = Бу документни ишлетирге болмады. Бир къауум документ бир заманда башланнганды; акъырын ишлеген приборда бу кёбюрек заман алады. Башха документле бошагъандан сора бетни джангыртыу болушургъа боллукъду.
core-start-failed-retry = Бу документни ишлетирге болмады.
core-start-failed-busy-retry = Бу документни ишлетирге болмады. Бир къауум документ бир заманда башланнганды; акъырын ишлеген приборда бу кёбюрек заман алады.
core-start-retry = Джангыдан сынау
saved-state-unavailable = Сакъланнган ишигизни джюклерге болмады.
