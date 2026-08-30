# Pangasinan (Salitan Pangasinan) content catalog: the prose the core computes
# into the document. Selected by `documentLocale` — the language the activity
# was written in. `locales/en/content.ftl` is the source of truth, and message
# ids, placeables and variant keys are never translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography: the modernised spelling**, as `chrome.ftl`'s header sets out —
# «k» throughout, no «c» or «qu», and none of «f v z x» outside untranslated
# identifiers. The older Spanish-influenced spelling is the one a reviewer
# might have expected; **respell rather than retranslate**, and respell all
# four files at once.
#
# ## Word order
#
# **The describing word comes first, the noun after it, with a linker between
# them**: «makapal a ambalanga a linya» is *thick red line*. That is English's
# order, and it is Pangasinan's ordinary order for an attributive phrase — not
# a failure to translate. So `style-stroke`, `style-with-noun` and
# `style-filled-with-noun` keep English's sequence of placeables, and what this
# catalog adds between them is the linker.
#
# ## The linker, and where it is wrong
#
# Pangasinan's linker has two shapes and the **preceding** word picks them: «a»
# after a consonant, enclitic «-n» — usually written «ya» when it stands free —
# after a vowel. No one shape is right in both positions, so this catalog does
# what `locales/pam` and `locales/bik` do: it writes the free **«a»**
# everywhere and names the exception rather than hiding it.
#
# «a» is wrong wherever the word in front of it ends in a vowel. In this
# catalog's own tables that is **«ambalanga»** (red), **«lila»** (purple),
# **«kape»** (brown), **«diamante»** and **«tuldek-tuldek»** — a description
# built on any of those renders «ambalanga a linya» where a speaker says
# «ambalangan linya». It is also wrong after an author's own `lineColorWord`
# whenever that word ends in a vowel, which the catalog cannot see. A fix is a
# change to what the composition messages are handed, not a change to the
# tables.
#
# ## Vocabulary
#
# The colours, the two widths, `style-filled-word`, `style-unfilled`,
# `noun-gender`'s answer and every function word are Pangasinan. The geometry
# is the **Spanish-derived vocabulary Philippine mathematics teaching
# carries** — «linya», «punto», «sirkulo», «poligono», «kuadrado»,
# «triyanggulo», «kurba», «parabola», «bektor» — used because it is what the
# community uses, not because English was respelled. «gris» (grey), «sian»
# (cyan), «kampo» (field, in the two `-field` nouns), «orisontal»,
# «bertikal», «reberso» and «tabla» are Spanish loans on the same footing.
# `.slope-field` and `.vector-field` keep `slope` and `vector`'s loan forms
# because the seed found no settled Pangasinan term for either.
#
# Pangasinan has no grammatical gender and no case, so `noun-gender` answers
# one token for every noun and nothing here selects on `$gender` or `$role`.
#
# **The two chemistry tables — `element-name` and `element-anion-name` — are
# omitted.** Secondary science in Pangasinan's provinces is taught in English,
# so the English fallback is the language of the classroom and filling those
# 130 keys in would claim a translation that had not happened. `ion-name-`
# `oxidation-state` and the two `chemistry-invalid-` messages are prose and
# are translated.


## Style vocabulary

color =
    .black = andeket
    .white = amputi
    .gray = gris
    .red = ambalanga
    .orange = kahel
    .yellow = duyaw
    .green = berde
    .cyan = sian
    .blue = asul
    .purple = lila
    .pink = rosas
    .brown = kape

line-width =
    .thick = makapal
    .thin = manipis

# The reduplication is distributive, not a plural: «tuldek-tuldek» is 'dots
# here and there' rather than 'more than one dot'.
line-style =
    .dashed = putol-putol
    .dotted = tuldek-tuldek

# Pangasinan marks no plural on the noun, so «linya» is the word for one line
# and for many alike; none of these is a plural of anything.
fill-style =
    .horizontal = orisontal a linya
    .vertical = bertikal a linya
    .diagonal = diagonal a linya
    .backdiagonal = reberso a diagonal a linya
    .dots = tuldek
    .diamonds = diamante

noun =
    .line = linya
    .line-segment = segmento na linya
    .ray = sinag
    .vector = bektor
    .curve = kurba
    .function = punsion
    .slope-field = kampo na slope
    .vector-field = kampo na bektor
    .parabola = parabola
    .polyline = polilinya
    .polygon = poligono
    .triangle = triyanggulo
    .rectangle = rektanggulo
    .circle = sirkulo
    .region = rehyon
    .point = punto
    .square = kuadrado
    .diamond = diamante
    .cross = krus
    .plus = plus

# The side count follows the adjectives as a complement, so that they stay
# beside the noun they describe. «ya» here is correct and fixed: «walaay» is
# vowel-initial, and the linker in front of it is decided by «poligono», which
# this catalog writes itself.
noun-regular-polygon =
    { $part ->
        [tail] ya walaay { $numSides } a gilig
       *[head] regular a poligono
    }

# One answer for every noun: Pangasinan has no grammatical gender, so nothing
# downstream has anything to agree with.
noun-gender = neuter


## Style composition

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

style-filled-word = napno

style-filled =
    { $parts ->
        [pattern] { $filled } a { $color } ya walaay { $pattern }
       *[plain] { $filled } a { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } a { $color } a { $noun } ya walaay { $pattern }
        [plain-tail] { $filled } a { $color } a { $noun } { $nounTail }
        [pattern-tail] { $filled } a { $color } a { $noun } { $nounTail } ya walaay { $pattern }
       *[plain] { $filled } a { $color } a { $noun }
    }

# Pangasinan has no article, so the two `-article` branches say what the other
# two say. They are kept apart because English's distinction is between a first
# clause and a further one, and this file does mark that: «ya walaay» against
# «tan».
style-border-clause =
    { $parts ->
        [with-article] ya walaay { $border } a gilig
        [and] tan { $border } a gilig
        [and-article] tan { $border } a gilig
       *[with] ya walaay { $border } a gilig
    }

style-fill =
    { $parts ->
        [pattern] { $color } a { $pattern }
       *[plain] { $color }
    }

style-unfilled = ag napno

style-text =
    { $parts ->
        [background] { $color } ya walaay { $background } a beneg
       *[plain] { $color }
    }

style-background-none = anggapo


## Boolean words

boolean-true = tua
boolean-false = palso


## Answer buttons

answer-submit-label = Nengnengen so Kimey
answer-submit-label-no-correctness = Ipawit so Ebat


## Sectional blocks

section-name =
    .activity = Aktibidad
    .aside = Aparte
    .cascade = Kaskada
    .definition = Kabaliksan
    .example = Alimbawa
    .exercise = Ehersisyo
    .exercises = Saray Ehersisyo
    .given-answer = Ebat
    .note = Nota
    .objectives = Saray Getma
    .paragraphs = Saray Parapo
    .part = Kabiangan
    .problem = Problema
    .problems = Saray Problema
    .proof = Paneknek
    .question = Tepet
    .section = Seksion
    .solution = Solusyon
    .task = Kimey
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

hint-title = Bilin


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

paginator-previous = Akauna
paginator-next = Onsublay
paginator-page = Pahina

paginator-page-status = { $pageLabel } { $currentPage } ed { $numPages }


## Piecewise functions

piecewise-condition-or = odino

piecewise-condition-if = no

piecewise-condition-otherwise = no andi


## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Aliwan Simbolo a Kemikal
chemistry-invalid-ionic-compound = Aliwan Kompuesto ya Ioniko

## Inputs embedded in math

math-embedded-input-blank = blangko

math-embedded-input-blank-ordinal = blangko { $ordinal } ed { $total }
