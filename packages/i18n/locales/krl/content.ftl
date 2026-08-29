# Karelian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** alphabet, with ä ö ü and č š ž. Karelian is a
# language of the Russian Federation that is not written in Cyrillic: the
# Republic of Karelia's official orthography for it has been Latin since 1989,
# and that is what CLDR fills a bare `krl` in as. Nothing here should be
# transliterated into Cyrillic.
#
# **`krl` and `olo` are two languages, not two spellings of one.** ISO 639-3
# gives Karelian `krl` and Livvi (Olonets Karelian) `olo` separately, and puts
# no macrolanguage code over the pair, so a Livvi reader arriving under `olo`
# reaches `locales/olo` and never this file, and a `krl` reader never reaches
# that one. Neither catalog can serve the other's reader and neither pretends
# to. What is written here is the **Karelian Proper (Viena / Northern)**
# literary norm: «musta», «valkie», «vihrie», «pisteh», the adessive in
# `-lla/-llä`. Livvi writes «musta», «valgei», «vihandu», «pistoi» and an
# adessive-allative in a bare `-l`. A reader of either norm can very largely
# read the other, and that is exactly why the two files must not be copies of
# each other — a copy would put one norm's endings in front of the other's
# reader while claiming to be their own.
#
# Karelian has no grammatical gender and does not inflect an attributive
# adjective for it, so `$gender` goes unused — the answer every Uralic catalog
# in this batch gives. `$role` is used: like Finnish, a Karelian attributive
# adjective agrees with its noun in **case**, so the adjective changes shape
# with the position the phrase goes into.
#
#   standalone          nominative: «musta»
#   border-clause       adessive, agreeing with «reuna»: «mustalla»
#   background-clause   adessive, agreeing with «tausta»: «mustalla»
#   text-clause         nominative, agreeing with «teksti»: «musta»
#
# Two pairs coincide, and that is a fact about which cases these four positions
# happen to govern rather than about Karelian.
#
# **A compound cannot be welded to a placeable.** Karelian would name a fill
# pattern as one word and the catalog has only the argument, so the pattern is
# named in a relative clause instead — «kušša on vinonelivöitä» — whose verb
# governs the partitive plural, which is the form `fill-style` supplies.
#
# **`element-name` and `element-anion-name` are deliberately omitted**, so the
# 118 element names and the anion names fall back to English. Secondary
# chemistry in Karelia is taught in Russian, from Russian textbooks: a Karelian
# reader's own chemistry vocabulary is the Russian one, and neither English nor
# 118 invented Karelian coinages would match the book in front of them. The
# English fallback is at least the international Latin-based set the periodic
# table itself is written with. Every other key in `locales/en/content.ftl` is
# present here.
#
# `piecewise-condition-if` is placeable: Karelian «kun» opens its clause and
# the mathematics follows it, exactly as English «if» does, so this catalog has
# no version of the limit `locales/kv` and `locales/chm` record.


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
            [border-clause] valkiella
            [background-clause] valkiella
           *[standalone] valkie
        }
    .gray =
        { $role ->
            [border-clause] harmualla
            [background-clause] harmualla
           *[standalone] harmua
        }
    .red =
        { $role ->
            [border-clause] ruskiella
            [background-clause] ruskiella
           *[standalone] ruskie
        }
    .orange =
        { $role ->
            [border-clause] oranššilla
            [background-clause] oranššilla
           *[standalone] oranšši
        }
    .yellow =
        { $role ->
            [border-clause] keltasella
            [background-clause] keltasella
           *[standalone] keltani
        }
    .green =
        { $role ->
            [border-clause] vihriellä
            [background-clause] vihriellä
           *[standalone] vihrie
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
           *[standalone] sinini
        }
    .purple =
        { $role ->
            [border-clause] violetilla
            [background-clause] violetilla
           *[standalone] violetti
        }
    .pink =
        { $role ->
            [border-clause] ruusunkarvasella
            [background-clause] ruusunkarvasella
           *[standalone] ruusunkarvani
        }
    .brown =
        { $role ->
            [border-clause] pruunilla
            [background-clause] pruunilla
           *[standalone] pruuni
        }
line-width =
    .thick =
        { $role ->
            [border-clause] pakšulla
            [background-clause] pakšulla
           *[standalone] pakšu
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
            [border-clause] katkoviivasella
            [background-clause] katkoviivasella
           *[standalone] katkoviivani
        }
    .dotted =
        { $role ->
            [border-clause] pisteviivasella
            [background-clause] pisteviivasella
           *[standalone] pisteviivani
        }
# Partitive plural, which is what «kušša on» governs — see the note at the top
# of this file.
fill-style =
    .horizontal = vuakaviivoja
    .vertical = pistyviivoja
    .diagonal = vinoviivoja
    .backdiagonal = vaštakkaisie vinoviivoja
    .dots = pisteitä
    .diamonds = vinonelivöitä
noun =
    .line = suora
    .line-segment = jana
    .ray = puolisuora
    .vector = vektori
    .curve = kuari
    .function = funktijo
    .slope-field = kulmakerroinkenttä
    .vector-field = vektorikenttä
    .parabola = paraboli
    .polyline = murtoviiva
    .polygon = monikulmijo
    .triangle = kolmijo
    .rectangle = suorakulmijo
    .circle = ympyrä
    .region = alovveh
    .point = pisteh
    .square = nelivö
    .diamond = vinonelivö
    .cross = risti
    .plus = plus
# «5-kulmijo» — a numeral-headed compound is written with a hyphen and the word
# after it is the same whatever the numeral, so the whole phrase is a head and
# there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] šiäntöllini { $numSides }-kulmijo
    }
# Karelian has no grammatical gender, so this answer goes unused. It is here
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
        [pattern] { $filled } { $color }, kušša on { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun }, kušša on { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail }, kušša on { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «reuna» takes the adessive, which the `border-clause` branch of every
# adjective agrees with. Karelian has no article, so the `-article` branches
# read the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } reunalla
        [and] ta { $border } reunalla
        [and-article] ta { $border } reunalla
       *[with] { $border } reunalla
    }
style-fill =
    { $parts ->
        [pattern] { $color } täyttö, kušša on { $pattern }
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
style-background-none = ei mitänä


## Boolean words

boolean-true = tozi
boolean-false = epätozi


## Answer buttons

answer-submit-label = Tarkista
answer-submit-label-no-correctness = Työnnä vastaus


## Sectional blocks

section-name =
    .activity = Toiminta
    .aside = Sivuhuomavo
    .cascade = Kaskadi
    .definition = Miäritelmä
    .example = Ezimerkki
    .exercise = Harjotus
    .exercises = Harjotukšet
    .given-answer = Vastaus
    .note = Huomavo
    .objectives = Tavotteet
    .paragraphs = Kappalehet
    .part = Oza
    .problem = Tehtävä
    .problems = Tehtävät
    .proof = Toistus
    .question = Kyzymys
    .section = Luku
    .solution = Ratkasu
    .task = Tehtävänanto
    .theorem = Lauzeh
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Vihjeh


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

paginator-previous = Eelline
paginator-next = Seuruaja
paginator-page = Sivu
# A slash rather than an elative ending: the ending harmonizes with how the
# numeral is read aloud, which the catalog cannot see.
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = tai
piecewise-condition-if = kun
piecewise-condition-otherwise = muitein


## Chemistry
##
## `element-name` and `element-anion-name` are omitted on purpose — see the
## note at the top of this file. The three keys below are the panel's own
## prose rather than a chemical vocabulary, so they are translated.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Viärä kemiallini merkki
chemistry-invalid-ionic-compound = Viärä ioniyhistelmä
