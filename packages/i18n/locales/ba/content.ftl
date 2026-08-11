# Bashkir content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic, which is the orthography Bashkortostan's schools and
# publishing use and what CLDR fills a bare `ba` in as. The letters ҙ, ҫ, ғ, ҡ,
# ң, ө, ү, һ, ә are Bashkir's own and are not Tatar's or Russian's; a catalog
# that spells «ҡара» as «кара» has quietly become a different language.
#
# Bashkir has no grammatical gender and does not inflect an attributive
# adjective, so both `$gender` and `$role` go unused here exactly as they do in
# English, Turkish and `locales/tt`. Adjectives precede the noun, so the
# composition messages keep the English order.
#
# The two clauses are marked by a suffix on the *noun* — «ситле», «фонда» — and
# that noun is one this catalog writes, so nothing is welded to a placeable.


## Style vocabulary

color =
    .black = ҡара
    .white = аҡ
    .gray = һоро
    .red = ҡыҙыл
    .orange = ҡыҙғылт һары
    .yellow = һары
    .green = йәшел
    .cyan = асыҡ зәңгәр
    .blue = зәңгәр
    .purple = шәмәхә
    .pink = алһыу
    .brown = көрән

line-width =
    .thick = ҡалын
    .thin = нәҙек

line-style =
    .dashed = өҙөклө
    .dotted = нөктәле

# Noun phrases: they stand in front of «биҙәкле» and modify nothing.
fill-style =
    .horizontal = горизонталь һыҙыҡ
    .vertical = вертикаль һыҙыҡ
    .diagonal = диагональ һыҙыҡ
    .backdiagonal = кире диагональ һыҙыҡ
    .dots = нөктә
    .diamonds = ромб

noun =
    .line = тура һыҙыҡ
    .line-segment = киҫек
    .ray = нур
    .vector = вектор
    .curve = кәкре һыҙыҡ
    .function = функция
    .parabola = парабола
    .polyline = һынған һыҙыҡ
    .polygon = күпмөйөш
    .triangle = өсмөйөш
    .rectangle = тура мөйөшлөк
    .circle = әйләнә
    .region = өлкә
    .point = нөктә
    .square = квадрат
    .diamond = ромб
    .cross = крест
    .plus = плюс

# Bashkir builds the word from the side count in front of the noun, so the
# whole of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] дөрөҫ { $numSides } мөйөш
    }

# Bashkir has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English, Turkish and Tatar.
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

style-filled-word = буялған

style-filled =
    { $parts ->
        [pattern] { $pattern } биҙәкле { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } биҙәкле { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } биҙәкле { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «ситле» — "having an edge" — carries the "with a border" sense in its own
# suffix, so neither a preposition nor an article is wanted, and all four
# branches read alike except for the connective English needs and Bashkir does
# not.
style-border-clause =
    { $parts ->
        [with-article] { $border } ситле
        [and] һәм { $border } ситле
        [and-article] һәм { $border } ситле
       *[with] { $border } ситле
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } биҙәкле { $color } буяу
       *[plain] { $color } буяу
    }

style-unfilled = буялмаған

# «фонда» is the locative of «фон» and says "on the background" by itself, so
# nothing stands between the two colours.
style-text =
    { $parts ->
        [background] { $background } фонда { $color }
       *[plain] { $color }
    }

style-background-none = юҡ


## Boolean words

boolean-true = дөрөҫ
boolean-false = яңылыш


## Answer buttons

answer-submit-label = Тикшереү
answer-submit-label-no-correctness = Яуапты ебәреү


## Sectional blocks

section-name =
    .activity = Эшмәкәрлек
    .aside = Ситләтмә
    .cascade = Каскад
    .definition = Билдәләмә
    .example = Миҫал
    .exercise = Күнегеү
    .exercises = Күнегеүҙәр
    .given-answer = Яуап
    .note = Иҫкәрмә
    .objectives = Маҡсаттар
    .paragraphs = Абзацтар
    .part = Өлөш
    .problem = Мәсьәлә
    .problems = Мәсьәләләр
    .proof = Иҫбатлау
    .question = Һорау
    .section = Бүлек
    .solution = Сиселеш
    .task = Бирем
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

hint-title = Кәңәш


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
        [numbered] Рәсем { $enumeration }
        [numbered-caption] Рәсем { $enumeration }{ ". " }
        [unnumbered-caption] Рәсем{ ". " }
       *[unnumbered] Рәсем
    }


## Paginator controls

paginator-previous = Алдағы
paginator-next = Киләһе
paginator-page = Бит

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = йәки
piecewise-condition-if = әгәр
piecewise-condition-otherwise = юғиһә


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Bashkortostan is
## taught in Russian, and the element names a Bashkir-speaking pupil meets are
## the Russian ones out of a Russian-language textbook. Copying that list into
## Bashkir spelling would produce neither language — the argument
## `locales/min` already makes against copying Indonesian's table — and
## `locales/tt` beside this file is the counter-example that decides it: Tatar
## supplies the whole table because Tatar-medium chemistry teaching produced
## one, and nothing about the two languages predicts the difference.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Дөрөҫ булмаған химик билдә
chemistry-invalid-ionic-compound = Дөрөҫ булмаған ион ҡушылмаһы
