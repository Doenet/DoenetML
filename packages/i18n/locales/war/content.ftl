# Waray content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Waray has no grammatical gender and no case, so `noun-gender` answers one
# token for every noun and nothing here selects on `$gender` or on `$role`.
#
# The **linker** «nga» is written in full at every site. Waray also has the
# enclitic `-ng`, attached to a preceding vowel-final word, but which of the two
# is available is decided by the word *before* the linker — and in these
# messages that word is often a placeable. The free form is grammatical
# wherever the enclitic is, so writing it out is not a compromise: it is the
# form that can be written without knowing what precedes it. That is the same
# move `locales/quc` makes with the free relational «rech» in place of the
# possessive prefix «u-»/«r-».
#
# The adjectives **precede** the noun, which is English's order and Waray's
# ordinary one: «pula nga linya».
#
# The geometry vocabulary is largely Spanish-derived, because that is what
# Philippine mathematics teaching carries in Waray as in Tagalog; the colours
# and the everyday words are Waray's own.


## Style vocabulary

color =
    .black = itom
    .white = busag
    .gray = abuhon
    .red = pula
    .orange = kahel
    .yellow = dalag
    .green = lunhaw
    .cyan = sian
    .blue = asul
    .purple = lila
    .pink = rosas
    .brown = kape

line-width =
    .thick = baga
    .thin = manipis

line-style =
    .dashed = putol-putol
    .dotted = tulbok-tulbok

# Noun phrases. Waray marks no plural on the noun, so «badlis» is the word for
# one line and for many alike.
fill-style =
    .horizontal = hirag nga badlis
    .vertical = tindog nga badlis
    .diagonal = hilis nga badlis
    .backdiagonal = baliskad nga hilis nga badlis
    .dots = tulbok
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

# The side count follows the adjectives as a complement, so that they stay
# beside the noun they describe.
noun-regular-polygon =
    { $part ->
        [tail] nga may { $numSides } nga kilid
       *[head] regular nga poligono
    }

# One answer for every noun: Waray has no grammatical gender, so nothing
# downstream has anything to agree with.
noun-gender = neuter


## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width } nga { $lineStyle } nga { $color }
        [width-color] { $width } nga { $color }
        [style-color] { $lineStyle } nga { $color }
        [width-style] { $width } nga { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

style-with-noun =
    { $parts ->
        [noun-tail] { $description } nga { $noun } { $nounTail }
       *[noun] { $description } nga { $noun }
    }

style-filled-word = puno

style-filled =
    { $parts ->
        [pattern] { $filled } nga { $color } nga may { $pattern }
       *[plain] { $filled } nga { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } nga { $color } nga { $noun } nga may { $pattern }
        [plain-tail] { $filled } nga { $color } nga { $noun } { $nounTail }
        [pattern-tail] { $filled } nga { $color } nga { $noun } { $nounTail } nga may { $pattern }
       *[plain] { $filled } nga { $color } nga { $noun }
    }

# Waray has no article, so the two `-article` branches say what the other two
# say. They are kept apart because English's distinction is between a first
# clause and a further one, which this file does mark: «nga may» against «ngan».
style-border-clause =
    { $parts ->
        [with-article] nga may { $border } nga ligid
        [and] ngan { $border } nga ligid
        [and-article] ngan { $border } nga ligid
       *[with] nga may { $border } nga ligid
    }

style-fill =
    { $parts ->
        [pattern] { $color } nga { $pattern }
       *[plain] { $color }
    }

style-unfilled = diri puno

style-text =
    { $parts ->
        [background] { $color } nga may { $background } nga background
       *[plain] { $color }
    }

style-background-none = waray


## Boolean words

boolean-true = tinuod
boolean-false = buwa


## Answer buttons

answer-submit-label = Susiha an baton
answer-submit-label-no-correctness = Ipadara an baton


## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Waray marks number on the article rather than on the noun, and a
# heading carries no article.
section-name =
    .activity = Aktibidad
    .aside = Nota ha ligid
    .cascade = Kaskada
    .definition = Depinisyon
    .example = Ehemplo
    .exercise = Ehersisyo
    .exercises = Ehersisyo
    .given-answer = Baton
    .note = Nota
    .objectives = Katuyoan
    .paragraphs = Parapo
    .part = Bahin
    .problem = Problema
    .problems = Problema
    .proof = Pamatuod
    .question = Pakiana
    .section = Seksyon
    .solution = Solusyon
    .task = Buruhaton
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

paginator-previous = Nahiuna
paginator-next = Sunod
paginator-page = Pahina

paginator-page-status = { $pageLabel } { $currentPage } ha { $numPages }


## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = kon
piecewise-condition-otherwise = kon diri


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Philippine secondary science is taught in English from the
## intermediate grades, so the periodic table a Waray pupil meets is the English
## one — the same reason `locales/fil` and `locales/ceb` leave these keys out.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Imbalido nga simbolo nga kemikal
chemistry-invalid-ionic-compound = Imbalido nga kompuwesto nga ioniko
