# Kʼicheʼ content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the ALMG orthography; see `chrome.ftl`'s header for the alphabet, the
# register, and the possessive-prefix constraint that shapes all four files.
#
# Kʼicheʼ has no grammatical gender and no adjective agreement, so `noun-gender`
# answers one token and nothing selects on it. Nothing selects on `$role`. Its
# adjectives **precede** the noun, so `style-stroke` and `style-with-noun` are
# English's order.
#
# The possessive prefix is the reason `style-fill` and `style-border-clause` read
# the way they do. Kʼicheʼ marks "a shape's border" with «u-» or «r-» on the
# border word — which is fine, because «uxukut» and «utzʼapibʼal» are words this
# catalog writes — but it cannot mark "filled with { $pattern }" that way, because
# the prefix would have to see `$pattern`'s first sound. So the pattern is joined
# with «rukʼ», the free comitative, and nothing is welded.
#
# `noun-regular-polygon` collapses to English's shape: the side count is a
# prenominal modifier, «jobʼ uxukut», so the head holds it and the `[tail]` branch
# is empty.
#
# **The colour table has the same seam `locales/gn` and `locales/ay` have.**
# Kʼicheʼ «räx» is the colour of a living plant and of water and of sky — it spans
# what English splits into green and blue. This catalog assigns `.green` to «räx»
# and `.blue` to the loan «asul», which is what present-day usage does and which
# is *not* a translation of either English word. Three languages in this batch
# divide that range three different ways; none of them divides it where English
# does, and a two-key table cannot record any of the three.


## Style vocabulary

color =
    .black = qʼeq
    .white = saq
    .gray = qʼeqsaq
    .red = kyaq
    .orange = kyaqqʼan
    .yellow = qʼan
    .green = räx
    .cyan = syan
    .blue = asul
    .purple = morad
    .pink = kyaqsaq
    .brown = kape

line-width =
    .thick = pim
    .thin = xax

line-style =
    .dashed = qʼatom
    .dotted = tzʼubʼutzʼubʼ

# Noun phrases, which is what the head of `style-fill` is. Kʼicheʼ does not
# pluralize these, so they are the same words for one and for many.
fill-style =
    .horizontal = juchʼ pa qʼeyexik
    .vertical = juchʼ pa tikbʼal
    .diagonal = juchʼ pa xukut
    .backdiagonal = juchʼ pa xukut tzalijisam
    .dots = tzʼubʼ
    .diamonds = rombo

noun =
    .line = juchʼ
    .line-segment = juchʼ qʼatom
    .ray = juchʼ junwiʼ
    .vector = bektor
    .curve = kotokik juchʼ
    .function = funsyon
    .parabola = parabola
    .polyline = kʼï juchʼ
    .polygon = kʼï uxukut
    .triangle = oxibʼ uxukut
    .rectangle = nim kajibʼ uxukut
    .circle = setesik
    .region = kʼolibʼal
    .point = tzʼubʼ
    .square = kajibʼ uxukut
    .diamond = rombo
    .cross = kurus
    .plus = retal kʼiyinem

# The side count is a prenominal modifier, so it stays in the head and the tail is
# empty. The «u-» on «uxukut» is fixed: «xukut» is a word this catalog writes.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } uxukut junam
    }

# One answer for every noun: Kʼicheʼ has no grammatical gender, so nothing
# downstream has anything to agree with.
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

# The adjectives precede the noun, so this is English's order. The `[noun-tail]`
# branch is unreachable from Kʼicheʼ's own `noun-regular-polygon`; it is kept
# because it is what a partly-corrected catalog falls back to.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

style-filled-word = nojisam

# «rukʼ», "with", is a free word, so nothing is welded to `$pattern`. The
# possessive prefix could not have been used here: its shape would depend on the
# pattern's first sound.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } rukʼ { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } rukʼ { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } rukʼ { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# The «u-» on «utzʼapibʼal» is fixed, because «tzʼapibʼal» is written here.
# Kʼicheʼ has no article, so English's four branches are two distinct strings; all
# four are written out because they are four positions.
style-border-clause =
    { $parts ->
        [with-article] rukʼ jun { $border } utzʼapibʼal
        [and] xuqujeʼ { $border } utzʼapibʼal
        [and-article] xuqujeʼ jun { $border } utzʼapibʼal
       *[with] rukʼ { $border } utzʼapibʼal
    }

# Here the pattern is the head noun — "blue diamonds" — and the colour precedes
# it, so the phrase needs nothing at all.
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = man nojisam taj

style-text =
    { $parts ->
        [background] { $color } rukʼ jun { $background } uwach
       *[plain] { $color }
    }

style-background-none = maj


## Boolean words

boolean-true = qas
boolean-false = man qas taj


## Answer buttons

answer-submit-label = Chanikʼoj ri chak
answer-submit-label-no-correctness = Chataqa ri tzalijisabʼal


## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are the same word:
# these nouns are inanimate and Kʼicheʼ does not pluralize them.
section-name =
    .activity = Chak
    .aside = Kʼak tzij
    .cascade = Xuruxik jaʼ
    .definition = Bʼixibʼal
    .example = Kʼutbʼal
    .exercise = Tijonik
    .exercises = Tijonik
    .given-answer = Tzalijisabʼal
    .note = Tzʼibʼanik
    .objectives = Rayibʼal
    .paragraphs = Tanaj tzij
    .part = Tanaj
    .problem = Kʼaxkʼolil
    .problems = Kʼaxkʼolil
    .proof = Qʼalajisanik
    .question = Kʼotbʼal chiʼaj
    .section = Tanajil
    .solution = Solbʼal
    .task = Taqanik
    .theorem = Teorema

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Tobʼanik


## Tables and figures

table-name =
    { $parts ->
        [numbered] Cholajil { $enumeration }
        [numbered-title] Cholajil { $enumeration }{ ": " }
        [unnumbered-title] Cholajil{ ": " }
       *[unnumbered] Cholajil
    }

figure-name =
    { $parts ->
        [numbered] Wachibʼal { $enumeration }
        [numbered-caption] Wachibʼal { $enumeration }{ ": " }
        [unnumbered-caption] Wachibʼal{ ": " }
       *[unnumbered] Wachibʼal
    }


## Paginator controls

paginator-previous = Nabʼe
paginator-next = Kʼisbʼal
paginator-page = Wuj

# «rech», "of", carries a fixed prefix because it is a word this catalog writes.
paginator-page-status = { $pageLabel } { $currentPage } rech { $numPages }


## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = we
piecewise-condition-otherwise = we man


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Kʼicheʼ-medium bilingual education in Guatemala reaches the primary
## grades; secondary chemistry is taught in Spanish out of Spanish textbooks, so
## the periodic table a pupil meets is `locales/es`'s. There is no settled Kʼicheʼ
## table for a seed to reproduce.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Man utz taj ri retal kimiko
chemistry-invalid-ionic-compound = Man utz taj ri riqoj ioniko
