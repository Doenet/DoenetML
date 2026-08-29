# Veps content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** alphabet, with ä ö ü, č š ž and the apostrophe that
# marks palatalization («kel'», «pol'», «nol'»). Veps is a language of the
# Russian Federation that is not written in Cyrillic: its modern orthography
# has been Latin since 1989, it is what the Republic of Karelia's Veps
# schoolbooks, the newspaper «Kodima» and the Veps dictionaries use, and it is
# what CLDR fills a bare `vep` in as. The 1930s Latin alphabet and the
# short-lived 1990s Cyrillic experiment are both history; nothing here should
# be transliterated into Cyrillic.
#
# Veps is Finnic but it is **not** Karelian. It is a separate ISO 639-3
# language with no macrolanguage code over it, so `locales/krl`, `locales/olo`
# and this file are three catalogs for three languages rather than three
# spellings of one. Veps has lost the final vowel of most stems — «must»,
# «vauged», «sanged» where Finnish has «musta», «valkoinen», «paksu» — and a
# Karelian file respelled would be wrong in nearly every word.
#
# Veps has no grammatical gender and does not inflect an attributive adjective
# for it, so `$gender` goes unused — the answer every Uralic catalog in this
# batch gives. `$role` is used: a Veps attributive adjective agrees with its
# noun in **case**, so the adjective changes shape with the position the phrase
# goes into.
#
#   standalone          nominative: «must»
#   border-clause       adessive-allative, agreeing with «röun»: «mustal»
#   background-clause   adessive-allative, agreeing with «fon»: «mustal»
#   text-clause         nominative, agreeing with «tekst»: «must»
#
# Veps, like Livvi and unlike Karelian Proper, has a single `-l` where Finnish
# writes `-lla/-llä`.
#
# **A compound cannot be welded to a placeable.** Veps would name a fill
# pattern as one word and the catalog has only the argument, so the pattern is
# named in a relative clause instead — «kudambas oma vinonellikod» — whose verb
# governs the partitive plural, which is the form `fill-style` supplies.
#
# **`element-name` and `element-anion-name` are deliberately omitted**, so the
# 118 element names and the anion names fall back to English. Secondary
# chemistry in the Veps area — Prionežje, and the Leningrad and Vologda oblast
# villages — is taught in Russian, from Russian textbooks: a Veps reader's own
# chemistry vocabulary is the Russian one, and neither English nor 118 invented
# Veps coinages would match the book in front of them. The English fallback is
# at least the international Latin-based set the periodic table itself is
# written with. Every other key in `locales/en/content.ftl` is present here.
#
# `piecewise-condition-if` is placeable: Veps «ku» opens its clause and the
# mathematics follows it, exactly as English «if» does, so this catalog has no
# version of the limit `locales/kv` and `locales/chm` record.
#
# **The vocabulary least certain in this seed is the technical one.** Veps has
# no settled words for a good deal of mathematics; where it has not fixed one,
# this catalog writes the Russian-mediated loan the Veps press actually uses —
# «funkcii», «vektor», «parabol», «koordinat» — rather than inventing a native
# compound. The colour and fill-pattern words are the next least certain. A
# reviewer should expect to change those before anything else.


# **The `noun` table splits "line" between two stems, and the header did not
# say so.** `.line` is «suor» and every `<line>`, `<ray>` and `<angle>`
# diagnostic uses it, but `.line-segment` is «viivpala» and `.polyline` is
# «katkaidud viiv», built on «viiv». There is a defensible reading — «suor» a
# straight line, «viiv» a drawn stroke, which is what `line-color` and
# `line-style` mean by it — but the `noun` table is the geometric list, so a
# segment and a polyline arguably want «suorpala» and «katkaidud suor». The
# seed could not settle it and the entries stand; this note is the record.
#
# «homaiduz» is `<note>` and is also the accessibility heading, where this
# catalog's own «varutez» is what every other panel calls the same thing; and
# `editor-response-answer-id` writes «Vastusen tunduz», where «tunduz» is the
# word `diagnostics.ftl` uses throughout for an XML tag. Both are left as
# they stand.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] mustal
            [background-clause] mustal
           *[standalone] must
        }
    .white =
        { $role ->
            [border-clause] vaugedal
            [background-clause] vaugedal
           *[standalone] vauged
        }
    .gray =
        { $role ->
            [border-clause] hahkal
            [background-clause] hahkal
           *[standalone] hahk
        }
    .red =
        { $role ->
            [border-clause] ruskedal
            [background-clause] ruskedal
           *[standalone] rusked
        }
    .orange =
        { $role ->
            [border-clause] oranžal
            [background-clause] oranžal
           *[standalone] oranž
        }
    .yellow =
        { $role ->
            [border-clause] keltaižel
            [background-clause] keltaižel
           *[standalone] keltaine
        }
    .green =
        { $role ->
            [border-clause] vihandal
            [background-clause] vihandal
           *[standalone] vihand
        }
    .cyan =
        { $role ->
            [border-clause] cianal
            [background-clause] cianal
           *[standalone] cian
        }
    .blue =
        { $role ->
            [border-clause] sinižel
            [background-clause] sinižel
           *[standalone] sinine
        }
    .purple =
        { $role ->
            [border-clause] violetal
            [background-clause] violetal
           *[standalone] violet
        }
    .pink =
        { $role ->
            [border-clause] ružoval
            [background-clause] ružoval
           *[standalone] ružov
        }
    .brown =
        { $role ->
            [border-clause] koričneval
            [background-clause] koričneval
           *[standalone] koričnev
        }
line-width =
    .thick =
        { $role ->
            [border-clause] sangedal
            [background-clause] sangedal
           *[standalone] sanged
        }
    .thin =
        { $role ->
            [border-clause] hoikal
            [background-clause] hoikal
           *[standalone] hoik
        }
line-style =
    .dashed =
        { $role ->
            [border-clause] katkaidudel
            [background-clause] katkaidudel
           *[standalone] katkaidud
        }
    .dotted =
        { $role ->
            [border-clause] točkaližel
            [background-clause] točkaližel
           *[standalone] točkaline
        }
# Partitive plural, which is what «kudambas oma» governs — see the note at the
# top of this file.
fill-style =
    .horizontal = poikviivoid
    .vertical = pystviivoid
    .diagonal = kaldviivoid
    .backdiagonal = vastkaldviivoid
    .dots = točkid
    .diamonds = vinonellikoid
noun =
    .line = suor
    .line-segment = viivpala
    .ray = pol'suor
    .vector = vektor
    .curve = kaar
    .function = funkcii
    .slope-field = kaldusen pöud
    .vector-field = vektoran pöud
    .parabola = parabol
    .polyline = katkaidud viiv
    .polygon = mongokulm
    .triangle = koumkulm
    .rectangle = kohtkulmik
    .circle = kruug
    .region = alovuz
    .point = punkt
    .square = nellikk
    .diamond = vinonellikk
    .cross = rist
    .plus = plus
# «5-kulm» — a numeral-headed compound is written with a hyphen and the word
# after it is the same whatever the numeral, so the whole phrase is a head and
# there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] pravil'noi { $numSides }-kulm
    }
# Veps has no grammatical gender, so this answer goes unused. It is here
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
style-filled-word = täuttud
style-filled =
    { $parts ->
        [pattern] { $filled } { $color }, kudambas oma { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun }, kudambas oma { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail }, kudambas oma { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «röun» takes the adessive-allative, which the `border-clause` branch of every
# adjective agrees with. Veps has no article, so the `-article` branches read
# the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } röunal
        [and] da { $border } röunal
        [and-article] da { $border } röunal
       *[with] { $border } röunal
    }
style-fill =
    { $parts ->
        [pattern] { $color } täuthuz, kudambas oma { $pattern }
       *[plain] { $color }
    }
style-unfilled = täuttamatoi
# «fon» takes the adessive-allative too, so the colour in front of it agrees
# with it the same way the border's does.
style-text =
    { $parts ->
        [background] { $color } { $background } fonal
       *[plain] { $color }
    }
style-background-none = ei nimidä


## Boolean words

boolean-true = tozi
boolean-false = ei-tozi


## Answer buttons

answer-submit-label = Tarkišta
answer-submit-label-no-correctness = Oigenda vastuz


## Sectional blocks

section-name =
    .activity = Toimind
    .aside = Rindhomaiduz
    .cascade = Kaskad
    .definition = Märituz
    .example = Ozutez
    .exercise = Harjoituz
    .exercises = Harjoitused
    .given-answer = Vastuz
    .note = Homaiduz
    .objectives = Tarkuded
    .paragraphs = Abzacad
    .part = Oza
    .problem = Tehtand
    .problems = Tehtandad
    .proof = Todištuz
    .question = Küzund
    .section = Pala
    .solution = Ratkaiduz
    .task = Tehtandan anduz
    .theorem = Teorem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Nevond


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tablic { $enumeration }
        [numbered-title] Tablic { $enumeration }{ ": " }
        [unnumbered-title] Tablic{ ": " }
       *[unnumbered] Tablic
    }
figure-name =
    { $parts ->
        [numbered] Kuva { $enumeration }
        [numbered-caption] Kuva { $enumeration }{ ": " }
        [unnumbered-caption] Kuva{ ": " }
       *[unnumbered] Kuva
    }


## Paginator controls

paginator-previous = Edeline
paginator-next = Jäl'ghine
paginator-page = Lehtpol'
# A slash rather than an elative ending: the ending harmonizes with how the
# numeral is read aloud, which the catalog cannot see.
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = vai
piecewise-condition-if = ku
piecewise-condition-otherwise = toižin


## Chemistry
##
## `element-name` and `element-anion-name` are omitted on purpose — see the
## note at the top of this file. The three keys below are the panel's own
## prose rather than a chemical vocabulary, so they are translated.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Vär kimine znam
chemistry-invalid-ionic-compound = Vär ionoiden ühthenzoituz
