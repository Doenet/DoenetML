# Madurese content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written throughout in **enjâ'-iyâ**, the plain everyday speech level; see
# `chrome.ftl`'s header for why a catalog must pick one level and stay in it.
#
# Madurese has no grammatical gender and no case, so `noun-gender` answers one
# token for every noun and nothing here selects on `$gender` or on `$role`.
#
# The adjectives **follow** the noun — «garis mera», a red line — so every
# composition message inverts the English order.
#
# The geometry vocabulary is largely the Indonesian one, because Madurese
# schools teach mathematics out of Indonesian-language textbooks; the colours,
# the widths and the everyday words are Madurese.


## Style vocabulary

color =
    .black = celleng
    .white = pote
    .gray = abu-abu
    .red = mera
    .orange = oranyè
    .yellow = konèng
    .green = ijo
    .cyan = sian
    .blue = biru
    .purple = ungu
    .pink = mera ngodhâ
    .brown = coklat

line-width =
    .thick = kandel
    .thin = tipis

line-style =
    .dashed = pote'-pote'
    .dotted = titik-titik

# Noun phrases. Madurese marks no plural on the noun, so «garis» is the word for
# one line and for many alike.
fill-style =
    .horizontal = garis malèntang
    .vertical = garis majhâjhâr
    .diagonal = garis mèrèng
    .backdiagonal = garis mèrèng tabâli'
    .dots = titik
    .diamonds = bellâ ketupat

noun =
    .line = garis
    .line-segment = roas garis
    .ray = sinar
    .vector = vektor
    .curve = lengkong
    .function = fungsi
    .parabola = parabola
    .polyline = garis potong
    .polygon = poligon
    .triangle = segitiga
    .rectangle = pasagi lanjhâng
    .circle = bunderan
    .region = dhâerâ
    .point = titik
    .square = pasagi
    .diamond = bellâ ketupat
    .cross = sèlang
    .plus = plus

# The side count follows the adjectives as a complement, so that they stay
# beside the noun they describe.
noun-regular-polygon =
    { $part ->
        [tail] se badâ { $numSides } essèna
       *[head] poligon beraturan
    }

# One answer for every noun: Madurese has no grammatical gender.
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

# The noun first and the adjectives behind it, which is the opposite of English.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = possa'

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } bân { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } bân { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } bân { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# Madurese has no article, so the two `-article` branches say what the other two
# say. They are kept apart because English's distinction is between a first
# clause and a further one, which this file does mark: «bân» against «sarta».
style-border-clause =
    { $parts ->
        [with-article] bân penggir { $border }
        [and] sarta penggir { $border }
        [and-article] sarta penggir { $border }
       *[with] bân penggir { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = ta' possa'

style-text =
    { $parts ->
        [background] { $color } bân latar { $background }
       *[plain] { $color }
    }

style-background-none = tadâ'


## Boolean words

boolean-true = bendher
boolean-false = sala


## Answer buttons

answer-submit-label = Pareksa lalakon
answer-submit-label-no-correctness = Kèrèm jhâwâban


## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Madurese marks no plural on the noun.
section-name =
    .activity = Kagiyâtan
    .aside = Catetan penggir
    .cascade = Kaskade
    .definition = Bâtessa
    .example = Conto
    .exercise = Latèyan
    .exercises = Latèyan
    .given-answer = Jhâwâban
    .note = Catetan
    .objectives = Tojjhuwân
    .paragraphs = Paragraf
    .part = Bâgiyân
    .problem = Soal
    .problems = Soal
    .proof = Bukte
    .question = Pertanyaan
    .section = Bâgiyân
    .solution = Panyalesaan
    .task = Tugas
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

hint-title = Petodu


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabel { $enumeration }
        [numbered-title] Tabel { $enumeration }{ ": " }
        [unnumbered-title] Tabel{ ": " }
       *[unnumbered] Tabel
    }

figure-name =
    { $parts ->
        [numbered] Gâmbhâr { $enumeration }
        [numbered-caption] Gâmbhâr { $enumeration }{ ": " }
        [unnumbered-caption] Gâmbhâr{ ": " }
       *[unnumbered] Gâmbhâr
    }


## Paginator controls

paginator-previous = Sabellunna
paginator-next = Salanjudde
paginator-page = Kaca

paginator-page-status = { $pageLabel } { $currentPage } dâri { $numPages }


## Piecewise functions

piecewise-condition-or = otabâ
piecewise-condition-if = mon
piecewise-condition-otherwise = mon bunten


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Madurese schools teach chemistry out of Indonesian-language
## textbooks, so the periodic table a Madurese pupil meets is `locales/id`'s,
## and Madurese has no settled table of its own to seed from.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Simbol kimia se ta' sah
chemistry-invalid-ionic-compound = Sanyawa ionik se ta' sah
