# Lak viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Lak (лакку маз) is a Northeast Caucasian language of central Dagestan,
# written in Cyrillic since 1938. That orthography is what Dagestan's schools,
# the Lak-language press and CLDR all use, and `lbe` maximizes to
# `lbe-Cyrl-RU`, so it is what this catalog is written in.
#
# The palochka Ӏ is a letter of the alphabet. It is not a Latin capital I and
# not a digit 1: a catalog that spells «тӀайласса» with either has quietly
# become unreadable, and the substitution is invisible in most editors.
#
# Lak counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape English gives it. A noun after a
# numeral stays in the singular in Lak, so the two branches differ in nothing
# but the number they print — that is correct rather than an oversight.
#
# Lak has a four-class agreement system, but nothing in this file agrees with
# a noun class: see `content.ftl`, whose header explains where the class
# markers land and why this seed does not fork on them.
#
# Least certain here: the words for abstractions the language has no settled
# term for. «ХьхьичӀава кӀицӀ» for a warning and «бигьану ишла баву» for
# accessibility are transparent coinages this seed chose over the bare Russian
# loans a Lak newspaper would print; a speaker should replace them with
# whatever Lak-language computing writing actually uses. The keyboard, matrix
# and orbital controls lean on Russian technical nouns («строка»,
# «столбец», «клетка», «стрелка»), which is what written Lak does for
# mathematics and computing.


## Answer submission

answer-checking = Ххал дуллай…
answer-submitting = Гьан дуллай…
answer-checking-status = Жаваб ххал дуллай
answer-submitting-status = Жаваб гьан дуллай
answer-correct = ТӀайласса
answer-incorrect = КъатӀайласса
answer-response-saved = Жаваб ябувну
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% тӀайла
answer-percent-short = { $percent } %
max-credit-available = Ласун бюхъайсса яла хъунмур балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] хӀарачатру ливчӀун бакъар
        [one] { $count } хӀарачат ливчӀун бур
       *[other] { $count } хӀарачат ливчӀун бур
    }
validation-correct = (ТӀайласса)
validation-incorrect = (КъатӀайласса)
validation-partially-correct = (БутӀалий тӀайласса)
answer-show-responses =
    { $count ->
        [one] { $answerId } тӀисса суалданул { $count } жаваб ккаккан бан
       *[other] { $answerId } тӀисса суалданул { $count } жаваб ккаккан бан
    }

## Disclosure panels

feedback-heading = Пикри
collapsible-click-to-open = (тӀитӀин щелк бува)
collapsible-click-to-close = (лакьин щелк бува)
collapsible-initializing = ХӀадур дуллай…
footnote-show = Лувсса кӀицӀ ккаккан бан
footnote-hide = Лувсса кӀицӀ лакьин
description-more-information = ялагу хавар

## Controls

slider-previous = ХьхьичӀмур
slider-next = Махъмур
keyboard-open = Клавиатура тӀитӀин
keyboard-close = Клавиатура лакьин
choice-input-remove-choice = { $choice } дуккан дан
matrix-remove-row = Строка дуккан дан
matrix-add-row = Строка бишин
matrix-remove-column = Столбец дуккан дан
matrix-add-column = Столбец бишин
subset-add-remove-points = Нукьтарду бишин/дуккан дан
subset-toggle-points-intervals = Нукьтарду ва интервалру даххана дан
subset-move-points = Нукьтарду занан дан
subset-clear = МарцӀ бан
orbital-add-row = Строка бишин
orbital-remove-row = Строка дуккан дан
orbital-add-box = Клетка бишин
orbital-remove-box = Клетка дуккан дан
orbital-add-up-arrow = Лахъуннайсса стрелка бишин
orbital-add-down-arrow = Лагьуннайсса стрелка бишин
orbital-remove-arrow = Стрелка дуккан дан
orbital-row-label = { $row } строкалул цӀа
pretzel-answer = Жаваб

## Math input

math-input-preview-region = математикалул выражение хьхьичӀава ккаккаву
math-input-preview = ХьхьичӀава ккаккаву
math-input-invalid-expression = КъатӀайласса выражение:

## Document status

viewer-initializing = ХӀадур дуллай…

## Errors

error-heading = ГъалатӀ
error-found-at =
    { $span ->
        [line] Лявкъуна { $startLine } строкалий.
       *[lines] Лявкъуна { $startLine }–{ $endLine } строкардай.
    }
document-contains-errors = Ва документрай гъалатӀру бур!
diagnostic-heading-error = ГъалатӀ
diagnostic-heading-warning = ХьхьичӀава кӀицӀ
diagnostic-heading-information = Хавар
diagnostic-heading-hint = Ишара
accessibility-heading-level-1 = WCAG AA бигьану ишла баврил тӀалавшин лиян баву
accessibility-heading-level-2 = Бигьану ишла баврил кӀицӀ
something-went-wrong = ГъалатӀ хьунни.
renderer-load-failed = сурат буллалисса модуль ласун къавхьунни. ЧӀапӀи цӀуну лахъан бува.
core-start-failed = Ва документ байбишин къавхьунни. ЧӀапӀи цӀуну лахъан бува.
core-start-failed-busy = Ва документ байбишин къавхьунни. Ца чӀумал чӀярусса документру байбишлай бивкӀссар, гужсса къадусса компьютердай му яла хӀаллай лякъин бюхъайссар. Цаймигу документру къуртал хьувкун, чӀапӀи цӀуну лахъан бувну кумаг хьун бюхъайссар.
core-start-failed-retry = Ва документ байбишин къавхьунни.
core-start-failed-busy-retry = Ва документ байбишин къавхьунни. Ца чӀумал чӀярусса документру байбишлай бивкӀссар, гужсса къадусса компьютердай му яла хӀаллай лякъин бюхъайссар.
core-start-retry = ЦӀуну ххал бува
saved-state-unavailable = Вил ябувну бивкӀсса даву ласун къавхьунни.
