# Kapampangan content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Kapampangan has no grammatical gender and no case, so `noun-gender` answers
# one token for every noun and nothing here selects on `$gender` or on `$role`.
#
# **The linker is the one thing this catalog cannot get right in every case.**
# Kapampangan links an adjective to what it describes with «a» after a
# consonant-final word and with the enclitic «-ng» welded onto a vowel-final
# one. Which applies is decided by the word *before* the linker, and that word
# is a placeable at most of the sites below — a colour this file supplies, or an
# author's own `lineColorWord`, which passes through untranslated and which the
# catalog has never seen. There is no form that is right in both places, so
# every linker here is written «a»: correct after «matuling» and «maputi»,
# wanted as «-ng» after «malutu» and «madilo». That is the affix rule of the
# README biting on a *ligature* rather than on a case ending, and it is the
# mirror image of `locales/ilo`'s, whose «a»/«nga» is decided by the word that
# follows, and it is `locales/bik`'s exactly. `locales/war` and `locales/hil`
# escape it, because their «nga» is grammatical in both positions.
#
# The adjectives **precede** the noun, which is English's order and
# Kapampangan's ordinary one.
#
# The geometry vocabulary is largely Spanish-derived, as Philippine mathematics
# teaching carries it; the colours and everyday words are Kapampangan's own.


## Style vocabulary

color =
    .black = matuling
    .white = maputi
    .gray = abwan
    .red = malutu
    .orange = kahel
    .yellow = madilo
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
    .dashed = putul-putul
    .dotted = tuldik-tuldik

# Noun phrases. Kapampangan marks no plural on the noun, so «gulis» is the word
# for one line and for many alike.
fill-style =
    .horizontal = mihiga a gulis
    .vertical = mitalakad a gulis
    .diagonal = mihilis a gulis
    .backdiagonal = kabaligtaran a mihilis a gulis
    .dots = tuldik
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
        [tail] a atin { $numSides } a gilid
       *[head] regular a poligono
    }

# One answer for every noun: Kapampangan has no grammatical gender.
noun-gender = neuter


## Style composition

# Every linker is written «a» — see the header for the case it gets wrong.
style-stroke =
    { $parts ->
        [width-style-color] { $width } a { $lineStyle } a { $color }
        [width-color] { $width } a { $color }
        [style-color] { $lineStyle } a { $color }
        [width-style] { $width } a { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

style-with-noun =
    { $parts ->
        [noun-tail] { $description } a { $noun } { $nounTail }
       *[noun] { $description } a { $noun }
    }

style-filled-word = mitmo

style-filled =
    { $parts ->
        [pattern] { $filled } a { $color } a atin { $pattern }
       *[plain] { $filled } a { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } a { $color } a { $noun } a atin { $pattern }
        [plain-tail] { $filled } a { $color } a { $noun } { $nounTail }
        [pattern-tail] { $filled } a { $color } a { $noun } { $nounTail } a atin { $pattern }
       *[plain] { $filled } a { $color } a { $noun }
    }

# Kapampangan has no article, so the two `-article` branches say what the other
# two say. They are kept apart because English's distinction is between a first
# clause and a further one, which this file does mark: «a atin» against «at».
style-border-clause =
    { $parts ->
        [with-article] a atin { $border } a gilid
        [and] at { $border } a gilid
        [and-article] at { $border } a gilid
       *[with] a atin { $border } a gilid
    }

style-fill =
    { $parts ->
        [pattern] { $color } a { $pattern }
       *[plain] { $color }
    }

style-unfilled = ali mitmo

style-text =
    { $parts ->
        [background] { $color } a atin { $background } a background
       *[plain] { $color }
    }

style-background-none = ala


## Boolean words

boolean-true = tutu
boolean-false = ali tutu


## Answer buttons

answer-submit-label = Siyasatan ing pakibat
answer-submit-label-no-correctness = Ipadala ing pakibat


## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Kapampangan marks number on the article rather than on the noun, and a
# heading carries no article.
section-name =
    .activity = Aktibidad
    .aside = Notang gilid
    .cascade = Kaskada
    .definition = Kahulugan
    .example = Alimbawa
    .exercise = Ehersisyo
    .exercises = Ehersisyo
    .given-answer = Pakibat
    .note = Nota
    .objectives = Layon
    .paragraphs = Parapo
    .part = Dake
    .problem = Problema
    .problems = Problema
    .proof = Patune
    .question = Kutang
    .section = Seksyon
    .solution = Solusyon
    .task = Dapat
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

paginator-previous = Milabas
paginator-next = Tutuki
paginator-page = Bulung

paginator-page-status = { $pageLabel } { $currentPage } king { $numPages }


## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = nung
piecewise-condition-otherwise = nung ali


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Philippine secondary science is taught in English from the
## intermediate grades, so the periodic table a Kapampangan pupil meets is the
## English one — the same reason `locales/fil` and `locales/ceb` leave these
## keys out.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Ali balido a simbolong kemikal
chemistry-invalid-ionic-compound = Ali balido a kompuwestong ioniko
