# Udmurt content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic with Udmurt's own ӝ, ӟ, ӥ, ӧ and ӵ, which is the
# orthography Udmurtia's schools and publishing use and what CLDR fills a bare
# `udm` in as. Those five letters are load-bearing: «сьӧд» spelled «сьод» is
# not Udmurt.
#
# Udmurt is the roster's first Permic language and its first Uralic one from
# inside Russia. It has no grammatical gender and does not inflect an
# attributive adjective, so `$gender` and `$role` go unused — the same answer
# the Turkic and Mongolic catalogs beside it give, from a third family. What
# Udmurt has instead is a rich case system on the *noun*, and the two clause
# messages below use it: the case suffix falls on a word this catalog writes,
# never on a placeable, which is what keeps it inside the affix rule.
#
# CONFIDENCE. The colour and shape vocabulary is the part this seed is most
# sure of. The newer technical nouns are Russian, which is what written Udmurt
# uses for them.


## Style vocabulary

color =
    .black = сьӧд
    .white = тӧдьы
    .gray = пурысь
    .red = горд
    .orange = оранжевой
    .yellow = чуж
    .green = вож
    .cyan = югыт лыз
    .blue = лыз
    .purple = фиолетовой
    .pink = лемлет
    .brown = коричневой

line-width =
    .thick = зӧк
    .thin = векчи

line-style =
    .dashed = чигем
    .dotted = пусъем

# Noun phrases: they stand in front of «чеберъямен» and modify nothing.
fill-style =
    .horizontal = горизонтальной чур
    .vertical = вертикальной чур
    .diagonal = диагональной чур
    .backdiagonal = пумит диагональной чур
    .dots = пус
    .diamonds = ромб

noun =
    .line = шонер чур
    .line-segment = висъет
    .ray = луч
    .vector = вектор
    .curve = кожась чур
    .function = функция
    .parabola = парабола
    .polyline = чигем чур
    .polygon = трос сэрего
    .triangle = куинь сэрего
    .rectangle = шонер сэрего
    .circle = котырес
    .region = инты
    .point = пус
    .square = квадрат
    .diamond = ромб
    .cross = перекрест
    .plus = плюс

# Udmurt builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] шонер { $numSides } сэрего
    }

# Udmurt has no grammatical gender, so every noun answers the same and the
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

style-filled-word = буям

style-filled =
    { $parts ->
        [pattern] { $pattern } чеберъямен { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } чеберъямен { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } чеберъямен { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «дуроен» is the instrumental of «дур», "edge", and carries the whole of "with
# a border" in its own suffix — so neither a preposition nor an article is
# wanted, and the suffix sits on a noun this catalog writes rather than on a
# placeable.
style-border-clause =
    { $parts ->
        [with-article] { $border } дуроен
        [and] но { $border } дуроен
        [and-article] но { $border } дуроен
       *[with] { $border } дуроен
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } чеберъямен { $color } буям
       *[plain] { $color } буям
    }

style-unfilled = буямтэ

# «вылын» — "on" — is a postposition and follows the background colour, so
# nothing stands between the two words.
style-text =
    { $parts ->
        [background] { $background } фон вылын { $color }
       *[plain] { $color }
    }

style-background-none = ӧвӧл


## Boolean words

boolean-true = зэм
boolean-false = зэм ӧвӧл


## Answer buttons

answer-submit-label = Эскерыны
answer-submit-label-no-correctness = Ответэз ыстыны


## Sectional blocks

section-name =
    .activity = Ужрад
    .aside = Пал пусъён
    .cascade = Каскад
    .definition = Валэктон
    .example = Пример
    .exercise = Дышетскон уж
    .exercises = Дышетскон ужъёс
    .given-answer = Ответ
    .note = Пусъён
    .objectives = Ужпумъёс
    .paragraphs = Абзацъёс
    .part = Люкет
    .problem = Задача
    .problems = Задачаос
    .proof = Юнматон
    .question = Юан
    .section = Ёзэт
    .solution = Шедьтон
    .task = Уж
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

hint-title = Юрттэт


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
        [numbered] Суред { $enumeration }
        [numbered-caption] Суред { $enumeration }{ ". " }
        [unnumbered-caption] Суред{ ". " }
       *[unnumbered] Суред
    }


## Paginator controls

paginator-previous = Азьло
paginator-next = Собере
paginator-page = Бам

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions
##
## `piecewise-condition-if` is `locales/sah`'s and `locales/tyv`'s limit a
## third time, arriving from a third family: Udmurt's conditional «ке» is a
## particle that *follows* the clause it conditions, and the renderer places
## this key before the mathematics it introduces. Five catalogs in this batch
## hit the same wall — `locales/sah`, `locales/tyv`, this one, `locales/kv` and
## `locales/chm` — and the other seven, among them `locales/bua` and
## `locales/xal`, do not, which is what makes it a fact about word order rather
## than about the region.

piecewise-condition-or = яке
piecewise-condition-if = ке
piecewise-condition-otherwise = мукет учыре


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Udmurtia is taught in
## Russian, so the element names an Udmurt-speaking pupil meets are the Russian
## ones — the school-system case this batch shares throughout.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Янгыш химической пус
chemistry-invalid-ionic-compound = Янгыш ион герӟет
