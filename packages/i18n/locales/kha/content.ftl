# Khasi (Ka Ktien Khasi) content catalog: the prose the core computes into the
# document — style descriptions, boolean words, section names, the words a
# piecewise function is read with. Selected by `documentLocale`, which follows
# the language the activity was written in rather than the reader's UI
# language.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator, and
# no permission is needed to change a word.
#
# **Orthography: Roman, with its diacritics.** Khasi has been written in the
# Roman alphabet since the Welsh Presbyterian mission, and no other script is
# at issue for it. The three marks that alphabet carries are used consistently:
# `ï` (U+00EF) in «ïa» and «ïaid», `ñ` (U+00F1) in «kñi» and its relatives, and
# the ASCII apostrophe `'` (U+0027) for the glottal stop in «ka'», never the
# typographic U+2019.
#
# **Word order: postnominal.** A Khasi attributive adjective follows its noun.
# So `style-with-noun` and `style-filled-with-noun` put `{ $noun }` *before*
# `{ $description }` — the reverse of English's sequence of placeables — and
# `style-fill` puts the pattern before its colour: "diamonds blue", not "blue
# diamonds". Inside `style-stroke` the internal order of width, dash pattern
# and colour is left as English has it, since all three are adjectives and none
# of them outranks the others in Khasi.
#
# **The attributive «ba-» prefix is written into the catalog's own words, not
# welded onto a placeable.** This is the interesting thing about this file. A
# Khasi adjective in attributive position carries «ba-» — «balieh» *white*,
# «basaw» *red*, «bathiang» *green*, «bakhraw» *big* — and the README's rule
# that an affix cannot be attached to a placeable would bite hard if the
# catalog tried to add it at composition time. It does not have to: `color`,
# `line-width` and `line-style` are the catalog's own words, so each of them is
# spelled with its «ba-» already on it and every composition message is a plain
# juxtaposition of finished words. Nothing here runs into the affix constraint.
#
# **No `$gender` fork and no `$role` fork — and Khasi's is a near miss worth
# writing down.** Khasi does have grammatical gender, four ways: «u»
# masculine, «ka» feminine, «i» diminutive, «ki» plural. But the gender falls
# on the *article or pronoun that precedes the noun*, not on the adjective.
# The messages that meet the noun — `style-with-noun`, `style-filled-with-noun`
# — are never handed `$gender`; only the adjectives are, and a Khasi adjective
# does not agree with anything. So no article is placed anywhere in this file,
# `noun-gender` answers the single token `neuter`, and every adjective ignores
# the argument it is given. This is a fact about *where* the agreement sits, not
# about whether the language has one.
#
# **Nothing selects on a count.** A Khasi noun is not marked for number after a
# numeral, and CLDR has no plural data for `kha` in any case. There is no
# one/other plural branch anywhere in these four files.
#
# **`[noun-tail]` is unused.** `noun-regular-polygon` fills `head` and leaves
# `tail` empty, exactly as English does: the side count sits with the noun in
# Khasi too, in front of it, so nothing is left over to follow the adjectives.
# The `-tail` variants are kept because they are what a partly-translated
# locale falls back to.
#
# **`piecewise-condition-if` is «lada»**, which is clause-initial in Khasi. The
# renderer places the mathematics after this word, and «lada» is exactly where
# a Khasi reader expects the conditional marker to be — so unlike some catalogs
# in this batch, the word and the notation need no reordering to read right.
#
# **Vocabulary: a large part of it is an English loan, and that is declared
# rather than disguised.** Meghalaya teaches mathematics and secondary science
# in English, so the geometry and computing words a Khasi classroom uses are
# the English ones, written here in their English spelling: `line`, `vector`,
# `function`, `polygon`, `circle`, `interval`, `matrix`, `statistik`,
# `paragraf`, `seksan`, `tebul`, `peij`. What is genuinely Khasi is the
# ordinary vocabulary around them — the colour terms «lieh», «iong», «saw»,
# «thiang», the size words «khraw» and «rit», «dur» *picture*, «bynta» *part*,
# «nuksa» *example*, «jingkylli» *question*, «jingjubab» *answer*,
# «jingpyrshang» *exercise*, «jingbatai» *explanation*, «kyrteng» *name*,
# «shaphang» *about*, «hok» *true*, «bakhlem hok» *false*, «ym don» *none*,
# «kam» *work/task*, «lada» *if*, «ne» *or*, «lymne» *otherwise*.
#
# **Words to check first:** «bathiang» for *green* (the seed also considered
# «bastem», which some speakers use for the same band of colour, and a reviewer
# should pick one and apply it consistently); «bakhraw»/«barit» for a stroke's
# *thick* and *thin*, which are the ordinary words for big and small and may be
# wrong for a line; «Jingpynbeit» for *solution*, which is a coinage; «kyrdan»
# for a shape's *border*; and «blank», left as a loan because the seed found no
# Khasi word it was confident of for the gap an input fills inside typeset
# mathematics.
#
# **`element-name` and `element-anion-name` are deliberately absent**, so all
# 130 of those keys fall back to English and `lint:i18n` reports the gap. This
# is not an oversight and should not be "fixed" by transliteration. Meghalaya
# teaches secondary chemistry in English, out of English textbooks, so the
# element names a Khasi student actually meets are Hydrogen, Oxygen, Iron —
# and falling back to English gives them exactly that. A Khasi table would be a
# claim about how to spell those words in Khasi letters rather than a fact
# about the language, and no such convention exists to seed from.


## Style vocabulary

# The four colours Khasi names with its own words carry the attributive «ba-»
# («balieh», «baiong», «basaw», «bathiang»); the rest are loans, written as
# «rong X» — *colour X* — because a loan does not take «ba-» comfortably.
color =
    .black = baiong
    .white = balieh
    .gray = rong gre
    .red = basaw
    .orange = rong orenj
    .yellow = rong yelo
    .green = bathiang
    .cyan = rong sayan
    .blue = rong blu
    .purple = rong parpul
    .pink = rong pink
    .brown = rong brawn

# Khasi names a stroke's width with its ordinary words for big and small.
line-width =
    .thick = bakhraw
    .thin = barit

line-style =
    .dashed = badash
    .dotted = badot

fill-style =
    .horizontal = ki lain ba iaid mynrei
    .vertical = ki lain ba iaid jrong
    .diagonal = ki lain ba iaid kynthup
    .backdiagonal = ki lain ba iaid kynthup ba kylla
    .dots = ki dot
    .diamonds = ki dayamon

noun =
    .line = lain
    .line-segment = bynta lain
    .ray = ray
    .vector = vektor
    .curve = lain bakhon
    .function = function
    .slope-field = slope field
    .vector-field = vector field
    .parabola = parabola
    .polyline = polylain
    .polygon = polygon
    .triangle = trayangul
    .rectangle = rektangul
    .circle = jyrong
    .region = jaka
    .point = point
    .square = skwer
    .diamond = dayamon
    .cross = kruh
    .plus = plas

# The side count stands in front of the noun in Khasi, as it does in English,
# so the head carries all of it and the tail is empty.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] polygon ba beit bad { $numSides } tylli ki bynta
    }

# Khasi gender sits on the article, not on the adjective, so nothing here
# selects on it. See the header.
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

# The noun comes first and the adjectives follow it. The trailing complement,
# which Khasi never asks for, is kept last so that a fallback still renders.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = badap

# «da» is the instrumental preposition and stands in front of what it governs,
# as English's "with" does.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } da { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } da { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } da { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# Khasi places no article here — see the header — so the two `-article`
# branches read like their neighbours. «bad» is *with*, «bad ruh» *and also*.
style-border-clause =
    { $parts ->
        [with-article] bad kyrdan { $border }
        [and] bad ruh kyrdan { $border }
        [and-article] bad ruh kyrdan { $border }
       *[with] bad kyrdan { $border }
    }

# The pattern is the noun and the colour the adjective, so they change places.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = ym badap

style-text =
    { $parts ->
        [background] { $color } bad bakgrawnd { $background }
       *[plain] { $color }
    }

style-background-none = ym don


## Boolean words

boolean-true = hok
boolean-false = bakhlem hok


## Answer buttons

answer-submit-label = Peit ïa ka Kam
answer-submit-label-no-correctness = Ai ïa ka Jingjubab


## Sectional blocks

section-name =
    .activity = Jingtrei
    .aside = Jingong Bynta
    .cascade = Kaskad
    .definition = Jingbatai Ktien
    .example = Nuksa
    .exercise = Jingpyrshang
    .exercises = Ki Jingpyrshang
    .given-answer = Jingjubab
    .note = Jingkynmaw
    .objectives = Ki Jingmut
    .paragraphs = Ki Paragraf
    .part = Bynta
    .problem = Jingeh
    .problems = Ki Jingeh
    .proof = Jingpynshisha
    .question = Jingkylli
    .section = Seksan
    .solution = Jingpynbeit
    .task = Kam
    .theorem = Thiorem

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Jingiarap


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tebul { $enumeration }
        [numbered-title] Tebul { $enumeration }{ ": " }
        [unnumbered-title] Tebul{ ": " }
       *[unnumbered] Tebul
    }

figure-name =
    { $parts ->
        [numbered] Dur { $enumeration }
        [numbered-caption] Dur { $enumeration }{ ": " }
        [unnumbered-caption] Dur{ ": " }
       *[unnumbered] Dur
    }


## Paginator controls

paginator-previous = Mynshuwa
paginator-next = Shaphrang
paginator-page = Peij

# «na» is *from/out of* and keeps English's order of the two counts.
paginator-page-status = { $pageLabel } { $currentPage } na { $numPages }


## Piecewise functions

piecewise-condition-or = ne

# «lada» is clause-initial in Khasi, so it sits correctly in front of the
# mathematics the renderer places after it.
piecewise-condition-if = lada

piecewise-condition-otherwise = lymne


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent — see the
## paragraph in the header. All 130 of those keys fall back to English, which
## is the nomenclature a Khasi student is taught in.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Simbol Kemikal Ba Ym Beit
chemistry-invalid-ionic-compound = Kompawnd Ayonik Ba Ym Beit

## Inputs embedded in math

math-embedded-input-blank = blank

math-embedded-input-blank-ordinal = blank { $ordinal } na { $total }
