# Southern Altai viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Southern Altai** (алтай тил), the literary standard of the Altai Republic
# in Russia, based on the Altai-kizhi dialect. `alt` is the individual language
# rather than the macrolanguage: Northern Altai varieties — Kumandy, Chelkan,
# Tubalar — are not written in this standard and are not served by this
# catalog.
#
# SCRIPT. Cyrillic, in the standard Altai alphabet: the Russian letters plus
# **ј ҥ ӧ ӱ**. `ј` is a full letter and is neither `дж` nor `ч`; `ҥ` is one
# letter, not `нг`. A corrector should keep all four and not fold them into
# Russian look-alikes.
#
# HOW THIN THIS IS. Altai has a literary standard, a press and school
# instruction, but very little written register for software, and secondary
# mathematics in the republic is taught in Russian. CLDR has no plural data for
# `alt`. A good deal of what is below is a first attempt rather than an
# attested usage. Where no Altai word could be established the Russian one is
# kept in its Russian spelling, which is what written Altai does with a
# technical loan.
#
# PLURALS. `Intl.PluralRules` has no data for `alt`, so a `[one]` branch could
# never be selected; and a noun after a numeral stays singular in Altai in any
# case. Every count selection is collapsed to a single `*[other]`. Explicit
# numeric branches such as `[0]` match the number itself and are kept.


## Answer submission

answer-checking = Шиҥделип јат…
answer-submitting = Ийилип јат…
answer-checking-status = Каруу шиҥделип јат
answer-submitting-status = Каруу ийилип јат
answer-correct = Чын
answer-incorrect = Чын эмес
answer-response-saved = Каруу аргадалган
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% чын
answer-percent-short = { $percent } %
max-credit-available = Эҥ бийик балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] шенелте артпаган
       *[other] { $count } шенелте арткан
    }
validation-correct = (Чын)
validation-incorrect = (Чын эмес)
validation-partially-correct = (Кезиги чын)
answer-show-responses =
    { $count ->
       *[other] { $answerId } учун { $count } карууны кӧргӱзер
    }


## Disclosure panels

feedback-heading = Каруу сӧс
collapsible-click-to-open = (ачарга базыгар)
collapsible-click-to-close = (јабарга базыгар)
collapsible-initializing = Белетелип јат…
footnote-show = Эскертӱни кӧргӱзер
footnote-hide = Эскертӱни јажырар
description-more-information = кожо јетирӱ


## Controls

slider-previous = Кайра
slider-next = Ары
keyboard-open = Клавиатураны ачар
keyboard-close = Клавиатураны јабар
choice-input-remove-choice = { $choice } талдаманы јоголтор
matrix-remove-row = Строканы јоголтор
matrix-add-row = Строка кожор
matrix-remove-column = Столбецти јоголтор
matrix-add-column = Столбец кожор
subset-add-remove-points = Точка кожор/јоголтор
subset-toggle-points-intervals = Точкалар ла аралар солыжар
subset-move-points = Точкаларды кӧчӱрер
subset-clear = Арутаар
orbital-add-row = Строка кожор
orbital-remove-row = Строканы јоголтор
orbital-add-box = Ящик кожор
orbital-remove-box = Ящикти јоголтор
orbital-add-up-arrow = Ӧрӧ согоно кожор
orbital-add-down-arrow = Тӧмӧн согоно кожор
orbital-remove-arrow = Согононы јоголтор
orbital-row-label = { $row } строканыҥ темдеги
pretzel-answer = Каруу


## Math input

math-input-preview-region = математика выражениениҥ озогы кӧрӱми
math-input-preview = Озогы кӧрӱм
math-input-invalid-expression = Јарабас выражение:


## Document status

viewer-initializing = Белетелип јат…


## Errors

error-heading = Јастыра
error-found-at =
    { $span ->
        [line] { $startLine } строкада табылган.
       *[lines] { $startLine }–{ $endLine } строкаларда табылган.
    }
document-contains-errors = Бу документте јастыралар бар!
diagnostic-heading-error = Јастыра
diagnostic-heading-warning = Эскертӱ
diagnostic-heading-information = Јетирӱ
diagnostic-heading-hint = Сӱме
accessibility-heading-level-1 = WCAG AA тузаланар арганыҥ бузулганы
accessibility-heading-level-2 = Тузаланар арга керегинде эскертӱ
something-went-wrong = Не-де јастыра болды.
renderer-load-failed = кӧргӱзер эп-арга јӱктелбеди. Бӱкти катап јӱктегер.
core-start-failed = Бу документ баштанбады. Бӱкти катап јӱктегер.
core-start-failed-busy = Бу документ баштанбады. Кӧп документ бир ӧйдӧ баштанып турган, ол јобош машинада кӧп ӧй алар аргалу. Ӧскӧ документтер тӱгенген кийнинде бӱкти катап јӱктегени болужар аргалу.
core-start-failed-retry = Бу документ баштанбады.
core-start-failed-busy-retry = Бу документ баштанбады. Кӧп документ бир ӧйдӧ баштанып турган, ол јобош машинада кӧп ӧй алар аргалу.
core-start-retry = Катап шенеер
saved-state-unavailable = Аргадалган ижигер јӱктелбеди.
