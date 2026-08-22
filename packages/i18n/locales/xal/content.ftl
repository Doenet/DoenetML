# Kalmyk content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic with Kalmyk's own ә, ө, ү, җ, ң and һ, which is the
# orthography Kalmykia's schools and publishing use and what CLDR fills a bare
# `xal` in as. Todo bichig — the Clear Script — is Kalmyk's historic
# orthography and is still written; if it is ever seeded it is an `xal-Mong`
# catalog beside this one rather than a rename of it, which is the answer
# `locales/sr` and `locales/az` already give to a script asymmetry.
#
# THIS IS THE LEAST CERTAIN CATALOG IN ITS BATCH, and a speaker should read it
# before the other eleven. Kalmyk is the most endangered language seeded here —
# UNESCO lists it as definitely endangered, its written output is small, and
# this seed had markedly less of it to draw on than it had Buryat, its nearest
# relative in this batch. Kalmyk orthography also drops unstressed vowels that
# Buryat and Mongolian write, so a word that looks like a typo beside
# `locales/bua` may well be correct here and vice versa — that is exactly the
# class of error this seed is least able to check. `locales/lom` set the
# precedent for saying so in a file's own header rather than leaving a reader
# to discover it.
#
# Kalmyk has no grammatical gender and does not inflect an attributive
# adjective, so `$gender` and `$role` go unused, as everywhere else in this
# batch but `locales/ce`.


## Style vocabulary

color =
    .black = хар
    .white = цаһан
    .gray = бор
    .red = улан
    .orange = улашар
    .yellow = шар
    .green = ноһан
    .cyan = цегән көк
    .blue = көк
    .purple = ниил яһан
    .pink = яһан
    .brown = хүрң
line-width =
    .thick = зузан
    .thin = нимгн
line-style =
    .dashed = тасрха
    .dotted = цегтә
# Noun phrases: they stand in front of «кеермжтә» and modify nothing.
fill-style =
    .horizontal = хөндлң зурас
    .vertical = босх зурас
    .diagonal = диагональ зурас
    .backdiagonal = өөрхә диагональ зурас
    .dots = цег
    .diamonds = ромб
noun =
    .line = шулун зурас
    .line-segment = хәәрцг
    .ray = сарул
    .vector = вектор
    .curve = мурул зурас
    .function = функц
    .parabola = парабол
    .polyline = хуһрсн зурас
    .polygon = олн талта
    .triangle = һурвлҗн
    .rectangle = шулун дөрвлҗн
    .circle = төөрг
    .region = һазр
    .point = цег
    .square = дөрвлҗн
    .diamond = ромб
    .cross = крест
    .plus = плюс
# Kalmyk builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] дүңцү { $numSides } талта
    }
# Kalmyk has no grammatical gender, so every noun answers the same and the
# answer goes unused.
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
style-filled-word = буддгсн
style-filled =
    { $parts ->
        [pattern] { $pattern } кеермжтә { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } кеермжтә { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } кеермжтә { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «кеҗгтә» — "having an edge" — carries the "with a border" sense in its own
# suffix, so neither a preposition nor an article is wanted.
style-border-clause =
    { $parts ->
        [with-article] { $border } кеҗгтә
        [and] болн { $border } кеҗгтә
        [and-article] болн { $border } кеҗгтә
       *[with] { $border } кеҗгтә
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } кеермжтә { $color } буд
       *[plain] { $color } буд
    }
style-unfilled = буддго
# «деер» — "on top of" — is a postposition and follows the background colour,
# so nothing stands between the two words.
style-text =
    { $parts ->
        [background] { $background } ора деер { $color }
       *[plain] { $color }
    }
style-background-none = уга

## Boolean words

boolean-true = үнн
boolean-false = худл

## Answer buttons

answer-submit-label = Шинҗлх
answer-submit-label-no-correctness = Хәрүг илгәх

## Sectional blocks

section-name =
    .activity = Күцәмҗ
    .aside = Хаҗу темдг
    .cascade = Каскад
    .definition = Тодрхлт
    .example = Үзмҗ
    .exercise = Дасхлт
    .exercises = Дасхлтс
    .given-answer = Хәрү
    .note = Темдг
    .objectives = Күслс
    .paragraphs = Абзацс
    .part = Хүв
    .problem = Бодлһн
    .problems = Бодлһнс
    .proof = Батлвр
    .question = Сурвр
    .section = Бөлг
    .solution = Шиидвр
    .task = Даалһвр
    .theorem = Теорем
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Зәәсн

## Tables and figures

table-name =
    { $parts ->
        [numbered] Хүсңт { $enumeration }
        [numbered-title] Хүсңт { $enumeration }{ ". " }
        [unnumbered-title] Хүсңт{ ". " }
       *[unnumbered] Хүсңт
    }
figure-name =
    { $parts ->
        [numbered] Зург { $enumeration }
        [numbered-caption] Зург { $enumeration }{ ". " }
        [unnumbered-caption] Зург{ ". " }
       *[unnumbered] Зург
    }

## Paginator controls

paginator-previous = Өмнк
paginator-next = Дару
paginator-page = Халхц
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## Kalmyk's conditional «кемр» is clause-initial, as Buryat's «хэрбээ» is, so
## this key lands where the renderer puts it — unlike `locales/sah` and
## `locales/tyv`, which record a limit here.

piecewise-condition-or = эсвл
piecewise-condition-if = кемр
piecewise-condition-otherwise = нань бәәдлд

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Kalmykia is taught in
## Russian, so the element names a Kalmyk-speaking pupil meets are the Russian
## ones — the school-system case this batch shares throughout, and here with an
## extra reason on top of it: this catalog's own header explains why 118
## unreviewed coinages would be the least defensible thing in it.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Буру химическ темдг
chemistry-invalid-ionic-compound = Буру ионы ниилвр
