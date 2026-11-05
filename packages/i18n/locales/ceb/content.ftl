# Cebuano content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Cebuano has no grammatical gender, no adjective agreement, no article and no
# case, so `$gender` and `$role` go unused here exactly as they do in English,
# and the two `-article` branches read like the ones without.
#
# THE LINKER. What Cebuano does have, and what shapes every composition message
# below, is a linker between a noun and what modifies it: «nga». The noun leads
# and its adjectives follow it, each joined by «nga» — «linya nga baga nga
# pula». After a vowel the linker contracts onto the word in front of it
# («pulang linya»), and this catalog never writes that contraction: the word in
# front is almost always a placeable whose last letter the catalog cannot see.
# The free «nga» is grammatical after a consonant and merely uncontracted after
# a vowel, which is the same stiffness `locales/fil` documents for its own
# linker, and the one place this seed is deliberately stiff.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

color =
    .black = itom
    .white = puti
    .gray = abuhon
    .red = pula
    .orange = kahel
    .yellow = dalag
    .green = lunhaw
    .cyan = cyan
    .blue = asul
    .purple = purpura
    .pink = rosas
    .brown = tabunon
line-width =
    .thick = baga
    .thin = nipis
line-style =
    .dashed = putol-putol
    .dotted = tuldok-tuldok
# Noun phrases: they follow «uban ang» and modify nothing, so they take no
# linker.
fill-style =
    .horizontal = mga linya nga pahigda
    .vertical = mga linya nga patindog
    .diagonal = mga linya nga pahilis
    .backdiagonal = mga linya nga pahilis pabalik
    .dots = mga tuldok
    .diamonds = mga diyamante
noun =
    .line = linya
    .line-segment = bahin sa linya
    .ray = sinag
    .vector = bektor
    .curve = kurba
    .function = punsyon
    .parabola = parabola
    .polyline = poliline
    .polygon = poligono
    .triangle = triyanggulo
    .rectangle = rektanggulo
    .circle = sirkulo
    .region = rehiyon
    .point = punto
    .square = kwadrado
    .diamond = diyamante
    .cross = krus
    .plus = timaan sa dugang
# The side count follows the noun with «nga» and «ka», the numeral linker, and
# precedes the adjectives, so it folds into the head and there is no tail:
# «regular nga poligono nga { $numSides } ka kilid».
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regular nga poligono nga { $numSides } ka kilid
    }
# Cebuano has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English.
noun-gender = neuter

## Style composition

# The adjectives are joined to each other by the same linker that joins them to
# the noun.
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
# The noun leads and the linker introduces its adjectives: «linya nga baga nga
# putol-putol nga pula».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } nga { $description } { $nounTail }
       *[noun] { $noun } nga { $description }
    }
style-filled-word = puno
style-filled =
    { $parts ->
        [pattern] { $filled } nga { $color } uban ang { $pattern }
       *[plain] { $filled } nga { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } nga { $filled } nga { $color } uban ang { $pattern }
        [plain-tail] { $noun } { $nounTail } nga { $filled } nga { $color }
        [pattern-tail] { $noun } { $nounTail } nga { $filled } nga { $color } uban ang { $pattern }
       *[plain] { $noun } nga { $filled } nga { $color }
    }
# Cebuano needs no article, so the `-article` branches read like the ones
# without.
style-border-clause =
    { $parts ->
        [with-article] uban ang utlanan nga { $border }
        [and] ug utlanan nga { $border }
        [and-article] ug utlanan nga { $border }
       *[with] uban ang utlanan nga { $border }
    }
# The pattern is a noun and the colour follows it with the linker.
style-fill =
    { $parts ->
        [pattern] { $pattern } nga { $color }
       *[plain] { $color }
    }
style-unfilled = walay sulod
style-text =
    { $parts ->
        [background] { $color } uban ang luyo nga { $background }
       *[plain] { $color }
    }
style-background-none = wala

## Boolean words

boolean-true = tinuod
boolean-false = bakak

## Answer buttons

answer-submit-label = Susiha ang Buhat
answer-submit-label-no-correctness = Ipadala ang Tubag

## Sectional blocks

section-name =
    .activity = Kalihokan
    .aside = Tabok nga nota
    .cascade = Sunodsunod
    .definition = Kahulogan
    .example = Pananglitan
    .exercise = Ehersisyo
    .exercises = Mga ehersisyo
    .given-answer = Tubag
    .note = Nota
    .objectives = Mga tumong
    .paragraphs = Mga parapo
    .part = Bahin
    .problem = Problema
    .problems = Mga problema
    .proof = Pamatuod
    .question = Pangutana
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
hint-title = Timailhan

## Tables and figures

# «talaan», a tabulation, and not «lamesa», which is the Spanish-derived word
# for the piece of furniture.
table-name =
    { $parts ->
        [numbered] Talaan { $enumeration }
        [numbered-title] Talaan { $enumeration }{ ": " }
        [unnumbered-title] Talaan{ ": " }
       *[unnumbered] Talaan
    }
figure-name =
    { $parts ->
        [numbered] Hulagway { $enumeration }
        [numbered-caption] Hulagway { $enumeration }{ ": " }
        [unnumbered-caption] Hulagway{ ": " }
       *[unnumbered] Hulagway
    }

## Paginator controls

paginator-previous = Miagi
paginator-next = Sunod
paginator-page = Panid
paginator-page-status = { $pageLabel } { $currentPage } sa { $numPages }

## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = kon
piecewise-condition-otherwise = kon dili

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Philippine science is taught in English from the intermediate grades, so the
## fallback here *is* the curriculum — the same decision `locales/fil` records,
## and for the same school system rather than for two different reasons.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Dili Balido nga Simbolo sa Kemikal
chemistry-invalid-ionic-compound = Dili Balido nga Ionic nga Compound
