# Komi-Zyrian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# This is **Komi-Zyrian** (`kpv`), the literary standard of the Komi Republic,
# written in Cyrillic with Komi's own ӧ and і — the orthography the Republic's
# schools and publishing use, and what CLDR fills a bare `kv` in as.
#
# **Why the directory is `kpv` and not `kv`.** `kv` is an ISO 639-3
# **macrolanguage** over Komi-Zyrian (`kpv`) and Komi-Permyak (`koi`), and
# Komi-Permyak now has a catalog of its own in `locales/koi`. A directory named
# for the macrolanguage would claim to cover a sibling it cannot serve, so this
# one is named for the individual language actually written in it. Nothing is
# lost to a reader who types the old tag: ICU canonicalizes `kpv` straight back
# onto `kv`, so `negotiate.ts` carries `kv: "kpv"` in `LANGUAGE_ALIASES` and
# **both tags reach this catalog**. A document that says `lang="kv"` keeps
# working exactly as before; one that says `lang="kpv"` now says precisely what
# it means.
#
# Komi-Zyrian has no grammatical gender and does not inflect an attributive
# adjective,
# so `$gender` and `$role` go unused here, exactly as in `locales/udm`, its
# nearest relative in this batch. What both Permic catalogs use instead is the
# noun's own case suffix in the two clause messages, and in both it falls on a
# word the catalog writes rather than on a placeable.


## Style vocabulary

color =
    .black = сьӧд
    .white = еджыд
    .gray = руд
    .red = гӧрд
    .orange = оранжевӧй
    .yellow = виж
    .green = турунвиж
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
# Komi builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] веськыд { $numSides } пельӧса
    }
# Komi has no grammatical gender, so every noun answers the same and the answer
# goes unused.
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
# wanted — `locales/udm`'s «дуроен» exactly, in the sister language.
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
    .exercises = Уджъяс
    .given-answer = Вочакыв
    .note = Пасйӧд
    .objectives = Могъяс
    .paragraphs = Абзацъяс
    .part = Пай
    .problem = Задача
    .problems = Задачаяс
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
## `piecewise-condition-if` is `locales/udm`'s limit in the sister language and
## for the identical reason: Komi's conditional «кӧ» is a particle that follows
## the clause it conditions, and the renderer places this key before the
## mathematics. Two Permic catalogs, one wall.

piecewise-condition-or = либӧ
piecewise-condition-if = кӧ
piecewise-condition-otherwise = мӧд ногӧн

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in the Komi Republic is
## taught in Russian, so the element names a Komi-speaking pupil meets are the
## Russian ones — the school-system case this batch shares throughout.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Абу веськыд химическӧй пас
chemistry-invalid-ionic-compound = Абу веськыд ион йитӧд
