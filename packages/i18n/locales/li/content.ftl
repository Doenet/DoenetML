# Limburgish (Limburgs) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Veldeke spelling; see `chrome.ftl` for the note on «tj»,
# «dj» and the vowels.
#
# Limburgish inflects on the same axis Dutch does — *de*-words against
# *het*-words rather than masculine against feminine — so `$gender` here
# carries `c` (common, a de-word) and `n` (neuter, a het-word), exactly as
# `locales/nl` does, and every attributive adjective selects on it. Adjectives
# precede their noun, as in English.
#
# `$role` goes unused: Limburgish marks no case on an attributive adjective in
# these three positions.
#
# **This file is not `locales/nl` and must not be edited into one.** The two
# are close and were read side by side, which makes their agreement no evidence
# either is right. Where they part company they do so in the commonest words:
# «good» for «goed», «verkierd» for «onjuist», «pöntj» for «punt», «riej» for
# «rij», «blaadzie» for «pagina», «faeler» for «fout», «gevónje» for
# «gevonden».
#
# **The periodic table is left to fall back to English.** Secondary science in
# Limburg is taught in Dutch out of Dutch textbooks, so the table a Limburgish
# speaker meets is `locales/nl`'s. That is a fact about a school system rather
# than about the language.


## Style vocabulary

color =
    .black =
        { $gender ->
            [n] zwart
           *[c] zwarte
        }
    .white =
        { $gender ->
            [n] wit
           *[c] witte
        }
    .gray =
        { $gender ->
            [n] gries
           *[c] grieze
        }
    .red =
        { $gender ->
            [n] roed
           *[c] roej
        }
    .orange = oranje
    .yellow =
        { $gender ->
            [n] geel
           *[c] gele
        }
    .green =
        { $gender ->
            [n] greun
           *[c] greune
        }
    .cyan =
        { $gender ->
            [n] cyaan
           *[c] cyane
        }
    .blue =
        { $gender ->
            [n] blauw
           *[c] blauwe
        }
    .purple =
        { $gender ->
            [n] paars
           *[c] paarse
        }
    .pink = roze
    .brown =
        { $gender ->
            [n] broen
           *[c] broene
        }
line-width =
    .thick =
        { $gender ->
            [n] dik
           *[c] dikke
        }
    .thin =
        { $gender ->
            [n] dun
           *[c] dunne
        }
line-style =
    .dashed =
        { $gender ->
            [n] gestreep
           *[c] gestreepde
        }
    .dotted =
        { $gender ->
            [n] gestip
           *[c] gestipde
        }
fill-style =
    .horizontal = horizontale liene
    .vertical = verticale liene
    .diagonal = sjuine liene
    .backdiagonal = ómgekierd sjuine liene
    .dots = pöntje
    .diamonds = roete
noun =
    .line = lien
    .line-segment = lienstök
    .ray = straol
    .vector = vector
    .curve = kromme
    .function = functie
    .slope-field = hellingsveld
    .vector-field = vectorveld
    .parabola = parabool
    .polyline = polylien
    .polygon = veelhook
    .triangle = driehook
    .rectangle = rechhook
    .circle = circel
    .region = gebeed
    .point = pöntj
    .square = vierkantj
    .diamond = roet
    .cross = krüts
    .plus = plus
# Limburgish folds the side count into the head, as Dutch and English do, so
# there is no tail. «-hook» is a de-word, so it takes the `-e` form.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regelmaotige { $numSides }-hook
    }
# `$noun` can also be `regular-polygon` (veelhook, c) or the head of a phrase
# the description never names: `border` (rand, c), `fill` (völling, c), `text`
# (teks, c), `background` (achtergróndj, c).
noun-gender =
    { $noun ->
        [line-segment] n
        [slope-field] n
        [vector-field] n
        [region] n
        [point] n
        [square] n
        [cross] n
        [plus] n
       *[other] c
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
        [n] gevöld
       *[c] gevölde
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
# «rand» is a de-word, so the border's adjectives take the `-e` form and the
# indefinite article is «ne» — a word of its own, which is why the distinction
# English draws between the `-article` branches and the others survives here.
style-border-clause =
    { $parts ->
        [with-article] mit ne { $border } rand
        [and] en { $border } rand
        [and-article] en ne { $border } rand
       *[with] mit { $border } rand
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = neet gevöld
style-text =
    { $parts ->
        [background] { $color } op ne { $background } achtergróndj
       *[plain] { $color }
    }
style-background-none = gein

## Boolean words

boolean-true = waor
boolean-false = vals

## Answer buttons

answer-submit-label = Kiek 't nao
answer-submit-label-no-correctness = Versjik 't antwoord

## Sectional blocks

section-name =
    .activity = Activiteit
    .aside = Kantnoteersing
    .cascade = Cascade
    .definition = Definisie
    .example = Veurbeeld
    .exercise = Oefening
    .exercises = Oefeninge
    .given-answer = Antwoord
    .note = Noteersing
    .objectives = Doele
    .paragraphs = Alinea's
    .part = Deil
    .problem = Opgaaf
    .problems = Opgave
    .proof = Bewies
    .question = Vraog
    .section = Sectie
    .solution = Oplossing
    .task = Taak
    .theorem = Stelling
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Tip

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabel { $enumeration }
        [numbered-title] Tabel { $enumeration }{ ": " }
        [unnumbered-title] Tabel{ ": " }
       *[unnumbered] Tabel
    }
figure-name =
    { $parts ->
        [numbered] Figuur { $enumeration }
        [numbered-caption] Figuur { $enumeration }{ ": " }
        [unnumbered-caption] Figuur{ ": " }
       *[unnumbered] Figuur
    }

## Paginator controls

paginator-previous = Veurige
paginator-next = Volgende
paginator-page = Blaadzie
paginator-page-status = { $pageLabel } { $currentPage } van { $numPages }

## Piecewise functions

piecewise-condition-or = of
piecewise-condition-if = es
piecewise-condition-otherwise = angesj

## Chemistry
##
## The 118 element names and the 12 anion names fall back to English. Secondary
## science in Limburg is taught in Dutch out of Dutch textbooks, so the
## periodic table a Limburgish speaker meets is `locales/nl`'s. That is a fact
## about a school system rather than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Chemisch symbool deug neet
chemistry-invalid-ionic-compound = Ionische verbinding deug neet

## Inputs embedded in math

# Read aloud inside the mathematics and never shown on screen, so it stays to
# one word.
math-embedded-input-blank = leeg
math-embedded-input-blank-ordinal = leeg { $ordinal } van { $total }
