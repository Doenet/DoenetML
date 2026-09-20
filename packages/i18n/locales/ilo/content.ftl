# Ilocano content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the modern Latin orthography of Ilocano publishing.
#
# Ilocano has no grammatical gender and no case, so `noun-gender` answers one
# token for every noun and nothing here selects on `$gender` or on `$role`.
# What the composition messages do is order and link — nothing more.
#
# **The linker decides the shape of this file.** An attributive adjective is
# joined to what it describes by a ligature, and Ilocano's has two forms whose
# choice is made by the **first sound of the word that follows it**: «nga»
# before a vowel, «a» before a consonant. That is the Kʼicheʼ «u-»/«r-» case of
# `locales/quc` seen in a Philippine language — an affix whose shape an unknown
# following word decides — and unlike the Bisayan and Bikol linkers it has no
# form that is right in both places, so it cannot simply be written out in full.
#
# Every entry in this catalog's own tables is consonant-initial but one: «asul».
# So every ligature that lands in front of a placeable is written «a», which is
# right for every word this file supplies except that one, and right for an
# author's own `lineColorWord` unless they wrote a vowel-initial word. A
# corrector adding a vowel-initial colour or noun has to check the ligature
# beside it; that is the one thing in this file a table edit can break.
#
# The adjectives **precede** the noun, which is English's order and Ilocano's
# ordinary one for a descriptive phrase.
#
# The geometry vocabulary is largely Spanish-derived — «linia», «sirkulo»,
# «poligono» — because that is the vocabulary Philippine mathematics teaching
# carries, in Ilocano as in Tagalog. The colours and the everyday words are
# Ilocano's own.


## Style vocabulary

color =
    .black = nangisit
    .white = puraw
    .gray = dapo
    .red = nalabaga
    .orange = kahel
    .yellow = duyaw
    .green = berde
    .cyan = sian
    .blue = asul
    .purple = lila
    .pink = rosas
    .brown = kapé
line-width =
    .thick = napuskol
    .thin = nanipis
line-style =
    .dashed = naguris-guris
    .dotted = natuldek-tuldek
# Noun phrases. Ilocano marks no plural on the noun, so «guris» is the word for
# one line and for many alike; these are not plurals of anything.
fill-style =
    .horizontal = pakleb a guris
    .vertical = takder a guris
    .diagonal = kilo a guris
    .backdiagonal = supadi a kilo a guris
    .dots = tuldek
    .diamonds = diamante
noun =
    .line = linia
    .line-segment = segmento
    .ray = sinag
    .vector = bektor
    .curve = kurba
    .function = punsion
    .parabola = parabola
    .polyline = polilinia
    .polygon = poligono
    .triangle = triangulo
    .rectangle = rektanggulo
    .circle = sirkulo
    .region = rehion
    .point = punto
    .square = kuadrado
    .diamond = diamante
    .cross = krus
    .plus = plus
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they describe. «nga» here is correct and fixed: «addaan» is
# vowel-initial and is this catalog's own word.
noun-regular-polygon =
    { $part ->
        [tail] nga addaan iti { $numSides } a sikigan
       *[head] regular a poligono
    }
# One answer for every noun: Ilocano has no grammatical gender, so nothing
# downstream has anything to agree with.
noun-gender = neuter

## Style composition

# Each ligature is written «a», the form before a consonant — see the header.
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
style-filled-word = napunno
style-filled =
    { $parts ->
        [pattern] { $filled } a { $color } nga addaan iti { $pattern }
       *[plain] { $filled } a { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } a { $color } a { $noun } nga addaan iti { $pattern }
        [plain-tail] { $filled } a { $color } a { $noun } { $nounTail }
        [pattern-tail] { $filled } a { $color } a { $noun } { $nounTail } nga addaan iti { $pattern }
       *[plain] { $filled } a { $color } a { $noun }
    }
# Ilocano has no article, so the two `-article` branches say what the other two
# say. They are kept apart because English's distinction is between a first
# clause and a further one, which this file does mark: «nga addaan iti» against
# «ken». The ligature in front of «igid» is «nga» and is fixed, because «igid»
# is vowel-initial and this catalog writes it.
style-border-clause =
    { $parts ->
        [with-article] nga addaan iti { $border } nga igid
        [and] ken { $border } nga igid
        [and-article] ken { $border } nga igid
       *[with] nga addaan iti { $border } nga igid
    }
style-fill =
    { $parts ->
        [pattern] { $color } a { $pattern }
       *[plain] { $color }
    }
style-unfilled = saan a napunno
style-text =
    { $parts ->
        [background] { $color } nga addaan iti { $background } a likudan
       *[plain] { $color }
    }
style-background-none = awan

## Boolean words

boolean-true = pudno
boolean-false = saan a pudno

## Answer buttons

answer-submit-label = Sukimaten ti sungbat
answer-submit-label-no-correctness = Ipatulod ti sungbat

## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Ilocano marks number on the article rather than on the noun, and a
# heading carries no article. Two ids with one translation is what that looks
# like here, not a copy-paste.
section-name =
    .activity = Aktibidad
    .aside = Nota iti sikigan
    .cascade = Kaskada
    .definition = Depinision
    .example = Ehemplo
    .exercise = Ehersisio
    .exercises = Ehersisio
    .given-answer = Sungbat
    .note = Nota
    .objectives = Panggep
    .paragraphs = Parapo
    .part = Paset
    .problem = Problema
    .problems = Problema
    .proof = Pammaneknek
    .question = Saludsod
    .section = Seksion
    .solution = Solusion
    .task = Trabaho
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
hint-title = Palagip

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabla { $enumeration }
        [numbered-title] Tabla { $enumeration }{ ": " }
        [unnumbered-title] Tabla{ ": " }
       *[unnumbered] Tabla
    }
figure-name =
    { $parts ->
        [numbered] Pigura { $enumeration }
        [numbered-caption] Pigura { $enumeration }{ ": " }
        [unnumbered-caption] Pigura{ ": " }
       *[unnumbered] Pigura
    }

## Paginator controls

paginator-previous = Napalabas
paginator-next = Sumaruno
paginator-page = Panid
paginator-page-status = { $pageLabel } { $currentPage } iti { $numPages }

## Piecewise functions

piecewise-condition-or = wenno
piecewise-condition-if = no
piecewise-condition-otherwise = no saan

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Philippine secondary science is taught in English from the
## intermediate grades, so the periodic table an Ilocano pupil meets is the
## English one — the same reason `locales/fil` and `locales/ceb` leave these
## keys out, and a fact about one school system rather than about the seven
## Philippine languages the roster now carries.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Imbalido a simbolo a kemikal
chemistry-invalid-ionic-compound = Imbalido a kompuesto nga ioniko
