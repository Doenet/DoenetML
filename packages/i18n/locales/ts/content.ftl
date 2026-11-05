# Tsonga content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `ts` is Xitsonga, official in South Africa and widely spoken in Mozambique
# and Zimbabwe. CLDR has no Tsonga-language data to answer the endonym with, so
# `<document lang>`'s autocomplete reads "Tsonga" once rather than twice.
#
# `$gender` is the noun **class** here as in every Bantu catalog, and
# `noun-gender` answers `c3`, `c7` or `c9`. **What this file adds to that
# group is how narrow a class fork can legitimately be.** Xitsonga has very few
# true adjectives; almost everything English calls one is a noun joined to what
# it describes with the possessive concord («ntila wa ntima», a line of
# blackness). So only the two words that really are adjectives — «-kulu» thick
# and «-tsongo» thin — and the passive «-tateriwaka» carry a concord here,
# where `locales/zu` writes the fork on fifteen words and `locales/sw` on six.
# That is not a smaller amount of agreement; it is agreement landing on fewer
# words, and `styleDescriptions.test.ts` pins the colours staying put while the
# width moves.
#
#   adjective concord   c3 lowu-   c7 lexi-   c9 leyi-
#
# The colours are written **bare**, without the possessive concord that would
# attach them attributively. That is `locales/sw`'s compromise for
# `locales/sw`'s reason: the concord is computable from `$gender`, but the same
# string is what `backgroundColor` reports standing alone, where a bare
# possessive is ungrammatical, and `$role` is `standalone` in both positions. A
# bare colour noun is what a label or a legend says in Xitsonga anyway.
#
# Classes 5 and 6 are absent because no noun the core names reaches either —
# class 6 is the plural of class 5 and every noun here is singular; see
# `locales/zu`'s header for the reachability rule that decides which class
# branches a catalog is entitled to write. Adding a `c5` branch — the leri-
# concord — means adding the noun that reaches it first.
#
# Describing words follow the noun, so the composition messages put the noun
# first. `$role` goes unused: Xitsonga marks no case.
#
# The mathematical nouns are the first thing to check. Where Xitsonga has its
# own word — «ntila» a line, «xirhendzevutana» a circle, «xikhutlonharhu» a
# triangle — that word is used; the rest are adapted loans this seed had
# nothing else to reach for.


## Style vocabulary

# Nouns, not adjectives: they do not change shape for anything.
color =
    .black = ntima
    .white = basa
    .gray = mpunga
    .red = tshwuka
    .orange = wanachisi
    .yellow = xitshopana
    .green = rihlaza
    .cyan = sayana
    .blue = wasi
    .purple = phepuli
    .pink = phinki
    .brown = ntsvuku wa misava
# The two true adjectives. With `style-filled-word` below, these are the only
# places in this file where a class concord moves.
line-width =
    .thick =
        { $gender ->
            [c3] lowukulu
            [c7] lexikulu
           *[c9] leyikulu
        }
    .thin =
        { $gender ->
            [c3] lowutsongo
            [c7] lexitsongo
           *[c9] leyitsongo
        }
# Written as an invariable «hi …» phrase, so that it agrees with nothing and
# can close the phrase. `style-stroke` puts it last for that reason.
line-style =
    .dashed = hi swiphemu
    .dotted = hi swikoloto
fill-style =
    .horizontal = mintila yo etlela
    .vertical = mintila yo yima
    .diagonal = mintila yo rhembelela
    .backdiagonal = mintila yo rhembelela hi ku hundzuluxa
    .dots = swikoloto
    .diamonds = madayimani
noun =
    .line = ntila
    .line-segment = xiphemu xa ntila
    .ray = reyi
    .vector = vhekitha
    .curve = ntila wo goba
    .function = ntirho
    .parabola = parabola
    .polyline = ntila wa swiphemu
    .polygon = xivumbeko xa matlhelo yo tala
    .triangle = xikhutlonharhu
    .rectangle = xikhutlomune
    .circle = xirhendzevutana
    .region = ndhawu
    .point = poyinti
    .square = xikwere
    .diamond = dayimani
    .cross = xihambano
    .plus = xikombiso xo hlanganisa
# The side count is a possessive complement and closes the noun phrase behind
# the describing words rather than opening it, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] xa matlhelo ya { $numSides }
       *[head] xivumbeko lexi ringanaka
    }
# The noun class. `c9` is the default and the class of every loanword,
# including a word an author supplies.
noun-gender =
    { $noun ->
        [line] c3
        [curve] c3
        [polyline] c3
        [function] c3
        [border] c3
        [line-segment] c7
        [polygon] c7
        [regular-polygon] c7
        [triangle] c7
        [rectangle] c7
        [circle] c7
        [square] c7
        [cross] c7
        [plus] c7
        [text] c7
        [fill] c7
       *[other] c9
    }

## Style composition

# The dash pattern is a «hi …» phrase and closes the description, so it moves
# behind the colour rather than sitting between the width and it.
style-stroke =
    { $parts ->
        [width-style-color] { $width } { $color } { $lineStyle }
        [width-color] { $width } { $color }
        [style-color] { $color } { $lineStyle }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [c3] lowu tateriweke
        [c7] lexi tateriweke
       *[c9] leyi tateriweke
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } hi { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } hi { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } hi { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «ndzilakano» is class 3 and leads its own describing words, so the border's
# words agree with it rather than with the shape it surrounds. Xitsonga has no
# article and joins this clause with the invariable «ni», so all four branches
# read alike.
style-border-clause =
    { $parts ->
        [with-article] ni ndzilakano { $border }
        [and] ni ndzilakano { $border }
        [and-article] ni ndzilakano { $border }
       *[with] ni ndzilakano { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = a swi tateriwanga
style-text =
    { $parts ->
        [background] { $color } ehenhla ka xitshuriwa { $background }
       *[plain] { $color }
    }
style-background-none = a ku na nchumu

## Boolean words

boolean-true = ntiyiso
boolean-false = mavunwa

## Answer buttons

answer-submit-label = Kambela Ntirho
answer-submit-label-no-correctness = Rhumela Nhlamulo

## Sectional blocks

section-name =
    .activity = Ntirho
    .aside = Xiengetelo
    .cascade = Landzelelano
    .definition = Nhlamuselo
    .example = Xikombiso
    .exercise = Ndzetelo
    .exercises = Mindzetelo
    .given-answer = Nhlamulo
    .note = Xitsundzuxo
    .objectives = Swikongomelo
    .paragraphs = Tindzimana
    .part = Xiphemu
    .problem = Xiphiqo
    .problems = Swiphiqo
    .proof = Vumbhoni
    .question = Xivutiso
    .section = Xiyenge
    .solution = Ntlhantlho
    .task = Ntirho
    .theorem = Thiyoremu
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Xiletelo

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tafula { $enumeration }
        [numbered-title] Tafula { $enumeration }{ ": " }
        [unnumbered-title] Tafula{ ": " }
       *[unnumbered] Tafula
    }
figure-name =
    { $parts ->
        [numbered] Xifaniso { $enumeration }
        [numbered-caption] Xifaniso { $enumeration }{ ": " }
        [unnumbered-caption] Xifaniso{ ": " }
       *[unnumbered] Xifaniso
    }

## Paginator controls

paginator-previous = Leswi hundzeke
paginator-next = Leswi landzelaka
paginator-page = Tluka
paginator-page-status = { $pageLabel } { $currentPage } eka { $numPages }

## Piecewise functions

piecewise-condition-or = kumbe
piecewise-condition-if = loko
piecewise-condition-otherwise = handle ka sweswo

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Secondary science is taught in English or Afrikaans
## in South Africa and in Portuguese in Mozambique, so a Xitsonga speaker meets
## the periodic table in one of those and the fallback *is* the curriculum —
## which is a fact about two education ministries rather than about the
## language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Xikombiso xa Khemikhali lexi Hoxeke
chemistry-invalid-ionic-compound = Nhlanganiso wa Ayoni lowu Hoxeke
