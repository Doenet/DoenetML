# Aymara content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the unified orthography of 1984.
#
# Aymara has no grammatical gender and no adjective agreement, so `noun-gender`
# answers one token and nothing selects on it. Nothing selects on `$role`. Its
# adjectives **precede** the noun, so `style-stroke` and `style-with-noun` are
# English's order — the second catalog in this batch for which that is true, and
# for the same Andean reason as `locales/qu`.
#
# Where it parts from Quechua is in the colour table, and the difference is not a
# matter of taste. Aymara's «larama» is the blue of the sky and of dyed cloth and
# «ch'uxña» the green of a growing plant; Quechua's «anqas» and «q'umir» divide
# the same range at a different point. Two neighbouring languages, two partitions,
# and a two-key table that cannot record either — the same problem `locales/gn`
# has more acutely. A speaker correcting one of these entries should know they are
# choosing where a boundary falls, not fixing a word.
#
# `noun-regular-polygon` collapses to English's shape: a side count is a
# prenominal modifier, «phisqa jarphini», so it sits in the head and the `[tail]`
# branch is empty.
#
# The instrumental «-mpi» cannot be welded to `$pattern` in `style-filled`, so
# that message names the value instead — «saltanakapa { $pattern }», after the
# Aymara word for the woven figures in a textile. Elsewhere every suffix lands on
# a word written here: «jarphini» for the border, «laphimpi» for the
# background, «laphinakata» for the page count.


## Style vocabulary

color =
    .black = ch'iyara
    .white = janq'u
    .gray = uqi
    .red = chupika
    .orange = naranja
    .yellow = q'illu
    .green = ch'uxña
    .cyan = sian
    .blue = larama
    .purple = kulli
    .pink = panti
    .brown = ch'umphi
line-width =
    .thick = lanqu
    .thin = juch'usa
line-style =
    .dashed = t'aqata
    .dotted = chhiqchhi
# Noun phrases, which is what the head of `style-fill` is. «-naka» is written
# here because nothing precedes them to say how many.
fill-style =
    .horizontal = wintu siqinaka
    .vertical = sayt'ata siqinaka
    .diagonal = k'umu siqinaka
    .backdiagonal = kutt'ata k'umu siqinaka
    .dots = chhiqchhinaka
    .diamonds = rombonaka
noun =
    .line = siqi
    .line-segment = siqi t'aqa
    .ray = wach'i
    .vector = bektor
    .curve = q'iwi siqi
    .function = funsyun
    .parabola = parabola
    .polyline = q'inq'u siqi
    .polygon = walja k'uchu
    .triangle = kimsa k'uchu
    .rectangle = suni pusi k'uchu
    .circle = muruq'u
    .region = chiqa
    .point = chimpu
    .square = pusi k'uchu
    .diamond = rombo
    .cross = chakana
    .plus = yapa chimpu
# The side count is a prenominal modifier, so it stays in the head and the tail
# is empty. «-ni», "having", lands on «jarpha», the side, which this catalog
# writes.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } jarphini pachpa walja k'uchu
    }
# One answer for every noun: Aymara has no grammatical gender, so nothing
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
# The adjectives precede the noun, so this is English's order. The `[noun-tail]`
# branch is unreachable from Aymara's own `noun-regular-polygon`; it is kept
# because it is what a partly-corrected catalog falls back to, and dropping it
# would drop that catalog's side count.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
style-filled-word = phuqata
# The instrumental «-mpi» cannot be welded to `$pattern`, so the pattern is named
# rather than marked: «saltanakapa { $pattern }», "its woven figures: diamonds".
style-filled =
    { $parts ->
        [pattern] { $filled } { $color }, saltanakapa { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun }, saltanakapa { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail }, saltanakapa { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «-ni», "having", lands on «jarpha» again — the same word `noun-regular-polygon`
# counts, since Aymara's word for a polygon's side is its word for an edge — and
# the adjectives precede it.
# Aymara has no articles, so English's four branches are two distinct strings; all
# four are written out because they are four positions.
style-border-clause =
    { $parts ->
        [with-article] { $border } jarphini
        [and] ukhamaraki { $border } jarphini
        [and-article] ukhamaraki { $border } jarphini
       *[with] { $border } jarphini
    }
# Here the pattern is the head noun — "blue diamonds" — so it needs no suffix at
# all and the colour simply precedes it. The same value that had to be named in
# `style-filled` needs nothing here.
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = jan phuqata
style-text =
    { $parts ->
        [background] { $background } laphimpi { $color }
       *[plain] { $color }
    }
style-background-none = janiwa utjkiti

## Boolean words

boolean-true = chiqa
boolean-false = k'ari

## Answer buttons

answer-submit-label = Luräwi uñakipaña
answer-submit-label-no-correctness = Jaysäwi apayaña

## Sectional blocks

section-name =
    .activity = Luräwi
    .aside = Yapa aru
    .cascade = Phaxcha
    .definition = Qhanañchawi
    .example = Uñacht'awi
    .exercise = Yatiqäwi
    .exercises = Yatiqäwinaka
    .given-answer = Jaysäwi
    .note = Amtawi
    .objectives = Amtanaka
    .paragraphs = T'aqanaka
    .part = Chikata
    .problem = Ch'axwawi
    .problems = Ch'axwawinaka
    .proof = Uñacht'ayawi
    .question = Jiskt'awi
    .section = Jaljawi
    .solution = Askichawi
    .task = Luranawi
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
hint-title = Yanapa

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
        [numbered] Uñacha { $enumeration }
        [numbered-caption] Uñacha { $enumeration }{ ": " }
        [unnumbered-caption] Uñacha{ ": " }
       *[unnumbered] Uñacha
    }

## Paginator controls

paginator-previous = Nayra
paginator-next = Qhipa
paginator-page = Laphi
# The ablative «-ta» lands on «laphi», which this catalog writes, so the total
# precedes it: "of N pages, Page 3".
paginator-page-status = { $numPages } laphinakata { $pageLabel } { $currentPage }

## Piecewise functions

piecewise-condition-or = jan ukaxa
piecewise-condition-if = ukhamäspa
piecewise-condition-otherwise = jan ukhamäspa

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Aymara-medium intercultural bilingual education reaches the primary
## grades in Bolivia and Peru; secondary chemistry is taught in Spanish out of
## Spanish textbooks, so the periodic table a pupil meets is `locales/es`'s. There
## is no settled Aymara table for a seed to reproduce.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Jan aski chimpu kimiku
chemistry-invalid-ionic-compound = Jan aski mayacha ioniku
