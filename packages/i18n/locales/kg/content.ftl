# Kongo content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `kg` is Kongo (Kikongo), of the lower Congo in the DRC, the Republic of the
# Congo and northern Angola. It is a macrolanguage; this catalog is written
# towards the Kikongo ya Bandundu written standard, and `negotiate.ts` folds
# `kng`, `kwy` and `ldi` onto it.
#
# **Read this file beside `locales/ktu`.** Kituba is the creole whose lexifier
# is Kikongo, and it was seeded in the previous batch (#1685) as the one Bantu
# catalog here that selects on neither `$gender` nor `$role`: a describing word
# is joined to its noun by the invariable linker «ya» and never changes shape.
#
# That «ya» is *this* language's class-9 linker, frozen. Kongo joins a
# describing word to its noun with a connective built on «-a», and the
# connective agrees:
#
#            c5 (di-)   c7 (ki-)   c9 (n-)    c11 (lu-)
#   linker    dya        kya        ya         lwa
#   ndombe    dya ndombe kya ndombe ya ndombe  lwa ndombe
#   nene      dya nene   kya nene   ya nene    lwa nene
#
# So the whole of the agreement in this catalog is one syllable, and it is
# always the same syllable: the describing stem never moves. Kituba kept the
# class-9 row and threw the other three away. Putting `color.black` in the two
# files side by side is the shortest statement of what a creole did to its
# lexifier that this repository can make, and it costs nothing but the two
# files being in the same tree.
#
# **Only the words joined by that connective fork.** The fill patterns are
# whole phrases with their own internal head, and the mathematical nouns are
# nouns, so neither takes a linker. This catalog forks on fifteen words — every
# colour, both widths and the filled word — which is `locales/zu`'s shape
# rather than `locales/ts`'s.
#
# `$role` goes unused: Kongo marks no case.
#
# The geometry leans on the French loans DRC schooling supplies, since that is
# where a Kongo speaker meets these words; where Kikongo has its own word it is
# used — «kizunga» a circle, «fulu» a place, «sinsu» a sign. They are the first
# thing to check.


## Style vocabulary

# The stem never changes. Only the connective in front of it does.
color =
    .black =
        { $gender ->
            [c5] dya ndombe
            [c7] kya ndombe
            [c11] lwa ndombe
           *[c9] ya ndombe
        }
    .white =
        { $gender ->
            [c5] dya mpembe
            [c7] kya mpembe
            [c11] lwa mpembe
           *[c9] ya mpembe
        }
    .gray =
        { $gender ->
            [c5] dya mvindu
            [c7] kya mvindu
            [c11] lwa mvindu
           *[c9] ya mvindu
        }
    .red =
        { $gender ->
            [c5] dya mbwaki
            [c7] kya mbwaki
            [c11] lwa mbwaki
           *[c9] ya mbwaki
        }
    .orange =
        { $gender ->
            [c5] dya olanze
            [c7] kya olanze
            [c11] lwa olanze
           *[c9] ya olanze
        }
    .yellow =
        { $gender ->
            [c5] dya nzole
            [c7] kya nzole
            [c11] lwa nzole
           *[c9] ya nzole
        }
    .green =
        { $gender ->
            [c5] dya mayamba
            [c7] kya mayamba
            [c11] lwa mayamba
           *[c9] ya mayamba
        }
    .cyan =
        { $gender ->
            [c5] dya sayani
            [c7] kya sayani
            [c11] lwa sayani
           *[c9] ya sayani
        }
    .blue =
        { $gender ->
            [c5] dya bule
            [c7] kya bule
            [c11] lwa bule
           *[c9] ya bule
        }
    .purple =
        { $gender ->
            [c5] dya viole
            [c7] kya viole
            [c11] lwa viole
           *[c9] ya viole
        }
    .pink =
        { $gender ->
            [c5] dya loze
            [c7] kya loze
            [c11] lwa loze
           *[c9] ya loze
        }
    .brown =
        { $gender ->
            [c5] dya ntoto
            [c7] kya ntoto
            [c11] lwa ntoto
           *[c9] ya ntoto
        }

line-width =
    .thick =
        { $gender ->
            [c5] dya nene
            [c7] kya nene
            [c11] lwa nene
           *[c9] ya nene
        }
    .thin =
        { $gender ->
            [c5] dya fyoti
            [c7] kya fyoti
            [c11] lwa fyoti
           *[c9] ya fyoti
        }

# Written as «ya + noun» phrases with their own frozen class-9 linker, the way
# Kituba writes everything: these describe a manner rather than a quality, and
# a speaker does not agree them with the shape. They therefore take no
# `$gender`, and `style-stroke` puts them last so nothing follows them.
line-style =
    .dashed = ya bitini bitini
    .dotted = ya tona tona

fill-style =
    .horizontal = nsinga miayalumuka
    .vertical = nsinga miatelama
    .diagonal = nsinga miasengoloka
    .backdiagonal = nsinga miasengoloka ku ndambu yankaka
    .dots = tona
    .diamonds = madiama

noun =
    .line = nsinga
    .line-segment = kitini kya nsinga
    .ray = nsemo
    .vector = vektele
    .curve = nsinga wa nkubama
    .function = fonksio
    .parabola = palabole
    .polyline = nsinga mia bitini
    .polygon = poligone
    .triangle = triangele
    .rectangle = rektangele
    .circle = kizunga
    .region = fulu
    .point = tona
    .square = kare
    .diamond = diama
    .cross = kuluse
    .plus = sinsu kya kuvukisa

# The side count is a counted complement and closes the noun phrase behind the
# describing words, so it goes in the tail. «-a» agrees here too, but the head
# noun is always the same word, so the form is fixed and needs no fork.
noun-regular-polygon =
    { $part ->
        [tail] ya makonso { $numSides }
       *[head] poligone yafwanana
    }

# The noun class. `c9` is the default and the class a French loan joins, which
# is what an author's own `markerStyleWord` is as far as this catalog is
# concerned — and it is also the row Kituba kept.
noun-gender =
    { $noun ->
        [line-segment] c7
        [square] c7
        [region] c7
        [circle] c7
        [fill] c7
        [point] c5
        [diamond] c5
        [cross] c5
        [plus] c5
        [text] c5
        [border] c11
       *[other] c9
    }


## Style composition

# The dash pattern is a «ya …» phrase and closes the description, so it moves
# behind the colour rather than sitting between the width and it. Two
# connective phrases in a row simply stand side by side; Kongo needs no
# conjunction between them.
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
        [c5] dyazala
        [c7] kyazala
        [c11] lwazala
       *[c9] yazala
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ye { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ye { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } ye { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «lubaku» is the border and leads its own describing words, so they agree with
# it rather than with the shape it surrounds — which is why `lubaku` is class
# 11 in `noun-gender` and why `border` answers `c11` there. Kongo has no
# article and joins this clause with the invariable «ye», so all four branches
# read alike.
style-border-clause =
    { $parts ->
        [with-article] ye lubaku { $border }
        [and] ye lubaku { $border }
        [and-article] ye lubaku { $border }
       *[with] ye lubaku { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = kyazala ve

style-text =
    { $parts ->
        [background] { $color } ye nima { $background }
       *[plain] { $color }
    }

style-background-none = ata kima ve


## Boolean words

boolean-true = kyedika
boolean-false = luvunu


## Answer buttons

answer-submit-label = Fyongunuka Kisalu
answer-submit-label-no-correctness = Tinda Mvutu


## Sectional blocks

section-name =
    .activity = Kisalu
    .aside = Diambu dyankaka
    .cascade = Ndiakana
    .definition = Nsasa
    .example = Kifwani
    .exercise = Ntonta
    .exercises = Bintonta
    .given-answer = Mvutu
    .note = Nsonokono
    .objectives = Bilomba
    .paragraphs = Bitini
    .part = Ndambu
    .problem = Diambu
    .problems = Mambu
    .proof = Kimbangi
    .question = Kyuvu
    .section = Kitini
    .solution = Nsukulu
    .task = Mfunu
    .theorem = Tewoleme

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Lusadisu


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabele { $enumeration }
        [numbered-title] Tabele { $enumeration }{ ": " }
        [unnumbered-title] Tabele{ ": " }
       *[unnumbered] Tabele
    }

figure-name =
    { $parts ->
        [numbered] Kifwani { $enumeration }
        [numbered-caption] Kifwani { $enumeration }{ ": " }
        [unnumbered-caption] Kifwani{ ": " }
       *[unnumbered] Kifwani
    }


## Paginator controls

paginator-previous = Yavita
paginator-next = Yalanda

paginator-page = Lukaya

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = to

piecewise-condition-if = kana

piecewise-condition-otherwise = mu mambu mankaka mawonso


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. The DRC teaches secondary science in French, so a
## Kongo speaker meets the periodic table there and neither Kikongo nor English
## is the curriculum — which is why the gap is left visible rather than filled
## with English words dressed up as Kikongo ones. `locales/ln` and `locales/lua`
## leave the same gap for the same ministry.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Sinsu kya Simi Kyambi
chemistry-invalid-ionic-compound = Kivukanu kya Ioni Kyambi
