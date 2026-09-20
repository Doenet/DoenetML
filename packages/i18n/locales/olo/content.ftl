# Livvi-Karelian content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** alphabet, with ä ö ü and č š ž. Livvi is a language
# of the Russian Federation that is not written in Cyrillic: the Republic of
# Karelia's official orthography for it has been Latin since 1989, and it is
# what the Republic's own newspapers, schoolbooks and dictionaries use.
# Nothing here should be transliterated into Cyrillic.
#
# **`olo` and `krl` are two languages, not two spellings of one.** ISO 639-3
# gives Livvi (Olonets Karelian) `olo` and Karelian `krl` separately, and puts
# no macrolanguage code over the pair, so a Karelian Proper reader arriving
# under `krl` reaches `locales/krl` and never this file, and an `olo` reader
# never reaches that one. Neither catalog can serve the other's reader and
# neither pretends to. What is written here is the **Livvi** norm the Karelian
# Republic publishes in: «musta», «valgei», «vihandu», «pisto», «da» for "and",
# the merged adessive-allative in a bare `-l`, and plain `s` where the Viena
# norm of `locales/krl` writes `š` («musta» / «musta», but «valgei» against
# «valkie» and «vihandu» against «vihrie»). A reader of either norm can very
# largely read the other, and that is exactly why the two files must not be
# copies of each other — a copy would put one norm's endings in front of the
# other's reader while claiming to be their own.
#
# Two spellings a review pass could not settle, left as they stand rather than
# replaced by a guess. «kiinolizien» in `diagnostics.ftl`'s message about
# dependent variables and «kiinolližus» in its two circular-dependency
# messages are the same stem written with `z` and with `lž`; and a constant is
# «vakioluvu» and «vakiototevusarvo» in two messages and «vakivo» in two more,
# on two different stems. A reviewer should pick one of each.
#
# Livvi has no grammatical gender and does not inflect an attributive adjective
# for it, so `$gender` goes unused — the answer every Uralic catalog in this
# batch gives. `$role` is used: a Livvi attributive adjective agrees with its
# noun in **case**, so the adjective changes shape with the position the phrase
# goes into.
#
#   standalone          nominative: «musta»
#   border-clause       adessive-allative, agreeing with «reunu»: «mustal»
#   background-clause   adessive-allative, agreeing with «tausta»: «mustal»
#   text-clause         nominative, agreeing with «tekstu»: «musta»
#
# Livvi has lost the final vowel of the Finnish `-lla/-llä`, so where
# `locales/krl` writes «mustalla» this catalog writes «mustal». That single
# ending is the clearest place the two norms part company, and copying either
# file onto the other would get it wrong in every colour.
#
# **A compound cannot be welded to a placeable.** Livvi would name a fill
# pattern as one word and the catalog has only the argument, so the pattern is
# named in a relative clause instead — «kudamas on vinonelliköi» — whose verb
# governs the partitive plural, which is the form `fill-style` supplies.
#
# **`element-name` and `element-anion-name` are deliberately omitted**, so the
# 118 element names and the anion names fall back to English. Secondary
# chemistry in Karelia is taught in Russian, from Russian textbooks: a Livvi
# reader's own chemistry vocabulary is the Russian one, and neither English nor
# 118 invented Livvi coinages would match the book in front of them. The
# English fallback is at least the international Latin-based set the periodic
# table itself is written with. Every other key in `locales/en/content.ftl` is
# present here.
#
# `piecewise-condition-if` is placeable: Livvi «gu» opens its clause and the
# mathematics follows it, exactly as English «if» does, so this catalog has no
# version of the limit `locales/kpv` and `locales/mhr` record.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] mustal
            [background-clause] mustal
           *[standalone] musta
        }
    .white =
        { $role ->
            [border-clause] valgial
            [background-clause] valgial
           *[standalone] valgei
        }
    .gray =
        { $role ->
            [border-clause] hahkoil
            [background-clause] hahkoil
           *[standalone] hahkoi
        }
    .red =
        { $role ->
            [border-clause] ruskiel
            [background-clause] ruskiel
           *[standalone] ruskei
        }
    .orange =
        { $role ->
            [border-clause] oranžal
            [background-clause] oranžal
           *[standalone] oranžu
        }
    .yellow =
        { $role ->
            [border-clause] keldazel
            [background-clause] keldazel
           *[standalone] keldaine
        }
    .green =
        { $role ->
            [border-clause] vihandal
            [background-clause] vihandal
           *[standalone] vihandu
        }
    .cyan =
        { $role ->
            [border-clause] cianal
            [background-clause] cianal
           *[standalone] cianu
        }
    .blue =
        { $role ->
            [border-clause] sinizel
            [background-clause] sinizel
           *[standalone] sinine
        }
    .purple =
        { $role ->
            [border-clause] violetal
            [background-clause] violetal
           *[standalone] violettu
        }
    .pink =
        { $role ->
            [border-clause] ružaval
            [background-clause] ružaval
           *[standalone] ružavu
        }
    .brown =
        { $role ->
            [border-clause] pruunal
            [background-clause] pruunal
           *[standalone] pruunu
        }
line-width =
    .thick =
        { $role ->
            [border-clause] sangial
            [background-clause] sangial
           *[standalone] sangei
        }
    .thin =
        { $role ->
            [border-clause] hoikal
            [background-clause] hoikal
           *[standalone] hoikku
        }
line-style =
    .dashed =
        { $role ->
            [border-clause] katkoviivazel
            [background-clause] katkoviivazel
           *[standalone] katkoviivaine
        }
    .dotted =
        { $role ->
            [border-clause] pistoviivazel
            [background-clause] pistoviivazel
           *[standalone] pistoviivaine
        }
# Partitive plural, which is what «kudamas on» governs — see the note at the
# top of this file.
fill-style =
    .horizontal = vuakkuviivoi
    .vertical = pystyviivoi
    .diagonal = kallistuviivoi
    .backdiagonal = vastukkahizii kallistuviivoi
    .dots = pistoloi
    .diamonds = vinonelliköi
noun =
    .line = suoru
    .line-segment = janu
    .ray = puolisuoru
    .vector = vektoru
    .curve = kaari
    .function = funktsii
    .slope-field = kaltevuskentty
    .vector-field = vektorukentty
    .parabola = parabolu
    .polyline = katkoviivu
    .polygon = monikulmivo
    .triangle = kolmikulmu
    .rectangle = suorakulmivo
    .circle = ymbyrü
    .region = aloveh
    .point = pisto
    .square = nelikkö
    .diamond = vinonellikkö
    .cross = risti
    .plus = plus
# «5-kulmivo» — a numeral-headed compound is written with a hyphen and the word
# after it is the same whatever the numeral, so the whole phrase is a head and
# there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] säändöllini { $numSides }-kulmivo
    }
# Livvi has no grammatical gender, so this answer goes unused. It is here
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
        [pattern] { $filled } { $color }, kudamas on { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun }, kudamas on { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail }, kudamas on { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «reunu» takes the adessive-allative, which the `border-clause` branch of
# every adjective agrees with. Livvi has no article, so the `-article` branches
# read the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } reunal
        [and] da { $border } reunal
        [and-article] da { $border } reunal
       *[with] { $border } reunal
    }
style-fill =
    { $parts ->
        [pattern] { $color } täyttö, kudamas on { $pattern }
       *[plain] { $color }
    }
style-unfilled = täyttämätöi
# «tausta» takes the adessive-allative too, so the colour in front of it agrees
# with it the same way the border's does.
style-text =
    { $parts ->
        [background] { $color } { $background } taustal
       *[plain] { $color }
    }
style-background-none = ei nimidä


## Boolean words

boolean-true = tozi
boolean-false = epätozi


## Answer buttons

answer-submit-label = Tarkista
answer-submit-label-no-correctness = Työnnä vastavus


## Sectional blocks

section-name =
    .activity = Toimindu
    .aside = Sivuhuomivo
    .cascade = Kaskadu
    .definition = Miäritys
    .example = Ezimerkki
    .exercise = Harjoitus
    .exercises = Harjoitukset
    .given-answer = Vastavus
    .note = Huomivo
    .objectives = Piämiärät
    .paragraphs = Kappalehet
    .part = Oza
    .problem = Tehtävy
    .problems = Tehtävät
    .proof = Tovestus
    .question = Kyzymys
    .section = Luku
    .solution = Ratkaisu
    .task = Tehtävänandu
    .theorem = Teoremu
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Nevvo


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabličču { $enumeration }
        [numbered-title] Tabličču { $enumeration }{ ": " }
        [unnumbered-title] Tabličču{ ": " }
       *[unnumbered] Tabličču
    }
figure-name =
    { $parts ->
        [numbered] Kuvu { $enumeration }
        [numbered-caption] Kuvu { $enumeration }{ ": " }
        [unnumbered-caption] Kuvu{ ": " }
       *[unnumbered] Kuvu
    }


## Paginator controls

paginator-previous = Ielline
paginator-next = Seuruai
paginator-page = Sivu
# A slash rather than an elative ending: the ending harmonizes with how the
# numeral is read aloud, which the catalog cannot see.
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = vai
piecewise-condition-if = gu
piecewise-condition-otherwise = muite


## Chemistry
##
## `element-name` and `element-anion-name` are omitted on purpose — see the
## note at the top of this file. The three keys below are the panel's own
## prose rather than a chemical vocabulary, so they are translated.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Viäry kemiallini merki
chemistry-invalid-ionic-compound = Viäry ionoin yhtevys
