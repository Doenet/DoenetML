# Skolt Sami content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Latin script with Skolt's own letters and the palatalisation mark
# `ʹ`; see `chrome.ftl` for what that mark is and for how much of this
# vocabulary is derived from Northern Sami rather than attested in Skolt.
#
# This catalog selects on neither `$gender` nor `$role`, for the reason
# `locales/se` gives: a Sami adjective standing in front of a noun takes a
# special **attributive** form, and that form agrees with nothing at all — not
# with the noun's case, not with its number, and Sami has no gender for it to
# agree with. So one word serves every position, and a `$role` fork would write
# four copies of one string.
#
# The attributive is not the same word as the predicative, and the two
# positions these words are rendered in want different ones. Every composed
# description puts the adjective in front of a noun and wants the attributive;
# only `backgroundColor` and `textColor` standing alone, reported as bare state
# variables, would want the predicative. This catalog writes the attributive
# throughout, so those two read as the front half of a phrase whose noun has
# not arrived — the same trade `locales/se`, `locales/st` and `locales/tn`
# make, and for the same reason: `$role` cannot tell the two positions apart,
# because `standalone` is both of them.
#
# Adjectives precede the noun, as in English, so the composition messages at
# the foot of the file keep the English order.
#
# The borrowed colours — «oranž», «turkos», «fiolett», «roosa» — have no
# attributive of their own and are cited in one shape. That the table is uneven
# is a fact about which colour words Sami inherited and which it borrowed.


## Style vocabulary

color =
    .black = čâppes
    .white = viõlgges
    .gray = ränes
    .red = rukses
    .orange = oranž
    .yellow = fiskkâd
    .green = ruånn
    .cyan = turkos
    .blue = alggâd
    .purple = fiolett
    .pink = roosa
    .brown = ruåšǩes
line-width =
    .thick = âsses
    .thin = seäggas
line-style =
    .dashed = säʹrǧǧlaž
    .dotted = čuõkkâzlaž
# Comitative plurals. The `-vuiʹm` ending is Skolt's own word for "with", which
# is why `style-filled` below places these straight after the colour and writes
# no preposition of its own: the ending already said it.
fill-style =
    .horizontal = horisontaal säʹrǧǧivuiʹm
    .vertical = vertikaal säʹrǧǧivuiʹm
    .diagonal = diagonaal säʹrǧǧivuiʹm
    .backdiagonal = nuuʹbb beälla diagonaal säʹrǧǧivuiʹm
    .dots = čuõkkâzivuiʹm
    .diamonds = rombivuiʹm
noun =
    .line = linjj
    .line-segment = linjjbieʹss
    .ray = peällinjj
    .vector = vektor
    .curve = kuurv
    .function = funktio
    .slope-field = luâđđamvääʹld
    .vector-field = vektorvääʹld
    .parabola = parabol
    .polyline = mäŋgglinjj
    .polygon = polygon
    .triangle = kolmmčiõkk
    .rectangle = rektangel
    .circle = ǩirmmâz
    .region = vuʹvdd
    .point = čuõkkâz
    .square = kvadraatt
    .diamond = romb
    .cross = ruõss
    .plus = plus
# Skolt keeps the side count in front of the noun, so the whole of it is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] tässõs { $numSides }-peällsaž polygon
    }
# Sami has no grammatical gender, so nothing above reads this and every noun
# answers alike. It is here because the argument is passed to every adjective
# and a message that resolves to nothing would render `{noun-gender}`.
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
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
style-filled-word = teâvvtum
# The pattern words carry their own «with» in their comitative ending, so
# nothing is written between them and what they follow.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «rääʹdivuiʹm» is «rääʹdd», a border, in the comitative — the case that carries
# "with" — so the clause needs no preposition either. Sami has no article, so
# the two `-article` branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] { $border } rääʹdivuiʹm
        [and] da { $border } rääʹdivuiʹm
        [and-article] da { $border } rääʹdivuiʹm
       *[with] { $border } rääʹdivuiʹm
    }
style-fill =
    { $parts ->
        [pattern] { $color } teâvvtõs { $pattern }
       *[plain] { $color } teâvvtõs
    }
style-unfilled = teâvvtõõttâm
style-text =
    { $parts ->
        [background] { $color } { $background } tuâǥǥažvuiʹm
       *[plain] { $color }
    }
style-background-none = ij mõõnn

## Boolean words

boolean-true = tuõtt
boolean-false = eʹpptuõtt

## Answer buttons

answer-submit-label = Taʹrǩast tuâj
answer-submit-label-no-correctness = Vuõlttâd vaʹsttõõzz

## Sectional blocks

section-name =
    .activity = Tuâjj
    .aside = Lââʹsstekst
    .cascade = Kaskaad
    .definition = Meäʹrtõs
    .example = Ouddmiârkk
    .exercise = Härjjtõs
    .exercises = Härjjtõõzz
    .given-answer = Vaʹsttõs
    .note = Miârkkšõõvvâm
    .objectives = Täävtõõzz
    .paragraphs = Teekstbieʹss
    .part = Vueʹss
    .problem = Tuâjjkõõččmõš
    .problems = Tuâjjkõõččmõõžž
    .proof = Tuõđštõs
    .question = Kõõččmõš
    .section = Kapiittel
    .solution = Čåuddmõš
    .task = Tuâjj
    .theorem = Teorem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Rääʹvv

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabeʹll { $enumeration }
        [numbered-title] Tabeʹll { $enumeration }{ ": " }
        [unnumbered-title] Tabeʹll{ ": " }
       *[unnumbered] Tabeʹll
    }
figure-name =
    { $parts ->
        [numbered] Kaartt { $enumeration }
        [numbered-caption] Kaartt { $enumeration }{ ": " }
        [unnumbered-caption] Kaartt{ ": " }
       *[unnumbered] Kaartt
    }

## Paginator controls

paginator-previous = Ouddel
paginator-next = Pueʹtti
paginator-page = Seidd
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## «jõs» opens the clause it conditions and so places straight in front of the
## mathematics, which is where the renderer puts it — none of the trouble
## `locales/kv`, `locales/chm` and `locales/dv` record with a clause-final
## conditional arises here.

piecewise-condition-or = leʹbe
piecewise-condition-if = jõs
piecewise-condition-otherwise = nuuʹbb naaʹlin

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Skolt-medium schooling in Finland does not
## reach secondary chemistry: a Skolt-speaking pupil meets the elements under
## their **Finnish** names, out of a Finnish textbook, so the English fallback
## stands nearer that textbook than 118 invented Skolt coinages would. The
## Finnish table is not reproduced here either, because writing Finnish into a
## catalog labelled `sms` would report a fact about a school system rather than
## about the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Kuõskteʹmes kemialaž symbol
chemistry-invalid-ionic-compound = Kuõskteʹmes ioonlaž õhttvuõtt
