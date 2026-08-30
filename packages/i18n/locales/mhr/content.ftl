# Meadow Mari content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# This is **Meadow Mari** (`mhr`), the larger of the two Mari literary
# standards, written in Cyrillic with its own ӧ, ӱ and ҥ — the orthography Mari
# El's schools and publishing use, and what CLDR fills a bare `chm` in as. Hill
# Mari's ӓ and ӹ are deliberately absent: they belong to the other standard,
# and this catalog is not written in it.
#
# **Why the directory is `mhr` and not `chm`.** `chm` is an ISO 639-3
# **macrolanguage** over Meadow Mari (`mhr`) and Hill Mari (`mrj`), and Hill
# Mari — a written standard of its own, with its own orthography — now has a
# catalog of its own in `locales/mrj`. A directory named for the macrolanguage
# would claim to cover a sibling it cannot serve, so this one is named for the
# individual language actually written in it. Nothing is lost to a reader who
# types the old tag: ICU canonicalizes `mhr` straight back onto `chm`, so
# `negotiate.ts` carries `chm: "mhr"` in `LANGUAGE_ALIASES` and **both tags
# reach this catalog**. A document that says `lang="chm"` keeps working exactly
# as before; one that says `lang="mhr"` now says precisely what it means.
#
# Meadow Mari has no grammatical gender and does not inflect an attributive
# adjective, so `$gender` and `$role` go unused here, as in the other three
# Uralic catalogs of this batch.


## Style vocabulary

color =
    .black = шем
    .white = ош
    .gray = сур
    .red = йошкар
    .orange = оранжевый
    .yellow = нарынче
    .green = ужар
    .cyan = волгыдо канде
    .blue = канде
    .purple = фиолетовый
    .pink = роза тӱсан
    .brown = кӱрен
line-width =
    .thick = кӱжгӧ
    .thin = вичкыж
line-style =
    .dashed = кӱрылтшӧ
    .dotted = точкан
# Noun phrases: they stand in front of «сӱретан» and modify nothing.
fill-style =
    .horizontal = горизонтальный линий
    .vertical = вертикальный линий
    .diagonal = диагональный линий
    .backdiagonal = ваштареш диагональный линий
    .dots = точко
    .diamonds = ромб
noun =
    .line = вияш линий
    .line-segment = ужаш
    .ray = луч
    .vector = вектор
    .curve = кадыр линий
    .function = функций
    .parabola = парабола
    .polyline = тодылмо линий
    .polygon = шуко лукан
    .triangle = кум лукан
    .rectangle = вияш лукан
    .circle = йыргешке
    .region = кундем
    .point = точко
    .square = квадрат
    .diamond = ромб
    .cross = вашкыл
    .plus = плюс
# Mari builds the word from the side count in front of the noun, so the whole
# of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] тӧр { $numSides } лукан
    }
# Mari has no grammatical gender, so every noun answers the same and the answer
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
style-filled-word = чиялтыме
style-filled =
    { $parts ->
        [pattern] { $pattern } сӱретан { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } сӱретан { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } сӱретан { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «тӱран» — "having an edge" — carries the whole of "with a border" in its own
# suffix, so neither a preposition nor an article is wanted.
style-border-clause =
    { $parts ->
        [with-article] { $border } тӱран
        [and] да { $border } тӱран
        [and-article] да { $border } тӱран
       *[with] { $border } тӱран
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } сӱретан { $color } чия
       *[plain] { $color } чия
    }
style-unfilled = чиялтыдыме
# «ӱмбалне» — "on" — is a postposition and follows the background colour, so
# nothing stands between the two words.
style-text =
    { $parts ->
        [background] { $background } фон ӱмбалне { $color }
       *[plain] { $color }
    }
style-background-none = уке

## Boolean words

boolean-true = чын
boolean-false = чын огыл

## Answer buttons

answer-submit-label = Тергаш
answer-submit-label-no-correctness = Вашмутым колташ

## Sectional blocks

section-name =
    .activity = Паша
    .aside = Ӧрдыж палемдымаш
    .cascade = Каскад
    .definition = Рашемдымаш
    .example = Пример
    .exercise = Упражнений
    .exercises = Упражнений-влак
    .given-answer = Вашмут
    .note = Палемдымаш
    .objectives = Цель-влак
    .paragraphs = Абзац-влак
    .part = Пай
    .problem = Задаче
    .problems = Задаче-влак
    .proof = Пеҥгыдемдымаш
    .question = Йодыш
    .section = Ужаш
    .solution = Решений
    .task = Пашаж
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
hint-title = Ой

## Tables and figures

table-name =
    { $parts ->
        [numbered] Таблице { $enumeration }
        [numbered-title] Таблице { $enumeration }{ ". " }
        [unnumbered-title] Таблице{ ". " }
       *[unnumbered] Таблице
    }
figure-name =
    { $parts ->
        [numbered] Сӱрет { $enumeration }
        [numbered-caption] Сӱрет { $enumeration }{ ". " }
        [unnumbered-caption] Сӱрет{ ". " }
       *[unnumbered] Сӱрет
    }

## Paginator controls

paginator-previous = Ончычсо
paginator-next = Вес
paginator-page = Лаштык
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## `piecewise-condition-if` is the limit `locales/udm` and `locales/kpv` already
## record, in a third Uralic language: Mari's conditional «гын» closes the
## clause it conditions, and the renderer places this key before the
## mathematics. Erzya beside them does not hit it, so the wall is word order
## rather than family.

piecewise-condition-or = але
piecewise-condition-if = гын
piecewise-condition-otherwise = вес семын

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Mari El is taught in
## Russian, so the element names a Mari-speaking pupil meets are the Russian
## ones — the school-system case this batch shares throughout.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Чын огыл химический пале
chemistry-invalid-ionic-compound = Чын огыл ион ушымаш
