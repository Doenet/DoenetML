# Tabasaran content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Cyrillic orthography of the Tabasaran literary language — the
# standard built on the Nitrik speech of the southern dialect group, which is
# what Dagestan's Tabasaran-medium primary schooling, the republic's Tabasaran
# publishing and the Tabasaran press are set in. CLDR carries no language data
# for `tab` at all, but its own likely-subtags fill the bare tag in as
# `tab-Cyrl-RU`, so the script this catalog is written in is the script a
# reader arriving under `tab` is expected in.
#
# The palochka Ӏ is a letter of the alphabet. It is not a Latin capital I and
# not a digit 1, and «апӀуб», «нукьтӀа» and «чӀал» stop being words the moment
# one of those is substituted for it. That check is worth running over any
# correction made to this file in an editor that autocorrects.
#
# **Tabasaran has a human / non-human class distinction, and this catalog forks
# on nothing — which is a claim about where the agreement lands rather than
# about whether the language has it.** Lezgian, its nearest neighbour, lost
# classes entirely; Avar has three and Lak four; Tabasaran keeps two in the
# singular. What carries that class, though, is the numeral (сар against саб),
# the verb, and a handful of pronouns — none of which the style pipeline ever
# reaches. The words this file's style vocabulary is made of are attributive
# adjectives, and a Tabasaran attributive adjective stands in front of its noun
# and does not change shape for it. So `noun-gender` answers one token, and a
# `$gender` fork written here would render the same string in every branch,
# which is the noise the roster's other agreeing catalogs are careful not to
# write.
#
# `style-unfilled` would be unreachable even if something did agree:
# `describeFill` renders it with no arguments at all, so no noun and therefore
# no `$gender` ever arrives. The flat form below is the only form it could
# have had.
#
# **Adjective placement: before the noun**, as in English, and a string of them
# keeps the order width, dash, colour, noun. So the composition messages below
# read in the same sequence English's do — that is Tabasaran's own order and
# not English's showing through.
#
# **Tabasaran is cited for a very large case inventory, and no case ending in
# this file is welded onto a placeable.** Wherever a value is followed by
# something that would take one, the ending is put on a noun this catalog
# writes out instead: «нахшди» (with a pattern) after `{ $pattern }` in
# `style-filled` and `style-filled-with-noun`, «гъирагъди» (with an edge) after
# `{ $border }` in `style-border-clause`, and «фондиин» (on the background)
# after `{ $background }` in `style-text`. That is the README's *name what the
# value is*, and it is why those three messages are phrased differently from
# English rather than translated in place.
#
# **The colour table and the geometric nouns are the least certain things in
# this file, and a speaker should read them before anything else.** The basic
# colours are written with the inherited Lezgic terms this seed judged most
# likely — «чӀару», «лизи», «уьру», «хъипи», «вили» — and the derived ones are
# built as compounds of them («уьру-хъипи» for orange, «вили-уьру» for purple,
# «уьру-лизи» for pink) rather than borrowed, on the pattern `locales/ce`
# already uses. «яшил» for green and «къагьвайи» for brown are the two that
# came in from outside the family, and either may simply be the wrong word.
# Secondary mathematics in Dagestan is taught in Russian, so the technical
# nouns below are the Russian terms a Tabasaran-speaking pupil actually meets —
# «вектор», «функция», «парабола», «квадрат», «ромб» — while the shapes named
# long before the syllabus was («нукьтӀа», «цӀар», «пай», «майдан») keep their
# own words. Where this seed had to build a word rather than recall one, it
# built it out of «пипӀ» (corner): «шубпипӀ», «дюзпипӀ», «гизафпипӀ». Those
# three are coinages and are named here so that they read as coinages.


## Style vocabulary
##
## A Tabasaran attributive adjective stands before its noun and does not
## inflect for the noun's class, so nothing here forks. See the header.

color =
    .black = чӀару
    .white = лизи
    .gray = боз
    .red = уьру
    .orange = уьру-хъипи
    .yellow = хъипи
    .green = яшил
    .cyan = аку вили
    .blue = вили
    .purple = вили-уьру
    .pink = уьру-лизи
    .brown = къагьвайи
line-width =
    .thick = яцӀу
    .thin = шуькю
line-style =
    .dashed = штрихрин
    .dotted = нукьтӀйирин
# Noun phrases in the plural: they name what the interior is drawn out of and
# modify nothing, so no class marker is wanted on any of them.
fill-style =
    .horizontal = горизонталин цӀарар
    .vertical = вертикалин цӀарар
    .diagonal = диагоналин цӀарар
    .backdiagonal = акси диагоналин цӀарар
    .dots = нукьтӀйир
    .diamonds = ромбар
noun =
    .line = дюз цӀар
    .line-segment = цӀарин пай
    .ray = нур
    .vector = вектор
    .curve = эгри цӀар
    .function = функция
    .slope-field = наклонарин поле
    .vector-field = векторарин поле
    .parabola = парабола
    .polyline = гъубгъу цӀар
    .polygon = гизафпипӀ
    .triangle = шубпипӀ
    .rectangle = дюзпипӀ
    .circle = даире
    .region = майдан
    .point = нукьтӀа
    .square = квадрат
    .diamond = ромб
    .cross = крест
    .plus = плюс
# Tabasaran puts the side count in front of the noun, like every other
# modifier, so the whole of the phrase is one head and there is no tail.
# «тереф» is the side and «айи» the participle "having", which is a word this
# catalog writes rather than an ending on `{ $numSides }`.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } тереф айи дюз гизафпипӀ
    }
# One token for everything. Tabasaran's two classes are carried by numerals,
# by the verb and by some pronouns, and by none of the adjectives this file is
# made of — see the header.
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
# Invariable: a Tabasaran participle used attributively takes no class marker,
# so there is nothing for `$gender` to choose between.
style-filled-word = ацӀу
# «нахшди» — "with a pattern" — is the instrumental of a noun this catalog
# writes, so the case ending sits on a word the file owns rather than on
# `{ $pattern }`.
style-filled =
    { $parts ->
        [pattern] { $pattern } нахшди { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } нахшди { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } нахшди { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# «гъирагъди» — "with an edge" — carries the case for the same reason, and
# Tabasaran wants no article, so the two article branches read like the two
# without one.
style-border-clause =
    { $parts ->
        [with-article] { $border } гъирагъди
        [and] ва { $border } гъирагъди
        [and-article] ва { $border } гъирагъди
       *[with] { $border } гъирагъди
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
# Rendered with no arguments by `describeFill`, so no noun and no `$gender`
# reach it and a fork here could only ever render its own default. «дару» is
# the negative participle and stands after the word it negates.
style-unfilled = ацӀу дару
# «фондиин» — "on the background" — is the case-bearing word again, and it
# follows the colour rather than preceding it.
style-text =
    { $parts ->
        [background] { $background } фондиин { $color }
       *[plain] { $color }
    }
style-background-none = адар

## Boolean words

boolean-true = дюз
boolean-false = дюз дар

## Answer buttons

answer-submit-label = Ахтармиш апӀуб
answer-submit-label-no-correctness = Жаваб ивуб

## Sectional blocks

section-name =
    .activity = Машгъулат
    .aside = Гъирагъдин къайд
    .cascade = Каскад
    .definition = Тайинуб
    .example = Мисал
    .exercise = Упражнени
    .exercises = Упражненйир
    .given-answer = Жаваб
    .note = Къайд
    .objectives = Мурадар
    .paragraphs = Абзацар
    .part = Пай
    .problem = Масъала
    .problems = Масъалаяр
    .proof = Исбат
    .question = Суал
    .section = Кьил
    .solution = Гьял
    .task = Тапшуругъ
    .theorem = Теорема
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
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

paginator-previous = Улихьна
paginator-next = Кьяляхъна
paginator-page = Ччин
# «of» is not written: a Tabasaran genitive would have to sit on
# `{ $numPages }`, and that is an ending on a value this catalog never sees.
# The slash says the same thing and belongs to no language.
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## Tabasaran's own conditional is a suffix on the verb and so closes the clause
## it conditions, which is the limit `locales/sah`, `locales/tyv`,
## `locales/udm`, `locales/kv` and `locales/chm` record. This key escapes it:
## «эгер» is the borrowed conjunction, it is clause-initial, and it is what
## written Tabasaran actually puts in front of a stated condition — so the word
## lands where the renderer places it, in front of the mathematics, and nothing
## here has to be worked around.

piecewise-condition-or = я
piecewise-condition-if = эгер
piecewise-condition-otherwise = жара гьаларди

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Dagestan is taught in
## Russian — Tabasaran-medium schooling covers the primary grades — so the
## element names a Tabasaran-speaking pupil meets are the Russian ones, and an
## invented Tabasaran list would be further from their textbook than the
## English fallback is.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Дюз дару химический лишан
chemistry-invalid-ionic-compound = Дюз дару ион бирлешме
