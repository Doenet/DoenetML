# Umbundu content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `umb` is Umbundu, the largest Angolan language, spoken across the central
# highlands. It is the first Angolan catalog in this repository, and it arrives
# beside `locales/kmb` (Kimbundu) in the same batch.
#
# **`$gender` is a noun class spelled as a concord prefix**, which is what
# twenty-odd Bantu catalogs here already do. The stem takes the class's prefix
# directly, with nothing between:
#
#            c5 (li-)    c7 (ci-)    c9 (yi-)    c10 (vi-)
#   -tekãva   litekãva    citekãva    yitekãva    vitekãva
#   -yela     liyela      ciyela      yiyela      viyela
#   -nene     linene      cinene      yinene      vinene
#
# **Read it beside `locales/kmb`, which is its neighbour and does not do
# this.** Kimbundu joins a describing word to its noun with a connective that
# agrees — «kya», «ya», «dya» — rather than prefixing the stem, so the two
# largest languages of one country, both Bantu, both with the same class
# system, put the agreement in different places. That is this batch's version
# of the point `locales/kg` and `locales/ktu` made in #1686 about a creole and
# its lexifier: **a shared family predicts the *existence* of agreement and
# nothing whatever about its shape.**
#
# `$role` goes unused: Umbundu marks no case.
#
# **The chemistry gap here is Portuguese**, which is new. Every earlier batch's
# gap was a French or English ministry; Angola teaches secondary science in
# Portuguese, so `locales/umb` and `locales/kmb` are the first two catalogs
# whose fallback-to-English is *not* the language of their own curriculum. See
# the note at the foot of this file.
#
# The geometry leans on the Portuguese loans Angolan schooling supplies; where
# Umbundu has its own word it is used — «ocitumãlo» a place, «ondimbukiso» a
# sign. They are the first thing to check.


## Style vocabulary

color =
    .black =
        { $gender ->
            [c5] litekãva
            [c9] yitekãva
            [c10] vitekãva
           *[c7] citekãva
        }
    .white =
        { $gender ->
            [c5] liyela
            [c9] yiyela
            [c10] viyela
           *[c7] ciyela
        }
    .gray =
        { $gender ->
            [c5] limbwe
            [c9] yimbwe
            [c10] vimbwe
           *[c7] cimbwe
        }
    .red =
        { $gender ->
            [c5] likusuka
            [c9] yikusuka
            [c10] vikusuka
           *[c7] cikusuka
        }
    .orange = laranja
    .yellow = amarelu
    .green = verdi
    .cyan = siyanu
    .blue = azulu
    .purple = roxu
    .pink = rosa
    .brown = kastanyu

line-width =
    .thick =
        { $gender ->
            [c5] linene
            [c9] yinene
            [c10] vinene
           *[c7] cinene
        }
    .thin =
        { $gender ->
            [c5] litito
            [c9] yitito
            [c10] vitito
           *[c7] citito
        }

# Written as «lo …» phrases rather than as prefixed qualifiers, so that they
# take no concord and can close the description. `style-stroke` puts them last.
line-style =
    .dashed = lo olongoli vitito
    .dotted = lo olondimbu

fill-style =
    .horizontal = olongoli vi kasi vokati
    .vertical = olongoli vi kasi voku talama
    .diagonal = olongoli vi kasi voku pita
    .backdiagonal = olongoli vi kasi voku pita konele yikwavo
    .dots = olondimbu
    .diamonds = olodiamanti

noun =
    .line = ongoli
    .line-segment = ocinepa congoli
    .ray = ondavululu
    .vector = vetoru
    .curve = ongoli yoku pengula
    .function = funsão
    .parabola = parabola
    .polyline = ongoli yolonepa
    .polygon = poligonu
    .triangle = triangulu
    .rectangle = retangulu
    .circle = ocilinganya
    .region = ocitumãlo
    .point = ondimbu
    .square = kwadradu
    .diamond = odiamanti
    .cross = ekulusu
    .plus = ondimbukiso yoku vokiya

# The side count is a complement and closes the noun phrase behind the
# describing words, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] lo olonele { $numSides }
       *[head] poligonu yisokisa
    }

# The noun class. `c7` is the default and the class a Portuguese loan joins,
# which is what an author's own `markerStyleWord` is as far as this catalog is
# concerned.
noun-gender =
    { $noun ->
        [point] c5
        [diamond] c5
        [cross] c5
        [plus] c5
        [text] c5
        [line] c9
        [curve] c9
        [ray] c9
        [polyline] c9
        [border] c9
        [line-segment] c10
        [fill] c10
        [background] c10
       *[other] c7
    }


## Style composition

# The dash pattern is a «lo …» phrase and closes the description, so it moves
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
        [c5] liyukisiwa
        [c9] yiyukisiwa
        [c10] viyukisiwa
       *[c7] ciyukisiwa
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } lo { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } lo { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } lo { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «onele» is the border and leads its own describing words, so they agree with
# it rather than with the shape it surrounds — which is why `border` answers
# `c9` in `noun-gender`. Umbundu has no article and joins this clause with the
# invariable «lo», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] lo onele { $border }
        [and] lo onele { $border }
        [and-article] lo onele { $border }
       *[with] lo onele { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = ka ciyukisiwa

style-text =
    { $parts ->
        [background] { $color } lo konyima { $background }
       *[plain] { $color }
    }

style-background-none = kalimwe


## Boolean words

boolean-true = ocili
boolean-false = uhembi


## Answer buttons

answer-submit-label = Konomboloya Upange
answer-submit-label-no-correctness = Tuma Etambululo


## Sectional blocks

section-name =
    .activity = Upange
    .aside = Olondaka vikwavo
    .cascade = Okulokoka
    .definition = Elomboloko
    .example = Ongangu
    .exercise = Elilongiso
    .exercises = Alilongiso
    .given-answer = Etambululo
    .note = Esapulo
    .objectives = Ovimãho
    .paragraphs = Olonepa
    .part = Onepa
    .problem = Ocitangi
    .problems = Ovitangi
    .proof = Uvangi
    .question = Epulilo
    .section = Onepa
    .solution = Etetulwilo
    .task = Upange
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

hint-title = Ekwatiso


## Tables and figures

table-name =
    { $parts ->
        [numbered] Otabela { $enumeration }
        [numbered-title] Otabela { $enumeration }{ ": " }
        [unnumbered-title] Otabela{ ": " }
       *[unnumbered] Otabela
    }

figure-name =
    { $parts ->
        [numbered] Ocifwa { $enumeration }
        [numbered-caption] Ocifwa { $enumeration }{ ": " }
        [unnumbered-caption] Ocifwa{ ": " }
       *[unnumbered] Ocifwa
    }


## Paginator controls

paginator-previous = Yipita
paginator-next = Yikwãma

paginator-page = Etapa

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = ale

piecewise-condition-if = nda

piecewise-condition-otherwise = kovina vikwavo viosi


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## **The Portuguese case, which is new here.** Every earlier batch's chemistry
## gap was left where the fallback *was* the curriculum: `locales/tiv` and
## `locales/kri` fall back to the English a Nigerian or Sierra Leonean student
## meets in their own textbook, and `locales/kg` and `locales/fon` leave the gap
## rather than fill it with English words a French-educated reader would not
## recognize. Angola is the second shape and a sharper one: a student here meets
## the periodic table in **Portuguese**, so English is neither Umbundu nor the
## curriculum, and the 130 keys fall back to a language that answers nobody.
##
## That is an argument for filling them in from Portuguese, not for leaving
## them — and it is left anyway, because a Portuguese table dressed as an
## Umbundu one is the substitution this whole seeding effort is careful not to
## make. It is the clearest case in the repository for a real translator, and it
## is recorded here so #1521 can find it.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Ondimbukiso ya Kimika ka Yisungulukile
chemistry-invalid-ionic-compound = Elikongelo lya Ioni ka Lyasungulukile
