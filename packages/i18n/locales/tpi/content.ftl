# Tok Pisin content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Tok Pisin has no grammatical gender and no case, so `noun-gender` answers one
# token for every noun.
#
# **`-pela` is this catalog's whole story, and it is a `$role` fork that cannot
# be written.** An attributive adjective in Tok Pisin carries the suffix
# «-pela» and stands **before** the noun — «retpela lain», a red line — while a
# predicative one drops it: «lain i ret». Those are two forms of one word, and
# which is wanted depends on the position the phrase is going into, which is
# exactly what `$role` names.
#
# It cannot be used here. `standalone` covers **both** the citation form a state
# variable reports and the attributive use inside `style-with-noun` — see
# `attachNoun` in `@doenet/utils/style/styleDescriptions.ts`, which passes
# `role: "standalone"` for the phrase that is about to be put in front of a
# noun. So one token arrives for two positions, and this catalog writes the
# `-pela` form throughout, which is right wherever a noun follows and reads as
# the attributive form where `backgroundColor` reports a colour on its own. The
# three clause roles get `-pela` too, since a noun follows in each.
#
# That is worth recording as a limitation of the argument rather than of the
# language: `$gender`'s token set and `$role`'s are the catalog's own business,
# but a distinction the *code* does not draw is one no catalog can recover. A
# later split of `standalone` into a citation position and an attributive one is
# what this file would want, and `locales/tpi` is the first catalog that would
# use it.
#
# The adjectives therefore **precede** the noun, as in English and as in the
# five Philippine catalogs of this batch, and unlike the nine others.
#
# The geometry vocabulary is largely English-derived, because PNG teaches
# mathematics in English; where Tok Pisin has its own word it is written.


## Style vocabulary

color =
    .black = blakpela
    .white = waitpela
    .gray = gripela
    .red = retpela
    .orange = orenspela
    .yellow = yelopela
    .green = grinpela
    .cyan = sianpela
    .blue = blupela
    .purple = purpelpela
    .pink = pingpela
    .brown = braunpela

line-width =
    .thick = patpela
    .thin = tinpela

line-style =
    .dashed = brukbruk
    .dotted = tikitiki

# Noun phrases. Tok Pisin marks no plural on the noun, so «lain» is the word for
# one line and for many alike; «ol» before it is the plural and a description
# does not carry it.
fill-style =
    .horizontal = ol lain i slip
    .vertical = ol lain i sanap
    .diagonal = ol lain i go krungut
    .backdiagonal = ol lain i go krungut long narapela sait
    .dots = ol tiki
    .diamonds = ol daimon

noun =
    .line = lain
    .line-segment = hap lain
    .ray = ret
    .vector = vekta
    .curve = kurup
    .function = pankisen
    .parabola = parabola
    .polyline = planti hap lain
    .polygon = poligon
    .triangle = trianggel
    .rectangle = rektanggel
    .circle = raunpela
    .region = hap
    .point = poin
    .square = skwea
    .diamond = daimon
    .cross = kruse
    .plus = plas

# The side count follows the noun as a complement, because «-pela» adjectives
# must sit directly in front of it and a counted phrase in front of them would
# read as a comment on the sides.
noun-regular-polygon =
    { $part ->
        [tail] i gat { $numSides } sait wankain
       *[head] poligon
    }

# One answer for every noun: Tok Pisin has no grammatical gender.
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

style-filled-word = pulapela

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } wantaim { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } wantaim { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } wantaim { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# Tok Pisin has no article, so the two `-article` branches say what the other
# two say. They are kept apart because English's distinction is between a first
# clause and a further one, which this file does mark: «wantaim» against «na».
style-border-clause =
    { $parts ->
        [with-article] wantaim { $border } arere
        [and] na { $border } arere
        [and-article] na { $border } arere
       *[with] wantaim { $border } arere
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = i no pulap

style-text =
    { $parts ->
        [background] { $color } wantaim { $background } baksait
       *[plain] { $color }
    }

style-background-none = i no gat


## Boolean words

boolean-true = tru
boolean-false = giaman


## Answer buttons

answer-submit-label = Skelim wok
answer-submit-label-no-correctness = Salim bekim


## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Tok Pisin marks number with «ol» rather than on the noun, and a heading
# does not carry it.
section-name =
    .activity = Wok
    .aside = Tok long arere
    .cascade = Kaskad
    .definition = Mining
    .example = Piksa tok
    .exercise = Traim wok
    .exercises = Traim wok
    .given-answer = Bekim
    .note = Tok
    .objectives = Ol as tingting
    .paragraphs = Ol paragraf
    .part = Hap
    .problem = Askim hatwok
    .problems = Askim hatwok
    .proof = Pruv
    .question = Askim
    .section = Seksen
    .solution = Rot bilong bekim
    .task = Wok
    .theorem = Tiorem

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Tok helpim


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tebol { $enumeration }
        [numbered-title] Tebol { $enumeration }{ ": " }
        [unnumbered-title] Tebol{ ": " }
       *[unnumbered] Tebol
    }

figure-name =
    { $parts ->
        [numbered] Piksa { $enumeration }
        [numbered-caption] Piksa { $enumeration }{ ": " }
        [unnumbered-caption] Piksa{ ": " }
       *[unnumbered] Piksa
    }


## Paginator controls

paginator-previous = Bipo
paginator-next = Neks
paginator-page = Pes

paginator-page-status = { $pageLabel } { $currentPage } bilong { $numPages }


## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = sapos
piecewise-condition-otherwise = sapos nogat


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Papua New Guinea teaches secondary science in English, so the
## periodic table a pupil meets is the English one, and Tok Pisin has no settled
## table of its own to seed from. Tok Pisin does name the substances known long
## before the elements were — «ain» for iron, «gol» for gold — and those, rather
## than the whole 118, are where a speaker should start.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Simbol kemikol i no stret
chemistry-invalid-ionic-compound = Kompaun aionik i no stret
