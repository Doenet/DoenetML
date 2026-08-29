# Komi-Permyak content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic with Komi's ӧ — but **not** with the і that Komi-Zyrian
# writes, which is not a letter of the Komi-Permyak alphabet.
#
# Komi-Permyak (`koi`) is a member of the Komi macrolanguage (`kv`) and until
# now was folded onto `locales/kpv` by `MACROLANGUAGE_MEMBERS` in
# `src/negotiate.ts`, which serves a Komi-Permyak reader the Komi-Zyrian
# catalog — the compromise that file's own header records. Komi-Permyak is a
# written standard of its own, with its own orthographic conventions and its
# own school publishing in Perm Krai, so it now has a catalog of its own and
# that fold is removed.
#
# Where this file's spelling parts from `locales/kpv`'s, in the words it
# actually contains:
#
#   plural -эз, not Zyrian -яс      уджэз, задачаэз, координатаэз
#                                   (kv: уджъяс, задачаяс, координатаяс)
#   no letter і                     вӧли (kv: вӧлі)
#   «либо» for Zyrian «либӧ»
#   «веж» for green, where Zyrian writes «турунвиж»
#
# Komi-Permyak has no grammatical gender and does not inflect an attributive
# adjective, so `$gender` and `$role` go unused, exactly as in `locales/kpv` and
# `locales/udm`. What the Permic catalogs use instead is the noun's own case
# suffix in the two clause messages, and it falls on a word the catalog writes
# rather than on a placeable.


# **Three of this catalog's nouns carry two concepts each, and the seed could
# settle none of them.** «пас» is the canonical noun for a *point* and is
# also the word for a *label*, which makes
# `prefigure-label-position-unsupported` read «паслӧн пасыслы», "the point's
# point"; «нимпас» is the obvious candidate for the label but is not attested
# here. «юкӧн» is the canonical noun for a *line segment* and is also
# *section* and *snippet*, so a geometric segment and a document section read
# alike; a head — «визь юкӧн» — would separate them. And «визь» is a *line*,
# a *row*, a *source line* and, in `math-input-invalid-function-names`, a
# *hyphen*. All three are used consistently in each of their senses, so
# nothing in the files contradicts them, which is why they need saying here.
# («шыпас» is the word for a character, and that message now writes it rather
# than the «пас» it began with.)
#
# «юрбитан» for a column is used consistently across all four files and is
# almost certainly wrong — it is built on «юрбитны», to pray. Nothing here
# can correct it, so a reviewer should.


## Style vocabulary

color =
    .black = сьӧд
    .white = еджыд
    .gray = руд
    .red = гӧрд
    .orange = оранжевӧй
    .yellow = виж
    .green = веж
    .cyan = югыд лӧз
    .blue = лӧз
    .purple = фиолетовӧй
    .pink = гӧрдоват
    .brown = мугӧм
line-width =
    .thick = кыз
    .thin = вӧсньыд
line-style =
    .dashed = вундалӧм
    .dotted = пасъялӧм
# Noun phrases: they stand in front of «серӧн» and modify nothing.
fill-style =
    .horizontal = горизонтальнӧй визь
    .vertical = вертикальнӧй визь
    .diagonal = диагональнӧй визь
    .backdiagonal = паныд диагональнӧй визь
    .dots = пас
    .diamonds = ромб
noun =
    .line = веськыд визь
    .line-segment = юкӧн
    .ray = луч
    .vector = вектор
    .curve = кусыня визь
    .function = функция
    .slope-field = мыгӧр ин
    .vector-field = вектор ин
    .parabola = парабола
    .polyline = чегӧм визь
    .polygon = уна пельӧса
    .triangle = куим пельӧса
    .rectangle = веськыд пельӧса
    .circle = гӧгрӧс
    .region = ин
    .point = пас
    .square = квадрат
    .diamond = ромб
    .cross = перекрест
    .plus = плюс
# Komi-Permyak builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] веськыд { $numSides } пельӧса
    }
# Komi-Permyak has no grammatical gender, so every noun answers the same and
# the answer goes unused.
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
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
style-filled-word = мавтӧм
style-filled =
    { $parts ->
        [pattern] { $pattern } серӧн { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } серӧн { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } серӧн { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «дорӧн» is the instrumental of «дор», "edge", and carries the whole of "with
# a border" in its own suffix, so neither a preposition nor an article is
# wanted — `locales/kpv`'s «дорӧн» and `locales/udm`'s «дуроен» exactly, in the
# two sister languages.
style-border-clause =
    { $parts ->
        [with-article] { $border } дорӧн
        [and] да { $border } дорӧн
        [and-article] да { $border } дорӧн
       *[with] { $border } дорӧн
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } серӧн { $color } мавтӧм
       *[plain] { $color } мавтӧм
    }
style-unfilled = мавтытӧм
# «вылын» — "on" — is a postposition and follows the background colour, so
# nothing stands between the two words.
style-text =
    { $parts ->
        [background] { $background } фон вылын { $color }
       *[plain] { $color }
    }
style-background-none = абу

## Boolean words

boolean-true = збыль
boolean-false = абу збыль

## Answer buttons

answer-submit-label = Видлавны
answer-submit-label-no-correctness = Вочакыв мӧдӧдны

## Sectional blocks

section-name =
    .activity = Уджтор
    .aside = Бокса пасйӧд
    .cascade = Каскад
    .definition = Тӧдмалӧм
    .example = Пример
    .exercise = Удж
    .exercises = Уджэз
    .given-answer = Вочакыв
    .note = Пасйӧд
    .objectives = Могэз
    .paragraphs = Абзацэз
    .part = Пай
    .problem = Задача
    .problems = Задачаэз
    .proof = Петкӧдлӧм
    .question = Юалӧм
    .section = Юкӧн
    .solution = Вӧчӧм
    .task = Уджтас
    .theorem = Теорема
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Индӧд

## Tables and figures

table-name =
    { $parts ->
        [numbered] Таблица { $enumeration }
        [numbered-title] Таблица { $enumeration }{ ". " }
        [unnumbered-title] Таблица{ ". " }
       *[unnumbered] Таблица
    }
figure-name =
    { $parts ->
        [numbered] Серпас { $enumeration }
        [numbered-caption] Серпас { $enumeration }{ ". " }
        [unnumbered-caption] Серпас{ ". " }
       *[unnumbered] Серпас
    }

## Paginator controls

paginator-previous = Бӧрлань
paginator-next = Водзлань
paginator-page = Лист бок
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## `piecewise-condition-if` is the limit `locales/kpv` and `locales/udm` already
## record, and for the identical reason: Komi-Permyak's conditional «кӧ» is a
## particle that follows the clause it conditions, and the renderer places this
## key before the mathematics. Three Permic catalogs, one wall.

piecewise-condition-or = либо
piecewise-condition-if = кӧ
piecewise-condition-otherwise = мӧд ногӧн

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Perm Krai is taught in
## Russian, so the element names a Komi-Permyak-speaking pupil meets are the
## Russian ones — the school-system case this batch shares throughout.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Абу веськыд химическӧй пас
chemistry-invalid-ionic-compound = Абу веськыд ион йитӧд
