# Khakas viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Khakas** (хакас тілі), a South Siberian Turkic language of the Republic of
# Khakassia in Russia.
#
# SCRIPT. Cyrillic, in the standard Khakas alphabet: the Russian letters plus
# **і ғ ң ӧ ӱ ӌ**. `і` is a letter in its own right and is not interchangeable
# with `и`; `ӌ` is not `дж` or `ч`. A corrector should keep all six and should
# not substitute the Russian look-alikes for them.
#
# HOW THIN THIS IS. Khakas has a literary standard, a newspaper and school
# instruction in the primary grades, but almost no settled written register for
# software or for secondary-school mathematics — both of which are conducted in
# Russian. There is no Khakas name for `kjh` in CLDR in any language, and no
# plural data. Much of what is below is therefore a first attempt rather than
# an attested usage, and a speaker should expect to rewrite rather than merely
# correct. Where no Khakas word could be established, the Russian one is kept
# in Russian spelling — that is what written Khakas actually does with a
# technical loan, and it is preferable to a coinage nobody uses.
#
# PLURALS. `Intl.PluralRules` has no data for `kjh`, so a `[one]` branch could
# never be selected; and Khakas leaves a noun singular after a numeral in any
# case. Every count selection is collapsed to a single `*[other]`. Explicit
# numeric branches such as `[0]` match the number itself and are kept.


## Answer submission

answer-checking = Тексерче…
answer-submitting = Ысча…
answer-checking-status = Харии тексерче
answer-submitting-status = Харии ысча
answer-correct = Сын
answer-incorrect = Сын нимес
answer-response-saved = Харии тудылған
answer-percent-credit = { $percent }% палл
answer-percent-correct = { $percent }% сын
answer-percent-short = { $percent } %
max-credit-available = Ин пӧзік палл: { $percent }%
attempts-remaining =
    { $count ->
        [0] сынағ халбаан
       *[other] { $count } сынағ халған
    }
validation-correct = (Сын)
validation-incorrect = (Сын нимес)
validation-partially-correct = (Чарым сын)
answer-show-responses =
    { $count ->
       *[other] { $answerId } ӱчӱн { $count } харии кӧзідерге
    }


## Disclosure panels

feedback-heading = Нандырығ
collapsible-click-to-open = (азарға пазыңар)
collapsible-click-to-close = (чабарға пазыңар)
collapsible-initializing = Тимненче…
footnote-show = Искермені кӧзідерге
footnote-hide = Искермені чазырарға
description-more-information = хоза искіріг


## Controls

slider-previous = Алнындағы
slider-next = Соондағы
keyboard-open = Клавиатура азарға
keyboard-close = Клавиатура чабарға
choice-input-remove-choice = { $choice } сығарарға
matrix-remove-row = Строканы сығарарға
matrix-add-row = Строка хозарға
matrix-remove-column = Столбецті сығарарға
matrix-add-column = Столбец хозарға
subset-add-remove-points = Точка хозарға/сығарарға
subset-toggle-points-intervals = Точкалар паза аралар алыстырарға
subset-move-points = Точкаларны кӧчірерге
subset-clear = Арығларға
orbital-add-row = Строка хозарға
orbital-remove-row = Строканы сығарарға
orbital-add-box = Ящик хозарға
orbital-remove-box = Ящикті сығарарға
orbital-add-up-arrow = Ӱстӱнзер ух хозарға
orbital-add-down-arrow = Алтынзар ух хозарға
orbital-remove-arrow = Ухты сығарарға
orbital-row-label = { $row } строканың белгізі
pretzel-answer = Харии


## Math input

math-input-preview-region = математика выражениезінің алын кӧрізі
math-input-preview = Алын кӧріс
math-input-invalid-expression = Чарабас выражение:


## Document status

viewer-initializing = Тимненче…


## Errors

error-heading = Чазығ
error-found-at =
    { $span ->
        [line] { $startLine } строкада табылған.
       *[lines] { $startLine }–{ $endLine } строкаларда табылған.
    }
document-contains-errors = Пу документте чазығлар пар!
diagnostic-heading-error = Чазығ
diagnostic-heading-warning = Сағындырығ
diagnostic-heading-information = Искіріг
diagnostic-heading-hint = Сӱме
accessibility-heading-level-1 = WCAG AA тузаланӌаң арғаның тоғыр полғаны
accessibility-heading-level-2 = Тузаланӌаң арға тузында сағындырығ
something-went-wrong = Ноо-да ниме тоғыр полған.
renderer-load-failed = кӧзідӌең ниме тартылбаан. Страницаны хатап тартыңар.
core-start-failed = Пу документ тимнелбеен. Страницаны хатап тартыңар.
core-start-failed-busy = Пу документ тимнелбеен. Кӧп документ пір туста тимненчеткен, ол ағырын машинада ӧбіре тус аларға чарир. Пасха документтер тоозылған соонда страницаны хатап тартханы полысханы чарир.
core-start-failed-retry = Пу документ тимнелбеен.
core-start-failed-busy-retry = Пу документ тимнелбеен. Кӧп документ пір туста тимненчеткен, ол ағырын машинада ӧбіре тус аларға чарир.
core-start-retry = Хатап сынирға
saved-state-unavailable = Тудылған тоғызыңар тартылбаан.
