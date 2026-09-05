# Shughni (Шугнонӣ, х̌уг̌нӯн зивод) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids and attribute names are never translated — only the text to the
# right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# ## Orthography
#
# These four files are written in the **Cyrillic practice used in Gorno-
# Badakhshan, Tajikistan**: the Tajik Cyrillic alphabet as the base, with the
# additional Pamiri letters (`х̌`, `ғ̌`, `ҙ`, `ҫ`, `ӡ`, `ҵ`, `ц`, `w`) available
# for the Shughni sounds Tajik has no letter for. Shughni is not a language
# with one settled orthography: a **Latin-based** practice and an
# **Arabic-script** practice are both in use among Shughni speakers in
# Afghanistan, and either is a defensible way to write the language. They are
# not defensible *mixed into these files*. A reviewer who wants Latin or
# Arabic script should convert all four files of this locale in one pass and
# say so in the headers; a single Latin or Arabic word dropped into a Cyrillic
# catalog is a bug, not a variant.
#
# ## This catalog is thinner than its siblings, and here is exactly how
#
# Shughni is the least-resourced language in this batch. There is no
# standardized written vocabulary for schooling, software or scientific prose:
# education in Badakhshan is conducted in **Tajik** and **Russian**, and that
# is where a Shughni speaker's words for these things come from. So this seed
# does not invent a Shughni technical register. Where a Shughni word could not
# be established, the loan the language actually uses is kept, in the lending
# language's own spelling. In practice **that is most of the running text in
# all four files**: the vocabulary below is overwhelmingly Tajik, with Russian
# where the Russian is what is said (`вектор`, `функсия`, `клавиатура`,
# `координата`, `матрица`, `вариант`, `филтр`). `content.ftl`'s header carries
# the full loan list for the batch.
#
# What that means for a corrector: treat this as a **frame**, not as a
# translation. The message structure, the plural handling and the placement of
# every argument have been thought about and should hold; the words are
# placeholders that a speaker is expected to replace, line by line, with
# Shughni ones wherever Shughni has them. Nothing here will be missed if it is
# rewritten.
#
# ## Number
#
# CLDR ships **no plural rules and no display name** for `sgh`, so
# `Intl.PluralRules` resolves this tag to the runtime default and a `[few]` or
# `[many]` branch could never be selected. Shughni does mark plural on the noun
# (the `-ен` suffix), but — as in Iranian languages generally — **a noun after
# a numeral is left unmarked**, so a count and a plural noun do not co-occur
# here anyway. So where English forks on a count, this file keeps **both**
# branches and writes them **identically** — `[one]` and `*[other]` say the
# same words — rather than collapsing to one branch. Nothing is lost either
# way: whichever the runtime's rules select, the reader sees the same Shughni,
# and keeping the pair makes the sameness visible instead of implicit.
# English's
# explicit `[0]` branches are numeric literals matched against the number
# itself, not plural categories, and are kept as they are.


## Answer submission

answer-checking = Санҷида мешавад…
answer-submitting = Фиристода мешавад…

answer-checking-status = Ҷавоб санҷида мешавад
answer-submitting-status = Ҷавоб фиристода мешавад

answer-correct = Дуруст
answer-incorrect = Нодуруст

answer-response-saved = Ҷавоб нигоҳ дошта шуд

answer-percent-credit = { $percent }% хол
answer-percent-correct = { $percent }% дуруст
answer-percent-short = { $percent } %

max-credit-available = Холи аз ҳама баланд: { $percent }%

# The `[one]` and `*[other]` branches are identical: a noun after a numeral is
# not marked for number. See the header.
attempts-remaining =
    { $count ->
        [0] кӯшиш намондааст
        [one] { $count } кӯшиш мондааст
       *[other] { $count } кӯшиш мондааст
    }

validation-correct = (Дуруст)
validation-incorrect = (Нодуруст)
validation-partially-correct = (Қисман дуруст)

# `$answerId` is the answer's authored name and stays as written.
answer-show-responses =
    { $count ->
        [one] Нишон додани { $count } ҷавоб ба { $answerId }
       *[other] Нишон додани { $count } ҷавоб ба { $answerId }
    }


## Disclosure panels

feedback-heading = Бозхонд

collapsible-click-to-open = (барои кушодан пахш кунед)
collapsible-click-to-close = (барои пӯшидан пахш кунед)

collapsible-initializing = Омода мешавад…

footnote-show = Нишон додани эзоҳ
footnote-hide = Пинҳон кардани эзоҳ

description-more-information = маълумоти иловагӣ


## Controls

slider-previous = Қаблӣ
slider-next = Навбатӣ

keyboard-open = Кушодани клавиатура
keyboard-close = Пӯшидани клавиатура

# `$choice` is the choice's own text and is never translated.
choice-input-remove-choice = Хориҷ кардани { $choice }

matrix-remove-row = Хориҷ кардани сатр
matrix-add-row = Илова кардани сатр
matrix-remove-column = Хориҷ кардани сутун
matrix-add-column = Илова кардани сутун

subset-add-remove-points = Илова/хориҷ кардани нуқтаҳо
subset-toggle-points-intervals = Иваз кардани нуқтаҳо ат фосилаҳо
subset-move-points = Ҷойивазкунии нуқтаҳо
subset-clear = Тоза кардан

orbital-add-row = Илова кардани сатр
orbital-remove-row = Хориҷ кардани сатр
orbital-add-box = Илова кардани хона
orbital-remove-box = Хориҷ кардани хона
orbital-add-up-arrow = Илова кардани тири боло
orbital-add-down-arrow = Илова кардани тири поён
orbital-remove-arrow = Хориҷ кардани тир

orbital-row-label = Нишонаи сатри { $row }

pretzel-answer = Ҷавоб

# `$column` is the authored name of the data column and stays as written.


## Math input

math-input-preview-region = пешнамоиши ифодаи математикӣ
math-input-preview = Пешнамоиш
math-input-invalid-expression = Ифодаи нодуруст:


## Document status

viewer-initializing = Омода мешавад…


## Errors

error-heading = Хато

# `$startLine` and `$endLine` arrive as text, not as numbers: a line number is
# an identifier and is not grouped.
error-found-at =
    { $span ->
        [line] Дар сатри { $startLine } ёфт шуд.
       *[lines] Дар сатрҳои { $startLine }–{ $endLine } ёфт шуд.
    }

document-contains-errors = Ин ҳуҷҷат хато дорад!

diagnostic-heading-error = Хато
diagnostic-heading-warning = Огоҳӣ
diagnostic-heading-information = Маълумот
diagnostic-heading-hint = Маслиҳат

# `WCAG AA` is the name of the standard and stays as written.
accessibility-heading-level-1 = Вайронкунии дастрасии WCAG AA
accessibility-heading-level-2 = Огоҳиномаи дастрасӣ

something-went-wrong = Чизе нодуруст рафт.

renderer-load-failed = тасвиргар бор нашуд. Лутфан саҳифаро нав кунед.

core-start-failed = Ин ҳуҷҷат оғоз нашуд. Лутфан саҳифаро нав кунед.

core-start-failed-busy = Ин ҳуҷҷат оғоз нашуд. Якчанд ҳуҷҷат якбора оғоз мешуданд ва дар дастгоҳи сусттар ин кор дарозтар мекашад. Пас аз он ки ҳуҷҷатҳои дигар тайёр шаванд, нав кардани саҳифа кӯмак карда метавонад.

core-start-failed-retry = Ин ҳуҷҷат оғоз нашуд.

core-start-failed-busy-retry = Ин ҳуҷҷат оғоз нашуд. Якчанд ҳуҷҷат якбора оғоз мешуданд ва дар дастгоҳи сусттар ин кор дарозтар мекашад.

core-start-retry = Аз нав кӯшиш кунед

saved-state-unavailable = Кори нигоҳдоштаи шумо бор нашуд.
