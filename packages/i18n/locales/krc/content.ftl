# Karachay-Balkar content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Cyrillic alphabet Karachay-Cherkessia and Kabardino-Balkaria
# teach and publish in, which is what CLDR fills a bare `krc` in as
# (`krc-Cyrl-RU`). къ, гъ, нг and дж are letters of that alphabet rather than
# pairs of Russian ones.
#
# Karachay and Balkar are two literary norms of a single language sharing one
# standard orthography, and a catalog has to pick one. **This one writes the
# Karachay norm**: дж- where Balkar has ж- («джашил», «джууап», «джокъ»), and
# a handful of everyday words differ besides. A Balkar reader will find those
# spellings unfamiliar without finding them unintelligible; correcting the file
# toward either norm is a consistent, mechanical change.
#
# **Karachay-Balkar is Turkic: it has no grammatical gender and no noun class,
# so `noun-gender` answers with one token for every noun and not one message in
# this catalog forks.** That is worth saying out loud, because this catalog is
# seeded beside the Northeast Caucasian and Nakh languages of the same region —
# `locales/ce` and its neighbours — whose class systems make the fork the
# expected shape. Nothing about sharing a map implies sharing agreement, and the
# Turkic answer here is the same flat "no" `locales/ba`, `locales/tt` and
# `locales/tr` give.
#
# An attributive adjective **precedes** its noun and never changes form —
# «къалын къызыл сызыкъ», thick red line — as in every Turkic language in the
# roster. So `$gender` and `$role` both go unused, and the composition messages
# below keep the English word order rather than reversing it.
#
# What a clause position wants is marked on the **noun**, by a suffix or a
# free postposition: «чек бла» for the border, «фонда» for the background.
# Both of those words are ones this catalog writes out, so no affix is ever
# welded onto a placeable.
#
# **Least certain thing in this file: the geometry nouns.** «майдан» for a
# mathematical field, «тийре» for a region, and «ангылатма» for an expression
# are coinages this seed chose from ordinary Karachay-Balkar words on the model
# of the Tatar and Bashkir terminologies; school geometry in the two republics
# is taught in Russian, so there is no settled published set to check them
# against. The colour «ал» for pink is the second-weakest word here: the
# language names light red and crimson more readily than it names pink, and the
# style pipeline splits colour where Karachay-Balkar does not.


## Style vocabulary
##
## Prenominal and invariable. Nothing here forks on `$gender` or `$role`,
## because nothing here changes shape for either.

color =
    .black = къара
    .white = акъ
    .gray = боз
    .red = къызыл
    .orange = къызгъылдым сары
    .yellow = сары
    .green = джашил
    .cyan = ачыкъ кёк
    .blue = кёк
    .purple = мор
    .pink = ал
    .brown = кюрен
line-width =
    .thick = къалын
    .thin = инчге
line-style =
    .dashed = юзюклю
    .dotted = нокъталы
# Noun phrases, not adjectives: they stand in front of «оюулу» in the messages
# that place them, and modify nothing on their own.
fill-style =
    .horizontal = горизонталь сызыкъла
    .vertical = вертикаль сызыкъла
    .diagonal = диагональ сызыкъла
    .backdiagonal = тескери диагональ сызыкъла
    .dots = нокъта
    .diamonds = ромб
noun =
    .line = тюз сызыкъ
    .line-segment = кесек
    .ray = нур
    .vector = вектор
    .curve = къынгыр сызыкъ
    .function = функция
    .slope-field = джантайыуну майданы
    .vector-field = векторну майданы
    .parabola = парабола
    .polyline = сынгъан сызыкъ
    .polygon = кёпмюйюш
    .triangle = ючмюйюш
    .rectangle = тюз мюйюшлюк
    .circle = тёгерек
    .region = тийре
    .point = нокъта
    .square = квадрат
    .diamond = ромб
    .cross = крест
    .plus = плюс
# The side count is a prenominal modifier here, as every modifier is, so the
# whole noun phrase is one head and there is no tail for the composition
# messages to place after the adjectives.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } джанлы тюз кёпмюйюш
    }
# Karachay-Balkar has no grammatical gender and no noun class, so every noun
# answers the same token and no message below selects on it.
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
# «оюулу» — "patterned" — is an adjective built on «оюу», ornament, and takes
# the pattern noun in front of it, so the whole pattern phrase precedes the
# colour exactly as any other modifier would.
style-filled =
    { $parts ->
        [pattern] { $pattern } оюулу { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } оюулу { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } оюулу { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «чек бла» — "with a border" — carries the sense with a free postposition
# standing after a noun this catalog writes, so nothing is welded to a
# placeable and no article is wanted. The two `-article` branches read the same
# as their plain siblings, because the article is what English needs and
# Karachay-Balkar does not.
style-border-clause =
    { $parts ->
        [with-article] { $border } чек бла
        [and] эм { $border } чек бла
        [and-article] эм { $border } чек бла
       *[with] { $border } чек бла
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = боялмагъан
# «фонда» is the locative of «фон» and says "on the background" by itself, so
# nothing stands between the two colours and the background comes first.
style-text =
    { $parts ->
        [background] { $background } фонда { $color }
       *[plain] { $color }
    }
style-background-none = джокъ


## Boolean words

boolean-true = тюз
boolean-false = терс


## Answer buttons

answer-submit-label = Тергеу
answer-submit-label-no-correctness = Джууапны джибериу


## Sectional blocks

section-name =
    .activity = Иш
    .aside = Къошакъ
    .cascade = Каскад
    .definition = Белгилеу
    .example = Юлгю
    .exercise = Кёнюгюу
    .exercises = Кёнюгюуле
    .given-answer = Джууап
    .note = Эсгертиу
    .objectives = Муратла
    .paragraphs = Абзацла
    .part = Кесек
    .problem = Масала
    .problems = Масалала
    .proof = Исбатлау
    .question = Соруу
    .section = Бёлюм
    .solution = Чечиу
    .task = Джумуш
    .theorem = Теорема
# A heading separates its number from the title with a period rather than a
# colon, which is the punctuation Russian-language schooling in the two
# republics has settled on and what a reader of Karachay-Balkar prose expects.
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

paginator-previous = Алгъыннгы
paginator-next = Келлик
paginator-page = Бет
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = неда
# The renderer places this word *before* the mathematics it introduces, and
# Karachay-Balkar can be written that way — but only with the borrowed
# conjunction. The language's own conditional is the verbal suffix -са/-се,
# which closes its clause and could never land here; «эгер» is a Persian
# borrowing that opens one, is what a mathematical condition is introduced with
# in written Karachay-Balkar, and needs nothing after it. So this key is
# correct as placed, unlike in `locales/sah`, `locales/tyv`, `locales/udm`,
# `locales/kpv` and `locales/mhr`, and for the same reason `locales/ba`'s
# «әгәр» is.
piecewise-condition-if = эгер
piecewise-condition-otherwise = алай болмаса


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Karachay-Cherkessia
## and Kabardino-Balkaria is taught in Russian, out of Russian-language
## textbooks; the element names a Karachay- or Balkar-speaking pupil actually
## meets are the Russian ones, and a table invented in Karachay-Balkar spelling
## would match neither the curriculum nor the language. The English fallback is
## the nearer of the two wrong answers, and it is visibly a fallback.
##
## `locales/tt` is the counter-example that decides it rather than a
## contradiction of it: Tatar supplies the whole table, because Tatar-medium
## chemistry teaching produced one. What settles this is which language a
## republic teaches the subject in, not which family the language belongs to.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Тюз болмагъан химия белги
chemistry-invalid-ionic-compound = Тюз болмагъан ион къошулуу
