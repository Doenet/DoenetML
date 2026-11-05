# Meänkieli (Tornedalen Finnish) content catalog: the prose the core computes
# into the document. Selected by `documentLocale` — the language the activity
# was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Latin alphabet, in Meänkieli's own orthography. Meänkieli is
# one of Sweden's five recognized national minority languages and is written to
# its own norm, not as a dialect spelling of Finnish, so this is a catalog of
# its own beside `locales/fi` rather than a variant of it. Where the two differ
# in the words this file actually contains:
#
#   -inen → -nen in the colour adjectives   punanen, valkonen, keltanen,
#                                           vaaleanpunanen (fi: punainen …),
#                                           and their adessives punasella,
#                                           valkosella, keltasella
#   eA → iA                                 vihriä/vihriällä, ruskia/ruskialla
#                                           (fi: vihreä, ruskea)
#   no d                                    yhiste, säe (fi: yhdiste, säde)
#   3sg of «olla»                          oon (fi: on)
#
# Meänkieli has no grammatical gender, so `$gender` goes unused. `$role` does
# not: an attributive adjective agrees with its noun in **case**, so the
# adjective changes shape with the position the phrase goes into — the same
# four positions `locales/fi` documents.
#
#   standalone          nominative: «musta»
#   border-clause       adessive, agreeing with «reuna»: «mustalla»
#   background-clause   adessive, agreeing with «tausta»: «mustalla»
#   text-clause         nominative, agreeing with «teksti»: «musta»
#
# **A compound cannot be welded to a placeable**, so a fill pattern is named in
# a relative clause — «jossa on vinoneliöitä» — whose verb governs the
# partitive plural, which is the form `fill-style` supplies.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] mustalla
            [background-clause] mustalla
           *[standalone] musta
        }
    .white =
        { $role ->
            [border-clause] valkosella
            [background-clause] valkosella
           *[standalone] valkonen
        }
    .gray =
        { $role ->
            [border-clause] harmaalla
            [background-clause] harmaalla
           *[standalone] harmaa
        }
    .red =
        { $role ->
            [border-clause] punasella
            [background-clause] punasella
           *[standalone] punanen
        }
    .orange =
        { $role ->
            [border-clause] oranssilla
            [background-clause] oranssilla
           *[standalone] oranssi
        }
    .yellow =
        { $role ->
            [border-clause] keltasella
            [background-clause] keltasella
           *[standalone] keltanen
        }
    .green =
        { $role ->
            [border-clause] vihriällä
            [background-clause] vihriällä
           *[standalone] vihriä
        }
    .cyan =
        { $role ->
            [border-clause] syaanilla
            [background-clause] syaanilla
           *[standalone] syaani
        }
    .blue =
        { $role ->
            [border-clause] sinisellä
            [background-clause] sinisellä
           *[standalone] sininen
        }
    .purple =
        { $role ->
            [border-clause] violetilla
            [background-clause] violetilla
           *[standalone] violetti
        }
    .pink =
        { $role ->
            [border-clause] vaaleanpunasella
            [background-clause] vaaleanpunasella
           *[standalone] vaaleanpunanen
        }
    .brown =
        { $role ->
            [border-clause] ruskialla
            [background-clause] ruskialla
           *[standalone] ruskia
        }
line-width =
    .thick =
        { $role ->
            [border-clause] paksulla
            [background-clause] paksulla
           *[standalone] paksu
        }
    .thin =
        { $role ->
            [border-clause] ohuella
            [background-clause] ohuella
           *[standalone] ohut
        }
line-style =
    .dashed =
        { $role ->
            [border-clause] katkoviivaisella
            [background-clause] katkoviivaisella
           *[standalone] katkoviivainen
        }
    .dotted =
        { $role ->
            [border-clause] pisteviivaisella
            [background-clause] pisteviivaisella
           *[standalone] pisteviivainen
        }
# Partitive plural, which is what «jossa on» governs — see the note at the top
# of this file.
fill-style =
    .horizontal = vaakaviivoja
    .vertical = pystyviivoja
    .diagonal = vinoviivoja
    .backdiagonal = vastakkaisia vinoviivoja
    .dots = pisteitä
    .diamonds = vinoneliöitä
noun =
    .line = suora
    .line-segment = jana
    .ray = puolisuora
    .vector = vektori
    .curve = käyrä
    .function = funktio
    .slope-field = suuntakenttä
    .vector-field = vektorikenttä
    .parabola = paraabeli
    .polyline = murtoviiva
    .polygon = monikulmio
    .triangle = kolmio
    .rectangle = suorakulmio
    .circle = ympyrä
    .region = alue
    .point = piste
    .square = neliö
    .diamond = vinoneliö
    .cross = risti
    .plus = plus
# «5-kulmio» — Meänkieli writes a numeral-headed compound with a hyphen, as
# Finnish does, and the word after it is the same whatever the numeral, so the
# whole phrase is a head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] säännöllinen { $numSides }-kulmio
    }
# Meänkieli has no grammatical gender, so this answer goes unused. It is here
# because the source catalog defines the key and a missing key would fall back
# to English rather than to nothing.
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
style-filled-word = täytetty
style-filled =
    { $parts ->
        [pattern] { $filled } { $color }, jossa oon { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun }, jossa oon { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail }, jossa oon { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «reuna» takes the adessive, which the `border-clause` branch of every
# adjective agrees with. Meänkieli has no article, so the `-article` branches
# read the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } reunalla
        [and] ja { $border } reunalla
        [and-article] ja { $border } reunalla
       *[with] { $border } reunalla
    }
style-fill =
    { $parts ->
        [pattern] { $color } täyttö, jossa oon { $pattern }
       *[plain] { $color }
    }
style-unfilled = täyttämätön
# «tausta» takes the adessive too, so the colour in front of it agrees with it
# the same way the border's does.
style-text =
    { $parts ->
        [background] { $color } { $background } taustalla
       *[plain] { $color }
    }
style-background-none = ei mitään

## Boolean words

boolean-true = tosi
boolean-false = epätosi

## Answer buttons

answer-submit-label = Tarkista
answer-submit-label-no-correctness = Lähetä vastaus

## Sectional blocks

section-name =
    .activity = Aktiviteetti
    .aside = Sivuhuomautus
    .cascade = Kaskadi
    .definition = Määritelmä
    .example = Esimerkki
    .exercise = Harjoitus
    .exercises = Harjoitukset
    .given-answer = Vastaus
    .note = Huomautus
    .objectives = Tavoitteet
    .paragraphs = Kappaleet
    .part = Osa
    .problem = Tehtävä
    .problems = Tehtävät
    .proof = Todistus
    .question = Kysymys
    .section = Luku
    .solution = Ratkaisu
    .task = Tehtävänanto
    .theorem = Lause
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Vihje

## Tables and figures

table-name =
    { $parts ->
        [numbered] Taulukko { $enumeration }
        [numbered-title] Taulukko { $enumeration }{ ": " }
        [unnumbered-title] Taulukko{ ": " }
       *[unnumbered] Taulukko
    }
figure-name =
    { $parts ->
        [numbered] Kuva { $enumeration }
        [numbered-caption] Kuva { $enumeration }{ ": " }
        [unnumbered-caption] Kuva{ ": " }
       *[unnumbered] Kuva
    }

## Paginator controls

paginator-previous = Eellinen
paginator-next = Seuraava
paginator-page = Sivu
# A slash rather than «-sta/-stä»: the elative harmonizes with how the numeral
# is read, which the catalog cannot see.
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = tai
piecewise-condition-if = jos
piecewise-condition-otherwise = muutoin

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Sweden is taught in
## Swedish, so the element names a Meänkieli-speaking pupil meets are the
## Swedish ones — the school-system case this batch shares throughout, and the
## one place this catalog does not simply follow `locales/fi`, which supplies
## the Finnish names because Finland teaches chemistry in Finnish.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Virheellinen kemiallinen merkki
chemistry-invalid-ionic-compound = Virheellinen ioniyhiste
