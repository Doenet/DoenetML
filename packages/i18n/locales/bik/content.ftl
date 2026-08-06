# Bikol content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in **Central Bikol** (Naga), the variety Bikol publishing and
# schooling use. `bik` is a macrolanguage; see `chrome.ftl`'s header and
# `MACROLANGUAGE_MEMBERS` in `negotiate.ts`.
#
# Bikol has no grammatical gender and no case, so `noun-gender` answers one
# token for every noun and nothing here selects on `$gender` or on `$role`.
#
# **The linker.** Bikol joins an adjective to what it describes with «na» after
# a consonant-final word and with the enclitic «-ng» welded onto a vowel-final
# one, and which applies is decided by the word *before* the linker — which at
# most of the sites below is a placeable. There is no form that is right in both
# places, so every linker that lands beside a placeable is written «na»:
# correct after «itom», wanted as «-ng» after «pula». Where the catalog writes
# both words around the linker it writes whichever form the preceding one
# takes, as «balidong simbolong kemikal» does. That is the same constraint `locales/pam` records, and the
# mirror image of `locales/ilo`'s, whose «a»/«nga» is decided by the word that
# follows instead. `locales/war` and `locales/hil` escape it, because Bisayan
# «nga» is grammatical in both positions.
#
# The adjectives **precede** the noun, which is English's order and Bikol's
# ordinary one.
#
# The geometry vocabulary is largely Spanish-derived, as Philippine mathematics
# teaching carries it; the colours and everyday words are Bikol's own.


## Style vocabulary

color =
    .black = itom
    .white = puti
    .gray = abuhon
    .red = pula
    .orange = kahel
    .yellow = dulaw
    .green = berde
    .cyan = sian
    .blue = asul
    .purple = lila
    .pink = rosas
    .brown = kape

line-width =
    .thick = makapal
    .thin = manipis

line-style =
    .dashed = putol-putol
    .dotted = tuldok-tuldok

# Noun phrases. Bikol marks no plural on the noun, so «linya» is the word for
# one line and for many alike.
fill-style =
    .horizontal = nakahigda na linya
    .vertical = nakatindog na linya
    .diagonal = pahilig na linya
    .backdiagonal = baliktad na pahilig na linya
    .dots = tuldok
    .diamonds = diyamante

noun =
    .line = linya
    .line-segment = segmento
    .ray = sinag
    .vector = bektor
    .curve = kurba
    .function = punsyon
    .parabola = parabola
    .polyline = polilinya
    .polygon = poligono
    .triangle = triyanggulo
    .rectangle = rektanggulo
    .circle = sirkulo
    .region = rehiyon
    .point = punto
    .square = kwadrado
    .diamond = diyamante
    .cross = krus
    .plus = plus

noun-regular-polygon =
    { $part ->
        [tail] na may { $numSides } na gilid
       *[head] regular na poligono
    }

# One answer for every noun: Bikol has no grammatical gender.
noun-gender = neuter


## Style composition

# Every linker is written «na» — see the header for the case it gets wrong.
style-stroke =
    { $parts ->
        [width-style-color] { $width } na { $lineStyle } na { $color }
        [width-color] { $width } na { $color }
        [style-color] { $lineStyle } na { $color }
        [width-style] { $width } na { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

style-with-noun =
    { $parts ->
        [noun-tail] { $description } na { $noun } { $nounTail }
       *[noun] { $description } na { $noun }
    }

style-filled-word = pano

style-filled =
    { $parts ->
        [pattern] { $filled } na { $color } na may { $pattern }
       *[plain] { $filled } na { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } na { $color } na { $noun } na may { $pattern }
        [plain-tail] { $filled } na { $color } na { $noun } { $nounTail }
        [pattern-tail] { $filled } na { $color } na { $noun } { $nounTail } na may { $pattern }
       *[plain] { $filled } na { $color } na { $noun }
    }

# Bikol has no article, so the two `-article` branches say what the other two
# say. They are kept apart because English's distinction is between a first
# clause and a further one, which this file does mark: «na may» against «asin».
style-border-clause =
    { $parts ->
        [with-article] na may { $border } na gilid
        [and] asin { $border } na gilid
        [and-article] asin { $border } na gilid
       *[with] na may { $border } na gilid
    }

style-fill =
    { $parts ->
        [pattern] { $color } na { $pattern }
       *[plain] { $color }
    }

style-unfilled = bakong pano

style-text =
    { $parts ->
        [background] { $color } na may { $background } na background
       *[plain] { $color }
    }

style-background-none = mayo


## Boolean words

boolean-true = totoo
boolean-false = bakong totoo


## Answer buttons

answer-submit-label = Siyasaton an simbag
answer-submit-label-no-correctness = Ipadara an simbag


## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Bikol marks number on «mga» rather than on the noun, and a heading does
# not carry it.
section-name =
    .activity = Aktibidad
    .aside = Nota sa gilid
    .cascade = Kaskada
    .definition = Depinisyon
    .example = Halimbawa
    .exercise = Ehersisyo
    .exercises = Ehersisyo
    .given-answer = Simbag
    .note = Nota
    .objectives = Katuyuhan
    .paragraphs = Parapo
    .part = Kabtang
    .problem = Problema
    .problems = Problema
    .proof = Patunay
    .question = Hapot
    .section = Seksyon
    .solution = Solusyon
    .task = Gibuhon
    .theorem = Teorema

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Giya


## Tables and figures

table-name =
    { $parts ->
        [numbered] Talaan { $enumeration }
        [numbered-title] Talaan { $enumeration }{ ": " }
        [unnumbered-title] Talaan{ ": " }
       *[unnumbered] Talaan
    }

figure-name =
    { $parts ->
        [numbered] Pigura { $enumeration }
        [numbered-caption] Pigura { $enumeration }{ ": " }
        [unnumbered-caption] Pigura{ ": " }
       *[unnumbered] Pigura
    }


## Paginator controls

paginator-previous = Nakaagi
paginator-next = Sunod
paginator-page = Pahina

paginator-page-status = { $pageLabel } { $currentPage } sa { $numPages }


## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = kun
piecewise-condition-otherwise = kun bako


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Philippine secondary science is taught in English from the
## intermediate grades, so the periodic table a Bikol pupil meets is the English
## one — the same reason `locales/fil` and `locales/ceb` leave these keys out.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Bakong balidong simbolong kemikal
chemistry-invalid-ionic-compound = Bakong balidong kompuwestong ioniko
