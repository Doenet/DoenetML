# Somali content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Somali adjectives follow their noun, so the composition messages put the noun
# first. Somali does have grammatical gender, but these descriptions are bare
# noun phrases in which the adjectives take no agreement marking, so every noun
# answers `noun-gender` the same and the answer goes unused — as in English.
#
# `element-name` and `element-anion-name` are deliberately absent. Somali has
# no settled chemical nomenclature that this could be seeded from, and inventing
# one would be worse than the English fallback a missing key gives: those two
# messages render in English until a chemist who writes Somali supplies them.


## Style vocabulary

color =
    .black = madow
    .white = caddaan
    .gray = cawl
    .red = guduud
    .orange = liin
    .yellow = jaalle
    .green = cagaar
    .cyan = buluug-cagaar
    .blue = buluug
    .purple = guduud-buluug
    .pink = casaan khafiif ah
    .brown = bunni
line-width =
    .thick = dhumuc weyn
    .thin = khafiif
line-style =
    .dashed = jarjaran
    .dotted = dhibco leh
# Noun phrases: they follow `oo leh` and agree with nothing.
fill-style =
    .horizontal = xariiqyo jiifa
    .vertical = xariiqyo taagan
    .diagonal = xariiqyo dhinac u jeeda
    .backdiagonal = xariiqyo dhinaca kale u jeeda
    .dots = dhibco
    .diamonds = dheeman
noun =
    .line = xariiq
    .line-segment = qayb xariiq
    .ray = fallaadh
    .vector = vektar
    .curve = qalooc
    .function = shaqo
    .parabola = parabola
    .polyline = xariiq jabjaban
    .polygon = geesle
    .triangle = saddexagal
    .rectangle = laydi
    .circle = goobo
    .region = gobol
    .point = bar
    .square = afargeesle
    .diamond = dheeman
    .cross = iskutallaab
    .plus = calaamadda lagu daro
# The noun is split: `geesle joogto ah` carries the adjectives and
# `oo leh 5 dhinac` closes the phrase behind them.
noun-regular-polygon =
    { $part ->
        [tail] oo leh { $numSides } dhinac
       *[head] geesle joogto ah
    }
noun-gender = neuter

## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $color } { $width } { $lineStyle }
        [width-color] { $color } { $width }
        [style-color] { $color } { $lineStyle }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
# The noun leads and its adjectives follow.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word = buuxsan
style-filled =
    { $parts ->
        [pattern] { $color } { $filled } oo leh { $pattern }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } oo leh { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } oo leh { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }
style-border-clause =
    { $parts ->
        [with-article] oo leh xuduud { $border }
        [and] iyo xuduud { $border }
        [and-article] iyo xuduud { $border }
       *[with] oo leh xuduud { $border }
    }
# Noun then colour, as everywhere else here. The colour words carry their own
# `ah` where they need one (`casaan khafiif ah`), so this message adds none.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = aan buuxsanayn
style-text =
    { $parts ->
        [background] { $color } oo ku yaal gadaal { $background }
       *[plain] { $color }
    }
style-background-none = midna

## Boolean words

boolean-true = run
boolean-false = been

## Answer buttons

answer-submit-label = Hubi
answer-submit-label-no-correctness = Dir jawaabta

## Sectional blocks

section-name =
    .activity = Hawl
    .aside = Faallo dhinac ah
    .cascade = Isku xigxig
    .definition = Qeexid
    .example = Tusaale
    .exercise = Layli
    .exercises = Layliyo
    .given-answer = Jawaab
    .note = Xusuusin
    .objectives = Ujeeddooyin
    .paragraphs = Faqrado
    .part = Qayb
    .problem = Su’aal
    .problems = Su’aalo
    .proof = Caddayn
    .question = Su’aal
    .section = Qaybta
    .solution = Xal
    .task = Hawl
    .theorem = Aragti
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Tilmaan

## Tables and figures

table-name =
    { $parts ->
        [numbered] Shaxda { $enumeration }
        [numbered-title] Shaxda { $enumeration }{ ": " }
        [unnumbered-title] Shax{ ": " }
       *[unnumbered] Shax
    }
figure-name =
    { $parts ->
        [numbered] Sawirka { $enumeration }
        [numbered-caption] Sawirka { $enumeration }{ ": " }
        [unnumbered-caption] Sawir{ ": " }
       *[unnumbered] Sawir
    }

## Paginator controls

paginator-previous = Hore
paginator-next = Xiga
paginator-page = Bog
paginator-page-status = { $pageLabel } { $currentPage } ka mid ah { $numPages }

## Piecewise functions

piecewise-condition-or = ama
piecewise-condition-if = haddii
piecewise-condition-otherwise = haddii kale

## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Calaamad kiimiko ah oo aan sax ahayn
chemistry-invalid-ionic-compound = Isku-dhis ayoon ah oo aan sax ahayn
