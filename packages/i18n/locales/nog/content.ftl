# Nogai content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic, the only orthography Nogai has been printed in since
# 1938 and what CLDR fills a bare `nog` in as. аь, оь, уь and нъ are letters of
# the alphabet rather than Russian letter sequences.
#
# Nogai is spoken across three federal subjects — Dagestan, Karachay-Cherkessia
# and Stavropol Krai — in three dialect groups: Kara-Nogai in Dagestan, Aqnogay
# on the Kuban in Karachay-Cherkessia, and the central variety in the Nogai
# steppe of Stavropol. This catalog writes the **literary norm built on the
# Kara-Nogai and central varieties**, which is the standard the Dagestani and
# Cherkessk school books and the newspaper «Ногай давысы» use. An Aqnogay
# reader will find some of these words are not the ones they say; that is a
# dialect difference and not an error in the file.
#
# Nogai is Turkic, so it has **no grammatical gender and no noun classes**, and
# an attributive adjective never agrees with anything. `noun-gender` therefore
# returns one token for every noun and **no message in this file forks on
# `$gender` or on `$role`** — the same flat answer `locales/ba`, `locales/tt`
# and `locales/tr` give.
#
# Attributive adjectives **precede** the noun, in the same order English writes
# them, so the composition messages below keep the English word order:
# «калын кызыл сызык» is width, colour, noun.
#
# What this file is least sure of is its vocabulary rather than its grammar.
# Nogai's written output is small and its published technical vocabulary is
# smaller: the colour words, the everyday nouns and the sectioning words below
# are Nogai, but several of the mathematical nouns — «авышлык майданы» for a
# slope field, «дурыс коьпмуьйиш» for a regular polygon, «анъламлама» for a
# definition — are built here out of general Kipchak vocabulary on the pattern
# Kazakh and Karakalpak use, because no attested Nogai term was available to
# copy. Those are the entries to check first.


## Style vocabulary

# «коьк» is blue and «ясыл» green, so the two do not overlap the way a Turkic
# «коьк» sometimes does; cyan is the separate «коьгилдир». «куьлгин» for purple
# is the least attested word in this table.
color =
    .black = кара
    .white = ак
    .gray = боз
    .red = кызыл
    .orange = кызгылт сары
    .yellow = сары
    .green = ясыл
    .cyan = коьгилдир
    .blue = коьк
    .purple = куьлгин
    .pink = кызгылт
    .brown = коьнъир
line-width =
    .thick = калын
    .thin = йинъишке
line-style =
    .dashed = уьзик
    .dotted = ноктали
# Noun phrases. They stand in front of «оювлы» in the composition messages
# below and modify nothing themselves.
fill-style =
    .horizontal = горизонталь сызыклар
    .vertical = вертикаль сызыклар
    .diagonal = диагональ сызыклар
    .backdiagonal = кери диагональ сызыклар
    .dots = нокталар
    .diamonds = ромблар
noun =
    .line = туьз сызык
    .line-segment = кесинди
    .ray = нур
    .vector = вектор
    .curve = кыйсык сызык
    .function = функция
    .slope-field = авышлык майданы
    .vector-field = вектор майданы
    .parabola = парабола
    .polyline = сынык сызык
    .polygon = коьпмуьйиш
    .triangle = уьшмуьйиш
    .rectangle = туьзмуьйишлик
    .circle = тоьгерек
    .region = аймак
    .point = нокта
    .square = квадрат
    .diamond = ромб
    .cross = крест
    .plus = плюс
# Nogai builds the side count into a modifier in front of the noun, so the
# whole of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } муьйишли дурыс коьпмуьйиш
    }
# Nogai has no grammatical gender and no noun classes, so every noun answers
# the same and the answer goes unused.
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
style-filled-word = толтырылган
# «оювлы» — "having the pattern of" — carries the "with" by itself, and the
# whole phrase goes in front of what it describes, as every modifier does here.
style-filled =
    { $parts ->
        [pattern] { $pattern } оювлы { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } оювлы { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } оювлы { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# The renderer appends this after the shape it belongs to, where a prenominal
# modifier cannot go. So it is written as a predicate instead — «шети { $border }»,
# "its border is thick red" — which is what Nogai puts after a noun. Neither
# the article nor the preposition English needs has anything to answer to here,
# so the two pairs of branches differ only in the «эм» that joins a second one.
style-border-clause =
    { $parts ->
        [with-article] шети { $border }
        [and] эм шети { $border }
        [and-article] эм шети { $border }
       *[with] шети { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = толтырылмаган
# «фонында» is the locative of «фон» and says "on the background" by itself, so
# nothing stands between the two colours. The suffix sits on a word this
# catalog writes, never on a placeable.
style-text =
    { $parts ->
        [background] { $background } фонында { $color }
       *[plain] { $color }
    }
style-background-none = йок

## Boolean words

boolean-true = дурыс
boolean-false = ялган

## Answer buttons

answer-submit-label = Тексеруьв
answer-submit-label-no-correctness = Явапты йиберуьв

## Sectional blocks

section-name =
    .activity = Аьрекет
    .aside = Ян соьз
    .cascade = Каскад
    .definition = Анъламлама
    .example = Уьлги
    .exercise = Коьнигуьв
    .exercises = Коьнигуьвлер
    .given-answer = Явап
    .note = Эскертпе
    .objectives = Максатлар
    .paragraphs = Абзацлар
    .part = Боьлик
    .problem = Масала
    .problems = Масалалар
    .proof = Далиллев
    .question = Сорав
    .section = Боьлим
    .solution = Шешуьв
    .task = Тапсырма
    .theorem = Теорема
# Nogai punctuates a heading the way the Cyrillic school tradition does, with a
# period rather than the colon English uses.
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Коьрсетпе

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
        [numbered] Сурет { $enumeration }
        [numbered-caption] Сурет { $enumeration }{ ". " }
        [unnumbered-caption] Сурет{ ". " }
       *[unnumbered] Сурет
    }

## Paginator controls

paginator-previous = Алдынгы
paginator-next = Келеси
paginator-page = Бет
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = яде
# Nogai's "if" opens its clause and lands correctly here. The conditional
# itself is a suffix on the verb (-са/-се), but the word that introduces the
# condition — «эгер» — stands at the **front** of it, so the renderer placing
# this before the mathematics is where Nogai wants it. This catalog therefore
# has none of the limit `locales/sah`, `locales/tyv`, `locales/udm`,
# `locales/kv` and `locales/chm` record beside this key, whose «буоллаҕына»,
# «болза», «ке», «кӧ» and «гын» all close the clause instead.
piecewise-condition-if = эгер
piecewise-condition-otherwise = болмаса

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Dagestan,
## Karachay-Cherkessia and Stavropol Krai is taught in Russian, and the element
## names a Nogai-speaking pupil meets are the Russian ones out of a
## Russian-language textbook, so the English fallback sits nearer their
## curriculum than an invented Nogai list would. Nogai has no published
## chemical nomenclature to seed from, and respelling the Russian list in Nogai
## letters would produce neither language — the argument `locales/min` already
## makes against copying Indonesian's table.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Дурыс тувыл химиялык белги
chemistry-invalid-ionic-compound = Дурыс тувыл ион косылысы
