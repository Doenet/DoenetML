# Hmong Njua content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Hmong adjectives follow their noun, so the composition messages put the noun
# first. Hmong has no grammatical gender and no adjective agreement, so every
# noun answers `noun-gender` the same and the answer goes unused — as in
# English.
#
# `element-name` and `element-anion-name` are deliberately absent. Hmong has no
# settled chemical nomenclature that this could be seeded from, and inventing
# one would be worse than the English fallback a missing key gives: those two
# messages render in English until a chemist who writes Hmong supplies them.


## Style vocabulary

color =
    .black = dub
    .white = dawb
    .gray = txho
    .red = liab
    .orange = txiv kab ntxwv
    .yellow = daj
    .green = ntsuab
    .cyan = xiav ntsuab
    .blue = xiav
    .purple = paj yeeb
    .pink = liab qab zib
    .brown = av

line-width =
    .thick = tuab
    .thin = nyias

line-style =
    .dashed = tu ntu
    .dotted = ua teev

# Noun phrases: they follow `nrog` and modify nothing.
fill-style =
    .horizontal = kab pheej
    .vertical = kab ntsug
    .diagonal = kab txiav
    .backdiagonal = kab txiav rov qab
    .dots = teev
    .diamonds = lub duab plaub ceg

noun =
    .line = kab
    .line-segment = ib ntu kab
    .ray = kab tshav
    .vector = kab qhia kev
    .curve = kab nkhaus
    .function = kev suav
    .parabola = kab nkhaus parabola
    .polyline = kab txhib
    .polygon = duab ntau ceg
    .triangle = duab peb ceg
    .rectangle = duab plaub ceg ntev
    .circle = lub voj voog
    .region = thaj chaw
    .point = lub taw
    .square = duab plaub ceg sib npaug
    .diamond = duab plaub ceg tig
    .cross = duab ntoo cuam
    .plus = lub cim ntxiv

# The noun is split: the head carries the adjectives and the complement closes
# the phrase behind them.
noun-regular-polygon =
    { $part ->
        [tail] uas muaj { $numSides } sab
       *[head] duab ntau ceg sib npaug
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

style-filled-word = ntim puv

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } nrog { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } nrog { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } nrog { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

style-border-clause =
    { $parts ->
        [with-article] nrog ib npoo { $border }
        [and] thiab npoo { $border }
        [and-article] thiab ib npoo { $border }
       *[with] nrog npoo { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } xim { $color }
       *[plain] { $color }
    }

style-unfilled = tsis tau ntim

style-text =
    { $parts ->
        [background] { $color } saum keeb { $background }
       *[plain] { $color }
    }

style-background-none = tsis muaj


## Boolean words

boolean-true = tseeb
boolean-false = tsis tseeb


## Answer buttons

answer-submit-label = Kuaj
answer-submit-label-no-correctness = Xa cov lus teb


## Sectional blocks

section-name =
    .activity = Kev ua
    .aside = Lus ntxiv
    .cascade = Kev sib law liag
    .definition = Lub ntsiab
    .example = Piv txwv
    .exercise = Kev xyaum
    .exercises = Cov kev xyaum
    .given-answer = Lus teb
    .note = Lus ceeb toom
    .objectives = Cov hom phiaj
    .paragraphs = Cov nqe lus
    .part = Feem
    .problem = Zaj lus nug
    .problems = Cov lus nug
    .proof = Pov thawj
    .question = Lus nug
    .section = Ntu
    .solution = Kev daws
    .task = Hauj lwm
    .theorem = Txoj cai lej

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Lus taw qhia


## Tables and figures

table-name =
    { $parts ->
        [numbered] Rooj { $enumeration }
        [numbered-title] Rooj { $enumeration }{ ": " }
        [unnumbered-title] Rooj{ ": " }
       *[unnumbered] Rooj
    }

figure-name =
    { $parts ->
        [numbered] Duab { $enumeration }
        [numbered-caption] Duab { $enumeration }{ ": " }
        [unnumbered-caption] Duab{ ": " }
       *[unnumbered] Duab
    }


## Paginator controls

paginator-previous = Yav tas
paginator-next = Tom ntej
paginator-page = Nplooj

paginator-page-status = { $pageLabel } { $currentPage } ntawm { $numPages }


## Piecewise functions

piecewise-condition-or = los yog
piecewise-condition-if = yog tias
piecewise-condition-otherwise = yog tsis li


## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Lub cim tshuaj tsis raug
chemistry-invalid-ionic-compound = Cov tshuaj ion tsis raug
