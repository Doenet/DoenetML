# Hiligaynon content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Hiligaynon has no grammatical gender and no case, so `noun-gender` answers one
# token for every noun and nothing here selects on `$gender` or on `$role`.
#
# The **linker** «nga» is written in full at every site. Hiligaynon also has the
# enclitic `-ng` on a vowel-final word, but which of the two is available is
# decided by the word *before* the linker, and in these messages that word is
# often a placeable. The free form is grammatical wherever the enclitic is, so
# writing it out is what makes these messages safe rather than a compromise —
# the same move `locales/war` makes, and the thing `locales/ilo`, `locales/pam`
# and `locales/bik` cannot do, because their linkers have no invariant form.
#
# The adjectives **precede** the noun, which is English's order and
# Hiligaynon's ordinary one: «pula nga linya».
#
# The geometry vocabulary is largely Spanish-derived, as Philippine mathematics
# teaching carries it; the colours and everyday words are Hiligaynon's own.
# «kolor» words a corrector may want to revisit: `.gray` is written «abuhon»
# rather than the loan «gris», and `.brown` «kape» rather than «tsokolate».


## Style vocabulary

color =
    .black = itom
    .white = puti
    .gray = abuhon
    .red = pula
    .orange = kahel
    .yellow = dalag
    .green = berde
    .cyan = sian
    .blue = asul
    .purple = lila
    .pink = rosas
    .brown = kape

line-width =
    .thick = madamol
    .thin = manipis

line-style =
    .dashed = putol-putol
    .dotted = tuldok-tuldok

# Noun phrases. Hiligaynon marks no plural on the noun, so «linya» is the word
# for one line and for many alike.
fill-style =
    .horizontal = hapa nga linya
    .vertical = tindog nga linya
    .diagonal = halihad nga linya
    .backdiagonal = balikwaot nga halihad nga linya
    .dots = tuldok
    .diamonds = diyamante

noun =
    .line = linya
    .line-segment = segmento
    .ray = silak
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
        [tail] nga may { $numSides } nga kilid
       *[head] regular nga poligono
    }

# One answer for every noun: Hiligaynon has no grammatical gender.
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

# Hiligaynon has no article, so the two `-article` branches say what the other
# two say. They are kept apart because English's distinction is between a first
# clause and a further one, which this file does mark: «nga may» against «kag».
style-border-clause =
    { $parts ->
        [with-article] nga may { $border } nga ligid
        [and] kag { $border } nga ligid
        [and-article] kag { $border } nga ligid
       *[with] nga may { $border } nga ligid
    }

style-fill =
    { $parts ->
        [pattern] { $color } nga { $pattern }
       *[plain] { $color }
    }

style-unfilled = indi puno

style-text =
    { $parts ->
        [background] { $color } nga may { $background } nga background
       *[plain] { $color }
    }

style-background-none = wala


## Boolean words

boolean-true = matuod
boolean-false = butig


## Answer buttons

answer-submit-label = Usisaa ang sabat
answer-submit-label-no-correctness = Ipadala ang sabat


## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Hiligaynon marks number on the article rather than on the noun, and a
# heading carries no article.
section-name =
    .activity = Aktibidad
    .aside = Nota sa kilid
    .cascade = Kaskada
    .definition = Kahulugan
    .example = Halimbawa
    .exercise = Ehersisyo
    .exercises = Ehersisyo
    .given-answer = Sabat
    .note = Nota
    .objectives = Tulumuron
    .paragraphs = Parapo
    .part = Bahin
    .problem = Problema
    .problems = Problema
    .proof = Pamatuod
    .question = Pamangkot
    .section = Seksyon
    .solution = Solusyon
    .task = Buluhaton
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

paginator-previous = Nagligad
paginator-next = Sunod
paginator-page = Pahina

paginator-page-status = { $pageLabel } { $currentPage } sa { $numPages }


## Piecewise functions

piecewise-condition-or = ukon
piecewise-condition-if = kon
piecewise-condition-otherwise = kon indi


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Philippine secondary science is taught in English from the
## intermediate grades, so the periodic table a Hiligaynon pupil meets is the
## English one — the same reason `locales/fil` and `locales/ceb` leave these
## keys out.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Indi balido nga simbolo nga kemikal
chemistry-invalid-ionic-compound = Indi balido nga kompuwesto nga ioniko
