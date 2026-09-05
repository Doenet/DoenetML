# Lezgian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Cyrillic orthography Dagestan's schools, its newspapers and
# its book publishing have used since 1938, which is also what CLDR fills a
# bare `lez` in as (`lez` maximizes to `lez-Cyrl-RU`). Lezgian is also spoken
# across the border in the Qusar, Qəbələ and Ismayıllı districts of Azerbaijan,
# where the same language is written in the Latin alphabet; this catalog is the
# Cyrillic standard, and a Latin-script Lezgian catalog would be a second
# catalog rather than an edit to this one. CLDR's English name for the language
# is **Lezghian**; it is more usually called Lezgian or Lezgi in English, and
# «лезги чӀал» in the language itself.
#
# The palochka Ӏ is a letter of the alphabet. It is not a Latin capital I and
# not the digit 1; «гъалатӀ» spelled with either has quietly stopped being a
# Lezgian word.
#
# Lezgian counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape English gives it. A noun after a
# numeral stays in the singular — «3 алахъун», not a plural — so the two
# branches differ in nothing but the number they print. The explicit `[0]`
# branch English writes is kept, because Lezgian says «алахъунар амач» there
# rather than counting to zero.
#
# **Lezgian has no noun classes and no grammatical gender**, unlike every one
# of its Northeast Caucasian neighbours seeded beside it. See `content.ftl`,
# where that fact is set out and where `noun-gender` returns a single token.
# Nothing in this file agrees with anything.
#
# Where an English preposition would land on a placeable, the Lezgian case
# suffix is put on a word this catalog writes instead — see
# `answer-show-responses` below, which names what the value is
# («… тӀвар алай суал») rather than welding -диз or -дин onto it.


## Answer submission

answer-checking = Ахтармишзава…
answer-submitting = Ракъурзава…
answer-checking-status = Жаваб ахтармишзава
answer-submitting-status = Жаваб ракъурзава
answer-correct = Дуьз
answer-incorrect = Дуьз туш
answer-response-saved = Жаваб хвена
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% дуьз
answer-percent-short = { $percent } %
max-credit-available = Къачуз жедай виридалайни гзаф балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] алахъунар амач
        [one] { $count } алахъун ама
       *[other] { $count } алахъун ама
    }
validation-correct = (Дуьз)
validation-incorrect = (Дуьз туш)
validation-partially-correct = (Са пай дуьз)
# «-диз» is a dative and cannot sit on a placeable, so the message names what
# the value is and puts the case on «суал», a word written here.
answer-show-responses =
    { $count ->
        [one] { $answerId } тӀвар алай суалдиз гайи { $count } жаваб къалура
       *[other] { $answerId } тӀвар алай суалдиз гайи { $count } жаваб къалура
    }

## Disclosure panels

feedback-heading = Къейдер
collapsible-click-to-open = (ахъаюн патал тӀуша)
collapsible-click-to-close = (агалун патал тӀуша)
collapsible-initializing = Гьазурзава…
footnote-show = КӀаник авай къейд къалура
footnote-hide = КӀаник авай къейд чуьнуьха
description-more-information = артух малумат

## Controls

slider-previous = Вилик
slider-next = Гуьгъуьнин
keyboard-open = Клавиатура ахъая
keyboard-close = Клавиатура агала
choice-input-remove-choice = { $choice } алуда
matrix-remove-row = ЦӀар алуда
matrix-add-row = ЦӀар алава ая
matrix-remove-column = Столбец алуда
matrix-add-column = Столбец алава ая
subset-add-remove-points = Нукьтаяр алава ая/алуда
subset-toggle-points-intervals = Нукьтаяр ва интервалар дегишара
subset-move-points = Нукьтаяр юзура
subset-clear = Михьа
orbital-add-row = ЦӀар алава ая
orbital-remove-row = ЦӀар алуда
orbital-add-box = Клетка алава ая
orbital-remove-box = Клетка алуда
orbital-add-up-arrow = Виниз стрелка алава ая
orbital-add-down-arrow = Агъуз стрелка алава ая
orbital-remove-arrow = Стрелка алуда
# «лагьай» is a free word and forms the ordinal after a numeral, so nothing is
# welded to the placeable here.
orbital-row-label = { $row } лагьай цӀарцӀин тӀвар
pretzel-answer = Жаваб
# The genitive «-дин» would have to sit on `{ $column }`, so the column is
# named instead and the case falls on «столбец».

## Math input

math-input-preview-region = математикадин ибарадин вилик квай килигун
math-input-preview = Вилик квай килигун
math-input-invalid-expression = Дуьз тушир ибара:

## Document status

viewer-initializing = Гьазурзава…

## Errors

error-heading = ГъалатӀ
error-found-at =
    { $span ->
        [line] { $startLine } лагьай цӀарал жагъана.
       *[lines] { $startLine }–{ $endLine } лагьай цӀарарал жагъана.
    }
document-contains-errors = И документда гъалатӀар ава!
diagnostic-heading-error = ГъалатӀ
diagnostic-heading-warning = Хабардарвал
diagnostic-heading-information = Малумат
diagnostic-heading-hint = Ишара
accessibility-heading-level-1 = WCAG AA агакьунвилин къайда чӀурун
accessibility-heading-level-2 = Агакьунвилин хабардарвал
something-went-wrong = Са затӀ дуьз хьанач.
renderer-load-failed = къалурдайди эхцигиз хьанач. Чин цӀийи хъия.
core-start-failed = И документ кардик кутаз хьанач. Чин цӀийи хъия.
core-start-failed-busy = И документ кардик кутаз хьанач. Са вахтунда гзаф документ кардик акатзавай, им зайиф аппаратда мадни яваш физвай кар я. Муькуь документар куьтягь хьайила чин цӀийи хъувуни куьмек гуз жеда.
core-start-failed-retry = И документ кардик кутаз хьанач.
core-start-failed-busy-retry = И документ кардик кутаз хьанач. Са вахтунда гзаф документ кардик акатзавай, им зайиф аппаратда мадни яваш физвай кар я.
core-start-retry = Мад сеферда алахъа
saved-state-unavailable = Ви хвенвай кӀвалах хкиз хьанач.
