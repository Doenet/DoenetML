# Avar viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Avar (авар мацӀ) in the Cyrillic orthography Dagestan's schools and
# publishing use, which is what CLDR fills a bare `av` in as (`av-Cyrl-RU`).
# The palochka Ӏ is a letter of the alphabet, not a Latin I and not a digit 1.
#
# Avar counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape English gave it. A noun after a
# numeral stays singular in Avar, so the two branches differ in nothing but the
# number they print — which is why they read alike rather than by oversight.
#
# Nothing in this file agrees with a noun class. Avar's class agreement is
# real, and it is a suffix on the agreeing word rather than a prefix; but it
# needs a noun the catalog itself supplies, and the words here describe the
# reader's own screen. `content.ftl`'s header is where the class system is
# written out and where the one place it could have mattered is explained.
#
# The interface and mathematical vocabulary is the Russian one wherever written
# Avar uses it — «клавиатура», «строка», «столбец», «интервал», «статистика»,
# «выражение» — because that is what an Avar-speaking reader meets on a screen
# and in a textbook. Where Avar has an everyday word that carries the meaning,
# that word is used instead: «гьумер» for a page, «жаваб» for an answer,
# «гъалатӀ» for an error.


## Answer submission

answer-checking = Хал гьабулеб буго…
answer-submitting = БитӀулеб буго…
answer-checking-status = Жавабалъул хал гьабулеб буго
answer-submitting-status = Жаваб битӀулеб буго
answer-correct = БитӀараб
answer-incorrect = Мекъаб
answer-response-saved = Жаваб хъвана
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% битӀараб
answer-percent-short = { $percent } %
max-credit-available = Босизе бегьулеб бищунго кӀудияб балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] цохӀо гӀуж хутӀун гьечӀо
        [one] { $count } гӀуж хутӀун буго
       *[other] { $count } гӀуж хутӀун буго
    }
validation-correct = (БитӀараб)
validation-incorrect = (Мекъаб)
validation-partially-correct = (БутӀаялъ битӀараб)
answer-show-responses =
    { $count ->
        [one] { $answerId } абураб суалалъе { $count } жаваб бихьизабизе
       *[other] { $answerId } абураб суалалъе { $count } жаваб бихьизабизе
    }

## Disclosure panels

feedback-heading = Жаваб-калам
collapsible-click-to-open = (рагьизе хӀапа гьабе)
collapsible-click-to-close = (къазе хӀапа гьабе)
collapsible-initializing = ХӀадурулеб буго…
footnote-show = Гъоркьа бицен бихьизабизе
footnote-hide = Гъоркьа бицен бахчизе
description-more-information = цойги хабар

## Controls

slider-previous = Цебесеб
slider-next = Хадусеб
keyboard-open = Клавиатура рагьизе
keyboard-close = Клавиатура къазе
choice-input-remove-choice = { $choice } нахъе босизе
matrix-remove-row = Строка нахъе босизе
matrix-add-row = Строка жубазе
matrix-remove-column = Столбец нахъе босизе
matrix-add-column = Столбец жубазе
subset-add-remove-points = ТӀанкӀал жубазе/нахъе росизе
subset-toggle-points-intervals = ТӀанкӀалги интервалалги хиси
subset-move-points = ТӀанкӀал сверизаризе
subset-clear = БацӀцӀад гьабизе
orbital-add-row = Строка жубазе
orbital-remove-row = Строка нахъе босизе
orbital-add-box = КатӀа жубазе
orbital-remove-box = КатӀа нахъе босизе
orbital-add-up-arrow = ТӀасан хӀулу жубазе
orbital-add-down-arrow = Гъоркьан хӀулу жубазе
orbital-remove-arrow = ХӀулу нахъе босизе
orbital-row-label = { $row } абураб строкаялъул цӀар
pretzel-answer = Жаваб

## Math input

math-input-preview-region = математикияб выражениялъул цебесеб балагьи
math-input-preview = Цебесеб балагьи
math-input-invalid-expression = Мекъаб выражение:

## Document status

viewer-initializing = ХӀадурулеб буго…

## Errors

error-heading = ГъалатӀ
error-found-at =
    { $span ->
        [line] { $startLine } абураб мухъалда батана.
       *[lines] { $startLine }–{ $endLine } абурал мухъазда батана.
    }
document-contains-errors = Гьаб документалда гъалатӀал руго!
diagnostic-heading-error = ГъалатӀ
diagnostic-heading-warning = ХӀинкъи
diagnostic-heading-information = Хабар
diagnostic-heading-hint = Ишара
accessibility-heading-level-1 = WCAG AA щвезабиялъул хисмат
accessibility-heading-level-2 = Щвезабиялъул хӀинкъи
something-went-wrong = Жо битӀун ккечӀо.
renderer-load-failed = сурат бахъулеб компонент бачине кӀвечӀо. Гьумер цӀияб гьабе.
core-start-failed = Гьаб документ байбихьизе кӀвечӀо. Гьумер цӀияб гьабе.
core-start-failed-busy = Гьаб документ байбихьизе кӀвечӀо. Цадахъ гӀемерал документал байбихьулел рукӀана, гьеб гӀорхъуда кӀудияб заман босизе бегьула зигараб устройствоялда. Цогидал документал лъугӀараб мехалъ гьумер цӀияб гьабуни, кумек букӀине бегьула.
core-start-failed-retry = Гьаб документ байбихьизе кӀвечӀо.
core-start-failed-busy-retry = Гьаб документ байбихьизе кӀвечӀо. Цадахъ гӀемерал документал байбихьулел рукӀана, гьеб гӀорхъуда кӀудияб заман босизе бегьула зигараб устройствоялда.
core-start-retry = ЦӀияб гӀуж гьабе
saved-state-unavailable = Дуца хъварабщинаб хӀалтӀи бачине кӀвечӀо.
