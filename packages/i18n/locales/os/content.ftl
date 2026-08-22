# Ossetian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Cyrillic with Ossetian's own æ, which is the orthography North and
# South Ossetia's schools and publishing use and what CLDR fills a bare `os` in
# as. The catalog is **Iron**, the literary standard; Digor is a written
# variety of its own that ISO 639-3 does not give a separate code, so a Digor
# reader arriving under `os` reaches Iron.
#
# The roster calls this language **Ossetic**, because that is what
# `Intl.DisplayNames` renders `os` as; Ossetian is the more usual English name
# and the two are one language. `os` is also the one locale in this batch whose
# `Intl.Locale("os").maximize()` names a country outside Russia — `os-Cyrl-GE`,
# Georgia — which is CLDR's data rather than an error, and costs negotiation
# nothing: no region tag over `os` needs an alias.
#
# Ossetian is Iranian and is the only Indo-European language in this batch. It
# has no grammatical gender and does not inflect an attributive adjective, so
# `$gender` and `$role` go unused — the same answer the Turkic, Mongolic and
# Uralic catalogs beside it give, from a fourth family and, this time, from a
# family whose better-known members (Russian, Persian's neighbours) do inflect.
#
# THE COLOUR TABLE IS WORTH READING FIRST, for the reason `locales/sah`'s is.
# Ossetian's «цъæх» covers green, blue and grey — one word where the style
# pipeline needs three — so this catalog writes the compounds that split it:
# «кæрдæгхуыз» (grass-coloured) for green and «æрвхуыз» (sky-coloured) for
# blue. Two unrelated languages in one batch, one problem, and the same shape
# of answer.


## Style vocabulary

color =
    .black = сау
    .white = урс
    .gray = фæлурс
    .red = сырх
    .orange = нарынджы хуыз
    .yellow = бур
    .green = кæрдæгхуыз
    .cyan = рухс æрвхуыз
    .blue = æрвхуыз
    .purple = фиолетон
    .pink = розæхуыз
    .brown = морæ
line-width =
    .thick = бæзджын
    .thin = тæнæг
line-style =
    .dashed = скъуыдтæ
    .dotted = стъæлфытимæ
# Noun phrases: they stand in front of «нывимæ» and modify nothing.
fill-style =
    .horizontal = горизонталон хахх
    .vertical = вертикалон хахх
    .diagonal = диагоналон хахх
    .backdiagonal = ныхмæ диагоналон хахх
    .dots = стъæлф
    .diamonds = ромб
noun =
    .line = раст хахх
    .line-segment = хахххай
    .ray = луч
    .vector = вектор
    .curve = къæдз хахх
    .function = функци
    .parabola = параболæ
    .polyline = састхахх
    .polygon = бирæкъуымон
    .triangle = æртæкъуымон
    .rectangle = раст къуымон
    .circle = тымбыл
    .region = бынат
    .point = стъæлф
    .square = квадрат
    .diamond = ромб
    .cross = дзуар
    .plus = плюс
# Ossetian builds the word from the side count in front of the noun, so the
# whole of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] раст { $numSides }-къуымон
    }
# Ossetian has no grammatical gender, so every noun answers the same and the
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
style-filled-word = ахуырст
style-filled =
    { $parts ->
        [pattern] { $pattern } нывимæ { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } нывимæ { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } нывимæ { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «кæронимæ» — "with an edge" — is written after the colour word this catalog
# supplies, so the comitative suffix lands on a noun of its own rather than on
# a placeable, and neither a preposition nor an article is wanted.
style-border-clause =
    { $parts ->
        [with-article] { $border } кæронимæ
        [and] æмæ { $border } кæронимæ
        [and-article] æмæ { $border } кæронимæ
       *[with] { $border } кæронимæ
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } нывимæ { $color } ахорæн
       *[plain] { $color } ахорæн
    }
style-unfilled = ахуырст нæу
# «уæлæ» — "on" — is a postposition and follows the background colour, so
# nothing stands between the two words.
style-text =
    { $parts ->
        [background] { $background } фон уæлæ { $color }
       *[plain] { $color }
    }
style-background-none = нæй

## Boolean words

boolean-true = раст
boolean-false = раст нæу

## Answer buttons

answer-submit-label = Бабæрæг кæнын
answer-submit-label-no-correctness = Дзуапп арвитын

## Sectional blocks

section-name =
    .activity = Куыст
    .aside = Фарсмæ фиппаинаг
    .cascade = Каскад
    .definition = Бæрæггæнæн
    .example = Цæвиттон
    .exercise = Фæлтæрæн
    .exercises = Фæлтæрæнтæ
    .given-answer = Дзуапп
    .note = Фиппаинаг
    .objectives = Нысæнттæ
    .paragraphs = Абзацтæ
    .part = Хай
    .problem = Хæс
    .problems = Хæстæ
    .proof = Бæлвырдгæнæн
    .question = Фарст
    .section = Хай
    .solution = Раиртасæн
    .task = Хæслæвæрд
    .theorem = Теоремæ
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Амынд

## Tables and figures

table-name =
    { $parts ->
        [numbered] Таблицæ { $enumeration }
        [numbered-title] Таблицæ { $enumeration }{ ". " }
        [unnumbered-title] Таблицæ{ ". " }
       *[unnumbered] Таблицæ
    }
figure-name =
    { $parts ->
        [numbered] Ныв { $enumeration }
        [numbered-caption] Ныв { $enumeration }{ ". " }
        [unnumbered-caption] Ныв{ ". " }
       *[unnumbered] Ныв
    }

## Paginator controls

paginator-previous = Разæй
paginator-next = Дарддæр
paginator-page = Фарс
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## Ossetian's conditional «кæд» is clause-initial, so this key lands where the
## renderer puts it — unlike `locales/sah`, `locales/tyv`, `locales/udm`,
## `locales/kv` and `locales/chm`, five catalogs of this batch whose
## conditional closes its clause and which record a limit there.

piecewise-condition-or = кæнæ
piecewise-condition-if = кæд
piecewise-condition-otherwise = æндæр хуызы

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry is taught in Russian in
## North Ossetia and in Russian in South Ossetia as well, so the element names
## an Ossetian-speaking pupil meets are the Russian ones — the school-system
## case this batch shares throughout, arriving here on both sides of a border
## rather than one.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Раст нæу химион нысан
chemistry-invalid-ionic-compound = Раст нæу ионон баиу
