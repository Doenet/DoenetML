# Southern Altai content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Southern Altai** (алтай тил), the literary standard of the Altai Republic,
# based on the Altai-kizhi dialect. The tag is the individual language, not the
# macrolanguage: the Northern Altai varieties are written differently and are
# not served here.
#
# SCRIPT. Cyrillic, in the standard Altai alphabet: the Russian letters plus
# **ј ҥ ӧ ӱ**. `ј` is a letter of its own — not `дж`, not `ч` — and `ҥ` is one
# letter, not `нг`. All four files of this locale use exactly these four extra
# letters and nothing else.
#
# HOW THIN THIS IS. Altai is better provided for than Khakas beside it — there
# is a press, a school tradition and a dictionary — but its written technical
# register is still very thin, and republic mathematics teaching is in Russian.
# CLDR has no plural data for `alt`. Much of the geometry and nearly all of the
# software vocabulary below is a first attempt rather than an attested usage,
# and a speaker should expect to rewrite rather than merely correct.
#
# WORD ORDER. Altai is left-branching, as every Turkic language is: modifiers
# stand in front of the noun and nothing follows the head but its suffixes.
# "thick red line" is `јоон кызыл сызык`, in that order, and the adjectives
# agree with the noun in nothing. That is why `noun-regular-polygon` has no
# tail — the side count is one more front modifier, so the whole phrase is a
# single head. What English marks with a preposition Altai marks with a
# postposition after the noun or a suffix on it: `{ $border } кыйулу` for "with
# a border" (literally "edge-having"), `{ $background } фон ӱстинде` for "on a
# background", `{ $pattern } биле` for "with a pattern" — and because `биле`
# follows its noun, the whole phrase moves to the front rather than trailing as
# English's "with" clause does.
#
# GENDER AND NUMBER. No grammatical gender, and an attributive adjective does
# not inflect, so `$gender` and `$role` arrive and go unused. A noun after a
# numeral stays singular.
#
# CHEMISTRY. `element-name` and `element-anion-name` are deliberately **left
# out** and fall back to English. Altai has no settled, checkable list of the
# 118 elements: chemistry in the Altai Republic is taught in Russian, and the
# names an Altai-speaking pupil meets are the Russian ones. Inventing a
# nomenclature is precisely what this seed may not do. The frames around the
# names — `ion-name-oxidation-state` and the two invalid-input messages — are
# prose, and are translated.
#
# LOANS KEPT. `вектор`, `функция`, `парабола`, `квадрат`, `ромб`, `крест`,
# `плюс`, `точка`, `область`, `фон`, `абзац`, `теорема`, `каскад`, `вариант`,
# `статистика`, `горизонталь`, `вертикаль`, `диагональ` are the Russian words
# as Altai writes them. They stand because they are what the language uses.
#
# CONFIDENCE. The least certain items are `боро` (gray), `кӱреҥ` (brown), the
# `мӱйӱш`-based figure names (`кӧп мӱйӱштӱ` polygon, `ӱч мӱйӱштӱ` triangle,
# `тӧрт мӱйӱштӱ` rectangle) and most of `section-name`. The figure names are
# calques on the Altai word for a corner; an Altai mathematics teacher would
# very likely write `треугольник` and `прямоугольник` instead, because that is
# what their textbook says. A speaker should pick one register and make the
# whole file consistent with it.


## Style vocabulary

color =
    .black = кара
    .white = ак
    .gray = боро
    .red = кызыл
    .orange = кызыл сары
    .yellow = сары
    .green = јажыл
    .cyan = јарык кӧк
    .blue = кӧк
    .purple = фиолет
    .pink = розовый
    .brown = кӱреҥ
line-width =
    .thick = јоон
    .thin = ичке
line-style =
    .dashed = ӱзӱк-ӱзӱк
    .dotted = точкалу
# Noun phrases: they stand in front of the word for the fill and modify
# nothing themselves.
fill-style =
    .horizontal = горизонталь сызыктар
    .vertical = вертикаль сызыктар
    .diagonal = диагональ сызыктар
    .backdiagonal = удура диагональ сызыктар
    .dots = точкалар
    .diamonds = ромбтор
# `slope-field` and `vector-field` are omitted: no Altai phrase for either
# could be established, and a calque would be invention. They fall back to
# English.
noun =
    .line = тӱс сызык
    .line-segment = кезек
    .ray = луч
    .vector = вектор
    .curve = ийилген сызык
    .function = функция
    .parabola = парабола
    .polyline = сынган сызык
    .polygon = кӧп мӱйӱштӱ
    .triangle = ӱч мӱйӱштӱ
    .rectangle = тӧрт мӱйӱштӱ
    .circle = тегерик
    .region = область
    .point = точка
    .square = квадрат
    .diamond = ромб
    .cross = крест
    .plus = плюс
# The side count is one more front modifier, so the whole phrase is a single
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] тӱҥей { $numSides } мӱйӱштӱ
    }
# Altai has no grammatical gender, so every noun answers the same and the
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
style-filled-word = будалган
# `биле` — "with" — is a postposition, so the pattern and its postposition move
# to the front of the phrase.
style-filled =
    { $parts ->
        [pattern] { $pattern } биле { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } биле { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } биле { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# `кыйулу` — "edge-having" — carries the whole of "with a border" in its own
# suffix, so neither a preposition nor an article is wanted and the `-article`
# branches read exactly like the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } кыйулу
        [and] ла { $border } кыйулу
        [and-article] ла { $border } кыйулу
       *[with] { $border } кыйулу
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = будалбаган
# `ӱстинде` — "on top of" — is a postposition and follows the background
# colour, so nothing stands between the two words.
style-text =
    { $parts ->
        [background] { $background } фон ӱстинде { $color }
       *[plain] { $color }
    }
style-background-none = јок


## Boolean words

boolean-true = чын
boolean-false = тӧгӱн


## Answer buttons

answer-submit-label = Шиҥдеер
answer-submit-label-no-correctness = Карууны ийер


## Sectional blocks

section-name =
    .activity = Иш
    .aside = Кыйу сӧс
    .cascade = Каскад
    .definition = Јартамал
    .example = Тем
    .exercise = Иштеме
    .exercises = Иштемелер
    .given-answer = Каруу
    .note = Темдек
    .objectives = Амадулар
    .paragraphs = Абзацтар
    .part = Кезек
    .problem = Бодолго
    .problems = Бодолголор
    .proof = Керелеме
    .question = Сурак
    .section = Бӧлӱк
    .solution = Чечӱ
    .task = Јӧптӧш
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
hint-title = Сӱме


## Tables and figures

table-name =
    { $parts ->
        [numbered] { $enumeration } таблица
        [numbered-title] { $enumeration } таблица{ ". " }
        [unnumbered-title] Таблица{ ". " }
       *[unnumbered] Таблица
    }
figure-name =
    { $parts ->
        [numbered] { $enumeration } јурук
        [numbered-caption] { $enumeration } јурук{ ". " }
        [unnumbered-caption] Јурук{ ". " }
       *[unnumbered] Јурук
    }


## Paginator controls

paginator-previous = Кайра
paginator-next = Ары
paginator-page = Бӱк
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions
##
## Altai marks a condition at the end of its clause — `болзо` — but the
## renderer places `piecewise-condition-if` in front of the mathematics it
## introduces. The word is written in its citation form so that the line is at
## least readable; a speaker who can move it should.

piecewise-condition-or = эмезе
piecewise-condition-if = болзо
piecewise-condition-otherwise = ӧскӧ тушта


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent; see the
## header. These three are frames, not vocabulary, so they are translated.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Јарабас химия темдеги
chemistry-invalid-ionic-compound = Јарабас ион кожулта


## Inputs embedded in math

math-embedded-input-blank = ак орын
math-embedded-input-blank-ordinal = { $total } ак орынныҥ { $ordinal }-зы
