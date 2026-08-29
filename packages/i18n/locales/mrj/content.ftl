# Hill Mari content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `mrj` is Hill Mari — "Western Mari" is the only English name CLDR has for it,
# and its own name for itself is кырык мары йӹлмӹ. It is written in Cyrillic
# with ӓ and ӹ, letters that do not occur in Meadow Mari at all, plus the
# shared ӧ, ӱ and ҥ.
#
# **Hill Mari is a written standard, not a spelling of Meadow Mari.** It has
# its own orthography, its own schoolbooks and its own newspaper, and the two
# standards differ in ordinary vocabulary, not only in spelling — every one of
# these pairs is a word this batch's two catalogs actually contain, Meadow
# first and Hill second: «огыл»/«агыл» (not), «да»/«дӓ» (and),
# «деч», «гыч»/«гӹц» (from), «дене»/«доно» (with), «-влак»/«-влӓ» (plural),
# «чын»/«цын» (correct), «ончаш»/«анжаш» (to look), «икшыве»/«тетя» (child),
# «мут»/«шамак» (word), «возаш»/«сирӓш» (to write), «сандене»/«седӹндон» (so),
# «эн»/«сек» (most), «нерген»/«гишӓн» (about), «йодыш»/«ядмаш» (question).
#
# `mrj` is a member of the `chm` macrolanguage together with Meadow Mari
# (`mhr`), and until this catalog existed `MACROLANGUAGE_MEMBERS` in
# `negotiate.ts` folded a Hill Mari reader onto `locales/mhr`, which is written
# in Meadow. That fold is the compromise `locales/mhr`'s own header records;
# with a catalog of its own here it is no longer needed, and it is removed
# alongside this seed rather than by it.
#
# Hill Mari has no grammatical gender and does not inflect an attributive
# adjective, so `$gender` and `$role` go unused here, exactly as in
# `locales/mhr`, `locales/kpv`, `locales/udm` and `locales/myv`.


## Style vocabulary

color =
    .black = шим
    .white = ош
    .gray = сур
    .red = якшар
    .orange = оранжевый
    .yellow = нарынзы
    .green = ыжар
    .cyan = соты кӓнде
    .blue = кӓнде
    .purple = фиолетовый
    .pink = роза тӹсӓн
    .brown = кӹрен
line-width =
    .thick = кӹжгӹ
    .thin = вӹцкӹж
line-style =
    .dashed = кӹрӹлтшӹ
    .dotted = тӧчкӓн
# Noun phrases: they stand in front of «сӱретан» and modify nothing.
fill-style =
    .horizontal = горизонтальный линий
    .vertical = вертикальный линий
    .diagonal = диагональный линий
    .backdiagonal = ваштареш диагональный линий
    .dots = тӧчкӓ
    .diamonds = ромб
noun =
    .line = виквӓш линий
    .line-segment = ужаш
    .ray = луч
    .vector = вектор
    .curve = кадыр линий
    .function = функций
    .slope-field = важык пасу
    .vector-field = вектор пасу
    .parabola = парабола
    .polyline = тодылмы линий
    .polygon = шукы лыкан
    .triangle = кым лыкан
    .rectangle = виквӓш лыкан
    .circle = йыргешкӹ
    .region = кындем
    .point = тӧчкӓ
    .square = квадрат
    .diamond = ромб
    .cross = вашкӹл
    .plus = плюс
# Hill Mari builds the word from the side count in front of the noun, so the
# whole of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] тӧр { $numSides } лыкан
    }
# Hill Mari has no grammatical gender, so every noun answers the same and the
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
style-filled-word = циӓлтӹмӹ
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
# «тӹран» — "having an edge" — carries the whole of "with a border" in its own
# suffix, so neither a preposition nor an article is wanted.
style-border-clause =
    { $parts ->
        [with-article] { $border } тӹран
        [and] дӓ { $border } тӹран
        [and-article] дӓ { $border } тӹран
       *[with] { $border } тӹран
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } сӱретан { $color } ция
       *[plain] { $color } ция
    }
style-unfilled = циӓлтӹдӹмӹ
# «вӹлнӹ» — "on" — is a postposition and follows the background colour, so
# nothing stands between the two words.
style-text =
    { $parts ->
        [background] { $background } фон вӹлнӹ { $color }
       *[plain] { $color }
    }
style-background-none = уке

## Boolean words

boolean-true = цын
boolean-false = цын агыл

## Answer buttons

answer-submit-label = Тергаш
answer-submit-label-no-correctness = Вашмутым колташ

## Sectional blocks

section-name =
    .activity = Пӓшӓ
    .aside = Ӧрдыж пӓлемдӹмӓш
    .cascade = Каскад
    .definition = Рашимдымаш
    .example = Пример
    .exercise = Упражнений
    .exercises = Упражнений-влӓ
    .given-answer = Вашмут
    .note = Пӓлемдӹмӓш
    .objectives = Цель-влӓ
    .paragraphs = Абзац-влӓ
    .part = Пай
    .problem = Задаче
    .problems = Задаче-влӓ
    .proof = Пингӹдемдӹмӓш
    .question = Ядмаш
    .section = Ужаш
    .solution = Решений
    .task = Пӓшӓж
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

paginator-previous = Анзыцшы
paginator-next = Вес
paginator-page = Ластык
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## `piecewise-condition-if` is the limit `locales/udm` and `locales/kpv` already
## record, in a third Uralic language: Mari's conditional «гӹнь» closes the
## clause it conditions, and the renderer places this key before the
## mathematics. Erzya beside them does not hit it, so the wall is word order
## rather than family.

piecewise-condition-or = ӓли
piecewise-condition-if = гӹнь
piecewise-condition-otherwise = вес семӹнь

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in the Hill Mari district
## of Mari El is taught in Russian, so the element names a Hill Mari-speaking
## pupil meets are the Russian ones — the same school-system case `locales/mhr`
## records, and the one this batch shares throughout.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Цын агыл химический пӓлӹ
chemistry-invalid-ionic-compound = Цын агыл ион ушымаш
