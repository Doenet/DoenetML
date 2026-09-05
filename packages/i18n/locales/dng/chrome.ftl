# Dungan (хуэйзў хуа / хуэйзў йүян) viewer chrome — the buttons, panel
# headings and status words the reader touches. Translated from
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
# ## Script and orthography
#
# Dungan is a Sinitic language — Northwest Mandarin carried into Central Asia
# in the 1870s — and it is the only one written in **Cyrillic**. This catalog
# writes the **standard Soviet-era Dungan alphabet still in use in Kyrgyzstan
# and Kazakhstan**: the Russian letters plus **ә, җ, ң, ў, ү**. So `җ` for the
# initial of «җә», `ң` for the syllable-final nasal («хаң», «дян» vs «хуаң»),
# `ў` and `ү` for the rounded vowels, `ә` for the vowel of «гә», «сә», «дә».
#
# **Tones are not marked.** Standard Dungan orthography leaves tone out of the
# spelling altogether and lets context carry it, and that is what is done here
# throughout: there is no accent, no macron and no digit on any syllable in any
# of these four files. A corrector must not introduce one.
#
# A corrector must also **not mix in another system**. In particular: no
# **pinyin** (there is no `zh`, `x`, `q`, `ü` here — those sounds are `җ`, `щ`,
# `ч`, `ү`), no **Chinese characters** anywhere, and no tone diacritics or tone
# numbers. Dungan is a Cyrillic language on the page, and a seed half-converted
# to pinyin would be worse than either system whole.
#
# ## This is one of the thinnest catalogs in the repository
#
# Said plainly, because it matters more than any single line below: there is
# very little published Dungan lexical material within reach, and almost none
# of it is technical. Dungan schooling in mathematics, chemistry and computing
# happens in **Russian** (and in Kyrgyz or Kazakh); there is no Dungan
# terminology for most of what a Doenet interface names, and this seed has not
# invented one.
#
# **The method, applied everywhere:** the *frame* of each message — the verbs,
# the negation, the word order, the attributive particle — is Dungan, and every
# technical noun this seed could not establish is left as the **Russian word**
# it is actually written with. The Russian loans are written in their Russian
# spelling and stand **uninflected**, in the nominative, wherever they appear:
# Dungan does not decline, and forcing a Russian case ending onto a borrowed
# noun inside a Dungan sentence would be a guess about a construction this seed
# cannot check. A speaker who knows the case Dungan actually writes there
# should fix it freely.
#
# **Russian loans used in this file:** ошибка (error), предупреждение
# (warning), страница (page), клавиатура (keyboard), сноска (footnote),
# интервал, статистика, математика, выражение (expression), формула,
# рендерер (renderer), документ, прибор (device), доступность
# (accessibility), Отзыв (feedback), интернет. `WCAG AA` is the standard's own
# name and stays as it is.
#
# ## Grammar as written here
#
# **The modifier precedes the noun**, joined by the attributive particle
# **«ди»**: «до ди щёщи» *more information*, «{ $column } ди статистика»
# *statistics of { $column }*. Nothing is welded to a placeable — «ди» is a
# separate word, so a substituted value keeps its own boundaries.
#
# **No grammatical gender**, and no agreement of any kind.
#
# **Number.** A Sinitic language does not mark a noun for number after a
# numeral: «йигә цы» and «сангә цы» carry the same noun. CLDR has no plural
# data for `dng` at all — nor a display name — so `Intl.PluralRules` falls back
# to the runtime default and could never select a `[one]` branch by Dungan's
# own rules anyway. Both facts point the same way, so every plural select in
# this catalog is **collapsed to a single `*[other]`**. English's explicit
# `[0]` branches are kept: those match the number itself, not a plural
# category, and Dungan does say "none left" differently.

## Answer submission

answer-checking = Җянча...
answer-submitting = Сун...

answer-checking-status = Җянча даан
answer-submitting-status = Сун даан

answer-correct = Дуй
answer-incorrect = Будуй

answer-response-saved = Хуэйда цунла

answer-percent-credit = { $percent }% фын
answer-percent-correct = { $percent }% дуй
answer-percent-short = { $percent } %

max-credit-available = Зуйдо кәи дәди фын: { $percent }%

# Collapsed to one `*[other]`; the `[0]` branch is kept because a count of none
# is said with the negative «мый», not with a numeral.
attempts-remaining =
    { $count ->
        [0] Мый шонсяди цы ла
       *[other] Шонся { $count } цы
    }

validation-correct = (Дуй)
validation-incorrect = (Будуй)
validation-partially-correct = (Йибуфын дуй)

answer-show-responses = Щянши { $answerId } ди { $count } гә хуэйда


## Disclosure panels

feedback-heading = Отзыв

collapsible-click-to-open = (дян йиха дакэ)
collapsible-click-to-close = (дян йиха гуаншаң)

collapsible-initializing = Кэшы...

footnote-show = Щянши сноска
footnote-hide = Цаң сноска

description-more-information = до ди щёщи


## Controls

slider-previous = Шаңйигә
slider-next = Сяйигә

keyboard-open = Дакэ клавиатура
keyboard-close = Гуаншаң клавиатура

choice-input-remove-choice = Ба { $choice } начў

matrix-remove-row = Начў йихаң
matrix-add-row = Җя йихаң
matrix-remove-column = Начў йиле
matrix-add-column = Җя йиле

subset-add-remove-points = Җя/Начў дян
subset-toggle-points-intervals = Хуан дян гын интервал
subset-move-points = Идун дян
subset-clear = Чинчў

orbital-add-row = Җя йихаң
orbital-remove-row = Начў йихаң
orbital-add-box = Җя йигә хәзы
orbital-remove-box = Начў йигә хәзы
orbital-add-up-arrow = Җя йигә шаң җянтў
orbital-add-down-arrow = Җя йигә ся җянтў
orbital-remove-arrow = Начў җянтў

orbital-row-label = Ди { $row } хаң ди бёчян

pretzel-answer = Даан



## Math input

math-input-preview-region = математика выражение ди үлан
math-input-preview = Үлан
math-input-invalid-expression = Будуй ди выражение:


## Document status

viewer-initializing = Кэшы...


## Errors

error-heading = Ошибка

error-found-at =
    { $span ->
        [line] Зэ { $startLine } хаң шаң җаоҗола.
       *[lines] Зэ { $startLine }–{ $endLine } хаң шаң җаоҗола.
    }

document-contains-errors = Җә документ ли ю ошибка!

diagnostic-heading-error = Ошибка
diagnostic-heading-warning = Предупреждение
diagnostic-heading-information = Щёщи
diagnostic-heading-hint = Тиши

accessibility-heading-level-1 = WCAG AA доступность ди вынти
accessibility-heading-level-2 = Доступность ди тиши

something-went-wrong = Ю шәр цола.

renderer-load-failed = йигә рендерер мый кэчи. Чин ба страница щин дакэ йицы.

core-start-failed = Җә документ мый кэчи. Чин ба страница щин дакэ йицы.

core-start-failed-busy = Җә документ мый кэчи. Йидорә документ йикуәр кэчила, манди прибор шаң җә йё фи до ди шыҗян. Дын битиди документ кэчи ваннила, ба страница щин дакэ йицы кәнын юңчў.

core-start-failed-retry = Җә документ мый кэчи.

core-start-failed-busy-retry = Җә документ мый кэчи. Йидорә документ йикуәр кэчила, манди прибор шаң җә йё фи до ди шыҗян.

core-start-retry = Зэ шы йицы

saved-state-unavailable = Ни цунхади гунзуо мый нын дакэ.
