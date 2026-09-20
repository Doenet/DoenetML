# Low German content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Northern Low Saxon, the variety CLDR fills a bare `nds` in as and
# the one most Low German publishing uses. A reader arriving under `nds-NL` —
# Dutch Low Saxon, written in a Dutch-based orthography — reaches this catalog
# and gets the German-based one. That is the same asymmetry `pa` and `sr`
# already have, and the answer to it is a second catalog beside this one rather
# than a rename of it.
#
# Low German has three genders, but an attributive adjective in a phrase with
# the indefinite article distinguishes only two forms: `-e` for masculine and
# feminine, the bare stem for neuter. «en dicke Krink», «en dicke Lien», «en
# dick Rebeed». So `noun-gender` answers with three tokens and every adjective
# writes two branches, the neuter against everything else.
#
# Nothing selects on `$role`. What a preposition governs is marked on the
# article rather than on the adjective in front of the noun, so «mit en dicke
# Rand» carries the same word the standalone phrase does.
#
# Adjectives precede the noun, so the composition messages keep the English
# order.


## Style vocabulary

color =
    .black =
        { $gender ->
            [n] swart
           *[other] swarte
        }
    .white =
        { $gender ->
            [n] witt
           *[other] witte
        }
    .gray =
        { $gender ->
            [n] gries
           *[other] griese
        }
    .red =
        { $gender ->
            [n] root
           *[other] rode
        }
    .orange = orange
    .yellow =
        { $gender ->
            [n] geel
           *[other] gele
        }
    .green =
        { $gender ->
            [n] gröön
           *[other] gröne
        }
    .cyan =
        { $gender ->
            [n] türkis
           *[other] türkise
        }
    .blue =
        { $gender ->
            [n] blau
           *[other] blaue
        }
    .purple =
        { $gender ->
            [n] vigelett
           *[other] vigelette
        }
    .pink = rosa
    .brown =
        { $gender ->
            [n] bruun
           *[other] bruune
        }
line-width =
    .thick =
        { $gender ->
            [n] dick
           *[other] dicke
        }
    .thin =
        { $gender ->
            [n] dünn
           *[other] dünne
        }
line-style =
    .dashed =
        { $gender ->
            [n] streekt
           *[other] streekte
        }
    .dotted =
        { $gender ->
            [n] püntelt
           *[other] püntelte
        }
# Plural noun phrases, which is what follows «mit» in `style-filled`. A plural
# adjective always takes `-e`, so these agree with nothing.
fill-style =
    .horizontal = waagrechte Lienen
    .vertical = pielrechte Lienen
    .diagonal = diagonale Lienen
    .backdiagonal = ümdreihte diagonale Lienen
    .dots = Pünkte
    .diamonds = Ruten
noun =
    .line = Lien
    .line-segment = Streek
    .ray = Straal
    .vector = Vekter
    .curve = Krumm
    .function = Funkschoon
    .parabola = Parabel
    .polyline = Lienentog
    .polygon = Polygon
    .triangle = Dreeck
    .rectangle = Rechteck
    .circle = Krink
    .region = Rebeed
    .point = Punkt
    .square = Quadraat
    .diamond = Ruut
    .cross = Krüüz
    .plus = Plus
# Low German keeps the side count in front of the noun, as a compound, so the
# whole of it is one head and there is no tail. The head noun is `-Eck`, which
# is neuter, so the adjective inside it is the bare stem — and `noun-gender`
# has to answer `n` for `regular-polygon`, or the adjectives the description
# puts around this phrase would take the `-e` the other two genders share.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regelmatig { $numSides }-Eck
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (which is
# `{ $numSides }-Eck`, n) or the head of a phrase the description never names:
# `border` (Rand, m), `fill` (Füllung, f), `text` (Text, m), `background`
# (Achtergrund, m).
#
# The `f` token is answered and never selected on, because masculine and
# feminine share a form. It is kept so that a later correction distinguishing
# them has the information it needs.
noun-gender =
    { $noun ->
        [line] f
        [line-segment] f
        [curve] f
        [function] f
        [parabola] f
        [diamond] f
        [fill] f
        [triangle] n
        [rectangle] n
        [region] n
        [square] n
        [cross] n
        [plus] n
        [polygon] n
        [regular-polygon] n
       *[other] m
    }

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
style-filled-word =
    { $gender ->
        [n] füllt
       *[other] füllte
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } mit { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } mit { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } mit { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «Rand» is masculine, so the border's adjectives agree with it rather than
# with the shape it surrounds. Low German has an indefinite article, «en», so
# the two `-article` branches really do differ from the two without.
style-border-clause =
    { $parts ->
        [with-article] mit en { $border } Rand
        [and] un { $border } Rand
        [and-article] un en { $border } Rand
       *[with] mit { $border } Rand
    }
style-fill =
    { $parts ->
        [pattern] { $color } Füllung mit { $pattern }
       *[plain] { $color } Füllung
    }
style-unfilled = nich füllt
style-text =
    { $parts ->
        [background] { $color } op en { $background } Achtergrund
       *[plain] { $color }
    }
style-background-none = keen

## Boolean words

boolean-true = wohr
boolean-false = falsch

## Answer buttons

answer-submit-label = Nakieken
answer-submit-label-no-correctness = Antwoort afschicken

## Sectional blocks

section-name =
    .activity = Aktivität
    .aside = Sietbemarken
    .cascade = Kaskaad
    .definition = Definitschoon
    .example = Bispill
    .exercise = Öövung
    .exercises = Öövungen
    .given-answer = Antwoort
    .note = Notiz
    .objectives = Zielen
    .paragraphs = Afsnitten
    .part = Deel
    .problem = Opgaav
    .problems = Opgaven
    .proof = Bewies
    .question = Fraag
    .section = Kapittel
    .solution = Lösung
    .task = Opdrag
    .theorem = Theorem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Henwies

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabell { $enumeration }
        [numbered-title] Tabell { $enumeration }{ ": " }
        [unnumbered-title] Tabell{ ": " }
       *[unnumbered] Tabell
    }
figure-name =
    { $parts ->
        [numbered] Figuur { $enumeration }
        [numbered-caption] Figuur { $enumeration }{ ": " }
        [unnumbered-caption] Figuur{ ": " }
       *[unnumbered] Figuur
    }

## Paginator controls

paginator-previous = Torüch
paginator-next = Wieder
paginator-page = Siet
paginator-page-status = { $pageLabel } { $currentPage } vun { $numPages }

## Piecewise functions

piecewise-condition-or = oder
piecewise-condition-if = wenn
piecewise-condition-otherwise = sünst

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Low German is not a language of instruction for secondary science
## anywhere; a pupil in northern Germany meets the German names and one in the
## Netherlands the Dutch ones, so there is no Low German table for a seed to
## reproduce.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Ungülltig cheemsch Symbool
chemistry-invalid-ionic-compound = Ungülltige ioonsche Verbinnen
