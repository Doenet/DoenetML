# Guarani content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Paraguayan Guarani, official orthography, in the *jopara* register
# the Ministerio de Educación's own materials use: where Guarani has no
# inherited term the Spanish loan is written rather than a coinage. See
# `chrome.ftl`'s header.
#
# Guarani has no grammatical gender and no adjective agreement, so
# `noun-gender` answers one token and nothing selects on it. Nothing selects on
# `$role`: what English marks with a preposition Guarani marks with a
# **postposition that is a free word** — «ndive», «rehe», «ári» — so the
# adjective in a clause is the same word it is standing alone.
#
# The adjectives **follow** the noun, so the composition messages invert the
# English order, and `noun-regular-polygon` splits the way `locales/es` does:
# the head is «heta hakua joja» and the side count follows the adjectives as a
# relative, «{ $numSides } hakuáva». The relativizer «-va» lands on «hakua»,
# which this catalog writes, not on `$numSides`.
#
# **The colour table is where this catalog needs a speaker most.** Guarani names
# one colour across the range English splits into blue and green: «hovy» covers
# both, and «hovyũ» is the darker end of it. This catalog assigns `.blue` to
# «hovy» and `.green` to «hovyũ», which is what Paraguayan school materials do
# and which is *not* a translation of either English word — it is a different
# partition of the spectrum, forced into a two-key table. Nothing downstream can
# repair that; the note is here because it is the first thing a speaker should
# look at, and because it is a fact about Guarani rather than an unfinished
# entry. Purple, cyan, orange and brown are Spanish loans, which is the register
# this file is in.


## Style vocabulary

color =
    .black = hũ
    .white = morotĩ
    .gray = hũngy
    .red = pytã
    .orange = narã
    .yellow = sa'yju
    .green = hovyũ
    .cyan = sian
    .blue = hovy
    .purple = violéta
    .pink = pytãngy
    .brown = marrõ

line-width =
    .thick = anambusu
    .thin = po'i

line-style =
    .dashed = kytĩmby
    .dotted = kytã'i

# Noun phrases, which is what the head of `style-fill` is. Guarani drops the
# plural suffix here because nothing precedes them to say how many, and a bare
# noun already reads as a kind rather than as one thing.
fill-style =
    .horizontal = tairũ oñenóva
    .vertical = tairũ oñembo'ýva
    .diagonal = tairũ karẽ
    .backdiagonal = tairũ karẽ jeguerujey
    .dots = kytã'i
    .diamonds = rombo

noun =
    .line = tairũ
    .line-segment = tairũ pehẽ
    .ray = tairũ apy'ỹ
    .vector = bektor
    .curve = tairũ karẽ
    .function = funsiõ
    .parabola = parábola
    .polyline = tairũ hetáva
    .polygon = heta hakua
    .triangle = mbohapy hakua
    .rectangle = irundy hakua puku
    .circle = apu'a
    .region = tenda
    .point = kyta
    .square = irundy hakua
    .diamond = rombo
    .cross = kurusu
    .plus = ñembojoapy ta'ãnga

noun-regular-polygon =
    { $part ->
        [tail] { $numSides } hakuáva
       *[head] heta hakua joja
    }

# One answer for every noun: Guarani has no grammatical gender, so nothing
# downstream has anything to agree with.
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

# The noun first and the adjectives after it, which is the opposite of English.
# The regular polygon's relative clause follows both.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = mbojehe'apyre

# «ndive», "with", is a free postposition and follows what it governs, so the
# pattern precedes it and no suffix lands on `$pattern`. That is the whole reason
# this catalog needs none of `locales/qu`'s workaround for the same message.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color }, { $pattern } ndive
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color }, { $pattern } ndive
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail }, { $pattern } ndive
       *[plain] { $noun } { $filled } { $color }
    }

# Guarani has no article, so English's four branches are two distinct strings.
# All four are written out because they are four positions and a later correction
# to one need not be a correction to the others.
style-border-clause =
    { $parts ->
        [with-article] ijyva { $border } ndive
        [and] ha ijyva { $border }
        [and-article] ha ijyva { $border }
       *[with] ijyva { $border } ndive
    }

# Here the pattern is the head noun — "blue diamonds" — and the colour follows
# it, so nothing marks the relation at all.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = mbojehe'apy'ỹ

style-text =
    { $parts ->
        [background] { $color }, { $background } tugua ári
       *[plain] { $color }
    }

style-background-none = mavave


## Boolean words

boolean-true = añete
boolean-false = japu


## Answer buttons

answer-submit-label = Ehecha pe tembiapo
answer-submit-label-no-correctness = Emondo pe mbohovái


## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are the same
# word: the plural is «-kuéra» and a heading does not carry it.
section-name =
    .activity = Tembiapo
    .aside = Ñe'ẽ joapy
    .cascade = Ykua pororo
    .definition = Ñemyesakã
    .example = Techapyrã
    .exercise = Tembiapokue
    .exercises = Tembiapokue
    .given-answer = Mbohovái
    .note = Jehaimi
    .objectives = Mba'eporãrã
    .paragraphs = Ñe'ẽjoaju
    .part = Pehẽ
    .problem = Apañuãi
    .problems = Apañuãi
    .proof = Jehechauka
    .question = Porandu
    .section = Pehẽngue
    .solution = Ñeñandu
    .task = Tembiaporã
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

hint-title = Ñepytyvõ


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
        [numbered] Ta'ãnga { $enumeration }
        [numbered-caption] Ta'ãnga { $enumeration }{ ": " }
        [unnumbered-caption] Ta'ãnga{ ": " }
       *[unnumbered] Ta'ãnga
    }


## Paginator controls

paginator-previous = Mboyve
paginator-next = Upéi
paginator-page = Rogue

# The ablative «-gui» lands on «rogue», which this catalog writes, so the total
# precedes it: "of N pages, Page 3".
paginator-page-status = { $numPages } roguégui { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = térã
piecewise-condition-if = ramo
piecewise-condition-otherwise = ambue jave


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Guarani is co-official in Paraguay and reaches further into schooling
## than any other language in this batch, but it reaches the primary grades and
## the language classroom; secondary chemistry is taught in Spanish out of
## Spanish textbooks, so the periodic table a pupil meets is `locales/es`'s.
## There is no settled Guarani table for a seed to reproduce.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Ta'ãnga kimiko naiporãiva
chemistry-invalid-ionic-compound = Ñembojoaju ioniko naiporãiva
