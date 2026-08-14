# Susu content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `sus` is Susu, of Guinea (and the Sierra Leone and Guinea-Bissau border
# areas). It is the fourth catalog in this batch to come from the Mande
# family, after `bm` (Bambara), `dyu` (Dyula) and `mnk` (Mandinka) — and the
# fourth to fork on nothing here. Susu is Central Mande, Soso-Jalonke branch,
# a different branch from the Manding languages the other three belong to,
# but the property that matters for this file is shared across the whole
# family: Susu has no grammatical gender or noun class, no article and no
# case, so `$gender` and `$role` go unused exactly as they do in `bm`, `dyu`
# and `mnk` — a fourth flat `noun-gender` message where four Mande catalogs in
# a row now agree on the same shape, for the same reason, across two branches
# of the family rather than one.
#
# What Susu marks a description with instead is a **definite suffix**,
# `-i` (surfacing as `-yi`/`-ni` by vowel harmony), which closes a noun
# phrase much as Mandinka's `-o` does: «sira fini» ("the black line"). It sits
# on the word the catalog writes, not on a placeable, so it is nothing like
# the affix rule's problem cases — worth naming for the same reason Mandinka's
# suffix is.
#
# Adjectives follow the noun, so the composition messages put the noun first,
# matching `bm`/`dyu`/`mnk`.
#
# The secondary style colors (`gray`, `orange`, `purple`, `pink`, `brown`,
# `cyan`) are French loanwords here rather than native Susu coinages: Guinea's
# language of schooling is French, and everyday Susu already borrows these
# color names from it rather than deriving them, which this seed follows
# instead of inventing terms no speaker would recognize.
#
# The chemistry note at the foot of this file explains why `element-name` and
# `element-anion-name` are absent.


## Style vocabulary

color =
    .black = fini
    .white = ferai
    .gray = grii
    .red = wulii
    .orange = oranjii
    .yellow = jonii
    .green = gbelii
    .cyan = siyanii
    .blue = bului
    .purple = volei
    .pink = rozii
    .brown = mawoni

line-width =
    .thick = xungbei
    .thin = fisenyi

# Written as invariable «nun …» (with …) phrases rather than as qualifiers, so
# that they take no `-i` agreement and can close the description.
# `style-stroke` puts them last.
line-style =
    .dashed = nun tuten-tutenyi
    .dotted = nun tonbondiyie

fill-style =
    .horizontal = sirandie naxee laariyaxi
    .vertical = sirandie naxee lookuxi
    .diagonal = sirandie naxee xungenxi
    .backdiagonal = sirandie naxee xungenxi fari doo ma
    .dots = tonbondiye
    .diamonds = diamanie

noun =
    .line = sira
    .line-segment = sira kuntu
    .ray = rayi
    .vector = vektɔri
    .curve = sira xungenxi
    .function = fonksioni
    .parabola = parabɔli
    .polyline = sira kuntu wuyaxi
    .polygon = poligoni
    .triangle = triyangili
    .rectangle = rektangili
    .circle = kurunyi
    .region = zoni
    .point = tonbo
    .square = karei
    .diamond = diamani
    .cross = kurusi
    .plus = lafan taamasenyi

# The side count follows the qualifiers, behind «naxan sɔtɔ …», because Susu
# closes a noun phrase with a relative rather than opening one — matching
# `mnk`'s shape for this message.
noun-regular-polygon =
    { $part ->
        [tail] naxan sɔtɔ kore { $numSides } ra
       *[head] poligoni tɛmɛxi
    }

# No grammatical gender, so this answers one token for every noun and the
# answer goes unused — the shape `locales/en`, `bm`, `dyu` and `mnk` all
# share.
noun-gender = kereni


## Style composition

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

style-filled-word = ki rafexi

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } nun { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } nun { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } nun { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# Susu has no article, and joins this clause with the invariable «nun»
# whatever came before it, so all four branches read alike — the shape
# `mnk`'s equivalent message uses with «niŋ».
style-border-clause =
    { $parts ->
        [with-article] nun naanewo { $border }
        [and] nun naanewo { $border }
        [and-article] nun naanewo { $border }
       *[with] nun naanewo { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = naxan mu rafexi

style-text =
    { $parts ->
        [background] { $color } nun raxidi { $background }
       *[plain] { $color }
    }

style-background-none = fɛn mu a ra


## Boolean words

boolean-true = tonyi
boolean-false = wafan


## Answer buttons

answer-submit-label = Dɔxɔliyi Matoxin
answer-submit-label-no-correctness = Yabi Rasa


## Sectional blocks

section-name =
    .activity = Dɔxɔliyi
    .aside = Lafanyi
    .cascade = Tɛmɛxi
    .definition = Kotoyi
    .example = Misali
    .exercise = Dɔxɔliyi Koleyi
    .exercises = Dɔxɔliyie Koleyie
    .given-answer = Yabi
    .note = Xaranyi
    .objectives = Fɛɛre
    .paragraphs = Kumakane
    .part = Kore
    .problem = Kuu Koleyi
    .problems = Kuue Koleye
    .proof = Seedeyi
    .question = Maxandi
    .section = Karan Kore
    .solution = Yabi Nakusa
    .task = Dɔxɔliyi
    .theorem = Teoremi

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Malaxidi


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabuli { $enumeration }
        [numbered-title] Tabuli { $enumeration }{ ": " }
        [unnumbered-title] Tabuli{ ": " }
       *[unnumbered] Tabuli
    }

figure-name =
    { $parts ->
        [numbered] Natanmayi { $enumeration }
        [numbered-caption] Natanmayi { $enumeration }{ ": " }
        [unnumbered-caption] Natanmayi{ ": " }
       *[unnumbered] Natanmayi
    }


## Paginator controls

paginator-previous = Naxan tɛmɛn
paginator-next = Naxan fa
paginator-page = Karati

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = waraxa

piecewise-condition-if = xa

piecewise-condition-otherwise = dulaa dɔɔ bɛɛ ma


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case, matching `bm` and `dyu`: Guinean secondary science
## is taught in French, so a Susu-speaking student meets the periodic table
## there, and the fallback to English rather than to a settled Susu list is
## the wrong-but-least-wrong answer for the same reason it is for Bambara and
## Dyula speakers one and two borders away. Verified rather than assumed —
## Guinea's medium of secondary instruction is French, unlike Mandinka's
## three-country, three-medium spread that `mnk`'s note documents.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Simi Taamasenyi Mu Tonyi Ra
chemistry-invalid-ionic-compound = Iyɔn Rafexi Mu Tonyi Ra
