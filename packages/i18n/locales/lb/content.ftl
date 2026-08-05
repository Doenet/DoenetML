# Luxembourgish content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Luxembourgish has three genders and adjectives precede their noun, so every
# describing word selects on `$gender` and the composition messages keep the
# English order. The attributive endings in a phrase with no article are
# masculine `-e(n)`, feminine bare stem, neuter `-t`: «e décke Krees», «eng
# déck Linn», «en déckt Dräieck».
#
# Nothing selects on `$role`, and the reason is the **Eifeler Regel** rather
# than a lack of case. The masculine ending is underlyingly `-en`, and the
# dative a preposition governs would be `-en` too — but the `n` is dropped
# before any consonant except `d`, `t`, `z`, `n` and `h`, and at the end of a
# phrase. So «mat engem décke Rand» and «e décke Rand» are the same string, and
# a `$role` fork would write it twice.
#
# The rule is also why the `n` is dropped rather than kept. Whether it survives
# is decided by the *following* word, and in `style-stroke` the following word
# is `{ $color }` or nothing at all — a value this catalog never sees. That is
# the constraint the README calls "an affix cannot be welded to a placeable",
# met here in a third shape: not a case ending and not an article, but a
# sandhi rule. The dropped form is right before every noun in the table below
# and right phrase-finally, which is every position these words reach.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] schwaarz
            [n] schwaarzt
           *[m] schwaarze
        }
    .white =
        { $gender ->
            [f] wäiss
            [n] wäisst
           *[m] wäisse
        }
    .gray =
        { $gender ->
            [f] gro
            [n] grot
           *[m] groe
        }
    .red =
        { $gender ->
            [f] rout
            [n] rout
           *[m] route
        }
    .orange = orange
    .yellow =
        { $gender ->
            [f] giel
            [n] gielt
           *[m] giele
        }
    .green =
        { $gender ->
            [f] gréng
            [n] gréngt
           *[m] grénge
        }
    .cyan =
        { $gender ->
            [f] türkis
            [n] türkist
           *[m] türkise
        }
    .blue =
        { $gender ->
            [f] blo
            [n] blot
           *[m] bloe
        }
    .purple = lila
    .pink = rosa
    .brown =
        { $gender ->
            [f] brong
            [n] brongt
           *[m] bronge
        }

line-width =
    .thick =
        { $gender ->
            [f] déck
            [n] déckt
           *[m] décke
        }
    .thin =
        { $gender ->
            [f] dënn
            [n] dënnt
           *[m] dënne
        }

# A participle used as an adjective takes the same endings, except that a stem
# already ending in `t` has nothing to add for the neuter.
line-style =
    .dashed =
        { $gender ->
            [f] gestrichelt
            [n] gestrichelt
           *[m] gestrichelte
        }
    .dotted =
        { $gender ->
            [f] gepunkt
            [n] gepunkt
           *[m] gepunkte
        }

# Plural noun phrases, which is what follows «mat» in `style-filled`. A plural
# adjective is the bare stem, so these agree with nothing.
fill-style =
    .horizontal = horizontal Linnen
    .vertical = vertikal Linnen
    .diagonal = diagonal Linnen
    .backdiagonal = ëmgedréint diagonal Linnen
    .dots = Punkten
    .diamonds = Rauten

noun =
    .line = Linn
    .line-segment = Streck
    .ray = Strahl
    .vector = Vektor
    .curve = Kurv
    .function = Funktioun
    .parabola = Parabel
    .polyline = Linnenzuch
    .polygon = Polygon
    .triangle = Dräieck
    .rectangle = Rechteck
    .circle = Krees
    .region = Beräich
    .point = Punkt
    .square = Quadrat
    .diamond = Raut
    .cross = Kräiz
    .plus = Plus

# Luxembourgish keeps the side count in front of the noun, as a compound, so
# the whole of it is one head and there is no tail. The head noun is `-Eck`,
# which is neuter, so the adjective inside it takes the neuter `-t` — and
# `noun-gender` has to answer `n` for `regular-polygon`, or the adjectives the
# description puts around this phrase would come out masculine.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regelméissegt { $numSides }-Eck
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (which is
# `{ $numSides }-Eck`, n) or the head of a phrase the description never names:
# `border` (Rand, m), `fill` (Fëllung, f), `text` (Text, m), `background`
# (Hannergrond, m).
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
        [f] gefëllt
        [n] gefëllt
       *[m] gefëllte
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } mat { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } mat { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } mat { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «Rand» is masculine, so the border's adjectives agree with it rather than
# with the shape it surrounds. Luxembourgish has an indefinite article, «e»,
# so the two `-article` branches really do differ from the two without.
style-border-clause =
    { $parts ->
        [with-article] mat engem { $border } Rand
        [and] an { $border } Rand
        [and-article] an engem { $border } Rand
       *[with] mat { $border } Rand
    }

style-fill =
    { $parts ->
        [pattern] { $color } Fëllung mat { $pattern }
       *[plain] { $color } Fëllung
    }

style-unfilled = net gefëllt

style-text =
    { $parts ->
        [background] { $color } op engem { $background } Hannergrond
       *[plain] { $color }
    }

style-background-none = keen


## Boolean words

boolean-true = wouer
boolean-false = falsch


## Answer buttons

answer-submit-label = Iwwerpréifen
answer-submit-label-no-correctness = Äntwert schécken


## Sectional blocks

section-name =
    .activity = Aktivitéit
    .aside = Nieweberäich
    .cascade = Kaskad
    .definition = Definitioun
    .example = Beispill
    .exercise = Übung
    .exercises = Übungen
    .given-answer = Äntwert
    .note = Notiz
    .objectives = Ziler
    .paragraphs = Abschnitter
    .part = Deel
    .problem = Aufgab
    .problems = Aufgaben
    .proof = Beweis
    .question = Fro
    .section = Kapitel
    .solution = Léisung
    .task = Aufgab
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

hint-title = Hiweis


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
        [numbered] Figur { $enumeration }
        [numbered-caption] Figur { $enumeration }{ ": " }
        [unnumbered-caption] Figur{ ": " }
       *[unnumbered] Figur
    }


## Paginator controls

paginator-previous = Zréck
paginator-next = Weider
paginator-page = Säit

paginator-page-status = { $pageLabel } { $currentPage } vun { $numPages }


## Piecewise functions

piecewise-condition-or = oder
piecewise-condition-if = wann
piecewise-condition-otherwise = soss


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Secondary science in Luxembourg is taught in German and French, and
## the chemical vocabulary a pupil meets is one of those two rather than a
## Luxembourgish table — so there is nothing settled here for a seed to
## reproduce.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Ongëltegt chemescht Symbol
chemistry-invalid-ionic-compound = Ongëlteg ionesch Verbindung
