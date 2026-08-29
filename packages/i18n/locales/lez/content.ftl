# Lezgian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Cyrillic orthography of 1938, which Dagestan's schools, its
# Lezgian-language press and its book publishing use, and which is what CLDR
# fills a bare `lez` in as (`lez` → `lez-Cyrl-RU`). The palochka Ӏ is a letter:
# not a Latin capital I, not the digit 1. Lezgian written in Azerbaijan uses
# the Latin alphabet for the same language; that would be a second catalog, not
# an edit to this one.
#
# **LEZGIAN IS THE NORTHEAST CAUCASIAN LANGUAGE THAT LOST ITS NOUN CLASSES, AND
# THAT IS THE FACT WORTH READING HERE.** Avar, Dargwa, Lak and Tabasaran —
# seeded in the same batch, and all of them relatives — agree a word with the
# class of the noun it describes; Lezgian does not, and neither does the rest
# of its own Lezgic sub-branch. There is no grammatical gender, no class
# prefix, no class agreement of any kind: the whole system was lost before the
# modern language. So `noun-gender` below returns one token for every noun and
# **nothing in this catalog forks on `$gender` or on `$role`** — the shape
# `locales/ba` and `locales/ktu` have, reached from inside a family where a
# reader would expect the opposite. A fork appearing in this file later is an
# error, not an improvement.
#
# **Attributive adjectives precede the noun in Lezgian and do not inflect**, so
# the composition messages below keep the order English gives them: width, dash
# pattern, colour, then the noun. An attributive adjective takes no case ending
# either — case falls on the last word of the noun phrase — which is the other
# half of why `$role` goes unused.
#
# Lezgian has a very large case system (an ergative, a genitive, a dative and
# some fourteen locative cases). None of those suffixes may be welded to a
# placeable, so every message that would want one puts the ending on a word
# this catalog writes instead: `style-border-clause` says «{ $border } къерех
# авай» — "having a … edge" — rather than putting a comitative on the border
# description, and `style-text` puts the locative on «фон». Both are recorded
# beside their messages below.
#
# **What this seed is least sure of is the vocabulary, not the grammar.**
# Lezgian mathematics is taught and written in Russian, so a settled Lezgian
# word for several of the shapes below does not exist to be looked up; where
# that is so, the Russian term is written («отрезок», «луч», «кривая»,
# «ломаная», «парабола»), which is what a Lezgian pupil actually meets, and
# where a Lezgian formation is well established it is used («пудпипӀ»,
# «гзафпипӀ», «нукьта», «чин»). The colour list is the second weak spot: the
# grey, orange, pink and brown terms below lean on Azerbaijani loans that are
# ordinary in speech but are not fixed in the dictionaries this seed could
# check. A speaker should read the `color`, `noun` and `fill-style` tables
# first.


## Style vocabulary
##
## No word here inflects for the noun it describes, and all of them stand in
## front of it.

color =
    .black = чӀулав
    .white = лацу
    .gray = боз
    .red = яру
    .orange = нарнжи
    .yellow = хъипи
    .green = къацу
    .cyan = экуь вили
    .blue = вили
    .purple = мор
    .pink = чагьрайи
    .brown = къумрал
line-width =
    .thick = яцӀу
    .thin = назук
line-style =
    .dashed = атӀай
    .dotted = нукьтаяр алай
# Noun phrases: the composition messages put «алай» — "on it" — after them, so
# they stand on their own and modify nothing.
fill-style =
    .horizontal = горизонтал цӀарар
    .vertical = вертикал цӀарар
    .diagonal = диагонал цӀарар
    .backdiagonal = эксина диагонал цӀарар
    .dots = нукьтаяр
    .diamonds = ромбаяр
noun =
    .line = дуьз цӀар
    .line-segment = отрезок
    .ray = луч
    .vector = вектор
    .curve = кривая
    .function = функция
    .slope-field = наклондин поле
    .vector-field = векторрин поле
    .parabola = парабола
    .polyline = ломаная
    .polygon = гзафпипӀ
    .triangle = пудпипӀ
    .rectangle = дуьзпипӀ
    .circle = гьалкъа
    .region = чка
    .point = нукьта
    .square = квадрат
    .diamond = ромб
    .cross = хаш
    .plus = плюс
# Lezgian says "a regular polygon having N sides" and keeps the whole of it in
# front of the noun, so there is one head and no tail. «пад» stays singular
# after the numeral, and «авай» is a free participle — nothing is welded to
# `{ $numSides }`.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } пад авай дуьз гзафпипӀ
    }
# Lezgian has no noun classes and no grammatical gender, so every noun answers
# the same and no message below selects on the answer. See the note at the top
# of this file: the loss of the class system is what separates Lezgian from its
# Avar, Dargwa, Lak and Tabasaran neighbours.
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
style-filled-word = ацӀурнавай
style-filled =
    { $parts ->
        [pattern] { $pattern } алай { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } алай { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } алай { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «къерех авай» — "having an edge" — carries the whole of English's "with a …
# border" in a participle that follows the catalog's own noun, so no case
# ending goes anywhere near `{ $border }` and no article is wanted. The four
# branches differ only by the connective «ва», which Lezgian needs and English
# spells as "and".
style-border-clause =
    { $parts ->
        [with-article] { $border } къерех авай
        [and] ва { $border } къерех авай
        [and-article] ва { $border } къерех авай
       *[with] { $border } къерех авай
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } алай { $color } ранг
       *[plain] { $color } ранг
    }
style-unfilled = ацӀурнавачир
# «фондал» is the locative of «фон» and says "on the background" by itself, so
# the two colours stand one after the other with no preposition between them
# and nothing attached to either placeable.
style-text =
    { $parts ->
        [background] { $background } фондал { $color }
       *[plain] { $color }
    }
style-background-none = авач

## Boolean words

boolean-true = дуьз
boolean-false = дуьз туш

## Answer buttons

answer-submit-label = Ахтармишун
answer-submit-label-no-correctness = Жаваб ракъурун

## Sectional blocks

section-name =
    .activity = Кар
    .aside = Къвалан къейд
    .cascade = Каскад
    .definition = Тайинарун
    .example = Мисал
    .exercise = Упражнение
    .exercises = Упражненияр
    .given-answer = Жаваб
    .note = Къейд
    .objectives = Метлебар
    .paragraphs = Абзацар
    .part = Пай
    .problem = Месэла
    .problems = Месэлаяр
    .proof = Субут
    .question = Суал
    .section = Кьил
    .solution = Гьялун
    .task = Тапшуругъ
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
hint-title = Меслят

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
        [numbered] Шикил { $enumeration }
        [numbered-caption] Шикил { $enumeration }{ ". " }
        [unnumbered-caption] Шикил{ ". " }
       *[unnumbered] Шикил
    }

## Paginator controls

paginator-previous = Вилик квайди
paginator-next = Гуьгъуьнинди
paginator-page = Чин
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## Lezgian's own conditional is a suffix, -тӀа, on the verb that closes the
## protasis — which this key could not reach, since the renderer places it in
## front of the mathematics rather than behind it. What is written here is
## «эгер», the borrowed clause-initial particle that ordinarily accompanies
## that suffix and is perfectly usual in written Lezgian, so this key lands
## where the renderer puts it and needs none of the caveat `locales/sah`,
## `locales/tyv`, `locales/udm`, `locales/kv` and `locales/chm` record.

piecewise-condition-or = ва я
piecewise-condition-if = эгер
piecewise-condition-otherwise = тахьайтӀа

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry is not taught in Lezgian
## anywhere it is spoken, and the two halves of the language are schooled in
## two different languages: in Dagestan the subject is taught in Russian, and
## in the Lezgian-speaking districts of northern Azerbaijan it is taught in
## Azerbaijani. So there is no one curriculum for a fallback to match, the
## situation `locales/lom` and `locales/mnk` already record for a border of
## their own, and inventing 118 Lezgian element names would serve neither side
## of this one. The English fallback stands nearer the textbook than a coinage
## would.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Дуьз тушир химиядин лишан
chemistry-invalid-ionic-compound = Дуьз тушир иондин кутӀунвал
