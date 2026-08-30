# Dungan (хуэйзў хуа / хуэйзў йүян) content catalog — the prose the core
# computes into the document itself: style descriptions ("thick red line"), the
# boolean words, the names sections and tables give themselves. Selected by
# `documentLocale`, the language the activity was written in, rather than by
# the reader's interface language.
#
# Translated from `locales/en/content.ftl`, which is the source of truth.
# Message ids and attribute names are never translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# ## Script and orthography
#
# Dungan is Northwest Mandarin written in **Cyrillic** — the only Sinitic
# language with a Cyrillic orthography — and this catalog writes the standard
# Soviet-era alphabet still current in Kyrgyzstan and Kazakhstan: Russian
# letters plus **ә, җ, ң, ў, ү**.
#
# **Tones are left unmarked**, as the standard orthography leaves them: not one
# accent, macron, tone digit or tone letter appears in any of these four files.
# A corrector must not add one, and must not mix in **pinyin** spellings
# (`zh`, `x`, `q`, `ü` have no place here — they are `җ`, `щ`, `ч`, `ү`) or
# **Chinese characters**, which Dungan does not use.
#
# ## Grammar as written here
#
# **Modifier before noun, joined by the attributive particle «ди».** «хунди
# сян» is *a red line*; «{ $description } ди { $noun }» is how every style
# description in this file attaches to the thing it describes. Modifiers stack
# in front in the same order English stacks them — width, then dash pattern,
# then colour — so `style-stroke` needed no reordering, only the particle at
# the join. «ди» is a word of its own and is never welded to a placeable, so a
# substituted value keeps its own boundaries.
#
# **No grammatical gender.** Dungan has none, so `noun-gender` answers a single
# token for every noun and no adjective here forks on `$gender`. **No `$role`
# fork** either: nothing inflects for case, so a colour word standing alone and
# the same word inside a border or background clause are the same word. The
# clause frames instead say the relation with a word — «ю … ди бян» for the
# border, «… ди фон» for the background.
#
# **Number is not marked.** A Sinitic noun after a numeral is the same noun:
# «йигә дян», «сангә дян». CLDR has **no plural data and no display name for
# `dng` at all**, so `Intl.PluralRules` resolves to the runtime default and a
# `[one]` branch could never be selected by Dungan's own rules. Both facts
# agree, so every plural select in this catalog is **collapsed to a single
# `*[other]`**; English's explicit `[0]` branches are kept, since those match
# the number itself and Dungan does say "none" with the negative «мый».
#
# ## The chemistry tables are deliberately absent
#
# `element-name` and `element-anion-name` are the only English keys this file
# does not define. Chemistry is not schooled in Dungan: a Dungan student meets
# the periodic table in **Russian** (or in Kyrgyz or Kazakh), and there is no
# settled, checkable Dungan list of a hundred and eighteen element names to
# copy. Writing one would be inventing a nomenclature and presenting it as a
# fact about the language. `lint:i18n` reports the two keys as missing
# coverage, and that report is correct — they fall back to English, which is at
# least honestly not Dungan. `ion-name-oxidation-state`,
# `chemistry-invalid-symbol` and `chemistry-invalid-ionic-compound` **are**
# covered: those are frames and punctuation rather than a vocabulary.
#
# ## Loans, listed
#
# This is one of the thinnest-resourced catalogs in the repository. Very little
# published Dungan lexical material is within reach and almost none of it is
# technical; Dungan mathematics and computing are done in Russian. So the
# **frame** of every message here is Dungan and the technical nouns this seed
# could not establish are kept as the **Russian words they are actually written
# with**, in Russian spelling and **uninflected** (Dungan does not decline, and
# a guessed case ending would be a claim this seed cannot check). Dungan also
# carries an older **Arabic/Persian** loan layer — the religious and everyday
# vocabulary — but none of it reaches the subject matter of this catalog, so no
# Arabic or Persian loan appears below.
#
# Russian loans kept here: оранжевый, голубой, коричневый (the three colour
# words this seed could not establish), пунктирный, точечный (dash patterns),
# ромб, луч, вектор, кривая, функция, парабола, ломаная, многоугольник,
# правильный многоугольник, область, поле наклона, векторное поле, фон
# (background), химический символ, ионное соединение, and the section words
# Занятие, Отступление, Каскад, Определение, Упражнение, Упражнения, Заметка,
# Цели, Абзацы, Задача, Задачи, Раздел, Решение, Задание, Теорема.
#
# The geometry and section vocabulary is therefore **almost entirely a Russian
# noun inside a Dungan frame**, exactly as stated. The words this seed does
# commit to as Dungan are the colours хый, бый, хуэй, хун, хуан, лү, лан, зы,
# фынхун; the shapes сян, сяндуан, дян, юан, санҗёщиң, чаңфаңщиң, җынфаңщиң,
# шызы, җяхо; the words цу (thick), щи (thin), тянман (filled), бян (border),
# бё (table), тў (figure), е (page), кун (blank), җын / җя (true / false),
# вынти (question), даан (answer), буфын (part), лизы (example), җынмин
# (proof), тиши (hint); and the connectives яоши, хуәҗə, яобуран. Replacing any
# of them needs no permission.


## Style vocabulary

color =
    .black = хый
    .white = бый
    .gray = хуэй
    .red = хун
    .orange = оранжевый
    .yellow = хуан
    .green = лү
    .cyan = голубой
    .blue = лан
    .purple = зы
    .pink = фынхун
    .brown = коричневый

line-width =
    .thick = цу
    .thin = щи

line-style =
    .dashed = пунктирный
    .dotted = точечный

fill-style =
    .horizontal = хынсян
    .vertical = шўсян
    .diagonal = щесян
    .backdiagonal = фан щесян
    .dots = дян
    .diamonds = ромб

noun =
    .line = сян
    .line-segment = сяндуан
    .ray = луч
    .vector = вектор
    .curve = кривая
    .function = функция
    .slope-field = поле наклона
    .vector-field = векторное поле
    .parabola = парабола
    .polyline = ломаная
    .polygon = многоугольник
    .triangle = санҗёщиң
    .rectangle = чаңфаңщиң
    .circle = юан
    .region = область
    .point = дян
    .square = җынфаңщиң
    .diamond = ромб
    .cross = шызы
    .plus = җяхо

# The side count is a modifier like any other, so it sits in front with «ди»
# and the tail is empty.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } бян ди правильный многоугольник
    }

# Dungan has no grammatical gender; the token is the English one so that
# nothing downstream has to learn a new name for "no gender at all".
noun-gender = neuter


## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width } { $lineStyle } { $color }
        [width-color] { $width } { $color }
        [style-color] { $lineStyle } { $color }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

style-with-noun =
    { $parts ->
        [noun-tail] { $description } ди { $noun } { $nounTail }
       *[noun] { $description } ди { $noun }
    }

style-filled-word = тянман

style-filled =
    { $parts ->
        [pattern] { $filled } { $color }, юң { $pattern } тян ди
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } ди { $noun }, юң { $pattern } тян ди
        [plain-tail] { $filled } { $color } ди { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } ди { $noun } { $nounTail }, юң { $pattern } тян ди
       *[plain] { $filled } { $color } ди { $noun }
    }

style-border-clause =
    { $parts ->
        [with-article] ю йигә { $border } ди бян
        [and] хэ ю { $border } ди бян
        [and-article] хэ ю йигә { $border } ди бян
       *[with] ю { $border } ди бян
    }

style-fill =
    { $parts ->
        [pattern] { $color } ди { $pattern }
       *[plain] { $color }
    }

style-unfilled = мый тян ди

style-text =
    { $parts ->
        [background] { $color }, { $background } ди фон
       *[plain] { $color }
    }

style-background-none = мый ю


## Boolean words

boolean-true = җын
boolean-false = җя


## Answer buttons

answer-submit-label = Җянча
answer-submit-label-no-correctness = Сун хуэйда


## Sectional blocks

section-name =
    .activity = Занятие
    .aside = Отступление
    .cascade = Каскад
    .definition = Определение
    .example = Лизы
    .exercise = Упражнение
    .exercises = Упражнения
    .given-answer = Даан
    .note = Заметка
    .objectives = Цели
    .paragraphs = Абзацы
    .part = Буфын
    .problem = Задача
    .problems = Задачи
    .proof = Җынмин
    .question = Вынти
    .section = Раздел
    .solution = Решение
    .task = Задание
    .theorem = Теорема

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Тиши


## Tables and figures

table-name =
    { $parts ->
        [numbered] Бё { $enumeration }
        [numbered-title] Бё { $enumeration }{ ": " }
        [unnumbered-title] Бё{ ": " }
       *[unnumbered] Бё
    }

figure-name =
    { $parts ->
        [numbered] Тў { $enumeration }
        [numbered-caption] Тў { $enumeration }{ ": " }
        [unnumbered-caption] Тў{ ": " }
       *[unnumbered] Тў
    }


## Paginator controls

paginator-previous = Шаңйигә
paginator-next = Сяйигә
paginator-page = Е

paginator-page-status = { $pageLabel } { $currentPage }, йигун { $numPages }


## Piecewise functions

piecewise-condition-or = хуәҗə

piecewise-condition-if = яоши

piecewise-condition-otherwise = яобуран


## Chemistry
##
## `element-name` and `element-anion-name` are absent on purpose; the header
## says why. What is here is frames, not vocabulary.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Будуй ди химический символ
chemistry-invalid-ionic-compound = Будуй ди ионное соединение


## Inputs embedded in math

math-embedded-input-blank = кун

math-embedded-input-blank-ordinal = ди { $ordinal } гә кун, йигун { $total } гә
