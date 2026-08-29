# Kumyk content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Kumyk (къумукъ тил), a Kipchak Turkic language of the Dagestan lowlands,
# written in the Cyrillic orthography its schools, its press and its publishing
# have used since 1938 — the script CLDR assumes for a bare `kum`, which
# maximizes to `kum-Cyrl-RU`. гъ, гь, къ, нг, оь and уь are single letters of
# that alphabet and are not decorations on the Russian ones.
#
# Kumyk has no grammatical gender and no noun class. `noun-gender` therefore
# returns one token for every noun, nothing below forks on `$gender`, and
# nothing forks on `$role` either, because an attributive adjective does not
# inflect. That is worth saying plainly rather than leaving to be inferred:
# this catalog sits in a batch of Northeast Caucasian class systems, and the
# languages Kumyk is surrounded by inside its own republic — Avar, Dargwa, Lak,
# Tabasaran — every one of them agrees a word with a noun's class. Kumyk, a
# Turkic language in the middle of them, does not, and centuries of contact
# have not given it one.
#
# Attributive modifiers precede the noun, so the composition messages below
# keep the order English gives them: «боялгъан гёк тёгерек» is *filled blue
# circle*, in that order, and never the reverse.
#
# The border and background clauses are marked by a suffix on a noun this
# catalog writes out — «четли» on the edge, the locative «фонда» on the
# background — so nothing is welded onto a placeable.
#
# Two colour notes a speaker should check first. Kumyk «гёк» is the old Turkic
# sky-word: it is blue here, but it still reaches over green in fixed phrases
# («гёк от», green grass), and the split this file writes — «гёк» blue against
# «яшыл» green — is the modern one. And there is no single settled word for
# either *cyan* or *pink*, so both are written as transparent compounds,
# «ачыкъ гёк» and «ачыкъ къызыл» (light blue, light red). Those are choices,
# not translations.


## Style vocabulary

color =
    .black = къара
    .white = акъ
    .gray = боз
    .red = къызыл
    .orange = къызгъылт сари
    .yellow = сари
    .green = яшыл
    .cyan = ачыкъ гёк
    .blue = гёк
    .purple = мор
    .pink = ачыкъ къызыл
    .brown = къонгур
line-width =
    .thick = къалын
    .thin = инче
line-style =
    .dashed = уьзюклю
    .dotted = нокъатлы
# Noun phrases: they stand in front of «нагъышлы» and modify nothing.
fill-style =
    .horizontal = горизонталь сызыкълар
    .vertical = вертикаль сызыкълар
    .diagonal = диагональ сызыкълар
    .backdiagonal = терс диагональ сызыкълар
    .dots = нокъатлар
    .diamonds = ромблар
noun =
    .line = тюз сызыкъ
    .line-segment = кесек
    .ray = нур
    .vector = вектор
    .curve = эгри сызыкъ
    .function = функция
    .slope-field = къыялыкъ майданы
    .vector-field = вектор майданы
    .parabola = парабола
    .polyline = сынгъан сызыкъ
    .polygon = кёпмююш
    .triangle = уьчмююш
    .rectangle = тюзмююшлюк
    .circle = тёгерек
    .region = майдан
    .point = нокъат
    .square = квадрат
    .diamond = ромб
    .cross = крест
    .plus = плюс
# Kumyk counts the sides in front of the noun — «5 янлы тюз кёпмююш» — so the
# whole of the phrase is one head and there is no tail for the adjectives to
# sit inside.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } янлы тюз кёпмююш
    }
# Kumyk has no grammatical gender and no noun class, so every noun answers the
# same and the answer goes unused — as in English, Turkish and `locales/ba`,
# and unlike every Northeast Caucasian language spoken beside it.
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
style-filled-word = боялгъан
# «нагъышлы» — "patterned" — is a word of its own standing after the pattern
# name, not a suffix on it, so the placeable keeps whatever shape it arrives in.
style-filled =
    { $parts ->
        [pattern] { $pattern } нагъышлы { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } нагъышлы { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } нагъышлы { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# «четли» — "having an edge" — carries the whole of "with a border" in its own
# suffix, so Kumyk wants neither a preposition nor an article and the four
# branches differ only by the conjunction «ва», which English needs and Kumyk
# needs only where a clause has already been said.
style-border-clause =
    { $parts ->
        [with-article] { $border } четли
        [and] ва { $border } четли
        [and-article] ва { $border } четли
       *[with] { $border } четли
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = боялмагъан
# «фонда» is the locative of «фон» and says "on the background" by itself, so
# nothing stands between the two colours.
style-text =
    { $parts ->
        [background] { $background } фонда { $color }
       *[plain] { $color }
    }
style-background-none = ёкъ

## Boolean words

boolean-true = тюз
boolean-false = ялгъан

## Answer buttons

answer-submit-label = Ишни тергев
answer-submit-label-no-correctness = Жавапны йиберив

## Sectional blocks

section-name =
    .activity = Иш-гьаракат
    .aside = Ян сёз
    .cascade = Каскад
    .definition = Белгилев
    .example = Мисал
    .exercise = Чалышыв
    .exercises = Чалышывлар
    .given-answer = Жавап
    .note = Эсгерив
    .objectives = Мурадлар
    .paragraphs = Абзацлар
    .part = Пай
    .problem = Масала
    .problems = Масалалар
    .proof = Исбат
    .question = Сорав
    .section = Бёлюк
    .solution = Чечив
    .task = Тапшурув
    .theorem = Теорема
# Kumyk publishing in Dagestan punctuates a heading the way the Russian-language
# press beside it does, so a title follows its number after a full stop rather
# than a colon.
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Ишара

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
        [numbered] Сурат { $enumeration }
        [numbered-caption] Сурат { $enumeration }{ ". " }
        [unnumbered-caption] Сурат{ ". " }
       *[unnumbered] Сурат
    }

## Paginator controls

paginator-previous = Алдагъы
paginator-next = Сонрагъы
paginator-page = Бет
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = яда
# Kumyk's conditional lands correctly, and it is worth recording *why*, because
# five catalogs in the previous batch had to record the opposite. A full Kumyk
# conditional is a frame with two ends — clause-initial «эгер» and clause-final
# «буса» — and the renderer places this message before the mathematics it
# introduces, which is exactly where «эгер» belongs. So this key writes «эгер»
# alone: grammatical on its own, clause-initial, and it needs no second half to
# be understood. Sakha's «буоллаҕына», Tuvan's «болза», Udmurt's «ке», Komi's
# «кӧ» and Mari's «гын» are the clause-final ones that cannot be written here;
# Kumyk is on the other side of that line. «эгер» is a Persian word, and its
# presence is one small mark of Kumyk's long career as the trade language of
# the northeastern Caucasus, alongside «масала», «исбат», «жавап» and «малумат»
# elsewhere in these files.
piecewise-condition-if = эгер
piecewise-condition-otherwise = болмаса

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Dagestan is taught in
## Russian: a Kumyk-speaking pupil meets the elements under their Russian names
## in a Russian-language textbook, and there is no Kumyk-medium chemistry
## teaching that would have produced a settled list of 118 to seed from.
## Respelling the Russian names in Kumyk orthography would produce neither
## language, and the English fallback at least sits beside the symbols the
## pupil already reads. `locales/tt` is the counter-example that decides it —
## Tatar supplies the whole table, because Tatar-medium teaching produced one —
## and nothing about the two languages predicts the difference.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Тюз болмагъан химия белгиси
chemistry-invalid-ionic-compound = Тюз болмагъан ион къошулув
